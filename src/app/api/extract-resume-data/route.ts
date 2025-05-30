import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'
import { getOrCreateJobSummary, shouldSummarizeJobDescription } from '@/lib/job-summary-utils'
import { getOrCreateOptimizedResume, saveOptimizedResumeToCache } from '@/lib/cache-utils'
import { legacyParseJSON } from '@/lib/json-utils'
import { callAnthropicResumeOptimization, ANTHROPIC_MODELS, ANTHROPIC_CONTEXT_SIZES, ANTHROPIC_TEMPERATURES } from '@/lib/anthropic-utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const startTime = Date.now()
    
    const { 
      resumeText, 
      analysisData, 
      jobDescription, 
      documentId, 
      analysisId
    } = await request.json()

    console.log('=== EXTRACT RESUME DATA DEBUG ===')
    console.log('Resume text length:', resumeText?.length || 0)
    console.log('Has analysis data:', !!analysisData)
    console.log('Job description length:', jobDescription?.length || 0)
    console.log('Document ID:', documentId)
    console.log('Analysis ID:', analysisId)

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Truncate resume text if too long (keep within reasonable limits for API)
    const maxResumeLength = 8000 // Reasonable limit for resume text
    const truncatedResumeText = resumeText.length > maxResumeLength 
      ? resumeText.substring(0, maxResumeLength) + '\n\n[Resume truncated for processing...]'
      : resumeText

    console.log('Truncated resume text length:', truncatedResumeText.length)
    console.log('Job description length:', jobDescription?.length || 0)

    // Get or create job description summary if provided and long
    let jobSummaryData = null
    let effectiveJobDescription = jobDescription || ''

    if (jobDescription && shouldSummarizeJobDescription(jobDescription, 3000)) {
      console.log('Job description is long, getting/creating summary...')
      
      try {
        jobSummaryData = await getOrCreateJobSummary(jobDescription)
        effectiveJobDescription = jobSummaryData.summary
        console.log('Using job summary:', jobSummaryData.cached ? 'cached' : 'newly generated')
        console.log('Summary length:', effectiveJobDescription.length)
      } catch (error) {
        console.error('Error getting job summary:', error)
        effectiveJobDescription = jobDescription.substring(0, 3000) + '\n\n[Job description truncated for length...]'
      }
    }

    console.log('Effective job description length:', effectiveJobDescription.length)

    // Use a default template ID for now (we can make this configurable later)
    const templateId = 'modern-professional'

    // Check for cached optimized resume first
    const cachedOptimizedResume = await getOrCreateOptimizedResume(
      user.id,
      truncatedResumeText,
      jobSummaryData?.id || null,
      templateId,
      analysisId,
      documentId
    )

    if (cachedOptimizedResume) {
      console.log('Returning cached optimized resume')
      return NextResponse.json({
        success: true,
        data: JSON.parse(cachedOptimizedResume.extractedData),
        cached: true,
        usageCount: cachedOptimizedResume.usageCount,
        metadata: {
          processingTime: Date.now() - startTime,
          fromCache: true,
          atsScore: cachedOptimizedResume.atsScore,
          keywordsMatched: cachedOptimizedResume.keywordsMatched,
          optimizationSuggestions: cachedOptimizedResume.optimizationSuggestions
        }
      })
    }

    console.log('No cached extracted resume found, generating new one...')

    // Create the extraction prompt
    const prompt = `Extract and structure the following resume data into a comprehensive JSON format:

${effectiveJobDescription ? `
TARGET JOB DESCRIPTION:
${effectiveJobDescription}
` : ''}

RESUME TEXT:
${truncatedResumeText}

${analysisData ? `
ANALYSIS INSIGHTS:
- Overall Score: ${analysisData.overallScore}%
- Key Strengths: ${analysisData.strengths?.slice(0, 3).join(', ')}
- Areas for Improvement: ${analysisData.weaknesses?.slice(0, 3).join(', ')}
- Matched Keywords: ${analysisData.keywordMatch?.matched?.slice(0, 5).join(', ')}
- Missing Keywords: ${analysisData.keywordMatch?.missing?.slice(0, 5).join(', ')}
` : ''}

${jobSummaryData ? `
EXTRACTED JOB DETAILS:
- Company: ${jobSummaryData.companyName || 'Not specified'}
- Position: ${jobSummaryData.jobTitle || 'Not specified'}
- Location: ${jobSummaryData.location || 'Not specified'}
- Key Requirements: ${jobSummaryData.keyRequirements?.slice(0, 5).join(', ') || 'See job description'}
` : ''}

IMPORTANT INSTRUCTIONS:
1. Extract information accurately from the resume text
2. Optimize content for ATS compatibility
3. Include quantified achievements where possible
4. Match keywords from the job description naturally
5. Ensure all dates are in MM/YYYY format
6. If information is missing, use null or empty arrays as appropriate
7. Make sure you don't omit any information from the resume text, this is the most important part of the process.

Please use the optimize_resume_data function to return the structured data.`

    console.log('Final prompt length:', prompt.length)
    console.log('Estimated tokens (rough):', Math.ceil(prompt.length / 4))
    console.log('=== END DEBUG ===')

    // Use centralized Anthropic utility with function calling
    const response = await callAnthropicResumeOptimization(prompt, {
      model: ANTHROPIC_MODELS.SONNET,
      maxTokens: ANTHROPIC_CONTEXT_SIZES.NORMAL,
      temperature: ANTHROPIC_TEMPERATURES.LOW,
      systemPrompt: 'You are an expert resume parser and career coach. Extract resume data into structured JSON format that is optimized for ATS systems and tailored for the target job. Use the provided tool to return structured data.'
    })

    const extractedData = response.data
    const processingTime = response.processingTime
    const tokensUsed = response.usage.totalTokens
    const estimatedCost = response.cost

    console.log('Resume extraction completed successfully')
    console.log('Processing time:', processingTime, 'ms')
    console.log('Tokens used:', tokensUsed)
    console.log('Used tools:', response.usedTools)

    // Calculate ATS score and keyword matching
    const atsScore = calculateATSScore(extractedData, effectiveJobDescription)
    const keywordsMatched = extractKeywordsMatched(extractedData, effectiveJobDescription)
    const optimizationSuggestions = generateOptimizationSuggestions(extractedData, analysisData)

    // Store the extraction in database using LLMConversation
    let conversationId = null
    try {
      // Create LLM conversation record
      const conversation = await db.lLMConversation.create({
        data: {
          userId: user.id,
          type: 'RESUME_EXTRACTION',
          title: `Resume Extraction - ${new Date().toLocaleDateString()}`,
          provider: 'anthropic',
          model: ANTHROPIC_MODELS.SONNET,
          totalTokensUsed: tokensUsed,
          totalCost: estimatedCost,
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      conversationId = conversation.id

      // Create messages for the conversation
      await db.lLMMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'USER',
          content: prompt,
          messageIndex: 0,
          inputTokens: response.usage.inputTokens,
          totalTokens: response.usage.inputTokens
        }
      })

      await db.lLMMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'ASSISTANT',
          content: JSON.stringify(extractedData),
          messageIndex: 1,
          outputTokens: response.usage.outputTokens,
          totalTokens: response.usage.outputTokens,
          cost: estimatedCost,
          processingTime: processingTime,
          finishReason: response.stopReason || 'end_turn',
          temperature: 0.3,
          maxTokens: ANTHROPIC_CONTEXT_SIZES.NORMAL
        }
      })

      console.log('Resume extraction stored in database')
    } catch (dbError) {
      console.error('Failed to store resume extraction:', dbError)
      // Continue without failing the request
    }

    // Generate optimized resume content (HTML/markdown)
    const optimizedContent = generateOptimizedResumeContent(extractedData, templateId)

    // Save to cache
    let cachedResult = null
    cachedResult = await saveOptimizedResumeToCache(
      user.id,
      optimizedContent,
      JSON.stringify(extractedData),
      templateId,
      truncatedResumeText,
      jobSummaryData?.id || null,
      atsScore,
      keywordsMatched,
      optimizationSuggestions,
      {
        tokensUsed,
        processingTime,
        estimatedCost,
        provider: 'anthropic',
        model: ANTHROPIC_MODELS.SONNET,
        conversationId: conversationId || undefined
      },
      analysisId,
      documentId
    )
    console.log('Optimized resume saved to cache')

    return NextResponse.json({
      success: true,
      data: extractedData,
      cached: false,
      usageCount: 1,
      metadata: {
        tokensUsed,
        processingTime,
        estimatedCost,
        atsScore,
        keywordsMatched,
        optimizationSuggestions
      }
    })

  } catch (error) {
    console.error('Error extracting resume data:', error)
    return NextResponse.json(
      { error: 'Failed to extract resume data' },
      { status: 500 }
    )
  }
}

// Helper functions
function calculateATSScore(extractedData: any, jobDescription: string): number {
  // Simple ATS score calculation based on completeness and keyword matching
  let score = 0
  
  // Check for required fields
  if (extractedData.personalInfo?.name) score += 10
  if (extractedData.personalInfo?.email) score += 10
  if (extractedData.personalInfo?.phone) score += 5
  if (extractedData.summary) score += 15
  if (extractedData.experience?.length > 0) score += 20
  if (extractedData.education?.length > 0) score += 10
  if (extractedData.skills?.technical?.length > 0) score += 15
  
  // Check for quantified achievements
  const hasQuantifiedAchievements = extractedData.experience?.some((exp: any) => 
    exp.achievements?.some((achievement: string) => /\d+/.test(achievement))
  )
  if (hasQuantifiedAchievements) score += 15
  
  return Math.min(score, 100)
}

function extractKeywordsMatched(extractedData: any, jobDescription: string): string[] {
  if (!jobDescription) return []
  
  const jobKeywords = jobDescription.toLowerCase().match(/\b\w+\b/g) || []
  const resumeText = JSON.stringify(extractedData).toLowerCase()
  
  const matched = jobKeywords.filter(keyword => 
    keyword.length > 3 && resumeText.includes(keyword)
  )
  
  // Remove duplicates and return top 10
  return [...new Set(matched)].slice(0, 10)
}

function generateOptimizationSuggestions(extractedData: any, analysisData: any): string[] {
  const suggestions = []
  
  if (!extractedData.summary || extractedData.summary.length < 50) {
    suggestions.push('Add a compelling professional summary')
  }
  
  if (!extractedData.experience?.length) {
    suggestions.push('Include professional experience section')
  }
  
  if (extractedData.experience?.some((exp: any) => !exp.achievements?.length)) {
    suggestions.push('Add quantified achievements to experience entries')
  }
  
  if (!extractedData.skills?.technical?.length) {
    suggestions.push('Include technical skills section')
  }
  
  if (analysisData?.keywordMatch?.missing?.length > 0) {
    suggestions.push(`Add missing keywords: ${analysisData.keywordMatch.missing.slice(0, 3).join(', ')}`)
  }
  
  return suggestions
}

function generateOptimizedResumeContent(extractedData: any, templateId: string): string {
  // Generate HTML content based on the template
  // This is a simplified version - in a real app, you'd have proper templates
  
  return `
    <div class="resume-${templateId}">
      <header>
        <h1>${extractedData.personalInfo?.name || 'Name'}</h1>
        <div class="contact-info">
          ${extractedData.personalInfo?.email ? `<span>${extractedData.personalInfo.email}</span>` : ''}
          ${extractedData.personalInfo?.phone ? `<span>${extractedData.personalInfo.phone}</span>` : ''}
          ${extractedData.personalInfo?.location ? `<span>${extractedData.personalInfo.location}</span>` : ''}
        </div>
      </header>
      
      ${extractedData.summary ? `
        <section class="summary">
          <h2>Professional Summary</h2>
          <p>${extractedData.summary}</p>
        </section>
      ` : ''}
      
      ${extractedData.experience?.length ? `
        <section class="experience">
          <h2>Professional Experience</h2>
          ${extractedData.experience.map((exp: any) => `
            <div class="experience-item">
              <h3>${exp.position} - ${exp.company}</h3>
              <div class="dates">${exp.startDate} - ${exp.endDate}</div>
              ${exp.achievements?.length ? `
                <ul>
                  ${exp.achievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}
      
      ${extractedData.skills?.technical?.length ? `
        <section class="skills">
          <h2>Technical Skills</h2>
          <div class="skills-list">
            ${extractedData.skills.technical.join(', ')}
          </div>
        </section>
      ` : ''}
      
      ${extractedData.education?.length ? `
        <section class="education">
          <h2>Education</h2>
          ${extractedData.education.map((edu: any) => `
            <div class="education-item">
              <h3>${edu.degree} in ${edu.field}</h3>
              <div>${edu.institution} - ${edu.graduationDate}</div>
            </div>
          `).join('')}
        </section>
      ` : ''}
    </div>
  `
}