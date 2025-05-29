import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, STRIPE_PRICE_IDS, validateStripeConfig } from '@/lib/stripe'
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

    const { priceId, tier, billingCycle } = await request.json()

    // Validate the price ID
    const validPriceIds = Object.values(STRIPE_PRICE_IDS).filter(id => id !== '')
    if (!priceId || !validPriceIds.includes(priceId)) {
      return NextResponse.json(
        { error: 'Invalid or missing price ID. Please contact support.' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let customerId = user.customerId

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: {
          userId: user.id,
        },
      })
      
      customerId = customer.id
      
      // Update user with customer ID
      await db.user.update({
        where: { id: user.id },
        data: { customerId }
      })
    }

    // Get the base URL for redirects
    const baseUrl = getBaseUrl()
    
    console.log('Stripe checkout session creation:', {
      baseUrl,
      successUrl: `${baseUrl}/dashboard?success=true&tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`,
      environment: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        VERCEL_URL: process.env.VERCEL_URL
      }
    })

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard?success=true&tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        tier,
        billingCycle,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          tier,
          billingCycle,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    })

    console.log('Created checkout session:', {
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      successUrl: checkoutSession.success_url,
      cancelUrl: checkoutSession.cancel_url
    })

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('No such price')) {
        return NextResponse.json(
          { error: 'Invalid pricing configuration. Please contact support.' },
          { status: 400 }
        )
      }
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Payment system configuration error. Please contact support.' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again or contact support.' },
      { status: 500 }
    )
  }
} 