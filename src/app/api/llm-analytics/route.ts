import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LLMLogger, ConversationType } from '@/lib/llm-logger'

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
    const action = searchParams.get('action') || 'conversations'
    const type = searchParams.get('type') as ConversationType
    const days = parseInt(searchParams.get('days') || '30')
    const limit = parseInt(searchParams.get('limit') || '50')

    switch (action) {
      case 'conversations': {
        const conversations = await LLMLogger.getUserConversations(
          session.user.id,
          type,
          limit
        )
        
        return NextResponse.json({
          success: true,
          conversations,
          total: conversations.length
        })
      }

      case 'analytics': {
        const analytics = await LLMLogger.getUsageAnalytics(session.user.id, days)
        
        return NextResponse.json({
          success: true,
          analytics
        })
      }

      case 'conversation': {
        const conversationId = searchParams.get('id')
        
        if (!conversationId) {
          return NextResponse.json(
            { error: 'Conversation ID required' },
            { status: 400 }
          )
        }

        const conversation = await LLMLogger.getConversation(conversationId)
        
        if (!conversation) {
          return NextResponse.json(
            { error: 'Conversation not found' },
            { status: 404 }
          )
        }

        // Check if user owns this conversation
        if (conversation.userId !== session.user.id) {
          return NextResponse.json(
            { error: 'Access denied' },
            { status: 403 }
          )
        }

        return NextResponse.json({
          success: true,
          conversation
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('LLM analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
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

    const analytics = await LLMLogger.getUsageAnalytics(undefined, days)
    
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