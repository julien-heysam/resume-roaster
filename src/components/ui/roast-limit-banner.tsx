"use client"

import { AlertTriangle, Crown, Flame } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent } from "./card"

interface RoastLimitBannerProps {
  remainingRoasts: number
  maxRoasts: number
  canRoast: boolean
  tier?: string
  isAuthenticated?: boolean
  onUpgrade?: () => void
}

export function RoastLimitBanner({ 
  remainingRoasts, 
  maxRoasts, 
  canRoast,
  tier = 'FREE',
  isAuthenticated = false,
  onUpgrade 
}: RoastLimitBannerProps) {

  // Show different messages based on tier
  const getTierDisplay = () => {
    switch (tier) {
      case 'PRO':
        return { name: 'Pro', color: 'text-blue-600', bgColor: 'bg-blue-50' }
      case 'ENTERPRISE':
        return { name: 'Enterprise', color: 'text-purple-600', bgColor: 'bg-purple-50' }
      default:
        return { name: 'Free', color: 'text-gray-600', bgColor: 'bg-gray-50' }
    }
  }

  const tierDisplay = getTierDisplay()

  // Handle unlimited plans
  if (tier === 'ENTERPRISE' || maxRoasts === -1) {
    return (
      <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Crown className="h-4 w-4 text-purple-500" />
            <span className="text-purple-700 font-medium">
              Enterprise Plan - Unlimited Credits
            </span>
          </div>
          <div className="text-purple-600 text-xs">
            ∞ remaining
          </div>
        </div>
      </div>
    )
  }

  // Handle PRO plan with high limits
  if (tier === 'PRO' && canRoast && remainingRoasts > 10) {
    return (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Crown className="h-4 w-4 text-blue-500" />
            <span className="text-blue-700 font-medium">
              Pro Plan - {remainingRoasts} credits remaining
            </span>
          </div>
          <div className="text-blue-600 text-xs">
            {remainingRoasts}/{maxRoasts}
          </div>
        </div>
      </div>
    )
  }

  if (canRoast && remainingRoasts > 1) {
    // Show subtle indicator when user still has credits left
    return (
      <div className={`mb-4 p-3 ${tierDisplay.bgColor} border border-gray-200 rounded-lg`}>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className={tierDisplay.color}>
              {isAuthenticated ? `${tierDisplay.name} Plan - ` : ''}{remainingRoasts} credits remaining
            </span>
          </div>
          <Button variant="link" size="sm" onClick={onUpgrade} className="text-orange-600 p-0 h-auto">
            {tier === 'FREE' ? 'Upgrade to Pro →' : 'Manage Plan →'}
          </Button>
        </div>
      </div>
    )
  }

  if (canRoast && remainingRoasts === 1) {
    // Show warning when on last credit
    return (
      <Card className="mb-4 border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                {tier === 'FREE' ? 'This is your last free credit!' : 'Last credit remaining!'}
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                {tier === 'FREE' 
                  ? 'Upgrade to Pro for 100 credits/month' 
                  : 'Your plan resets monthly'
                }
              </p>
            </div>
            <Button size="sm" onClick={onUpgrade}>
              {tier === 'FREE' ? 'Upgrade to Pro' : 'Manage Plan'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!canRoast) {
    // Show limit reached message
    return (
      <Card className="mb-4 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
        <CardContent className="p-6 text-center">
          <Crown className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {tier === 'FREE' 
              ? "You've Used All Your Free Credits! 🔥" 
              : `${tierDisplay.name} Plan Limit Reached`
            }
          </h3>
          <p className="text-gray-600 mb-4">
            {tier === 'FREE' 
              ? `You've used all ${maxRoasts} free credits. Upgrade to get unlimited resume analysis, AI rewriting, and premium features.`
              : `You've used all ${maxRoasts} credits for this month. Your limit resets monthly.`
            }
          </p>
          <div className="space-y-3">
            <Button size="lg" onClick={onUpgrade} className="w-full">
              <Crown className="h-4 w-4 mr-2" />
              {tier === 'FREE' 
                ? 'Upgrade to Pro - $9.99/month' 
                : tier === 'PRO' 
                  ? 'Upgrade to Enterprise' 
                  : 'Manage Plan'
              }
            </Button>
            {tier === 'FREE' && (
              <p className="text-xs text-gray-500">
                Or wait until next month for your credits to reset
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
} 