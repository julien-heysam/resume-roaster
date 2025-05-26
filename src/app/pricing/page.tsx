"use client"

import { useState } from "react"
import { Flame, Check, Zap, Star, ArrowRight, CreditCard, User, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const isAuthenticated = status === 'authenticated'

  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out Resume Roaster",
      price: {
        monthly: 0,
        yearly: 0
      },
      features: [
        "3 resume roasts per month",
        "AI-powered PDF extraction",
        "Basic markdown formatting",
        "Claude 4 Sonnet analysis",
        "Email support"
      ],
      limitations: [
        "Limited to 3 roasts monthly",
        "No document history",
        "Basic analysis only"
      ],
      buttonText: "Get Started Free",
      popular: false,
      tier: "FREE" as const
    },
    {
      name: "Pro",
      description: "Best for active job seekers",
      price: {
        monthly: 9.99,
        yearly: 99.99
      },
      features: [
        "100 resume roasts per month",
        "Document history",
        "Priority AI processing",
        "Advanced analysis insights",
        "Cover letter generation",
        "ATS optimization tips",
        "Multiple resume versions",
        "Priority email support",
        "Download formatted resumes",
        "Fine tuned AI models"
      ],
      limitations: [],
      buttonText: "Upgrade to Pro",
      popular: true,
      tier: "PRO" as const
    },
    {
      name: "Enterprise",
      description: "For teams and career services",
      price: {
        monthly: 49.99,
        yearly: 499.99
      },
      features: [
        "Unlimited resume roasts",
        "Team collaboration tools",
        "API access",
        "Custom branding",
        "Bulk processing",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantees",
        "Custom AI training"
      ],
      limitations: [],
      buttonText: "Contact Sales",
      popular: false,
      tier: "ENTERPRISE" as const
    }
  ]

  const handleUpgrade = (tier: string, price: number) => {
    if (tier === 'FREE') {
      // Redirect to signup
      window.location.href = '/auth/signup'
    } else if (tier === 'ENTERPRISE') {
      // Contact sales
      window.open('mailto:sales@resumeroaster.com?subject=Enterprise Plan Inquiry')
    } else {
      // Redirect to Stripe checkout (placeholder)
      alert(`Redirecting to payment for ${tier} plan ($${price}/${billingCycle})...`)
      // In real implementation: redirect to Stripe
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="border-b border-orange-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Resume Roaster
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" onClick={() => router.push('/')}>
                Home
              </Button>
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                    Dashboard
                  </Button>
                  <span className="text-orange-500 font-medium">Pricing</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        {session?.user?.name || session?.user?.email}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/pricing')}>
                        Pricing
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <span className="text-orange-500 font-medium">Pricing</span>
                  <Button variant="outline" onClick={() => router.push('/auth/signin')}>
                    Sign In
                  </Button>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-orange-100">
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" className="justify-start" onClick={() => router.push('/')}>
                  Home
                </Button>
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => router.push('/dashboard')}>
                      Dashboard
                    </Button>
                    <div className="px-3 py-2 text-sm text-orange-500 font-medium">
                      Pricing
                    </div>
                    <div className="px-3 py-2 text-sm text-gray-600">
                      {session?.user?.name || session?.user?.email}
                    </div>
                    <Button variant="ghost" className="justify-start text-red-600" onClick={() => signOut()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="px-3 py-2 text-sm text-orange-500 font-medium">
                      Pricing
                    </div>
                    <Button variant="outline" className="justify-start" onClick={() => router.push('/auth/signin')}>
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent leading-tight">
              Choose Your Plan
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Transform your resume with AI-powered feedback. Start free, upgrade when you need more.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <Badge variant="secondary" className="ml-2">
                  Save 20%
                </Badge>
              )}
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={plan.name} 
                  className={`relative ${plan.popular ? 'ring-2 ring-orange-500 scale-105' : ''} hover:shadow-lg transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-orange-500 text-white px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${plan.price[billingCycle]}
                      </span>
                      <span className="text-gray-500 ml-1">
                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                      {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                        <div className="text-sm text-green-600 mt-1">
                          Save ${(plan.price.monthly * 12 - plan.price.yearly).toFixed(2)} annually
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Limitations */}
                    {plan.limitations.length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                        <div className="space-y-1">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <div key={limitIndex} className="text-xs text-gray-400">
                              • {limitation}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <div className="pt-6">
                      <Button
                        className={`w-full ${plan.popular ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                        onClick={() => handleUpgrade(plan.tier, plan.price[billingCycle])}
                      >
                        {plan.tier === 'ENTERPRISE' ? (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            {plan.buttonText}
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            {plan.buttonText}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 text-center">
              <p className="text-gray-600 mb-4">Trusted by job seekers worldwide</p>
              <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>14-day money back guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Secure payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h3>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold mb-2">What happens if I exceed my monthly limit?</h4>
              <p className="text-gray-600">You'll be prompted to upgrade to the next tier. Pro users get 100 roasts/month, and Enterprise users have unlimited access.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold mb-2">Can I upgrade or downgrade anytime?</h4>
              <p className="text-gray-600">Yes! You can change your plan anytime. Upgrades take effect immediately, downgrades at the next billing cycle.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold mb-2">Is my data secure?</h4>
              <p className="text-gray-600">Absolutely. We use enterprise-grade encryption and never store your documents permanently unless you're signed in and choose to save them.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold mb-2">Do you offer refunds?</h4>
              <p className="text-gray-600">Yes, we offer a 14-day money-back guarantee for all paid plans. No questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Resume?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of job seekers who've improved their interview rates with AI-powered Resume Roaster.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="group"
              onClick={() => window.location.href = '/'}
            >
              <Flame className="mr-2 h-5 w-5" />
              Start Roasting Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Flame className="h-6 w-6 text-orange-500" />
                <span className="text-lg font-bold">Resume Roaster</span>
              </div>
              <p className="text-gray-400">
                AI-powered resume feedback that gets you hired.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-orange-500 transition-colors">Home</a></li>
                <li><a href="/pricing" className="hover:text-orange-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Examples</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Resume Roaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 