"use client"

import { useState } from 'react'
import { X, ZoomIn, ZoomOut, Eye } from 'lucide-react'
import { Button } from './button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'

interface PDFPreviewProps {
  images: string[]
  fileName?: string
  className?: string
}

export function PDFPreview({ images, fileName = "PDF", className }: PDFPreviewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  if (!images || images.length === 0) {
    return null
  }

  const openImage = (index: number) => {
    setSelectedImageIndex(index)
    setIsZoomed(false)
  }

  const closeImage = () => {
    setSelectedImageIndex(null)
    setIsZoomed(false)
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return
    
    if (direction === 'prev' && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    } else if (direction === 'next' && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
    setIsZoomed(false)
  }

  return (
    <div className={className}>
      {/* Thumbnail Grid */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            PDF Preview ({images.length} page{images.length !== 1 ? 's' : ''})
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((imageBase64, index) => (
            <div
              key={index}
              className="relative group cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:border-orange-300 transition-colors"
              onClick={() => openImage(index)}
            >
              <img
                src={`data:image/png;base64,${imageBase64}`}
                alt={`${fileName} - Page ${index + 1}`}
                className="w-full h-32 object-cover bg-white"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </div>
              
              {/* Page Number */}
              <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Size Image Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={closeImage}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="flex items-center justify-between">
              <span>{fileName} - Page {selectedImageIndex !== null ? selectedImageIndex + 1 : ''}</span>
              <div className="flex items-center space-x-2">
                {/* Navigation */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateImage('prev')}
                      disabled={selectedImageIndex === 0}
                    >
                      ← Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateImage('next')}
                      disabled={selectedImageIndex === images.length - 1}
                    >
                      Next →
                    </Button>
                  </>
                )}
                
                {/* Zoom Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleZoom}
                >
                  {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                </Button>
                
                {/* Close */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-4 pt-0 overflow-auto">
            {selectedImageIndex !== null && (
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${images[selectedImageIndex]}`}
                  alt={`${fileName} - Page ${selectedImageIndex + 1}`}
                  className={`max-w-full h-auto bg-white border border-gray-200 rounded transition-all duration-300 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={toggleZoom}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 