import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { LLMLogger, ConversationType, MessageRole, ConversationStatus } from '@/lib/llm-logger'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'

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
  let conversationId: string | null = null

  try {
    const { resumeData, jobDescription, analysisName } = await request.json()

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

    // Get user session for logging
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || null

    // Generate analysis title
    let analysisTitle = analysisName?.trim()
    if (!analysisTitle) {
      // Auto-generate title with increment
      const userAnalysisCount = await db.analysis.count({
        where: { userId }
      })
      analysisTitle = `Analysis ${userAnalysisCount + 1}`
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    // Create conversation for logging
    conversationId = await LLMLogger.createConversation({
      userId: userId ?? undefined,
      type: ConversationType.RESUME_ANALYSIS,
      title: analysisTitle,
      documentId: resumeData.documentId || null,
      provider: 'anthropic',
      model: 'claude-sonnet-4-20250514'
    })

    // Prepare the resume text
    const resumeText = typeof resumeData === 'string' ? resumeData : 
                      resumeData.text || resumeData.extractedText || JSON.stringify(resumeData)

    console.log('Resume analysis - documentId:', resumeData.documentId) // Debug log

    // Log user message
    const userPrompt = `Please analyze this resume against the job description:

**RESUME:**
${resumeText}

**JOB DESCRIPTION:**
${jobDescription}

Please provide a comprehensive analysis following the framework above.`

    await LLMLogger.logMessage({
      conversationId,
      role: MessageRole.USER,
      content: userPrompt
    })

    console.log('Sending request to Anthropic...')

    const startTime = Date.now()
    
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
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
      conversationId,
      role: MessageRole.ASSISTANT,
      content: responseText,
      inputTokens,
      outputTokens,
      totalTokens,
      cost: totalCost,
      processingTime,
      finishReason: message.stop_reason || 'stop',
      temperature: 0.3,
      maxTokens: 4000
    })
    
    let analysisData: any
    
    try {
      // Claude might wrap JSON in code blocks, so let's handle that
      let jsonText = responseText.trim()
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/```\s*$/, '')
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/```\s*$/, '')
      }
      
      // Try to parse as JSON
      analysisData = JSON.parse(jsonText)
      
      // Validate required fields
      if (!analysisData.overallScore || !analysisData.strengths || !analysisData.weaknesses) {
        throw new Error('Invalid analysis format')
      }
      
    } catch (parseError) {
      console.error('Failed to parse analysis response:', parseError)
      console.log('Raw response:', responseText)
      
      // Update conversation with error
      await LLMLogger.updateConversation({
        conversationId,
        status: ConversationStatus.FAILED,
        errorMessage: 'Failed to parse analysis results',
        totalTokensUsed: totalTokens,
        totalCost
      })
      
      return NextResponse.json(
        { error: 'Failed to parse analysis results. Please try again.' },
        { status: 500 }
      )
    }

    // Update conversation as completed
    await LLMLogger.updateConversation({
      conversationId,
      status: ConversationStatus.COMPLETED,
      totalTokensUsed: totalTokens,
      totalCost,
      completedAt: new Date()
    })

    console.log(`Analysis completed with score: ${analysisData.overallScore}`)

    // Save analysis to the new Analysis table
    const analysisRecord = await db.analysis.create({
      data: {
        userId: userId ?? undefined,
        title: analysisTitle,
        documentId: resumeData.documentId || null,
        jobDescription: jobDescription.trim(),
        resumeText,
        analysisData: JSON.stringify(analysisData),
        overallScore: analysisData.overallScore,
        provider: 'anthropic',
        model: 'claude-sonnet-4-20250514',
        conversationId,
        totalTokensUsed: totalTokens,
        totalCost: totalCost,
        processingTime
      }
    })

    console.log(`Analysis saved with ID: ${analysisRecord.id}`)

    return NextResponse.json({
      success: true,
      analysis: analysisData,
      conversationId,
      analysisId: analysisRecord.id,
      metadata: {
        totalTokens,
        totalCost,
        processingTime,
        provider: 'anthropic',
        model: 'claude-sonnet-4-20250514'
      }
    })

  } catch (error) {
    console.error('Resume analysis error:', error)
    
    // Update conversation with error if we have a conversationId
    if (conversationId) {
      await LLMLogger.updateConversation({
        conversationId,
        status: ConversationStatus.FAILED,
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