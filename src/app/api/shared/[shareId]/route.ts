import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

interface RouteParams {
  params: {
    shareId: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { shareId } = await params

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      )
    }

    // Get shared analysis
    const sharedAnalysis = await db.sharedAnalysis.findUnique({
      where: { id: shareId },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    if (!sharedAnalysis) {
      return NextResponse.json(
        { error: 'Shared analysis not found' },
        { status: 404 }
      )
    }

    // Check if expired
    if (sharedAnalysis.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'This shared analysis has expired' },
        { status: 410 }
      )
    }

    // Increment view count
    await db.sharedAnalysis.update({
      where: { id: shareId },
      data: { viewCount: { increment: 1 } }
    })

    // Parse analysis data
    const analysisData = JSON.parse(sharedAnalysis.analysisData)
    const settings = JSON.parse(sharedAnalysis.settings || '{}')

    return NextResponse.json({
      success: true,
      analysis: analysisData,
      metadata: {
        sharedBy: sharedAnalysis.user.name || 'Anonymous',
        sharedAt: sharedAnalysis.createdAt,
        viewCount: sharedAnalysis.viewCount + 1,
        settings
      }
    })

  } catch (error) {
    console.error('Get shared analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shared analysis' },
      { status: 500 }
    )
  }
} 