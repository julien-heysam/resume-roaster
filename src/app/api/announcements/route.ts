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

    // Get user's subscription tier
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionTier: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const now = new Date()

    // Fetch active announcements for the user's tier
    const announcements = await db.announcement.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: now } }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } }
            ]
          },
          {
            OR: [
              { targetTiers: { isEmpty: true } }, // No tier restriction
              { targetTiers: { has: user.subscriptionTier } }
            ]
          },
          {
            NOT: {
              dismissedBy: { has: session.user.id }
            }
          }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ announcements })

  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { announcementId } = await request.json()

    if (!announcementId) {
      return NextResponse.json(
        { error: 'announcementId is required' },
        { status: 400 }
      )
    }

    // Add user to dismissedBy array
    await db.announcement.update({
      where: { id: announcementId },
      data: {
        dismissedBy: {
          push: session.user.id
        }
      }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error dismissing announcement:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 