import { PrismaClient, UsageAction } from '@/generated/prisma'
import { createHash } from 'crypto'

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}

// Generate file hash for duplicate detection
export function generateFileHash(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex')
}

// Document caching and retrieval
export class DocumentService {
  // Check if document was already processed
  static async findByHash(fileHash: string) {
    return await db.document.findUnique({
      where: { fileHash },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      }
    })
  }

  // Create new document record
  static async create(data: {
    userId?: string
    filename: string
    originalSize: number
    fileHash: string
    mimeType: string
    extractedText: string
    wordCount: number
    pageCount: number
    aiProvider: string
    extractionCost?: number
    summary?: string
    sections?: string[]
    images?: string[]
    processingTime: number
  }) {
    return await db.document.create({
      data: {
        ...data,
        sections: data.sections || [],
        images: data.images || []
      }
    })
  }

  // Get user's recent documents
  static async getUserDocuments(userId: string, limit = 10) {
    return await db.document.findMany({
      where: { userId },
      orderBy: { processedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        filename: true,
        wordCount: true,
        pageCount: true,
        processedAt: true,
        summary: true,
        aiProvider: true
      }
    })
  }

  // Delete old documents (cleanup)
  static async deleteOldDocuments(daysOld = 30) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    return await db.document.deleteMany({
      where: {
        processedAt: {
          lt: cutoffDate
        },
        userId: null // Only delete anonymous documents
      }
    })
  }

  // Delete document by ID
  static async deleteById(documentId: string) {
    return await db.document.delete({
      where: { id: documentId }
    })
  }

  // Delete document by file hash
  static async deleteByHash(fileHash: string) {
    return await db.document.delete({
      where: { fileHash }
    })
  }

  // Find document by ID
  static async findById(documentId: string) {
    return await db.document.findUnique({
      where: { id: documentId },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        }
      }
    })
  }
}

// User management
export class UserService {
  // Get or create user
  static async findOrCreate(email: string, name?: string) {
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return existingUser
    }

    return await db.user.create({
      data: {
        email,
        name,
        monthlyRoasts: 0,
        totalRoasts: 0,
        lastRoastReset: new Date()
      }
    })
  }

  // Check user's remaining roasts
  static async checkRoastLimit(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) throw new Error('User not found')

    // Reset monthly count if needed
    const now = new Date()
    const lastReset = new Date(user.lastRoastReset)
    const monthsElapsed = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                         (now.getMonth() - lastReset.getMonth())

    if (monthsElapsed >= 1) {
      await db.user.update({
        where: { id: userId },
        data: {
          monthlyRoasts: 0,
          lastRoastReset: now
        }
      })
      user.monthlyRoasts = 0
    }

    // Get limits based on subscription tier
    const MONTHLY_LIMITS = {
      FREE: 3,
      PLUS: 100,
      PREMIUM: -1 // Unlimited
    } as const

    const limit = MONTHLY_LIMITS[user.subscriptionTier]
    const canRoast = limit === -1 || user.monthlyRoasts < limit
    const remaining = limit === -1 ? -1 : Math.max(0, limit - user.monthlyRoasts)

    return {
      canRoast,
      remaining,
      used: user.monthlyRoasts,
      limit,
      tier: user.subscriptionTier
    }
  }

  // Increment roast count
  static async incrementRoastCount(userId: string) {
    return await db.user.update({
      where: { id: userId },
      data: {
        monthlyRoasts: { increment: 1 },
        totalRoasts: { increment: 1 }
      }
    })
  }

  // Update subscription
  static async updateSubscription(userId: string, data: {
    subscriptionTier?: 'FREE' | 'PLUS' | 'PREMIUM'
    subscriptionId?: string
    customerId?: string
    subscriptionEndsAt?: Date
  }) {
    return await db.user.update({
      where: { id: userId },
      data
    })
  }
}

// Usage tracking for billing
export class UsageService {
  // Record usage event
  static async recordUsage(data: {
    userId: string
    documentId: string
    action: UsageAction
    cost?: number
    creditsUsed?: number
  }) {
    const now = new Date()
    const billingMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    return await db.usageRecord.create({
      data: {
        ...data,
        cost: data.cost || 0,
        creditsUsed: data.creditsUsed || 1,
        billingMonth
      }
    })
  }

  // Get user's monthly usage
  static async getMonthlyUsage(userId: string, month?: string) {
    const now = new Date()
    const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    const usage = await db.usageRecord.groupBy({
      by: ['action'],
      where: {
        userId,
        billingMonth: targetMonth
      },
      _sum: {
        cost: true,
        creditsUsed: true
      },
      _count: {
        id: true
      }
    })

    type UsageRecord = {
      action: UsageAction
      _count: { id: number }
      _sum: { cost: number | null; creditsUsed: number | null }
    }

    return usage.reduce((acc: Record<string, { count: number; cost: number; credits: number }>, record: UsageRecord) => {
      acc[record.action] = {
        count: record._count.id,
        cost: record._sum.cost || 0,
        credits: record._sum.creditsUsed || 0
      }
      return acc
    }, {} as Record<string, { count: number; cost: number; credits: number }>)
  }

  // Get total costs for billing
  static async getBillingData(userId: string, startDate: Date, endDate: Date) {
    const records = await db.usageRecord.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        document: {
          select: {
            filename: true,
            aiProvider: true
          }
        }
      }
    })

    const totalCost = records.reduce((sum: number, record: any) => sum + record.cost, 0)
    const totalCredits = records.reduce((sum: number, record: any) => sum + record.creditsUsed, 0)

    return {
      records,
      totalCost,
      totalCredits,
      itemCount: records.length
    }
  }
} 