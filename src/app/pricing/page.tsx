"use client"

import { useState } from "react"
import { Flame, Check, Zap, Star, ArrowRight, CreditCard, User, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useAlertDialog } from "@/components/ui/alert-dialog"
import { StripeCheckout } from "@/components/stripe/StripeCheckout"
import { Footer } from "@/components/ui/footer"
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
  const { showAlert, AlertDialog } = useAlertDialog()
  
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
      tier: "FREE" as const,
      priceIds: {
        monthly: "",
        yearly: ""
      }
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
      tier: "PRO" as const,
      priceIds: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || "",
        yearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || ""
      }
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
      tier: "ENTERPRISE" as const,
      priceIds: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || "",
        yearly: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_YEARLY_PRICE_ID || ""
      }
    }
  ]

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
                  <Button variant="ghost" onClick={() => router.push('/resume-optimizer')}>
                    Resume Optimizer
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
                      <DropdownMenuItem onClick={() => router.push('/resume-optimizer')}>
                        Resume Optimizer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/pricing')}>
                        Pricing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/settings')}>
                        Settings
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
                  <Button variant="ghost" onClick={() => router.push('/resume-optimizer')}>
                    Resume Optimizer
                  </Button>
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
                <Button variant="ghost" onClick={() => router.push('/')} className="justify-start">
                  Home
                </Button>
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" onClick={() => router.push('/dashboard')} className="justify-start">
                      Dashboard
                    </Button>
                    <Button variant="ghost" onClick={() => router.push('/resume-optimizer')} className="justify-start">
                      Resume Optimizer
                    </Button>
                    <span className="text-orange-500 font-medium px-3 py-2">Pricing</span>
                    <Button variant="ghost" onClick={() => router.push('/settings')} className="justify-start">
                      Settings
                    </Button>
                    <Button variant="ghost" onClick={() => signOut()} className="justify-start">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => router.push('/resume-optimizer')} className="justify-start">
                      Resume Optimizer
                    </Button>
                    <span className="text-orange-500 font-medium px-3 py-2">Pricing</span>
                    <Button variant="outline" onClick={() => router.push('/auth/signin')} className="justify-start">
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Plan</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get your resume roasted by AI and land your dream job faster
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={billingCycle === 'monthly' ? 'text-orange-500 font-medium' : 'text-gray-500'}>
              Monthly
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative"
            >
              <div className={`w-12 h-6 rounded-full transition-colors ${billingCycle === 'yearly' ? 'bg-orange-500' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
              </div>
            </Button>
            <span className={billingCycle === 'yearly' ? 'text-orange-500 font-medium' : 'text-gray-500'}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <StripeCheckout 
              key={index} 
              plan={plan} 
              billingCycle={billingCycle} 
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, Apple Pay, Google Pay, and PayPal through our secure Stripe integration.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes! Our Free plan gives you 3 resume roasts per month to try out our service.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 30-day money-back guarantee if you're not satisfied with our service.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      {AlertDialog}
    </div>
  )
} 