"use client"

import { useState } from 'react'
import { getStripe } from '@/lib/stripe'
import { Elements, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard, Loader2, AlertTriangle, Settings, Calendar } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useSubscription } from '@/hooks/useSubscription'

// Get Stripe promise
const stripePromise = getStripe()

interface PricingPlan {
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: string[]
  tier: 'FREE' | 'PRO' | 'ENTERPRISE'
  priceIds: {
    monthly: string
    yearly: string
  }
  popular?: boolean
}

interface StripeCheckoutProps {
  plan: PricingPlan
  billingCycle: 'monthly' | 'yearly'
}

function CheckoutForm({ plan, billingCycle }: StripeCheckoutProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { subscription, openCustomerPortal } = useSubscription()

  const price = plan.price[billingCycle]
  const priceId = plan.priceIds[billingCycle]

  // Check if user is already on this plan
  const isCurrentPlan = subscription?.tier === plan.tier
  const isUpgrade = subscription && (
    (subscription.tier === 'FREE' && (plan.tier === 'PRO' || plan.tier === 'ENTERPRISE')) ||
    (subscription.tier === 'PRO' && plan.tier === 'ENTERPRISE')
  )
  const isDowngrade = subscription && (
    (subscription.tier === 'PRO' && plan.tier === 'FREE') ||
    (subscription.tier === 'ENTERPRISE' && (plan.tier === 'PRO' || plan.tier === 'FREE'))
  )

  // Format subscription end date
  const formatEndDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  // Check if price ID is configured (only for paid plans)
  if (plan.tier !== 'FREE' && !priceId) {
    return (
      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
        <div className="flex items-center space-x-2 text-yellow-800">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">Payment configuration incomplete</span>
        </div>
        <p className="text-xs text-yellow-600 mt-1">
          Please contact support to complete your subscription setup.
        </p>
      </div>
    )
  }

  const handleExpressCheckout = async (event: any) => {
    if (!stripe || !elements) {
      toast.error('Payment system not ready. Please try again.')
      return
    }

    setIsLoading(true)

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          tier: plan.tier,
          billingCycle,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { sessionId, url } = await response.json()

      if (url) {
        window.location.href = url
      } else if (sessionId) {
        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({ sessionId })
        
        if (error) {
          toast.error(error.message || 'Payment failed')
        }
      } else {
        throw new Error('No checkout URL or session ID received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout process')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegularCheckout = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          tier: plan.tier,
          billingCycle,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout process')
    } finally {
      setIsLoading(false)
    }
  }

  // FREE PLAN
  if (plan.tier === 'FREE') {
    if (isCurrentPlan) {
      return (
        <div className="space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Current Plan</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              You're currently on the Free plan
            </p>
          </div>
          {subscription?.subscriptionEndsAt && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-800">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Subscription ends: {formatEndDate(subscription.subscriptionEndsAt)}</span>
              </div>
            </div>
          )}
        </div>
      )
    }

    return (
      <Button 
        className="w-full" 
        variant="outline"
        onClick={() => router.push('/auth/signup')}
      >
        Get Started Free
      </Button>
    )
  }

  // CURRENT PLAN - Show manage subscription
  if (isCurrentPlan) {
    return (
      <div className="space-y-3">
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 text-green-800">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Current Plan</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            You're subscribed to {plan.name}
          </p>
        </div>
        
        {subscription?.subscriptionEndsAt && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-800">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Renews: {formatEndDate(subscription.subscriptionEndsAt)}</span>
            </div>
          </div>
        )}

        <Button 
          className="w-full" 
          variant="outline"
          onClick={openCustomerPortal}
        >
          <Settings className="mr-2 h-4 w-4" />
          Manage Subscription
        </Button>
      </div>
    )
  }

  // DOWNGRADE - Show manage subscription option
  if (isDowngrade) {
    return (
      <div className="space-y-3">
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2 text-orange-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Downgrade</span>
          </div>
          <p className="text-xs text-orange-600 mt-1">
            To downgrade, manage your subscription
          </p>
        </div>

        <Button 
          className="w-full" 
          variant="outline"
          onClick={openCustomerPortal}
        >
          <Settings className="mr-2 h-4 w-4" />
          Manage Subscription
        </Button>
      </div>
    )
  }

  // UPGRADE OR NEW SUBSCRIPTION
  return (
    <div className="space-y-4">
      {/* Express Checkout Element */}
      {stripe && (
        <div className="border rounded-lg p-4">
          <ExpressCheckoutElement
            onConfirm={handleExpressCheckout}
            options={{
              buttonType: {
                applePay: 'subscribe',
                googlePay: 'subscribe',
                paypal: 'pay',
              },
              layout: {
                maxColumns: 1,
                maxRows: 1,
              },
              buttonHeight: 48,
            }}
          />
        </div>
      )}

      {/* Divider */}
      {stripe && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or pay with card
            </span>
          </div>
        </div>
      )}

      {/* Regular checkout button */}
      <Button 
        className="w-full" 
        onClick={handleRegularCheckout}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {isUpgrade ? 'Upgrade to' : 'Subscribe to'} {plan.name} - ${price}/{billingCycle === 'monthly' ? 'month' : 'year'}
          </>
        )}
      </Button>
    </div>
  )
}

export function StripeCheckout({ plan, billingCycle }: StripeCheckoutProps) {
  // Check if Stripe is properly configured
  if (!stripePromise) {
    return (
      <Card className={`relative ${plan.popular ? 'border-orange-500 shadow-lg' : ''}`}>
        {plan.popular && (
          <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500">
            Most Popular
          </Badge>
        )}
        
        <CardHeader>
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
          <div className="mt-4">
            <span className="text-3xl font-bold">
              ${plan.price[billingCycle]}
            </span>
            <span className="text-muted-foreground">
              /{billingCycle === 'monthly' ? 'month' : 'year'}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Stripe Not Configured</span>
            </div>
            <p className="text-xs text-red-600 mt-1">
              Please add your Stripe keys to .env.local to enable payments.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const options = {
    mode: 'subscription' as const,
    amount: plan.price[billingCycle] * 100, // Convert to cents
    currency: 'usd',
    appearance: {
      theme: 'stripe' as const,
      variables: {
        borderRadius: '8px',
      },
    },
  }

  return (
    <Card className={`relative ${plan.popular ? 'border-orange-500 shadow-lg' : ''}`}>
      {plan.popular && (
        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500">
          Most Popular
        </Badge>
      )}
      
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">
            ${plan.price[billingCycle]}
          </span>
          <span className="text-muted-foreground">
            /{billingCycle === 'monthly' ? 'month' : 'year'}
          </span>
          {billingCycle === 'yearly' && plan.price.yearly < plan.price.monthly * 12 && (
            <Badge variant="secondary" className="ml-2">
              Save ${(plan.price.monthly * 12 - plan.price.yearly).toFixed(0)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm plan={plan} billingCycle={billingCycle} />
        </Elements>
      </CardContent>
    </Card>
  )
} 