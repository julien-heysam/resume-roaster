import { Suspense } from 'react'
import DownloadPage from '@/components/ui/download-page'
import { Footer } from '@/components/ui/footer'
import { Navigation } from '@/components/ui/navigation'

export default function Download() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      {/* Navigation */}
      <Navigation currentPage="download" />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        }>
          <DownloadPage />
        </Suspense>
      </div>
      
      <Footer />
    </div>
  )
} 