import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'
import { LLMLogger, MessageRole } from '@/lib/llm-logger'
import { ANTHROPIC_MODELS, ANTHROPIC_CONTEXT_SIZES, ANTHROPIC_TEMPERATURES, callAnthropicResumeOptimization } from '@/lib/anthropic-utils'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  let llmCallId: string | null = null

  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { resumeText, resumeId, extractedResumeId, bypassCache = false } = await request.json()

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

    console.log('Summarized resume API called')
    console.log('Resume text length:', resumeText.length)
    console.log('Resume ID:', resumeId)
    console.log('Extracted Resume ID:', extractedResumeId)
    console.log('Bypass cache:', bypassCache)

    // Generate content hash for caching
    const contentHash = crypto.createHash('sha256')
      .update(resumeText + 'summarized')
      .digest('hex')

    console.log('Content hash:', contentHash)

    // Check for cached summarized resume first (unless bypassing cache)
    if (!bypassCache) {
      const cachedSummarizedResume = await db.summarizedResume.findUnique({
        where: { contentHash }
      })

      if (cachedSummarizedResume) {
        console.log('Returning cached summarized resume')
        
        const data = cachedSummarizedResume.summary as any
        return NextResponse.json({
          success: true,
          data: data,
          summarizedResumeId: cachedSummarizedResume.id,
          cached: true,
          metadata: {
            contentHash,
            createdAt: cachedSummarizedResume.createdAt.toISOString(),
            fromCache: true
          }
        })
      }
    }

    console.log('No cached summarized resume found, generating new one...')

    // Create LLM call for logging
    llmCallId = await LLMLogger.createLlmCall({
      userId: user.id,
      provider: 'anthropic',
      model: ANTHROPIC_MODELS.SONNET,
      operationType: 'resume_summarization',
      resumeId: resumeId || undefined
    })

    // Create the summarization prompt
    const prompt = `Extract and structure the following resume data into a comprehensive JSON format:

RESUME TEXT:
${resumeText}

IMPORTANT INSTRUCTIONS:
1. Extract information accurately from the resume text
2. Structure the data in a clean, organized JSON format
3. Include all relevant sections: personal info, experience, education, skills, etc.
4. Ensure all dates are in MM/YYYY format
5. If information is missing, use null or empty arrays as appropriate
6. Make sure you don't omit any information from the resume text
7. Organize achievements and responsibilities clearly
8. Extract technical and soft skills separately
9. Include any certifications, projects, or additional sections

Please use the optimize_resume_data function to return the structured data.`

    await LLMLogger.logMessage({
      llmCallId,
      role: MessageRole.user,
      content: prompt,
      messageIndex: 0
    })

    console.log('Sending request to Anthropic for resume summarization...')

    const startTime = Date.now()

    // Use centralized Anthropic utility with function calling
    const response = await callAnthropicResumeOptimization(prompt, {
      model: ANTHROPIC_MODELS.SONNET,
      maxTokens: ANTHROPIC_CONTEXT_SIZES.NORMAL,
      temperature: ANTHROPIC_TEMPERATURES.NORMAL, // Lower temperature for more consistent extraction
      systemPrompt: 'You are an expert resume parser. Extract resume data into structured JSON format that captures all information accurately and completely. Use the provided tool to return structured data.'
    })

    const processingTime = Date.now() - startTime
    const summarizedData = response.data
    const tokensUsed = response.usage.totalTokens
    const estimatedCost = response.cost

    console.log('Resume summarization completed successfully')
    console.log('Processing time:', processingTime, 'ms')
    console.log('Tokens used:', tokensUsed)
    console.log('Cost:', estimatedCost)

    // Log AI response
    await LLMLogger.logMessage({
      llmCallId,
      role: MessageRole.assistant,
      content: JSON.stringify(summarizedData),
      messageIndex: 1,
      totalTokens: tokensUsed,
      costUsd: estimatedCost,
      processingTimeMs: processingTime
    })

    // Update LLM call as completed
    await LLMLogger.updateLlmCall({
      llmCallId,
      status: 'COMPLETED',
      totalTokens: tokensUsed,
      totalCostUsd: estimatedCost,
      totalProcessingTimeMs: processingTime,
      completedAt: new Date()
    })

    // Save summarized data
    const savedSummarized = await db.summarizedResume.create({
      data: {
        extractedResumeId: extractedResumeId || crypto.randomUUID(),
        contentHash,
        summary: summarizedData
      }
    })

    console.log('Summarized resume saved with ID:', savedSummarized.id)

    return NextResponse.json({
      success: true,
      data: summarizedData,
      summarizedResumeId: savedSummarized.id,
      cached: false,
      metadata: {
        contentHash,
        createdAt: savedSummarized.createdAt.toISOString(),
        fromCache: false,
        tokensUsed,
        processingTime,
        estimatedCost,
        llmCallId
      }
    })

  } catch (error) {
    console.error('Summarized resume error:', error)
    
    // Update LLM call with error if we have an ID
    if (llmCallId) {
      await LLMLogger.updateLlmCall({
        llmCallId,
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to summarize resume data',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
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

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get user's summarized resumes through extractedResume relation
    const summarizedResumes = await db.summarizedResume.findMany({
      where: { 
        extractedResume: {
          resume: {
            userId: user.id
          }
        }
      },
      include: {
        extractedResume: {
          include: {
            resume: {
              select: {
                id: true,
                filename: true,
                createdAt: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    const totalCount = await db.summarizedResume.count({
      where: {
        extractedResume: {
          resume: {
            userId: user.id
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: summarizedResumes,
      pagination: {
        total: totalCount,
        page: Math.floor(offset / limit) + 1,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    })

  } catch (error) {
    console.error('Get summarized resumes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch summarized resumes' },
      { status: 500 }
    )
  }
} 