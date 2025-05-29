import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'
import { getOrCreateJobSummary, shouldSummarizeJobDescription } from '@/lib/job-summary-utils'
import { getOrCreateCoverLetter, saveCoverLetterToCache } from '@/lib/cache-utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { resumeData, jobDescription, analysisData, tone = 'professional', analysisId } = await request.json()

    if (!resumeData || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume data and job description are required' },
        { status: 400 }
      )
    }

    const startTime = Date.now()

    // Get user for caching
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Extract key information from resume
    const resumeText = typeof resumeData === 'string' ? resumeData : 
      resumeData.text || resumeData.extractedText || JSON.stringify(resumeData)

    // Truncate resume text to prevent token overflow (roughly 2000 tokens = ~8000 characters)
    const truncatedResumeText = resumeText.length > 8000 
      ? resumeText.substring(0, 8000) + '\n\n[Resume content truncated for length...]'
      : resumeText

    console.log('=== COVER LETTER GENERATION DEBUG ===')
    console.log('Resume text length:', resumeText.length)
    console.log('Truncated resume text length:', truncatedResumeText.length)
    console.log('Job description length:', jobDescription.length)
    console.log('Analysis ID:', analysisId)
    console.log('Document ID:', resumeData.documentId)
    console.log('Resume data keys:', Object.keys(resumeData))

    // Get or create job description summary if the job description is long
    let jobSummaryData = null
    let effectiveJobDescription = jobDescription

    if (shouldSummarizeJobDescription(jobDescription, 2000)) {
      console.log('Job description is long, getting/creating summary...')
      
      try {
        jobSummaryData = await getOrCreateJobSummary(jobDescription)
        effectiveJobDescription = jobSummaryData.summary
        console.log('Using job summary:', jobSummaryData.cached ? 'cached' : 'newly generated')
        console.log('Summary length:', effectiveJobDescription.length)
      } catch (error) {
        console.error('Error getting job summary:', error)
        effectiveJobDescription = jobDescription.substring(0, 2000) + '\n\n[Job description truncated for length...]'
      }
    }

    console.log('Effective job description length:', effectiveJobDescription.length)

    // Check for cached cover letter first
    const cachedCoverLetter = await getOrCreateCoverLetter(
      user.id,
      truncatedResumeText,
      jobSummaryData?.id || null,
      tone,
      analysisId,
      resumeData.documentId
    )

    if (cachedCoverLetter) {
      console.log('Returning cached cover letter')
      return NextResponse.json({
        success: true,
        data: {
          coverLetter: cachedCoverLetter.content,
          tone: cachedCoverLetter.tone,
          wordCount: cachedCoverLetter.wordCount,
          cached: true,
          usageCount: cachedCoverLetter.usageCount,
          metadata: {
            processingTime: Date.now() - startTime,
            fromCache: true
          }
        }
      })
    }

    console.log('No cached cover letter found, generating new one...')

    // Create the cover letter prompt
    const prompt = `Generate a compelling cover letter based on the following information:

RESUME DATA:
${truncatedResumeText}

JOB DESCRIPTION:
${effectiveJobDescription.extractedText}

${analysisData ? `
ANALYSIS INSIGHTS:
- Overall Score: ${analysisData.overallScore}%
- Key Strengths: ${analysisData.strengths?.slice(0, 3).join(', ')}
- Matched Keywords: ${analysisData.keywordMatch?.matched?.slice(0, 5).join(', ')}
` : ''}

${jobSummaryData ? `
EXTRACTED JOB DETAILS:
- Company: ${jobSummaryData.companyName || 'Not specified'}
- Position: ${jobSummaryData.jobTitle || 'Not specified'}
- Location: ${jobSummaryData.location || 'Not specified'}
- Key Requirements: ${jobSummaryData.keyRequirements?.slice(0, 5).join(', ') || 'See job description'}
` : ''}

REQUIREMENTS:
1. Write a ${tone} cover letter that's 3-4 paragraphs long
2. Address the hiring manager professionally
3. Highlight relevant experience and skills from the resume
4. Show enthusiasm for the specific role and company
5. Include specific examples and achievements when possible
6. Use keywords from the job description naturally
7. End with a strong call to action
8. Keep it concise but impactful (250-400 words)

TONE: ${tone === 'professional' ? 'Professional and confident' : 
       tone === 'enthusiastic' ? 'Enthusiastic and energetic' :
       tone === 'conversational' ? 'Conversational but professional' : 'Professional'}

Generate only the cover letter content without any additional formatting or explanations.`

    console.log('Final prompt length:', prompt.length)
    console.log('Estimated tokens (rough):', Math.ceil(prompt.length / 4))
    console.log('=== END DEBUG ===')

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert career coach and professional writer specializing in creating compelling cover letters that get results. Write cover letters that are personalized, engaging, and demonstrate clear value to employers.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate cover letter' },
        { status: 500 }
      )
    }

    const openaiData = await openaiResponse.json()
    const coverLetter = openaiData.choices[0]?.message?.content

    if (!coverLetter) {
      return NextResponse.json(
        { error: 'No cover letter generated' },
        { status: 500 }
      )
    }

    const processingTime = Date.now() - startTime
    const tokensUsed = openaiData.usage?.total_tokens || 0
    const estimatedCost = (tokensUsed / 1000) * 0.002 // Rough estimate for GPT-4o-mini

    // Store the cover letter generation in database using LLMConversation
    let conversationId = null
    try {
      // Create LLM conversation record
      const conversation = await db.lLMConversation.create({
        data: {
          userId: user.id,
          type: 'COVER_LETTER_GENERATION',
          title: `Cover Letter - ${new Date().toLocaleDateString()}`,
          provider: 'openai',
          model: 'gpt-4.1-mini',
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
          content: `Generate cover letter for job:\n\n${effectiveJobDescription}\n\nUsing resume data and tone: ${tone}`,
          messageIndex: 0,
          inputTokens: tokensUsed - (openaiData.usage?.completion_tokens || 0),
          totalTokens: tokensUsed - (openaiData.usage?.completion_tokens || 0)
        }
      })

      await db.lLMMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'ASSISTANT',
          content: coverLetter,
          messageIndex: 1,
          outputTokens: openaiData.usage?.completion_tokens || 0,
          totalTokens: openaiData.usage?.completion_tokens || 0,
          cost: estimatedCost,
          processingTime: processingTime,
          finishReason: openaiData.choices[0]?.finish_reason || 'stop',
          temperature: 0.7,
          maxTokens: 1000
        }
      })

      console.log('Cover letter generation stored in database')
    } catch (dbError) {
      console.error('Failed to store cover letter generation:', dbError)
      // Continue without failing the request
    }

    // Save to cache
    const cachedResult = await saveCoverLetterToCache(
      user.id,
      coverLetter,
      tone,
      truncatedResumeText,
      jobSummaryData?.id || null,
      {
        tokensUsed,
        processingTime,
        estimatedCost,
        provider: 'openai',
        model: 'gpt-4.1-mini',
        conversationId: conversationId || undefined
      },
      analysisId,
      resumeData.documentId
    )

    return NextResponse.json({
      success: true,
      data: {
        coverLetter: cachedResult.content,
        tone: cachedResult.tone,
        wordCount: cachedResult.wordCount,
        cached: false,
        usageCount: 1,
        metadata: {
          tokensUsed,
          processingTime,
          estimatedCost
        }
      }
    })

  } catch (error) {
    console.error('Error generating cover letter:', error)
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    )
  }
} 