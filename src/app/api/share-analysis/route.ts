import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'
import { randomBytes } from 'crypto'
import { getBaseUrl } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
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

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get the base URL for sharing
    const baseUrl = getBaseUrl()

    // Generate a unique share ID
    const shareId = randomBytes(16).toString('hex')
    
    // Set expiration (default 30 days)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (settings?.expirationDays || 30))

    let roastId = analysisData.roastId

    // If we don't have a roastId, try to find or create a GeneratedRoast record
    if (!roastId) {
      console.log('No roastId provided, attempting to find or create GeneratedRoast record')
      
      // Try to find an existing GeneratedRoast for this user with similar data
      const existingRoast = await db.generatedRoast.findFirst({
        where: {
          userId: user.id,
          // We could add more specific matching criteria here if needed
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      if (existingRoast) {
        roastId = existingRoast.id
        console.log('Found existing GeneratedRoast:', roastId)
      } else {
        // Create a new GeneratedRoast record for sharing
        console.log('Creating new GeneratedRoast record for sharing')
        
        // Generate a content hash for the analysis data
        const contentHash = randomBytes(16).toString('hex')
        
        const newRoast = await db.generatedRoast.create({
          data: {
            userId: user.id,
            contentHash: contentHash,
            data: analysisData.analysis || analysisData, // Use the analysis data
            overallScore: analysisData.analysis?.overallScore || analysisData.overallScore || 0
          }
        })
        
        roastId = newRoast.id
        console.log('Created new GeneratedRoast:', roastId)
      }
    }

    // Verify the roastId exists in the database
    const roastExists = await db.generatedRoast.findUnique({
      where: { id: roastId }
    })

    if (!roastExists) {
      return NextResponse.json(
        { error: 'Invalid analysis reference' },
        { status: 400 }
      )
    }

    // Create shareable analysis record
    const sharedAnalysis = await db.sharedAnalysis.create({
      data: {
        id: shareId,
        userId: user.id,
        roastId: roastId, // Now we have a valid roastId
        settings: JSON.stringify(settings || {}),
        expiresAt,
        viewCount: 0
      }
    })

    return NextResponse.json({
      success: true,
      shareId: sharedAnalysis.id,
      shareUrl: `${baseUrl}/shared/${sharedAnalysis.id}`,
      expiresAt: sharedAnalysis.expiresAt
    })

  } catch (error) {
    console.error('Error creating shared analysis:', error)
    return NextResponse.json(
      { error: 'Failed to create shared analysis' },
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
          gt: new Date() // Only non-expired shares
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get the base URL for sharing
    const baseUrl = getBaseUrl()

    const formattedShares = sharedAnalyses.map(share => ({
      id: share.id,
      shareUrl: `${baseUrl}/shared/${share.id}`,
      viewCount: share.viewCount,
      expiresAt: share.expiresAt,
      createdAt: share.createdAt
    }))

    return NextResponse.json({
      shares: formattedShares
    })

  } catch (error) {
    console.error('Error fetching shared analyses:', error)
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