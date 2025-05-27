import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, validateStripeConfig } from '@/lib/stripe'
import { db } from '@/lib/database'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!validateStripeConfig() || !stripe) {
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string
    const subscriptionId = subscription.id
    const status = subscription.status
    
    // Get tier from metadata
    const tier = subscription.metadata.tier as 'PRO' | 'ENTERPRISE'
    
    if (!tier) {
      console.error('No tier found in subscription metadata')
      return
    }

    // Find user by customer ID
    const user = await db.user.findFirst({
      where: { customerId }
    })

    if (!user) {
      console.error(`User not found for customer ID: ${customerId}`)
      return
    }

    // Update user subscription
    await db.user.update({
      where: { id: user.id },
      data: {
        subscriptionId,
        subscriptionTier: tier,
        // Reset monthly roasts on subscription change
        monthlyRoasts: 0,
        lastRoastReset: new Date(),
      }
    })

    console.log(`Updated subscription for user ${user.id}: ${tier}`)

  } catch (error) {
    console.error('Error handling subscription change:', error)
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string

    // Find user by customer ID
    const user = await db.user.findFirst({
      where: { customerId }
    })

    if (!user) {
      console.error(`User not found for customer ID: ${customerId}`)
      return
    }

    // Update user to FREE tier
    await db.user.update({
      where: { id: user.id },
      data: {
        subscriptionId: null,
        subscriptionTier: 'FREE',
        subscriptionEndsAt: null,
      }
    })

    console.log(`Cancelled subscription for user ${user.id}`)

  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string

    // Find user by customer ID
    const user = await db.user.findFirst({
      where: { customerId }
    })

    if (!user) {
      console.error(`User not found for customer ID: ${customerId}`)
      return
    }

    console.log(`Payment succeeded for user ${user.id}`)

  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string

    // Find user by customer ID
    const user = await db.user.findFirst({
      where: { customerId }
    })

    if (!user) {
      console.error(`User not found for customer ID: ${customerId}`)
      return
    }

    console.log(`Payment failed for user ${user.id}`)
    
    // You might want to send an email notification here
    // or update the user's status

  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
} 