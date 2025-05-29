import { db } from '@/lib/database'
import crypto from 'crypto'

export interface CachedCoverLetter {
  id: string
  content: string
  tone: string
  wordCount: number
  usageCount: number
  cached: boolean
  metadata?: {
    tokensUsed: number
    processingTime: number
    estimatedCost: number
  }
}

export interface CachedOptimizedResume {
  id: string
  content: string
  extractedData: string
  templateId: string
  atsScore: number | null
  keywordsMatched: string[]
  optimizationSuggestions: string[]
  usageCount: number
  cached: boolean
  metadata?: {
    tokensUsed: number
    processingTime: number
    estimatedCost: number
  }
}

/**
 * Generate content hash for cover letter caching
 */
export function generateCoverLetterHash(
  resumeText: string,
  jobSummaryId: string | null,
  tone: string
): string {
  const content = `${resumeText.trim()}|${jobSummaryId || 'no-job'}|${tone}`
  return crypto.createHash('sha256').update(content.toLowerCase()).digest('hex')
}

/**
 * Generate content hash for optimized resume caching
 */
export function generateOptimizedResumeHash(
  resumeText: string,
  jobSummaryId: string | null,
  templateId: string
): string {
  const content = `${resumeText.trim()}|${jobSummaryId || 'no-job'}|${templateId}`
  return crypto.createHash('sha256').update(content.toLowerCase()).digest('hex')
}

/**
 * Get or create cached cover letter
 */
export async function getOrCreateCoverLetter(
  userId: string | null,
  resumeText: string,
  jobSummaryId: string | null,
  tone: string,
  analysisId?: string,
  documentId?: string
): Promise<CachedCoverLetter | null> {
  const contentHash = generateCoverLetterHash(resumeText, jobSummaryId, tone)

  console.log('Checking for cached cover letter with hash:', contentHash)

  // Check if we already have this cover letter
  let existingCoverLetter = await db.coverLetter.findUnique({
    where: { contentHash }
  })

  if (existingCoverLetter) {
    console.log('Found cached cover letter, updating usage count')
    
    // Update usage count and last used timestamp
    existingCoverLetter = await db.coverLetter.update({
      where: { id: existingCoverLetter.id },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date()
      }
    })

    return {
      id: existingCoverLetter.id,
      content: existingCoverLetter.content,
      tone: existingCoverLetter.tone,
      wordCount: existingCoverLetter.wordCount,
      usageCount: existingCoverLetter.usageCount,
      cached: true
    }
  }

  console.log('No cached cover letter found')
  return null
}

/**
 * Save generated cover letter to cache
 */
export async function saveCoverLetterToCache(
  userId: string | null,
  content: string,
  tone: string,
  resumeText: string,
  jobSummaryId: string | null,
  metadata: {
    tokensUsed: number
    processingTime: number
    estimatedCost: number
    provider: string
    model: string
    conversationId?: string
  },
  analysisId?: string,
  documentId?: string
): Promise<CachedCoverLetter> {
  const contentHash = generateCoverLetterHash(resumeText, jobSummaryId, tone)
  const wordCount = content.split(' ').length

  const savedCoverLetter = await db.coverLetter.create({
    data: {
      userId,
      content,
      tone,
      wordCount,
      contentHash,
      analysisId,
      documentId,
      jobSummaryId,
      provider: metadata.provider,
      model: metadata.model,
      conversationId: metadata.conversationId,
      totalTokensUsed: metadata.tokensUsed,
      totalCost: metadata.estimatedCost,
      processingTime: metadata.processingTime
    }
  })

  console.log('Cover letter saved to cache with ID:', savedCoverLetter.id)

  return {
    id: savedCoverLetter.id,
    content: savedCoverLetter.content,
    tone: savedCoverLetter.tone,
    wordCount: savedCoverLetter.wordCount,
    usageCount: 1,
    cached: false,
    metadata: {
      tokensUsed: metadata.tokensUsed,
      processingTime: metadata.processingTime,
      estimatedCost: metadata.estimatedCost
    }
  }
}

/**
 * Get or create cached optimized resume
 */
export async function getOrCreateOptimizedResume(
  userId: string | null,
  resumeText: string,
  jobSummaryId: string | null,
  templateId: string,
  analysisId?: string,
  documentId?: string
): Promise<CachedOptimizedResume | null> {
  const contentHash = generateOptimizedResumeHash(resumeText, jobSummaryId, templateId)

  console.log('Checking for cached optimized resume with hash:', contentHash)

  // Check if we already have this optimized resume
  let existingOptimizedResume = await db.optimizedResume.findUnique({
    where: { contentHash }
  })

  if (existingOptimizedResume) {
    console.log('Found cached optimized resume, updating usage count')
    
    // Update usage count and last used timestamp
    existingOptimizedResume = await db.optimizedResume.update({
      where: { id: existingOptimizedResume.id },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date()
      }
    })

    return {
      id: existingOptimizedResume.id,
      content: existingOptimizedResume.content,
      extractedData: existingOptimizedResume.extractedData,
      templateId: existingOptimizedResume.templateId,
      atsScore: existingOptimizedResume.atsScore,
      keywordsMatched: existingOptimizedResume.keywordsMatched,
      optimizationSuggestions: existingOptimizedResume.optimizationSuggestions,
      usageCount: existingOptimizedResume.usageCount,
      cached: true
    }
  }

  console.log('No cached optimized resume found')
  return null
}

/**
 * Save generated optimized resume to cache
 */
export async function saveOptimizedResumeToCache(
  userId: string | null,
  content: string,
  extractedData: string,
  templateId: string,
  resumeText: string,
  jobSummaryId: string | null,
  atsScore: number | null,
  keywordsMatched: string[],
  optimizationSuggestions: string[],
  metadata: {
    tokensUsed: number
    processingTime: number
    estimatedCost: number
    provider: string
    model: string
    conversationId?: string
  },
  analysisId?: string,
  documentId?: string
): Promise<CachedOptimizedResume> {
  const contentHash = generateOptimizedResumeHash(resumeText, jobSummaryId, templateId)

  const savedOptimizedResume = await db.optimizedResume.create({
    data: {
      userId,
      content,
      extractedData,
      templateId,
      contentHash,
      atsScore,
      keywordsMatched,
      optimizationSuggestions,
      analysisId,
      documentId,
      jobSummaryId,
      provider: metadata.provider,
      model: metadata.model,
      conversationId: metadata.conversationId,
      totalTokensUsed: metadata.tokensUsed,
      totalCost: metadata.estimatedCost,
      processingTime: metadata.processingTime
    }
  })

  console.log('Optimized resume saved to cache with ID:', savedOptimizedResume.id)

  return {
    id: savedOptimizedResume.id,
    content: savedOptimizedResume.content,
    extractedData: savedOptimizedResume.extractedData,
    templateId: savedOptimizedResume.templateId,
    atsScore: savedOptimizedResume.atsScore,
    keywordsMatched: savedOptimizedResume.keywordsMatched,
    optimizationSuggestions: savedOptimizedResume.optimizationSuggestions,
    usageCount: 1,
    cached: false,
    metadata: {
      tokensUsed: metadata.tokensUsed,
      processingTime: metadata.processingTime,
      estimatedCost: metadata.estimatedCost
    }
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats() {
  const [coverLetterStats, optimizedResumeStats] = await Promise.all([
    db.coverLetter.aggregate({
      _count: { id: true },
      _sum: { 
        usageCount: true,
        totalTokensUsed: true,
        totalCost: true
      },
      _avg: {
        processingTime: true,
        wordCount: true
      }
    }),
    db.optimizedResume.aggregate({
      _count: { id: true },
      _sum: { 
        usageCount: true,
        totalTokensUsed: true,
        totalCost: true
      },
      _avg: {
        processingTime: true,
        atsScore: true
      }
    })
  ])

  return {
    coverLetters: {
      total: coverLetterStats._count.id,
      totalUsage: coverLetterStats._sum.usageCount || 0,
      totalTokensUsed: coverLetterStats._sum.totalTokensUsed || 0,
      totalCost: coverLetterStats._sum.totalCost || 0,
      avgProcessingTime: coverLetterStats._avg.processingTime || 0,
      avgWordCount: coverLetterStats._avg.wordCount || 0
    },
    optimizedResumes: {
      total: optimizedResumeStats._count.id,
      totalUsage: optimizedResumeStats._sum.usageCount || 0,
      totalTokensUsed: optimizedResumeStats._sum.totalTokensUsed || 0,
      totalCost: optimizedResumeStats._sum.totalCost || 0,
      avgProcessingTime: optimizedResumeStats._avg.processingTime || 0,
      avgAtsScore: optimizedResumeStats._avg.atsScore || 0
    }
  }
} 