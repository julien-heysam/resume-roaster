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

    // Get URL search params for filtering
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') || 'RESUME_ANALYSIS'
    const skip = (page - 1) * limit

    // Fetch user's analysis conversations with related data
    const conversations = await db.lLMConversation.findMany({
      where: {
        userId: session.user.id,
        type: type as any
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
            processedAt: true
          }
        },
        messages: {
          where: {
            role: 'ASSISTANT'
          },
          select: {
            id: true,
            content: true,
            createdAt: true,
            totalTokens: true,
            cost: true
          },
          orderBy: {
            messageIndex: 'desc'
          },
          take: 1 // Only get the final analysis result
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // Get total count for pagination
    const totalCount = await db.lLMConversation.count({
      where: {
        userId: session.user.id,
        type: type as any
      }
    })

    // Parse analysis results from assistant messages
    const analysisHistory = conversations.map(conversation => {
      let analysisData = null
      
      if (conversation.messages.length > 0) {
        try {
          const assistantMessage = conversation.messages[0]
          let content = assistantMessage.content.trim()
          
          // Extract JSON from markdown code blocks if present
          const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
          if (jsonMatch) {
            content = jsonMatch[1].trim()
          }
          
          // Remove any leading/trailing backticks or spaces
          content = content.replace(/^`+|`+$/g, '').trim()
          
          analysisData = JSON.parse(content)
        } catch (error) {
          console.error('Failed to parse analysis data:', error)
          console.error('Content that failed to parse:', conversation.messages[0]?.content?.substring(0, 200) + '...')
        }
      }

      return {
        id: conversation.id,
        title: conversation.title || `Resume Analysis - ${conversation.createdAt.toLocaleDateString()}`,
        createdAt: conversation.createdAt,
        completedAt: conversation.completedAt,
        status: conversation.status,
        totalCost: conversation.totalCost,
        totalTokensUsed: conversation.totalTokensUsed,
        provider: conversation.provider,
        model: conversation.model,
        document: conversation.document,
        analysisData,
        // Summary stats from analysis (updated for new format)
        overallScore: analysisData?.overallScore || null,
        scoreLabel: analysisData?.scoreLabel || null,
        strengthsCount: analysisData?.strengths?.length || 0,
        weaknessesCount: analysisData?.weaknesses?.length || 0,
        suggestionsCount: analysisData?.suggestions?.length || 0,
        atsIssuesCount: analysisData?.atsIssues?.length || 0,
        keywordMatchPercentage: analysisData?.keywordMatch?.matchPercentage || null,
        scoringBreakdown: analysisData?.scoringBreakdown || null
      }
    })

    return NextResponse.json({
      success: true,
      data: analysisHistory,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + limit < totalCount
      }
    })

  } catch (error) {
    console.error('Get analysis history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis history' },
      { status: 500 }
    )
  }
} 