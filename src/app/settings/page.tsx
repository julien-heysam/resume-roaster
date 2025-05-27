"use client"

import { useState } from "react"
import { Flame, User, LogOut, Menu, X, Settings as SettingsIcon, Crown, Calendar, BarChart3, CreditCard, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useSubscription } from "@/hooks/useSubscription"
import { Footer } from "@/components/ui/footer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SettingsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { subscription, loading, openCustomerPortal, getRemainingUsage, getSubscriptionStatus } = useSubscription()
  
  const isAuthenticated = status === 'authenticated'

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/auth/signin')
    return null
  }

  // Format date
  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  // Get tier info
  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'FREE':
        return {
          name: 'Free',
          color: 'bg-gray-100 text-gray-800',
          icon: <User className="h-4 w-4" />,
          maxRoasts: 3
        }
      case 'PRO':
        return {
          name: 'Pro',
          color: 'bg-orange-100 text-orange-800',
          icon: <Crown className="h-4 w-4" />,
          maxRoasts: 100
        }
      case 'ENTERPRISE':
        return {
          name: 'Enterprise',
          color: 'bg-purple-100 text-purple-800',
          icon: <Crown className="h-4 w-4" />,
          maxRoasts: -1 // Unlimited
        }
      default:
        return {
          name: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          icon: <User className="h-4 w-4" />,
          maxRoasts: 0
        }
    }
  }

  const tierInfo = getTierInfo(subscription?.tier || 'FREE')
  const remainingUsage = getRemainingUsage()
  const subscriptionStatus = getSubscriptionStatus()

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
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
              <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => router.push('/resume-optimizer')}>
                Resume Optimizer
              </Button>
              <Button variant="ghost" onClick={() => router.push('/pricing')}>
                Pricing
              </Button>
              <span className="text-orange-500 font-medium">Settings</span>
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
                <Button variant="ghost" onClick={() => router.push('/dashboard')} className="justify-start">
                  Dashboard
                </Button>
                <Button variant="ghost" onClick={() => router.push('/resume-optimizer')} className="justify-start">
                  Resume Optimizer
                </Button>
                <Button variant="ghost" onClick={() => router.push('/pricing')} className="justify-start">
                  Pricing
                </Button>
                <span className="text-orange-500 font-medium px-3 py-2">Settings</span>
                <Button variant="ghost" onClick={() => signOut()} className="justify-start">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Account <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Settings</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Manage your subscription and view your account details
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading subscription details...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Account Information</span>
                </CardTitle>
                <CardDescription>Your basic account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{session?.user?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{session?.user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5" />
                  <span>Subscription Details</span>
                </CardTitle>
                <CardDescription>Your current plan and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={tierInfo.color}>
                      {tierInfo.icon}
                      <span className="ml-1">{tierInfo.name} Plan</span>
                    </Badge>
                    {subscriptionStatus === 'active' && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                    {subscriptionStatus === 'expired' && (
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Expired
                      </Badge>
                    )}
                  </div>
                  {subscription?.tier !== 'FREE' && (
                    <Button variant="outline" onClick={openCustomerPortal}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manage Billing
                    </Button>
                  )}
                </div>

                {subscription?.subscriptionEndsAt && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-800">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {subscriptionStatus === 'active' ? 'Next billing date' : 'Subscription ends'}: {formatDate(subscription.subscriptionEndsAt)}
                      </span>
                    </div>
                  </div>
                )}

                {subscription?.tier === 'FREE' && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-orange-800">
                      <Crown className="h-4 w-4" />
                      <span className="text-sm font-medium">Ready to upgrade?</span>
                    </div>
                    <p className="text-sm text-orange-600 mt-1">
                      Get more resume roasts and advanced features with Pro or Enterprise plans.
                    </p>
                    <Button 
                      size="sm" 
                      className="mt-3"
                      onClick={() => router.push('/pricing')}
                    >
                      View Plans
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Usage Statistics</span>
                </CardTitle>
                <CardDescription>Your current month's usage and limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Resume Roasts This Month</span>
                    <span className="text-sm text-gray-600">
                      {subscription?.monthlyRoasts || 0} / {tierInfo.maxRoasts === -1 ? '∞' : tierInfo.maxRoasts}
                    </span>
                  </div>
                  {tierInfo.maxRoasts !== -1 && (
                    <Progress 
                      value={((subscription?.monthlyRoasts || 0) / tierInfo.maxRoasts) * 100} 
                      className="h-2"
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {tierInfo.maxRoasts === -1 
                      ? 'Unlimited roasts available'
                      : `${remainingUsage} roasts remaining this month`
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Total Roasts</label>
                    <p className="text-2xl font-bold text-gray-900">{subscription?.totalRoasts || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Reset</label>
                    <p className="text-gray-900">
                      {subscription?.lastRoastReset 
                        ? formatDate(subscription.lastRoastReset)
                        : 'Never'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
                <CardDescription>Common account management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="justify-start h-auto p-4"
                    onClick={() => router.push('/pricing')}
                  >
                    <div className="text-left">
                      <div className="font-medium">View Plans</div>
                      <div className="text-sm text-gray-500">Compare and upgrade your plan</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="justify-start h-auto p-4"
                    onClick={() => router.push('/dashboard')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Dashboard</div>
                      <div className="text-sm text-gray-500">View your resume history</div>
                    </div>
                  </Button>

                  {subscription?.tier !== 'FREE' && (
                    <Button 
                      variant="outline" 
                      className="justify-start h-auto p-4"
                      onClick={openCustomerPortal}
                    >
                      <div className="text-left">
                        <div className="font-medium">Billing Portal</div>
                        <div className="text-sm text-gray-500">Manage payment methods and invoices</div>
                      </div>
                    </Button>
                  )}

                  <Button 
                    variant="outline" 
                    className="justify-start h-auto p-4"
                    onClick={() => router.push('/resume-optimizer')}
                  >
                    <div className="text-left">
                      <div className="font-medium">Resume Optimizer</div>
                      <div className="text-sm text-gray-500">Get your resume roasted</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
} 