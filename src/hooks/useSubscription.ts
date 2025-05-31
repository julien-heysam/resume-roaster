"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export interface SubscriptionData {
  tier: 'FREE' | 'PLUS' | 'PREMIUM'
  subscriptionId?: string
  customerId?: string
  subscriptionEndsAt?: Date
  monthlyRoasts: number
  totalRoasts: number
  lastRoastReset: Date
}

export function useSubscription() {
  const { data: session } = useSession()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch subscription data
  const fetchSubscription = async () => {
    if (!session?.user?.email) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/user/subscription')
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      } else {
        setError('Failed to fetch subscription data')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  // Create checkout session for upgrade
  const createCheckoutSession = async (priceId: string, tier: string, billingCycle: string) => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          tier,
          billingCycle,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to start checkout process')
    }
  }

  // Open customer portal
  const openCustomerPortal = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Failed to open customer portal')
      }
    } catch (error) {
      console.error('Portal error:', error)
      toast.error('Failed to open customer portal')
    }
  }

  // Check if user can perform an action based on their subscription
  const canPerformAction = (action: 'roast' | 'download' | 'history') => {
    if (!subscription) return false

    switch (action) {
      case 'roast':
        if (subscription.tier === 'FREE') {
          return subscription.monthlyRoasts < 5
        }
        if (subscription.tier === 'PLUS') {
          return subscription.monthlyRoasts < 100
        }
        return true // PREMIUM has unlimited

      case 'download':
      case 'history':
        return subscription.tier !== 'FREE'

      default:
        return false
    }
  }

  // Get remaining usage for current billing period
  const getRemainingUsage = () => {
    if (!subscription) return 0

    switch (subscription.tier) {
      case 'FREE':
        return Math.max(0, 5 - subscription.monthlyRoasts)
      case 'PLUS':
        return Math.max(0, 100 - subscription.monthlyRoasts)
      case 'PREMIUM':
        return -1 // Unlimited
      default:
        return 0
    }
  }

  // Get subscription status
  const getSubscriptionStatus = () => {
    if (!subscription) return 'loading'

    if (subscription.tier === 'FREE') return 'free'

    if (subscription.subscriptionEndsAt) {
      const now = new Date()
      const endsAt = new Date(subscription.subscriptionEndsAt)
      
      if (now > endsAt) {
        return 'expired'
      }
    }

    return 'active'
  }

  useEffect(() => {
    fetchSubscription()
  }, [session])

  return {
    subscription,
    loading,
    error,
    createCheckoutSession,
    openCustomerPortal,
    canPerformAction,
    getRemainingUsage,
    getSubscriptionStatus,
    refetch: fetchSubscription,
  }
} 