"use client"

import { useState } from 'react'

interface ExtractedResumeData {
  text: string
  documentId?: string
  metadata: {
    pages: number
    wordCount: number
    fileName: string
    fileSize: number
    extractedAt: string
    aiProvider: string
    fromCache?: boolean
  }
}

interface PdfExtractionState {
  isExtracting: boolean
  extractedData: ExtractedResumeData | null
  error: string | null
}

export function usePdfExtractionReal() {
  const [state, setState] = useState<PdfExtractionState>({
    isExtracting: false,
    extractedData: null,
    error: null
  })

  const extractPdf = async (file: File): Promise<ExtractedResumeData | null> => {
    setState(prev => ({ ...prev, isExtracting: true, error: null }))

    try {
      // Validate file type
      if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        throw new Error('Only PDF files are supported for extraction')
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum 10MB allowed.')
      }

      // Create FormData to send the file
      const formData = new FormData()
      formData.append('file', file)

      // Call the API endpoint
      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to extract PDF text')
      }

      if (!result.success || !result.data) {
        throw new Error('Invalid response from extraction service')
      }

      const extractedData: ExtractedResumeData = result.data

      setState({
        isExtracting: false,
        extractedData,
        error: null
      })

      return extractedData
    } catch (error) {
      console.error('PDF extraction error:', error)
      
      let errorMessage = 'Failed to extract text from PDF.'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      setState(prev => ({
        ...prev,
        isExtracting: false,
        error: errorMessage
      }))
      return null
    }
  }

  const clearExtraction = () => {
    setState({
      isExtracting: false,
      extractedData: null,
      error: null
    })
  }

  const retryExtraction = async (file: File) => {
    return await extractPdf(file)
  }

  return {
    ...state,
    extractPdf,
    clearExtraction,
    retryExtraction
  }
} 