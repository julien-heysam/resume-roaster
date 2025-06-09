import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ConversationService } from '@/lib/database'

// GET /api/conversations - Get user's conversations
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user ID from session
    const { db } = await import('@/lib/database')
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const conversations = await ConversationService.getUserConversations(user.id)

    return NextResponse.json({
      success: true,
      conversations
    })

  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

// POST /api/conversations - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { title, selectedTemplate, selectedModel, metadata } = await request.json()

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Get user ID from session
    const { db } = await import('@/lib/database')
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const conversation = await ConversationService.create({
      userId: user.id,
      title,
      selectedTemplate,
      selectedModel,
      metadata
    })

    return NextResponse.json({
      success: true,
      conversation
    })

  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
} 