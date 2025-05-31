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

    if (!['FREE', 'PLUS', 'PREMIUM'].includes(subscriptionTier)) {
      return NextResponse.json(
        { error: 'Invalid subscription tier. Must be FREE, PLUS, or PREMIUM' },
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

    console.log(`Admin updating user plan: ${user.email} from ${user.subscriptionTier} to ${subscriptionTier}`)

    // Prepare update data
    const updateData: any = {
      subscriptionTier: subscriptionTier as 'FREE' | 'PLUS' | 'PREMIUM',
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
      console.log(`Resetting usage counters for user ${user.email}`)
    }

    // Update user with transaction for consistency
    const updatedUser = await db.$transaction(async (tx) => {
      const result = await tx.user.update({
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

      // Log the successful update
      console.log(`Successfully updated user ${user.email} to ${subscriptionTier}:`, {
        oldTier: user.subscriptionTier,
        newTier: result.subscriptionTier,
        monthlyRoasts: result.monthlyRoasts,
        updatedAt: result.updatedAt
      })

      return result
    })

    // Create response with cache invalidation headers
    const response = NextResponse.json({
      success: true,
      message: `User ${user.email} plan updated to ${subscriptionTier}`,
      user: updatedUser
    })

    // Add headers to prevent caching of this response
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Surrogate-Control', 'no-store')

    return response

  } catch (error) {
    console.error('Admin update user plan error:', error)
    
    // More detailed error logging for production debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }

    return NextResponse.json(
      { 
        error: 'Failed to update user plan',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// Simple admin check - customize this based on your requirements
function isAdmin(email: string): boolean {
  const adminEmails = [
    'support@resume-roaster.xyz',
    'julien@resume-roaster.xyz',
    'julien@resumeroaster.com',
    'admin@resumeroaster.com',
    'julien.wut@gmail.com',
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

    const response = NextResponse.json({
      success: true,
      user
    })

    // Add cache control headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response

  } catch (error) {
    console.error('Admin get user error:', error)
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    )
  }
} 