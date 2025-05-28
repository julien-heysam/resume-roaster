import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Fetch user's analyses with related document data
    const analyses = await db.analysis.findMany({
      where: {
        userId: userId
      },
      include: {
        document: {
          select: {
            id: true,
            filename: true,
            originalSize: true,
            wordCount: true,
            pageCount: true,
            summary: true,
            processedAt: true,
            images: true // Include PDF images
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the expected format
    const analysisHistory = analyses.map(analysis => {
      let analysisData = null
      
      try {
        analysisData = JSON.parse(analysis.analysisData)
      } catch (error) {
        console.error('Failed to parse analysis data:', error)
        analysisData = null
      }

      return {
        id: analysis.id,
        title: analysis.title,
        createdAt: analysis.createdAt,
        completedAt: analysis.createdAt, // Analysis is completed when created
        status: 'COMPLETED',
        totalCost: analysis.totalCost,
        totalTokensUsed: analysis.totalTokensUsed,
        provider: analysis.provider,
        model: analysis.model,
        document: analysis.document,
        analysisData,
        // Include PDF images if available
        pdfImages: analysis.document?.images || [],
        // Include job description
        jobDescription: analysis.jobDescription,
        // Summary stats from analysis
        overallScore: analysis.overallScore,
        scoreLabel: analysisData?.scoreLabel || null,
        strengths: analysisData?.strengths || [],
        weaknesses: analysisData?.weaknesses || [],
        suggestions: analysisData?.suggestions || [],
        keywordMatch: analysisData?.keywordMatch || null,
        atsIssues: analysisData?.atsIssues || []
      }
    })

    return NextResponse.json({
      success: true,
      data: analysisHistory,
      total: analysisHistory.length
    })

  } catch (error) {
    console.error('Analysis history fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis history' },
      { status: 500 }
    )
  }
} 