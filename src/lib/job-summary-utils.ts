import { db } from '@/lib/database'
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

/**
 * Get or create a job description summary
 * @param jobDescription The original job description text
 * @returns JobSummaryData object with summary and metadata
 */
export async function getOrCreateJobSummary(jobDescription: string): Promise<JobSummaryData> {
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

  console.log('No existing summary found, generating new one...')

  const startTime = Date.now()

  // Create summarization prompt
  const prompt = `Analyze and summarize the following job description. Extract key information and create a concise summary.

JOB DESCRIPTION:
${jobDescription}

Please provide a JSON response with the following structure:
{
  "summary": "A concise 2-3 paragraph summary of the role, responsibilities, and company (max 500 words)",
  "keyRequirements": ["requirement1", "requirement2", "requirement3", ...],
  "companyName": "Company name if mentioned",
  "jobTitle": "Job title",
  "location": "Location if mentioned",
  "salaryRange": "Salary range if mentioned"
}

Focus on:
- Core responsibilities and role purpose
- Essential skills and qualifications
- Company culture and values (if mentioned)
- Key benefits or perks (if mentioned)
- Remove redundant information and marketing fluff
- Keep technical requirements specific but concise

Respond only with valid JSON.`

  // Use GPT-4o-mini for fast, cost-effective summarization
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
          content: 'You are an expert HR analyst and job description summarizer. You extract key information and create concise, useful summaries while preserving all important details. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
      response_format: { type: "json_object" }
    }),
  })

  if (!openaiResponse.ok) {
    const errorData = await openaiResponse.json()
    console.error('OpenAI API error during summarization:', errorData)
    throw new Error('Failed to summarize job description')
  }

  const openaiData = await openaiResponse.json()
  const summaryContent = openaiData.choices[0]?.message?.content

  if (!summaryContent) {
    throw new Error('No summary generated')
  }

  let parsedSummary
  try {
    parsedSummary = JSON.parse(summaryContent)
  } catch (error) {
    console.error('Failed to parse summary JSON:', error)
    throw new Error('Invalid summary format generated')
  }

  const processingTime = Date.now() - startTime
  const tokensUsed = openaiData.usage?.total_tokens || 0
  const estimatedCost = (tokensUsed / 1000) * 0.002

  console.log('Summary generated successfully')
  console.log('Processing time:', processingTime, 'ms')
  console.log('Tokens used:', tokensUsed)

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
      provider: 'openai',
      model: 'gpt-4.1-mini',
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