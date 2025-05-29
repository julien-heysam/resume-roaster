import { db } from '@/lib/database'
import { callOpenAIJobSummary, OPENAI_MODELS, CONTEXT_SIZES, TEMPERATURES } from '@/lib/openai-utils'
import { callAnthropicJobSummary, ANTHROPIC_MODELS, ANTHROPIC_CONTEXT_SIZES, ANTHROPIC_TEMPERATURES } from '@/lib/anthropic-utils'
import crypto from 'crypto'

export interface JobSummaryData {
  id: string
  summary: string
  keyRequirements: string[]
  companyName: string | null
  jobTitle: string | null
  location: string | null
  salaryRange: string | null
  usageCount: number
  cached: boolean
}

export interface JobSummaryOptions {
  provider?: 'openai' | 'anthropic'
  model?: string
  maxTokens?: number
  temperature?: number
}

/**
 * Get or create a job description summary
 * @param jobDescription The original job description text
 * @param options Configuration options for the AI provider
 * @returns JobSummaryData object with summary and metadata
 */
export async function getOrCreateJobSummary(
  jobDescription: string, 
  options: JobSummaryOptions = {}
): Promise<JobSummaryData> {
  const { provider = 'openai' } = options
  
  // Create hash of the job description for deduplication
  const contentHash = crypto
    .createHash('sha256')
    .update(jobDescription.trim().toLowerCase())
    .digest('hex')

  console.log('Checking for existing job summary with hash:', contentHash)

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

    return {
      id: existingSummary.id,
      summary: existingSummary.summary,
      keyRequirements: existingSummary.keyRequirements,
      companyName: existingSummary.companyName,
      jobTitle: existingSummary.jobTitle,
      location: existingSummary.location,
      salaryRange: existingSummary.salaryRange,
      usageCount: existingSummary.usageCount,
      cached: true
    }
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

  let openaiResponse: any
  let tokensUsed: number
  let estimatedCost: number
  let processingTime: number
  let parsedSummary: any

  if (provider === 'anthropic') {
    // Use Anthropic for summarization
    const response = await callAnthropicJobSummary(prompt, {
      model: options.model || ANTHROPIC_MODELS.SONNET,
      maxTokens: options.maxTokens || ANTHROPIC_CONTEXT_SIZES.NORMAL,
      temperature: options.temperature || ANTHROPIC_TEMPERATURES.NORMAL,
      systemPrompt: 'You are an expert HR analyst and job description summarizer. You extract key information and create concise, useful summaries while preserving all important details. Use the provided tool to return structured data.'
    })

    parsedSummary = response.data
    tokensUsed = response.usage.totalTokens
    estimatedCost = response.cost
    processingTime = response.processingTime

    console.log('Summary generated successfully with Anthropic')
    console.log('Processing time:', processingTime, 'ms')
    console.log('Tokens used:', tokensUsed)
    console.log('Used tools:', response.usedTools)
  } else {
    // Use OpenAI for summarization (default)
    const response = await callOpenAIJobSummary(prompt, {
      model: options.model || OPENAI_MODELS.MINI,
      maxTokens: options.maxTokens || CONTEXT_SIZES.NORMAL,
      temperature: options.temperature || TEMPERATURES.NORMAL,
      systemPrompt: 'You are an expert HR analyst and job description summarizer. You extract key information and create concise, useful summaries while preserving all important details. Use the provided function to return structured data.'
    })

    parsedSummary = response.data
    tokensUsed = response.usage.totalTokens
    estimatedCost = response.cost
    processingTime = response.processingTime

    console.log('Summary generated successfully with OpenAI')
    console.log('Processing time:', processingTime, 'ms')
    console.log('Tokens used:', tokensUsed)
    console.log('Used function calling for structured output')
  }

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
      model: options.model || (provider === 'anthropic' ? ANTHROPIC_MODELS.SONNET : OPENAI_MODELS.MINI),
      totalTokensUsed: tokensUsed,
      totalCost: estimatedCost,
      processingTime: processingTime
    }
  })

  console.log('Summary saved to database with ID:', savedSummary.id)

  return {
    id: savedSummary.id,
    summary: savedSummary.summary,
    keyRequirements: savedSummary.keyRequirements,
    companyName: savedSummary.companyName,
    jobTitle: savedSummary.jobTitle,
    location: savedSummary.location,
    salaryRange: savedSummary.salaryRange,
    usageCount: 1,
    cached: false
  }
}

/**
 * Get job summary statistics
 * @returns Object with summary statistics
 */
export async function getJobSummaryStats() {
  const stats = await db.jobDescriptionSummary.aggregate({
    _count: { id: true },
    _sum: { 
      usageCount: true,
      totalTokensUsed: true,
      totalCost: true
    },
    _avg: {
      processingTime: true
    }
  })

  const topUsed = await db.jobDescriptionSummary.findMany({
    orderBy: { usageCount: 'desc' },
    take: 5,
    select: {
      id: true,
      companyName: true,
      jobTitle: true,
      usageCount: true,
      createdAt: true
    }
  })

  return {
    totalSummaries: stats._count.id,
    totalUsage: stats._sum.usageCount || 0,
    totalTokensUsed: stats._sum.totalTokensUsed || 0,
    totalCost: stats._sum.totalCost || 0,
    avgProcessingTime: stats._avg.processingTime || 0,
    topUsedSummaries: topUsed
  }
}

/**
 * Check if a job description should be summarized
 * @param jobDescription The job description text
 * @param threshold Character threshold (default: 2000)
 * @returns boolean indicating if summarization is recommended
 */
export function shouldSummarizeJobDescription(jobDescription: string, threshold: number = 2000): boolean {
  return jobDescription.length > threshold
} 