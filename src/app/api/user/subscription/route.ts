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

    // Get user subscription data
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        subscriptionTier: true,
        subscriptionId: true,
        customerId: true,
        subscriptionEndsAt: true,
        monthlyRoasts: true,
        totalRoasts: true,
        lastRoastReset: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if monthly roasts need to be reset
    const now = new Date()
    const lastReset = new Date(user.lastRoastReset)
    const monthsElapsed = (now.getFullYear() - lastReset.getFullYear()) * 12 + 
                         (now.getMonth() - lastReset.getMonth())

    let updatedUser = user
    if (monthsElapsed >= 1) {
      updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          monthlyRoasts: 0,
          lastRoastReset: now
        }
      })
    }

    return NextResponse.json({
      tier: updatedUser.subscriptionTier,
      subscriptionId: updatedUser.subscriptionId,
      customerId: updatedUser.customerId,
      subscriptionEndsAt: updatedUser.subscriptionEndsAt,
      monthlyRoasts: updatedUser.monthlyRoasts,
      totalRoasts: updatedUser.totalRoasts,
      lastRoastReset: updatedUser.lastRoastReset,
    })

  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 }
    )
  }
} 