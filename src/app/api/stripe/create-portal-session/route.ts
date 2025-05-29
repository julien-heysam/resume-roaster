import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, validateStripeConfig } from '@/lib/stripe'
import { db } from '@/lib/database'
import { getBaseUrl } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!validateStripeConfig() || !stripe) {
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 500 }
      )
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's Stripe customer ID
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user?.customerId) {
      return NextResponse.json(
        { error: 'No subscription found. Please subscribe first.' },
        { status: 404 }
      )
    }

    // Get the base URL for redirects
    const baseUrl = getBaseUrl()

    // Create customer portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.customerId,
      return_url: `${baseUrl}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url })

  } catch (error) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: 'Failed to create customer portal session' },
      { status: 500 }
    )
  }
} 