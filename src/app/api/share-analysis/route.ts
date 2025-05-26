import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { analysisData, settings } = await request.json()

    if (!analysisData) {
      return NextResponse.json(
        { error: 'Analysis data is required' },
        { status: 400 }
      )
    }

    // Generate a unique share ID
    const shareId = randomBytes(16).toString('hex')
    
    // Set expiration (default 30 days)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (settings?.expirationDays || 30))

    // Create shareable analysis record
    const sharedAnalysis = await db.sharedAnalysis.create({
      data: {
        id: shareId,
        userId: session.user.id,
        analysisData: JSON.stringify(analysisData),
        settings: JSON.stringify(settings || {}),
        expiresAt,
        viewCount: 0
      }
    })

    return NextResponse.json({
      success: true,
      shareId: sharedAnalysis.id,
      shareUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/shared/${sharedAnalysis.id}`,
      expiresAt: sharedAnalysis.expiresAt
    })

  } catch (error) {
    console.error('Share analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to create shareable link' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's shared analyses
    const sharedAnalyses = await db.sharedAnalysis.findMany({
      where: { 
        userId: session.user.id,
        expiresAt: {
          gt: new Date() // Only active shares
        }
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        expiresAt: true,
        viewCount: true,
        settings: true
      }
    })

    return NextResponse.json({
      success: true,
      sharedAnalyses: sharedAnalyses.map(analysis => ({
        ...analysis,
        shareUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/shared/${analysis.id}`,
        settings: JSON.parse(analysis.settings || '{}')
      }))
    })

  } catch (error) {
    console.error('Get shared analyses error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shared analyses' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { shareId } = await request.json()

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      )
    }

    // Delete the shared analysis (only if user owns it)
    const result = await db.sharedAnalysis.deleteMany({
      where: {
        id: shareId,
        userId: session.user.id
      }
    })

    if (result.count === 0) {
      return NextResponse.json(
        { error: 'Share not found or access denied' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Share deleted successfully'
    })

  } catch (error) {
    console.error('Delete shared analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to delete share' },
      { status: 500 }
    )
  }
} 