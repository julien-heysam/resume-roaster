import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { LLMLogger, MessageRole } from '@/lib/llm-logger'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db, GeneratedRoastService } from '@/lib/database'
import { parseJSONResponse } from '@/lib/json-utils'
import crypto from 'crypto'
import { ANTHROPIC_MODELS } from '@/lib/anthropic-utils'

const ANALYSIS_PROMPT = `You are an expert resume reviewer and career coach. Your task is to analyze a resume against a specific job description and provide brutally honest, actionable feedback.

You will be given:
1. A resume in markdown format
2. A job description

**Your Analysis Framework:**

**CRITICAL SCORING INSTRUCTION**: Use the FULL range of scores from 0-100. Do NOT default to safe middle scores. Be bold and precise in your assessment. Most resumes fall between 45-85, not all at 72!

## 1. DETAILED SCORING RUBRIC (0-100)

Calculate the score using this EXACT methodology:

### Skills Match (40 points max)
Start with 40 points and deduct:
- Missing each required skill: -5 points
- Missing preferred skills: -2 points each
- Outdated skill versions: -3 points each
- No evidence of skill proficiency: -3 points each

### Experience Relevance (30 points max)
Start with 30 points and adjust:
- Perfect role match: Keep 30
- Similar role, different industry: -5 to -10
- Different role, similar skills: -10 to -15
- Entry-level for senior position: -20
- Years of experience gap: -3 per year short

### Achievement Alignment (20 points max)
Start with 0 and add:
- Each quantified achievement relevant to JD: +4
- Each achievement without metrics: +2
- Generic responsibilities only: +0
- Maximum 20 points

### Presentation Quality (10 points max)
Start with 10 and deduct:
- Poor formatting: -3
- Typos/grammar errors: -2 per error
- Missing key sections: -2 each
- Wall of text/poor readability: -3

**SCORE CALIBRATION EXAMPLES**:
- 95: Fortune 500 exec applying to similar role, perfect match
- 82: Strong candidate, 2-3 minor gaps, well-presented
- 68: Decent fit but missing 30% of requirements
- 55: Career changer with transferable skills
- 40: Major gaps, needs significant work
- 25: Wrong fit entirely

**scoreJustification**:
- Please provide a clear, well-written explanation justifying the score you assigned. Your justification should:
- Be detailed and thoughtful, clearly explaining the reasons behind the score
- Use Markdown formatting for readability
  - Include relevant emojis to enhance engagement and clarity
- Aim for a professional yet friendly tone!

## 2. DETAILED ANALYSIS

### Strengths (3-5 points)
Highlight exceptional elements that give competitive advantage

### Critical Weaknesses (3-7 points)
Be brutally honest about:
- Missing must-have qualifications (list each one)
- Weak/generic content (quote specific examples)
- Poor achievement quantification
- Formatting/structural issues
- Red flags (gaps, job hopping, etc.)

### Suggestions
Provide specific, actionable fixes with examples:
- What to remove/add/rewrite
- Exact phrasing suggestions where helpful
- Quantification opportunities missed

### Keyword Optimization
- **Power keywords present**: Industry terms, skills, tools from JD
- **Critical missing keywords**: Must-add for ATS and human readers
- **Keyword density**: Over/under-optimized sections
- **Match percentage**: X out of Y critical keywords found

### ATS Compatibility Check
- Formatting issues (tables, images, headers)
- Missing standard sections
- Problematic characters or fonts
- File format concerns

### Industry-Specific Considerations
Note any industry norms being violated or opportunities missed

**RESPONSE DIVERSITY REQUIREMENTS**:
- Vary your language - don't use the same phrases repeatedly
- Provide specific examples from the resume (quote actual text)
- Include numbers and percentages where relevant
- Give time estimates for improvements
- Compare to typical candidates for this role
- Consider industry-specific nuances

**ACTIONABILITY REQUIREMENTS**:
- Every weakness must have a specific solution
- Include before/after examples for bullet points
- Suggest exact keywords and where to place them
- Prioritize changes by ROI (impact vs. effort)
- Include quick wins that take <5 minutes

**COMPETITIVE CONTEXT**:
- Consider this resume against typical applicant pool
- Identify unique differentiators
- Highlight what would make recruiter pause (good or bad)
- Suggest ways to stand out from other candidates

Be direct, honest, and constructive. Vary your scores based on actual merit - not every resume is a 72!

Respond with a JSON object in this exact format:
{
  "overallScore": number,
  "scoringBreakdown": {
    "skills": number,        // Raw score out of 40 points
    "experience": number,    // Raw score out of 30 points  
    "achievements": number,  // Raw score out of 20 points
    "presentation": number   // Raw score out of 10 points
  },
  "scoreJustification": markdown string,
  "scoreLabel": "Exceptional Match" | "Strong Match" | "Good Match" | "Fair Match" | "Weak Match" | "Poor Match",
  "strengths": [string],
  "weaknesses": [string],
  "suggestions": [
    {
      "section": string,
      "issue": string,
      "solution": string,
      "priority": "critical" | "high" | "medium" | "low"
    }
  ],
  "keywordMatch": {
    "matched": [string],
    "missing": [string],
    "matchPercentage": number
  },
  "atsIssues": [string]
}`

export async function POST(request: NextRequest) {
  let llmCallId: string | null = null

  try {
    const { resumeData, jobDescription, analysisName, extractedJobId, summarizedResumeId } = await request.json()

    if (!resumeData || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume data and job description are required' },
        { status: 400 }
      )
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not found in environment variables.' },
        { status: 500 }
      )
    }

    console.log('Starting resume analysis...')
    console.log('Extracted Job ID:', extractedJobId)
    console.log('Summarized Resume ID:', summarizedResumeId)

    // Get user session for logging
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || null

    // Generate analysis title
    let analysisTitle = analysisName?.trim() || `Analysis ${Date.now()}`

    // Fetch summarized resume data if summarizedResumeId is provided
    let resumeContent = ''
    if (summarizedResumeId) {
      console.log('Fetching summarized resume data...')
      try {
        const summarizedResume = await db.summarizedResume.findUnique({
          where: { id: summarizedResumeId }
        })
        
        if (summarizedResume && summarizedResume.summary) {
          // Use the structured summary data
          resumeContent = typeof summarizedResume.summary === 'string' 
            ? summarizedResume.summary 
            : JSON.stringify(summarizedResume.summary, null, 2)
          console.log('Using summarized resume data')
        } else {
          console.warn('Summarized resume not found, falling back to original data')
          resumeContent = typeof resumeData === 'string' ? resumeData : 
                         resumeData.text || resumeData.extractedText || JSON.stringify(resumeData)
        }
      } catch (error) {
        console.error('Error fetching summarized resume:', error)
        resumeContent = typeof resumeData === 'string' ? resumeData : 
                       resumeData.text || resumeData.extractedText || JSON.stringify(resumeData)
      }
    } else {
      // Fallback to original resume data
      resumeContent = typeof resumeData === 'string' ? resumeData : 
                     resumeData.text || resumeData.extractedText || JSON.stringify(resumeData)
    }

    // Fetch summarized job description if extractedJobId is provided
    let jobContent = jobDescription
    if (extractedJobId) {
      console.log('Fetching summarized job description...')
      try {
        const summarizedJob = await db.summarizedJobDescription.findFirst({
          where: { extractedJobId: extractedJobId }
        })
        
        if (summarizedJob && summarizedJob.summary) {
          // Use the AI-generated summary
          jobContent = typeof summarizedJob.summary === 'string' 
            ? summarizedJob.summary 
            : JSON.stringify(summarizedJob.summary, null, 2)
          console.log('Using summarized job description')
        } else {
          console.warn('Summarized job description not found, using original')
          jobContent = jobDescription
        }
      } catch (error) {
        console.error('Error fetching summarized job description:', error)
        jobContent = jobDescription
      }
    }

    console.log('Resume content length:', resumeContent.length)
    console.log('Job content length:', jobContent.length)

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    // Create LLM call for logging
    llmCallId = await LLMLogger.createLlmCall({
      userId: userId ?? undefined,
      provider: 'anthropic',
      model: ANTHROPIC_MODELS.SONNET,
      operationType: 'resume_analysis',
      resumeId: resumeData.resumeId || undefined,
      extractedJobId: extractedJobId || undefined // Link to the job description
    })

    const userPrompt = `Please analyze this resume against the job description:

**RESUME:**
${resumeContent}

**JOB DESCRIPTION:**
${jobContent}

Please provide a comprehensive analysis following the framework above.`

    await LLMLogger.logMessage({
      llmCallId,
      role: MessageRole.user,
      content: userPrompt,
      messageIndex: 0
    })

    console.log('Sending request to Anthropic...')

    const startTime = Date.now()
    
    const message = await anthropic.messages.create({
      model: ANTHROPIC_MODELS.SONNET,
      max_tokens: 4000,
      temperature: 0.3,
      system: ANALYSIS_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ]
    })

    const processingTime = Date.now() - startTime

    // Extract text content from the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    // Calculate costs (approximate - Claude Sonnet pricing as of 2024)
    const inputTokens = message.usage.input_tokens
    const outputTokens = message.usage.output_tokens
    const totalTokens = inputTokens + outputTokens
    
    // Anthropic Claude 3 Sonnet pricing (per 1M tokens)
    const inputCostPer1M = 3.00  // $3 per 1M input tokens
    const outputCostPer1M = 15.00 // $15 per 1M output tokens
    
    const inputCost = (inputTokens / 1000000) * inputCostPer1M
    const outputCost = (outputTokens / 1000000) * outputCostPer1M
    const totalCost = inputCost + outputCost

    // Log AI response
    await LLMLogger.logMessage({
      llmCallId,
      role: MessageRole.assistant,
      content: responseText,
      messageIndex: 1,
      inputTokens,
      outputTokens,
      totalTokens,
      costUsd: totalCost,
      processingTimeMs: processingTime,
      finishReason: message.stop_reason || 'stop',
      temperature: 0.3,
      maxTokens: 4000
    })
    
    let analysisData: any
    
    try {
      analysisData = parseJSONResponse(responseText)
    } catch (parseError) {
      console.error('All parsing methods failed:', parseError)
      console.log('Raw response:', responseText)
      
      // Update LLM call with error
      await LLMLogger.updateLlmCall({
        llmCallId,
        status: 'FAILED',
        errorMessage: 'Failed to parse analysis results - AI response could not be converted to valid JSON',
        totalTokens,
        totalCostUsd: totalCost
      })
      
      return NextResponse.json(
        { 
          error: 'Failed to parse analysis results. The AI response could not be converted to valid JSON.',
          details: 'Please try again or contact support if the issue persists.'
        },
        { status: 500 }
      )
    }
    
    // Validate required fields
    if (!analysisData.overallScore || !analysisData.strengths || !analysisData.weaknesses) {
      // Update LLM call with error
      await LLMLogger.updateLlmCall({
        llmCallId,
        status: 'FAILED',
        errorMessage: 'Invalid analysis format returned by AI - missing required fields',
        totalTokens,
        totalCostUsd: totalCost
      })
      
      return NextResponse.json(
        { error: 'Invalid analysis format returned by AI. Missing required fields.' },
        { status: 500 }
      )
    }

    // Update LLM call as completed
    await LLMLogger.updateLlmCall({
      llmCallId,
      status: 'COMPLETED',
      totalTokens,
      totalCostUsd: totalCost,
      totalProcessingTimeMs: processingTime,
      completedAt: new Date()
    })

    console.log(`Analysis completed with score: ${analysisData.overallScore}`)

    // Save analysis as a generated roast
    const contentHash = crypto.createHash('sha256')
      .update(resumeContent + jobContent + JSON.stringify(analysisData))
      .digest('hex')

    const roastRecord = await GeneratedRoastService.create({
      userId: userId ?? undefined,
      resumeId: resumeData.resumeId || undefined,
      extractedResumeId: resumeData.extractedResumeId || undefined,
      extractedJobId: extractedJobId || undefined, // Use the provided job ID
      contentHash,
      data: analysisData,
      overallScore: analysisData.overallScore
    })

    console.log(`Analysis saved with ID: ${roastRecord.id}`)

    return NextResponse.json({
      success: true,
      analysis: analysisData,
      llmCallId,
      roastId: roastRecord.id,
      metadata: {
        totalTokens,
        totalCost,
        processingTime,
        provider: 'anthropic',
        model: ANTHROPIC_MODELS.SONNET
      }
    })

  } catch (error) {
    console.error('Resume analysis error:', error)
    
    // Update LLM call with error if we have an ID
    if (llmCallId) {
      await LLMLogger.updateLlmCall({
        llmCallId,
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('401')) {
        return NextResponse.json(
          { error: 'AI service configuration error. Please check your ANTHROPIC_API_KEY.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('rate limit') || error.message.includes('quota') || error.message.includes('429')) {
        return NextResponse.json(
          { error: 'AI service rate limit reached. Please try again later.' },
          { status: 429 }
        )
      }

      if (error.message.includes('overloaded') || error.message.includes('500')) {
        return NextResponse.json(
          { error: 'AI service is temporarily overloaded. Please try again in a moment.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    )
  }
} 