import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const type = searchParams.get('type')

    if (conversationId) {
      // Get specific LLM call details
      const llmCall = await db.llmCall.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { messageIndex: 'asc' }
          }
        }
      })

      if (!llmCall || llmCall.userId !== session.user.id) {
        return NextResponse.json(
          { error: 'LLM call not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: llmCall
      })
    } else {
      // Get user's LLM calls summary
      const llmCalls = await db.llmCall.findMany({
        where: { 
          userId: session.user.id,
          ...(type && { operationType: type })
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          _count: {
            select: { messages: true }
          }
        }
      })

      const totalCost = await db.llmCall.aggregate({
        where: { userId: session.user.id },
        _sum: { totalCostUsd: true }
      })

      const totalTokens = await db.llmCall.aggregate({
        where: { userId: session.user.id },
        _sum: { totalTokens: true }
      })

      return NextResponse.json({
        success: true,
        data: {
          calls: llmCalls,
          summary: {
            totalCalls: llmCalls.length,
            totalCost: totalCost._sum.totalCostUsd || 0,
            totalTokens: totalTokens._sum.totalTokens || 0
          }
        }
      })
    }

  } catch (error) {
    console.error('LLM analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

// Admin endpoint to get system-wide analytics
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin (you might want to add an isAdmin field to your User model)
    if (!session?.user?.email?.includes('admin')) { // Simple admin check - improve this
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { days = 30 } = await request.json()

    // Get system-wide analytics from the new schema
    const totalCost = await db.llmCall.aggregate({
      _sum: { totalCostUsd: true }
    })

    const totalTokens = await db.llmCall.aggregate({
      _sum: { totalTokens: true }
    })

    const totalCalls = await db.llmCall.count()

    const analytics = {
      totalCalls,
      totalCost: totalCost._sum.totalCostUsd || 0,
      totalTokens: totalTokens._sum.totalTokens || 0
    }
    
    return NextResponse.json({
      success: true,
      analytics
    })

  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin analytics' },
      { status: 500 }
    )
  }
} 