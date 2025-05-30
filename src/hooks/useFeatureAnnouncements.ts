import { useEffect } from 'react'
import { toast } from 'sonner'

interface FeatureAnnouncement {
  id: string
  title: string
  description: string
  type?: 'info' | 'success' | 'warning'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function useFeatureAnnouncements() {
  useEffect(() => {
    // Check if user has seen recent announcements
    const lastAnnouncementSeen = localStorage.getItem('lastAnnouncementSeen')
    const currentAnnouncement = 'dashboard-improvements-2024' // Update this ID for new announcements
    
    if (lastAnnouncementSeen !== currentAnnouncement) {
      // Show announcement toast
      setTimeout(() => {
        toast.info('🚀 Dashboard Improvements Coming Soon!', {
          description: 'We\'re working on enhanced analytics and new features to improve your experience.',
          duration: 8000,
          action: {
            label: 'Learn More',
            onClick: () => {
              window.open('/help', '_blank')
            }
          }
        })
        
        // Mark as seen
        localStorage.setItem('lastAnnouncementSeen', currentAnnouncement)
      }, 2000) // Delay to avoid overwhelming the user
    }
  }, [])

  const showCustomAnnouncement = (announcement: FeatureAnnouncement) => {
    const toastFunction = announcement.type === 'success' ? toast.success :
                         announcement.type === 'warning' ? toast.warning :
                         toast.info

    toastFunction(announcement.title, {
      description: announcement.description,
      duration: announcement.duration || 6000,
      action: announcement.action
    })
  }

  return { showCustomAnnouncement }
} 