import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'
import { callOpenAIJobSummary, OPENAI_MODELS, CONTEXT_SIZES, TEMPERATURES } from '@/lib/openai-utils'
import { callAnthropicJobSummary, ANTHROPIC_MODELS, ANTHROPIC_CONTEXT_SIZES, ANTHROPIC_TEMPERATURES } from '@/lib/anthropic-utils'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { jobDescription, provider = 'openai' } = await request.json()

    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      )
    }

    if (!['openai', 'anthropic'].includes(provider)) {
      return NextResponse.json(
        { error: 'Provider must be either "openai" or "anthropic"' },
        { status: 400 }
      )
    }

    // Create hash of the job description for deduplication
    const contentHash = crypto
      .createHash('sha256')
      .update(jobDescription.trim().toLowerCase())
      .digest('hex')

    console.log('=== JOB DESCRIPTION SUMMARIZATION ===')
    console.log('Original length:', jobDescription.length)
    console.log('Content hash:', contentHash)
    console.log('Provider:', provider)

    // Check if we already have a summary for this job description
    let existingSummary = await db.jobDescriptionSummary.findUnique({
      where: { contentHash }
    })

    if (existingSummary) {
      console.log('Found existing summary, updating usage count')
      
      // Update usage count and last used timestamp
      existingSummary = await db.jobDescriptionSummary.update({
        where: { id: existingSummary.id },
        data: {
          usageCount: { increment: 1 },
          lastUsedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          id: existingSummary.id,
          summary: existingSummary.summary,
          keyRequirements: existingSummary.keyRequirements,
          companyName: existingSummary.companyName,
          jobTitle: existingSummary.jobTitle,
          location: existingSummary.location,
          salaryRange: existingSummary.salaryRange,
          usageCount: existingSummary.usageCount,
          cached: true,
          provider: existingSummary.provider
        }
      })
    }

    console.log(`No existing summary found, generating new one using ${provider}...`)

    const startTime = Date.now()

    // Create summarization prompt
    const prompt = `Analyze and summarize the following job description. Extract key information and create a concise summary.

JOB DESCRIPTION:
${jobDescription}

Focus on:
- Core responsibilities and role purpose
- Essential skills and qualifications
- Company culture and values (if mentioned)
- Key benefits or perks (if mentioned)
- Remove redundant information and marketing fluff
- Keep technical requirements specific but concise`

    let response: any
    let parsedSummary: any
    let tokensUsed: number
    let estimatedCost: number
    let processingTime: number

    if (provider === 'anthropic') {
      // Check for API key
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json(
          { error: 'Anthropic API key not configured' },
          { status: 500 }
        )
      }

      // Use Anthropic for summarization
      response = await callAnthropicJobSummary(prompt, {
        model: ANTHROPIC_MODELS.SONNET,
        maxTokens: ANTHROPIC_CONTEXT_SIZES.MINI,
        temperature: ANTHROPIC_TEMPERATURES.NORMAL,
        systemPrompt: 'You are an expert HR analyst and job description summarizer. You extract key information and create concise, useful summaries while preserving all important details. Use the provided tool to return structured data.'
      })

      console.log('Summary generated successfully with Anthropic')
      console.log('Used tools:', response.usedTools)
    } else {
      // Check for API key
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
          { error: 'OpenAI API key not configured' },
          { status: 500 }
        )
      }

      // Use OpenAI for summarization (default)
      response = await callOpenAIJobSummary(prompt, {
        model: OPENAI_MODELS.MINI,
        maxTokens: CONTEXT_SIZES.MINI,
        temperature: TEMPERATURES.NORMAL,
        systemPrompt: 'You are an expert HR analyst and job description summarizer. You extract key information and create concise, useful summaries while preserving all important details. Use the provided function to return structured data.'
      })

      console.log('Summary generated successfully with OpenAI')
      console.log('Used function calling for structured output')
    }

    parsedSummary = response.data
    tokensUsed = response.usage.totalTokens
    estimatedCost = response.cost
    processingTime = response.processingTime

    console.log('Processing time:', processingTime, 'ms')
    console.log('Tokens used:', tokensUsed)
    console.log('Cost:', estimatedCost)

    // Save the summary to database
    const savedSummary = await db.jobDescriptionSummary.create({
      data: {
        contentHash,
        originalText: jobDescription,
        summary: parsedSummary.summary || '',
        keyRequirements: parsedSummary.keyRequirements || [],
        companyName: parsedSummary.companyName || null,
        jobTitle: parsedSummary.jobTitle || null,
        location: parsedSummary.location || null,
        salaryRange: parsedSummary.salaryRange || null,
        provider: provider,
        model: provider === 'anthropic' ? ANTHROPIC_MODELS.SONNET : OPENAI_MODELS.MINI,
        totalTokensUsed: tokensUsed,
        totalCost: estimatedCost,
        processingTime: processingTime
      }
    })

    console.log('Summary saved to database with ID:', savedSummary.id)

    return NextResponse.json({
      success: true,
      data: {
        id: savedSummary.id,
        summary: savedSummary.summary,
        keyRequirements: savedSummary.keyRequirements,
        companyName: savedSummary.companyName,
        jobTitle: savedSummary.jobTitle,
        location: savedSummary.location,
        salaryRange: savedSummary.salaryRange,
        usageCount: 1,
        cached: false,
        provider: provider,
        metadata: {
          tokensUsed,
          processingTime,
          estimatedCost,
          originalLength: jobDescription.length,
          summaryLength: savedSummary.summary.length
        }
      }
    })

  } catch (error) {
    console.error('Error summarizing job description:', error)
    return NextResponse.json(
      { error: 'Failed to summarize job description' },
      { status: 500 }
    )
  }
} 