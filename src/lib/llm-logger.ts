import { db } from './database'
import { MessageRole, LlmCallStatus } from '@/generated/prisma'

interface CreateLlmCallParams {
  userId?: string
  provider: string
  model: string
  operationType: string
  resumeId?: string
  extractedResumeId?: string
  extractedJobId?: string
  generatedRoastId?: string
  generatedCoverLetterId?: string
  generatedResumeId?: string
}

interface LogMessageParams {
  llmCallId: string
  role: MessageRole
  content: string
  messageIndex: number
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
  costUsd?: number
  processingTimeMs?: number
  finishReason?: string
  temperature?: number
  maxTokens?: number
  metadata?: any
}

interface UpdateLlmCallParams {
  llmCallId: string
  status?: LlmCallStatus
  totalInputTokens?: number
  totalOutputTokens?: number
  totalTokens?: number
  totalCostUsd?: number
  totalProcessingTimeMs?: number
  errorMessage?: string
  completedAt?: Date
}

export class LLMLogger {
  /**
   * Create a new LLM call
   */
  static async createLlmCall(params: CreateLlmCallParams): Promise<string> {
    try {
      const llmCall = await db.llmCall.create({
        data: {
          userId: params.userId,
          provider: params.provider,
          model: params.model,
          operationType: params.operationType,
          resumeId: params.resumeId,
          extractedResumeId: params.extractedResumeId,
          extractedJobId: params.extractedJobId,
          generatedRoastId: params.generatedRoastId,
          generatedCoverLetterId: params.generatedCoverLetterId,
          generatedResumeId: params.generatedResumeId,
        }
      })
      
      console.log(`Created LLM call: ${llmCall.id} (${params.operationType})`)
      return llmCall.id
    } catch (error) {
      console.error('Failed to create LLM call:', error)
      throw error
    }
  }

  /**
   * Log a message in an existing LLM call
   */
  static async logMessage(params: LogMessageParams): Promise<void> {
    try {
      await db.llmMessage.create({
        data: {
          llmCallId: params.llmCallId,
          role: params.role,
          content: params.content,
          messageIndex: params.messageIndex,
          inputTokens: params.inputTokens,
          outputTokens: params.outputTokens,
          totalTokens: params.totalTokens,
          costUsd: params.costUsd || 0,
          processingTimeMs: params.processingTimeMs,
          finishReason: params.finishReason,
          temperature: params.temperature,
          maxTokens: params.maxTokens,
          metadata: params.metadata,
        }
      })

      console.log(`Logged message ${params.messageIndex} in LLM call ${params.llmCallId}`)
    } catch (error) {
      console.error('Failed to log LLM message:', error)
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Update LLM call totals and status
   */
  static async updateLlmCall(params: UpdateLlmCallParams): Promise<void> {
    try {
      const updateData: any = {}
      
      if (params.status !== undefined) updateData.status = params.status
      if (params.totalInputTokens !== undefined) updateData.totalInputTokens = params.totalInputTokens
      if (params.totalOutputTokens !== undefined) updateData.totalOutputTokens = params.totalOutputTokens
      if (params.totalTokens !== undefined) updateData.totalTokens = params.totalTokens
      if (params.totalCostUsd !== undefined) updateData.totalCostUsd = params.totalCostUsd
      if (params.totalProcessingTimeMs !== undefined) updateData.totalProcessingTimeMs = params.totalProcessingTimeMs
      if (params.errorMessage !== undefined) updateData.errorMessage = params.errorMessage
      if (params.completedAt !== undefined) updateData.completedAt = params.completedAt

      await db.llmCall.update({
        where: { id: params.llmCallId },
        data: updateData
      })

      console.log(`Updated LLM call: ${params.llmCallId}`)
    } catch (error) {
      console.error('Failed to update LLM call:', error)
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Get LLM call with all messages
   */
  static async getLlmCall(llmCallId: string) {
    try {
      return await db.llmCall.findUnique({
        where: { id: llmCallId },
        include: {
          messages: {
            orderBy: { messageIndex: 'asc' }
          },
          user: {
            select: { id: true, email: true, name: true }
          },
          resume: {
            select: { id: true, filename: true }
          }
        }
      })
    } catch (error) {
      console.error('Failed to get LLM call:', error)
      return null
    }
  }

  /**
   * Get user's LLM calls
   */
  static async getUserLlmCalls(userId: string, operationType?: string, limit = 50) {
    try {
      return await db.llmCall.findMany({
        where: {
          userId,
          ...(operationType && { operationType })
        },
        include: {
          messages: {
            select: { id: true, role: true, createdAt: true },
            orderBy: { messageIndex: 'desc' },
            take: 1 // Get only the latest message
          },
          resume: {
            select: { id: true, filename: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })
    } catch (error) {
      console.error('Failed to get user LLM calls:', error)
      return []
    }
  }

  /**
   * Get usage analytics
   */
  static async getUsageAnalytics(userId?: string, days = 30) {
    try {
      const whereClause = {
        createdAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        },
        ...(userId && { userId })
      }

      const [callStats, messageStats, costStats] = await Promise.all([
        // Call counts by operation type
        db.llmCall.groupBy({
          by: ['operationType'],
          where: whereClause,
          _count: true
        }),
        
        // Message counts by role
        db.llmMessage.groupBy({
          by: ['role'],
          where: {
            createdAt: {
              gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
            },
            llmCall: userId ? { userId } : undefined
          },
          _count: true,
          _sum: {
            totalTokens: true,
            costUsd: true
          }
        }),

        // Total costs and tokens
        db.llmCall.aggregate({
          where: whereClause,
          _sum: {
            totalTokens: true,
            totalCostUsd: true
          },
          _count: true
        })
      ])

      return {
        callStats,
        messageStats,
        costStats,
        period: `${days} days`
      }
    } catch (error) {
      console.error('Failed to get usage analytics:', error)
      return null
    }
  }
}

export { MessageRole, LlmCallStatus } 