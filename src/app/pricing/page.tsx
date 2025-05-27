"use client"

import { useState } from "react"
import { Check, Crown, Zap, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Navigation } from "@/components/ui/navigation"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useSubscription } from "@/hooks/useSubscription"
import { Footer } from "@/components/ui/footer"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const router = useRouter()
  const { data: session } = useSession()
  const { subscription, loading, createCheckoutSession } = useSubscription()

  const plans = [
    {
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for trying out Resume Roaster",
      features: [
        "3 resume roasts per month",
        "Basic AI feedback",
        "PDF/DOCX upload support",
        "Markdown export",
        "Email support"
      ],
      limitations: [
        "Limited roasts per month",
        "Basic feedback only",
        "No priority support"
      ],
      cta: "Get Started",
      popular: false,
      tier: "FREE"
    },
    {
      name: "Pro",
      price: { monthly: 9.99, yearly: 99.99 },
      description: "For serious job seekers who want the best",
      features: [
        "Unlimited resume roasts",
        "Advanced AI analysis",
        "Job-specific optimization",
        "ATS compatibility check",
        "Multiple export formats",
        "Priority email support",
        "Resume templates",
        "Interview tips"
      ],
      limitations: [],
      cta: "Upgrade to Pro",
      popular: true,
      tier: "PRO"
    },
    {
      name: "Enterprise",
      price: { monthly: 49.99, yearly: 499.99 },
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team management",
        "Bulk resume processing",
        "Custom branding",
        "API access",
        "Dedicated support",
        "Custom integrations",
        "Analytics dashboard"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
      tier: "ENTERPRISE"
    }
  ]

  const handleSubscribe = async (tier: string) => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (tier === 'FREE') {
      router.push('/')
      return
    }

    if (tier === 'ENTERPRISE') {
      // Handle enterprise contact
      window.open('mailto:sales@resumeroaster.com?subject=Enterprise Plan Inquiry', '_blank')
      return
    }

    try {
      const priceId = billingCycle === 'monthly' ? 
        process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID : 
        process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID

      if (!priceId) {
        throw new Error('Price ID not configured')
      }

      await createCheckoutSession(priceId, tier, billingCycle)
    } catch (error) {
      console.error('Subscription error:', error)
      // Handle error (show toast, etc.)
    }
  }

  const getCurrentPlan = () => {
    if (!subscription) return 'FREE'
    return subscription.tier
  }

  const isCurrentPlan = (tier: string) => {
    return getCurrentPlan() === tier
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Navigation */}
      <Navigation currentPage="pricing" />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get the brutal feedback you need to land your dream job. No sugar-coating, just results.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={billingCycle === 'yearly'}
              onCheckedChange={(checked: boolean) => setBillingCycle(checked ? 'yearly' : 'monthly')}
            />
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
              Save 17%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-orange-500 border-2 shadow-xl scale-105' : 'border-gray-200'} transition-all hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center mb-4">
                  {plan.name === 'Free' && <Zap className="h-8 w-8 text-blue-500" />}
                  {plan.name === 'Pro' && <Crown className="h-8 w-8 text-orange-500" />}
                  {plan.name === 'Enterprise' && <Star className="h-8 w-8 text-purple-500" />}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {plan.description}
                </CardDescription>
                <div className="mt-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price[billingCycle]}
                    </span>
                    <span className="text-gray-500 ml-1">
                      /{billingCycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                    <div className="text-sm text-green-600 mt-1">
                      Save ${(plan.price.monthly * 12 - plan.price.yearly).toFixed(2)} per year
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={loading || isCurrentPlan(plan.tier)}
                >
                  {isCurrentPlan(plan.tier) ? 'Current Plan' : plan.cta}
                  {!isCurrentPlan(plan.tier) && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
                
                {isCurrentPlan(plan.tier) && (
                  <p className="text-center text-sm text-green-600 font-medium">
                    ✓ This is your current plan
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards (Visa, MasterCard, American Express) through our secure payment processor Stripe.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Our Free plan gives you 3 roasts per month to try out the service. No credit card required!</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How does the AI analysis work?</h3>
              <p className="text-gray-600">Our AI analyzes your resume against job descriptions, checking for ATS compatibility, keyword optimization, and providing actionable feedback to improve your chances.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 