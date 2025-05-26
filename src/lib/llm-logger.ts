import { db } from './database'
import { ConversationType, MessageRole, ConversationStatus } from '@/generated/prisma'

interface CreateConversationParams {
  userId?: string
  type: ConversationType
  title?: string
  documentId?: string
  provider: string
  model: string
}

interface LogMessageParams {
  conversationId: string
  role: MessageRole
  content: string
  inputTokens?: number
  outputTokens?: number
  totalTokens?: number
  cost?: number
  processingTime?: number
  finishReason?: string
  temperature?: number
  maxTokens?: number
}

interface UpdateConversationParams {
  conversationId: string
  status?: ConversationStatus
  totalTokensUsed?: number
  totalCost?: number
  errorMessage?: string
  completedAt?: Date
}

export class LLMLogger {
  /**
   * Create a new LLM conversation
   */
  static async createConversation(params: CreateConversationParams): Promise<string> {
    try {
      const conversation = await db.lLMConversation.create({
        data: {
          userId: params.userId,
          type: params.type,
          title: params.title,
          documentId: params.documentId,
          provider: params.provider,
          model: params.model,
        }
      })
      
      console.log(`Created LLM conversation: ${conversation.id} (${params.type})`)
      return conversation.id
    } catch (error) {
      console.error('Failed to create LLM conversation:', error)
      throw error
    }
  }

  /**
   * Log a message in an existing conversation
   */
  static async logMessage(params: LogMessageParams): Promise<void> {
    try {
      // Get the current message count to determine the index
      const messageCount = await db.lLMMessage.count({
        where: { conversationId: params.conversationId }
      })

      await db.lLMMessage.create({
        data: {
          conversationId: params.conversationId,
          role: params.role,
          content: params.content,
          inputTokens: params.inputTokens,
          outputTokens: params.outputTokens,
          totalTokens: params.totalTokens,
          cost: params.cost || 0,
          messageIndex: messageCount,
          processingTime: params.processingTime,
          finishReason: params.finishReason,
          temperature: params.temperature,
          maxTokens: params.maxTokens,
        }
      })

      console.log(`Logged message ${messageCount} in conversation ${params.conversationId}`)
    } catch (error) {
      console.error('Failed to log LLM message:', error)
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Update conversation totals and status
   */
  static async updateConversation(params: UpdateConversationParams): Promise<void> {
    try {
      const updateData: any = {}
      
      if (params.status !== undefined) updateData.status = params.status
      if (params.totalTokensUsed !== undefined) updateData.totalTokensUsed = params.totalTokensUsed
      if (params.totalCost !== undefined) updateData.totalCost = params.totalCost
      if (params.errorMessage !== undefined) updateData.errorMessage = params.errorMessage
      if (params.completedAt !== undefined) updateData.completedAt = params.completedAt

      await db.lLMConversation.update({
        where: { id: params.conversationId },
        data: updateData
      })

      console.log(`Updated LLM conversation: ${params.conversationId}`)
    } catch (error) {
      console.error('Failed to update LLM conversation:', error)
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Get conversation with all messages
   */
  static async getConversation(conversationId: string) {
    try {
      return await db.lLMConversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { messageIndex: 'asc' }
          },
          user: {
            select: { id: true, email: true, name: true }
          },
          document: {
            select: { id: true, filename: true }
          }
        }
      })
    } catch (error) {
      console.error('Failed to get LLM conversation:', error)
      return null
    }
  }

  /**
   * Get user's conversations
   */
  static async getUserConversations(userId: string, type?: ConversationType, limit = 50) {
    try {
      return await db.lLMConversation.findMany({
        where: {
          userId,
          ...(type && { type })
        },
        include: {
          messages: {
            select: { id: true, role: true, createdAt: true },
            orderBy: { messageIndex: 'desc' },
            take: 1 // Get only the latest message
          },
          document: {
            select: { id: true, filename: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      })
    } catch (error) {
      console.error('Failed to get user conversations:', error)
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

      const [conversationStats, messageStats, costStats] = await Promise.all([
        // Conversation counts by type
        db.lLMConversation.groupBy({
          by: ['type'],
          where: whereClause,
          _count: true
        }),
        
        // Message counts by role
        db.lLMMessage.groupBy({
          by: ['role'],
          where: {
            createdAt: {
              gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
            },
            conversation: userId ? { userId } : undefined
          },
          _count: true,
          _sum: {
            totalTokens: true,
            cost: true
          }
        }),

        // Total costs and tokens
        db.lLMConversation.aggregate({
          where: whereClause,
          _sum: {
            totalTokensUsed: true,
            totalCost: true
          },
          _count: true
        })
      ])

      return {
        conversationStats,
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

export { ConversationType, MessageRole, ConversationStatus } 