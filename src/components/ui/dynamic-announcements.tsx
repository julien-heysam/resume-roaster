"use client"

import { useState, useEffect } from "react"
import { FeatureAnnouncementBanner } from "./feature-announcement-banner"

interface Announcement {
  id: string
  title: string
  description: string
  featureName?: string
  estimatedDate?: string
  type: 'COMING_SOON' | 'IN_PROGRESS' | 'BETA' | 'NEW' | 'MAINTENANCE' | 'UPDATE'
  ctaText?: string
  ctaUrl?: string
}

export function DynamicAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements || [])
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = async (announcementId: string) => {
    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ announcementId }),
      })

      if (response.ok) {
        // Remove the announcement from the local state
        setAnnouncements(prev => prev.filter(a => a.id !== announcementId))
      }
    } catch (error) {
      console.error('Error dismissing announcement:', error)
    }
  }

  const mapAnnouncementType = (type: string) => {
    switch (type) {
      case 'COMING_SOON': return 'coming-soon'
      case 'IN_PROGRESS': return 'in-progress'
      case 'BETA': return 'beta'
      case 'NEW': return 'new'
      default: return 'coming-soon'
    }
  }

  if (loading || announcements.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <FeatureAnnouncementBanner
          key={announcement.id}
          title={announcement.title}
          description={announcement.description}
          featureName={announcement.featureName}
          estimatedDate={announcement.estimatedDate}
          type={mapAnnouncementType(announcement.type) as any}
          ctaText={announcement.ctaText}
          ctaAction={announcement.ctaUrl ? () => window.open(announcement.ctaUrl, '_blank') : undefined}
          dismissible={true}
          onDismiss={() => handleDismiss(announcement.id)}
        />
      ))}
    </div>
  )
} 