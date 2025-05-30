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
        },
        roast: {
          select: { data: true }
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

    // Get the roast data through the relation
    const roastData = sharedAnalysis.roast?.data || {}
    const settings = typeof sharedAnalysis.settings === 'string' ? 
      JSON.parse(sharedAnalysis.settings) : (sharedAnalysis.settings || {})

    // Handle both old and new data formats for backward compatibility
    let responseData
    if (roastData) {
      // New format with roast data
      responseData = {
        success: true,
        analysis: roastData,
        resumeData: null, // Not stored separately in new schema
        jobDescription: null, // Not stored separately in new schema
        pdfImages: [], // Not stored in new schema
        metadata: {
          sharedBy: sharedAnalysis.user.name || 'Anonymous',
          sharedAt: sharedAnalysis.createdAt,
          viewCount: sharedAnalysis.viewCount,
          settings
        }
      }
    } else {
      // Fallback for missing data
      responseData = {
        success: true,
        analysis: { error: 'Analysis data not found' },
        resumeData: null,
        jobDescription: null,
        pdfImages: [],
        metadata: {
          sharedBy: sharedAnalysis.user.name || 'Anonymous',
          sharedAt: sharedAnalysis.createdAt,
          viewCount: sharedAnalysis.viewCount,
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