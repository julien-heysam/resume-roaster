import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

interface RouteContext {
  params: Promise<{
    shareId: string
  }>
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { shareId } = await context.params

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

    // Handle both old and new data formats for backward compatibility
    let responseData
    if (analysisData.analysis) {
      // New format with comprehensive data
      responseData = {
        success: true,
        analysis: analysisData.analysis,
        resumeData: analysisData.resumeData,
        jobDescription: analysisData.jobDescription,
        pdfImages: analysisData.pdfImages || [],
        metadata: {
          sharedBy: sharedAnalysis.user.name || 'Anonymous',
          sharedAt: sharedAnalysis.createdAt,
          viewCount: sharedAnalysis.viewCount + 1,
          settings
        }
      }
    } else {
      // Old format - just analysis data
      responseData = {
        success: true,
        analysis: analysisData,
        resumeData: null,
        jobDescription: null,
        pdfImages: [],
        metadata: {
          sharedBy: sharedAnalysis.user.name || 'Anonymous',
          sharedAt: sharedAnalysis.createdAt,
          viewCount: sharedAnalysis.viewCount + 1,
          settings
        }
      }
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Get shared analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shared analysis' },
      { status: 500 }
    )
  }
} 