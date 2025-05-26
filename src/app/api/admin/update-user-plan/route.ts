import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin (you can implement your own admin check logic)
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId, email, subscriptionTier, subscriptionId, customerId, subscriptionEndsAt, resetUsage } = body

    // Validate input
    if (!userId && !email) {
      return NextResponse.json(
        { error: 'Either userId or email is required' },
        { status: 400 }
      )
    }

    if (!['FREE', 'PRO', 'ENTERPRISE'].includes(subscriptionTier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier. Must be FREE, PRO, or ENTERPRISE' },
        { status: 400 }
      )
    }

    // Find user by userId or email
    const user = userId 
      ? await db.user.findUnique({ where: { id: userId } })
      : await db.user.findUnique({ where: { email: email! } })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {
      subscriptionTier: subscriptionTier as 'FREE' | 'PRO' | 'ENTERPRISE',
      updatedAt: new Date()
    }

    // Optional fields
    if (subscriptionId !== undefined) {
      updateData.subscriptionId = subscriptionId
    }
    if (customerId !== undefined) {
      updateData.customerId = customerId
    }
    if (subscriptionEndsAt !== undefined) {
      updateData.subscriptionEndsAt = subscriptionEndsAt ? new Date(subscriptionEndsAt) : null
    }

    // Reset usage counters if requested or when downgrading to FREE
    if (resetUsage || (subscriptionTier === 'FREE' && user.subscriptionTier !== 'FREE')) {
      updateData.monthlyRoasts = 0
      updateData.lastRoastReset = new Date()
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionTier: true,
        subscriptionId: true,
        customerId: true,
        subscriptionEndsAt: true,
        monthlyRoasts: true,
        totalRoasts: true,
        lastRoastReset: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: `User ${user.email} plan updated to ${subscriptionTier}`,
      user: updatedUser
    })

  } catch (error) {
    console.error('Admin update user plan error:', error)
    return NextResponse.json(
      { error: 'Failed to update user plan' },
      { status: 500 }
    )
  }
}

// Simple admin check - customize this based on your requirements
function isAdmin(email: string): boolean {
  const adminEmails = [
    'admin@resumeroaster.com',
    'julien@resumeroaster.com',
    // Add your admin emails here
  ]
  
  return adminEmails.includes(email.toLowerCase())
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')

    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Either email or userId parameter is required' },
        { status: 400 }
      )
    }

    const user = userId 
      ? await db.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            subscriptionTier: true,
            subscriptionId: true,
            customerId: true,
            subscriptionEndsAt: true,
            monthlyRoasts: true,
            totalRoasts: true,
            lastRoastReset: true,
            createdAt: true,
            updatedAt: true
          }
        })
      : await db.user.findUnique({
          where: { email: email! },
          select: {
            id: true,
            email: true,
            name: true,
            subscriptionTier: true,
            subscriptionId: true,
            customerId: true,
            subscriptionEndsAt: true,
            monthlyRoasts: true,
            totalRoasts: true,
            lastRoastReset: true,
            createdAt: true,
            updatedAt: true
          }
        })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user
    })

  } catch (error) {
    console.error('Admin get user error:', error)
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    )
  }
} 