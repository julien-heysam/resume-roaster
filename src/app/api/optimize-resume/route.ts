import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'
import { getOrCreateJobSummary, shouldSummarizeJobDescription } from '@/lib/job-summary-utils'
import { callOpenAIResumeOptimization, OPENAI_MODELS, CONTEXT_SIZES, TEMPERATURES } from '@/lib/openai-utils'
import crypto from 'crypto'

// Configure runtime for long-running operations
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes timeout
export const dynamic = 'force-dynamic'

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
      extractedResumeId,
      jobDescription, 
      analysisData,
      templateId = 'modern-professional',
      documentId, 
      analysisId
    } = await request.json()

    console.log('=== OPTIMIZE RESUME DEBUG ===')
    console.log('Extracted Resume ID:', extractedResumeId)
    console.log('Job description length:', jobDescription?.length || 0)
    console.log('Has analysis data:', !!analysisData)
    console.log('Template ID:', templateId)
    console.log('Document ID:', documentId)
    console.log('Analysis ID:', analysisId)

    if (!extractedResumeId) {
      return NextResponse.json(
        { error: 'Extracted resume ID is required' },
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

    // Get the extracted resume data
    const extractedResume = await db.extractedResume.findUnique({
      where: { id: extractedResumeId },
      include: {
        user: true,
        document: true,
        analysis: true
      }
    })

    if (!extractedResume) {
      return NextResponse.json(
        { error: 'Extracted resume not found' },
        { status: 404 }
      )
    }

    // Parse the extracted resume data
    let baseResumeData
    try {
      baseResumeData = JSON.parse(extractedResume.extractedData)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid extracted resume data' },
        { status: 400 }
      )
    }

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

    // Create content hash for deduplication (based on extracted resume + job + template)
    const contentHash = crypto
      .createHash('sha256')
      .update(`${extractedResumeId}-${effectiveJobDescription}-${templateId}`)
      .digest('hex')

    // Check for cached optimized resume first
    const cachedOptimizedResume = await db.optimizedResume.findUnique({
      where: { contentHash },
      include: {
        user: true,
        extractedResume: true,
        analysis: true,
        document: true,
        jobSummary: true
      }
    })

    if (cachedOptimizedResume) {
      console.log('Returning cached optimized resume')
      
      // Update usage count and last used
      await db.optimizedResume.update({
        where: { id: cachedOptimizedResume.id },
        data: {
          usageCount: { increment: 1 },
          lastUsedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        data: JSON.parse(cachedOptimizedResume.extractedData),
        content: cachedOptimizedResume.content,
        cached: true,
        usageCount: cachedOptimizedResume.usageCount + 1,
        optimizedResumeId: cachedOptimizedResume.id,
        metadata: {
          processingTime: Date.now() - startTime,
          fromCache: true,
          atsScore: cachedOptimizedResume.atsScore,
          keywordsMatched: cachedOptimizedResume.keywordsMatched,
          optimizationSuggestions: cachedOptimizedResume.optimizationSuggestions
        }
      })
    }

    console.log('No cached optimized resume found, generating new one...')

    // Create the optimization prompt
    const prompt = `Optimize the following resume data for the target job description and analysis insights.

IMPORTANT:
- Keep it short and concise, this is a resume, not a novel.
- Keep it to 1000 words or less.

${effectiveJobDescription ? `
TARGET JOB DESCRIPTION:
${effectiveJobDescription}
` : ''}

BASE RESUME DATA (JSON):
${JSON.stringify(baseResumeData, null, 2)}

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

Please optimize and return ONLY a valid JSON object with the same structure as the base resume data, but with the following optimizations:

1. **Keyword Integration**: Naturally incorporate missing keywords from the job description
2. **Achievement Enhancement**: Quantify achievements where possible and align with job requirements
3. **Skills Optimization**: Prioritize and highlight relevant technical and soft skills
4. **Experience Tailoring**: Emphasize relevant experience and responsibilities
5. **Summary Enhancement**: Create a compelling summary that matches the job requirements
6. **ATS Optimization**: Ensure content is ATS-friendly with proper formatting and keywords

IMPORTANT INSTRUCTIONS:
1. Maintain the exact same JSON structure as the input
2. Keep all original information but enhance and optimize it
3. Add quantified metrics where logical and impactful
4. Ensure all dates remain in MM/YYYY format
5. Return ONLY the JSON object, no additional text or formatting
6. Make the content more compelling while staying truthful to the original data
7. Prioritize keywords and skills that match the job description

Return the optimized resume data in the same JSON format:`

    console.log('Final prompt length:', prompt.length)
    console.log('Estimated tokens (rough):', Math.ceil(prompt.length / 4))
    console.log('=== END DEBUG ===')

    console.log('🚀 Starting OpenAI API call...')
    const apiStartTime = Date.now()

    // Call OpenAI API using the centralized utility with function calling
    try {
      const openaiResponse = await callOpenAIResumeOptimization(prompt, {
        model: OPENAI_MODELS.MINI,
        maxTokens: CONTEXT_SIZES.XLARGE,
        temperature: TEMPERATURES.NORMAL,
        systemPrompt: 'You are an expert resume optimizer and career coach. Optimize resume data for ATS systems and job requirements while maintaining truthfulness. Use the provided function to return structured resume data.',
        retryOnIncomplete: true
      })

      const optimizedData = openaiResponse.data
      const tokensUsed = openaiResponse.usage.totalTokens
      const estimatedCost = openaiResponse.cost
      const processingTime = openaiResponse.processingTime

      console.log('✅ OpenAI optimization completed successfully')
      console.log('Processing time:', processingTime, 'ms')
      console.log('Tokens used:', tokensUsed)
      console.log('Cost:', estimatedCost)
      console.log('Used function calling for structured output')

      // Validate the optimized data structure
      if (!optimizedData || typeof optimizedData !== 'object') {
        throw new Error('Invalid optimized data structure')
      }

      // Calculate metrics
    const atsScore = calculateATSScore(optimizedData, effectiveJobDescription)
    const keywordsMatched = extractKeywordsMatched(optimizedData, effectiveJobDescription)
    const optimizationSuggestions = generateOptimizationSuggestions(optimizedData, analysisData)

    console.log('💾 Storing optimization in database...')
    // Store the optimization in database using LLMConversation
    let conversationId = null
    try {
      // Create LLM conversation record
      const conversation = await db.lLMConversation.create({
        data: {
          userId: user.id,
          type: 'RESUME_EXTRACTION', // Using existing enum value
          title: `Resume Optimization - ${new Date().toLocaleDateString()}`,
          provider: 'openai',
            model: OPENAI_MODELS.MINI,
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
          content: `Optimize resume for job:\n\nExtracted Resume ID: ${extractedResumeId}\nJob description: ${effectiveJobDescription ? 'Provided' : 'None'}`,
          messageIndex: 0,
            inputTokens: openaiResponse.usage.promptTokens,
            totalTokens: openaiResponse.usage.promptTokens
        }
      })

      await db.lLMMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'ASSISTANT',
            content: JSON.stringify(optimizedData),
          messageIndex: 1,
            outputTokens: openaiResponse.usage.completionTokens,
          totalTokens: tokensUsed,
          cost: estimatedCost,
          processingTime: processingTime,
            finishReason: openaiResponse.finishReason,
            temperature: TEMPERATURES.NORMAL,
            maxTokens: CONTEXT_SIZES.XLARGE
        }
      })

      console.log('Resume optimization stored in database')
    } catch (dbError) {
        console.error('Failed to store optimization conversation:', dbError)
      // Continue without failing the request
    }

      // Generate optimized resume content
      const optimizedContent = generateOptimizedResumeContent(optimizedData, templateId)

      // Save the optimized resume to database
      const savedOptimizedResume = await db.optimizedResume.create({
        data: {
          userId: user.id,
          extractedResumeId: extractedResumeId,
          documentId: documentId || null,
          analysisId: analysisId || null,
          jobSummaryId: jobSummaryData?.id || null,
          contentHash,
          extractedData: JSON.stringify(optimizedData),
          content: optimizedContent,
          templateId,
          atsScore,
          keywordsMatched,
          optimizationSuggestions,
          provider: 'openai',
          model: OPENAI_MODELS.MINI,
          totalTokensUsed: tokensUsed,
          totalCost: estimatedCost,
          processingTime: processingTime,
          conversationId: conversationId || null,
          usageCount: 1,
          lastUsedAt: new Date()
        }
      })
      
      console.log('Optimized resume saved to database with ID:', savedOptimizedResume.id)

      const totalProcessingTime = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      data: optimizedData,
        content: optimizedContent,
      cached: false,
      usageCount: 1,
        optimizedResumeId: savedOptimizedResume.id,
      metadata: {
        tokensUsed,
          processingTime: totalProcessingTime,
        estimatedCost,
        atsScore,
        keywordsMatched,
        optimizationSuggestions,
          usedFunctionCalling: true
        }
      })

    } catch (error: any) {
      console.error('❌ OpenAI optimization failed:', error)
      
      // Return appropriate error response
      if (error.message?.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timed out. Please try again with a shorter job description or resume.' },
          { status: 408 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to optimize resume data' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error optimizing resume:', error)
    return NextResponse.json(
      { error: 'Failed to optimize resume' },
      { status: 500 }
    )
  }
}

// Helper functions
function calculateATSScore(optimizedData: any, jobDescription: string): number {
  // Simple ATS score calculation based on completeness and keyword matching
  let score = 0
  
  // Check for required fields
  if (optimizedData.personalInfo?.name) score += 10
  if (optimizedData.personalInfo?.email) score += 10
  if (optimizedData.personalInfo?.phone) score += 5
  if (optimizedData.summary) score += 15
  if (optimizedData.experience?.length > 0) score += 20
  if (optimizedData.education?.length > 0) score += 10
  if (optimizedData.skills?.technical?.length > 0) score += 15
  
  // Check for quantified achievements
  const hasQuantifiedAchievements = optimizedData.experience?.some((exp: any) => 
    exp.achievements?.some((achievement: string) => /\d+/.test(achievement))
  )
  if (hasQuantifiedAchievements) score += 15
  
  return Math.min(score, 100)
}

function extractKeywordsMatched(optimizedData: any, jobDescription: string): string[] {
  if (!jobDescription) return []
  
  const jobKeywords = jobDescription.toLowerCase().match(/\b\w+\b/g) || []
  const resumeText = JSON.stringify(optimizedData).toLowerCase()
  
  const matched = jobKeywords.filter(keyword => 
    keyword.length > 3 && resumeText.includes(keyword)
  )
  
  // Remove duplicates and return top 10
  return [...new Set(matched)].slice(0, 10)
}

function generateOptimizationSuggestions(optimizedData: any, analysisData: any): string[] {
  const suggestions = []
  
  if (!optimizedData.summary || optimizedData.summary.length < 50) {
    suggestions.push('Add a compelling professional summary')
  }
  
  if (!optimizedData.experience?.length) {
    suggestions.push('Include professional experience section')
  }
  
  if (optimizedData.experience?.some((exp: any) => !exp.achievements?.length)) {
    suggestions.push('Add quantified achievements to experience entries')
  }
  
  if (!optimizedData.skills?.technical?.length) {
    suggestions.push('Include technical skills section')
  }
  
  if (analysisData?.keywordMatch?.missing?.length > 0) {
    suggestions.push(`Add missing keywords: ${analysisData.keywordMatch.missing.slice(0, 3).join(', ')}`)
  }
  
  return suggestions
}

function generateOptimizedResumeContent(optimizedData: any, templateId: string): string {
  // Generate HTML content based on the template
  // This is a simplified version - in a real app, you'd have proper templates
  
  return `
    <div class="resume-${templateId}">
      <header>
        <h1>${optimizedData.personalInfo?.name || 'Name'}</h1>
        <div class="contact-info">
          ${optimizedData.personalInfo?.email ? `<span>${optimizedData.personalInfo.email}</span>` : ''}
          ${optimizedData.personalInfo?.phone ? `<span>${optimizedData.personalInfo.phone}</span>` : ''}
          ${optimizedData.personalInfo?.location ? `<span>${optimizedData.personalInfo.location}</span>` : ''}
        </div>
      </header>
      
      ${optimizedData.summary ? `
        <section class="summary">
          <h2>Professional Summary</h2>
          <p>${optimizedData.summary}</p>
        </section>
      ` : ''}
      
      ${optimizedData.experience?.length ? `
        <section class="experience">
          <h2>Professional Experience</h2>
          ${optimizedData.experience.map((exp: any) => `
            <div class="experience-item">
              <h3>${exp.title} - ${exp.company}</h3>
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
      
      ${optimizedData.skills?.technical?.length ? `
        <section class="skills">
          <h2>Technical Skills</h2>
          <div class="skills-list">
            ${optimizedData.skills.technical.join(', ')}
          </div>
        </section>
      ` : ''}
      
      ${optimizedData.education?.length ? `
        <section class="education">
          <h2>Education</h2>
          ${optimizedData.education.map((edu: any) => `
            <div class="education-item">
              <h3>${edu.degree}</h3>
              <div>${edu.school} - ${edu.graduationDate}</div>
            </div>
          `).join('')}
        </section>
      ` : ''}
    </div>
  `
} 