import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch resume optimizations for the user
    const optimizations = await db.resumeOptimization.findMany({
      where: { userId: user.id },
      include: {
        analysis: {
          select: {
            id: true,
            title: true,
            overallScore: true,
            createdAt: true
          }
        },
        document: {
          select: {
            id: true,
            filename: true,
            processedAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    // Get total count
    const totalCount = await db.resumeOptimization.count({
      where: { userId: user.id }
    })

    // Format the response
    const formattedOptimizations = optimizations.map(opt => ({
      id: opt.id,
      templateId: opt.templateId,
      atsScore: opt.atsScore,
      keywordsMatched: opt.keywordsMatched,
      optimizationSuggestions: opt.optimizationSuggestions,
      provider: opt.provider,
      model: opt.model,
      totalTokensUsed: opt.totalTokensUsed,
      totalCost: opt.totalCost,
      processingTime: opt.processingTime,
      createdAt: opt.createdAt,
      analysis: opt.analysis,
      document: opt.document,
      // Don't include the full resume text and extracted data in list view for performance
      hasExtractedData: !!opt.extractedData,
      hasOptimizedResume: !!opt.optimizedResume
    }))

    return NextResponse.json({
      success: true,
      data: {
        optimizations: formattedOptimizations,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      }
    })

  } catch (error) {
    console.error('Error fetching resume optimizations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resume optimizations' },
      { status: 500 }
    )
  }
}

// GET specific optimization by ID
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { optimizationId } = await request.json()

    if (!optimizationId) {
      return NextResponse.json(
        { error: 'Optimization ID is required' },
        { status: 400 }
      )
    }

    // Get user
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch specific optimization
    const optimization = await db.resumeOptimization.findFirst({
      where: { 
        id: optimizationId,
        userId: user.id 
      },
      include: {
        analysis: true,
        document: true
      }
    })

    if (!optimization) {
      return NextResponse.json(
        { error: 'Optimization not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: optimization
    })

  } catch (error) {
    console.error('Error fetching specific optimization:', error)
    return NextResponse.json(
      { error: 'Failed to fetch optimization' },
      { status: 500 }
    )
  }
} 