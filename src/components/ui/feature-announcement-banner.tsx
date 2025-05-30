"use client"

import { useState } from "react"
import { X, Sparkles, Calendar, ArrowRight, Bell } from "lucide-react"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { Badge } from "./badge"

interface FeatureAnnouncementBannerProps {
  title: string
  description: string
  featureName?: string
  estimatedDate?: string
  type?: 'coming-soon' | 'in-progress' | 'beta' | 'new'
  ctaText?: string
  ctaAction?: () => void
  dismissible?: boolean
  onDismiss?: () => void
}

export function FeatureAnnouncementBanner({
  title,
  description,
  featureName,
  estimatedDate,
  type = 'coming-soon',
  ctaText,
  ctaAction,
  dismissible = true,
  onDismiss
}: FeatureAnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  const getTypeConfig = () => {
    switch (type) {
      case 'in-progress':
        return {
          bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200',
          badgeColor: 'bg-blue-100 text-blue-800',
          iconColor: 'text-blue-600',
          icon: Sparkles
        }
      case 'beta':
        return {
          bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
          borderColor: 'border-purple-200',
          badgeColor: 'bg-purple-100 text-purple-800',
          iconColor: 'text-purple-600',
          icon: Sparkles
        }
      case 'new':
        return {
          bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
          borderColor: 'border-green-200',
          badgeColor: 'bg-green-100 text-green-800',
          iconColor: 'text-green-600',
          icon: Sparkles
        }
      default: // coming-soon
        return {
          bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50',
          borderColor: 'border-amber-200',
          badgeColor: 'bg-amber-100 text-amber-800',
          iconColor: 'text-amber-600',
          icon: Calendar
        }
    }
  }

  const config = getTypeConfig()
  const IconComponent = config.icon

  return (
    <Card className={`mb-6 ${config.borderColor} ${config.bgColor}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`p-2 rounded-full bg-white shadow-sm`}>
              <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                {featureName && (
                  <Badge className={config.badgeColor}>
                    {featureName}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {type === 'coming-soon' ? 'Coming Soon' : 
                   type === 'in-progress' ? 'In Progress' :
                   type === 'beta' ? 'Beta' : 'New'}
                </Badge>
              </div>
              
              <p className="text-gray-700 mb-3 leading-relaxed">
                {description}
              </p>
              
              {estimatedDate && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>Expected: {estimatedDate}</span>
                </div>
              )}
              
              {ctaText && ctaAction && (
                <Button 
                  onClick={ctaAction}
                  size="sm"
                  className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
                >
                  {ctaText}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
          
          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 