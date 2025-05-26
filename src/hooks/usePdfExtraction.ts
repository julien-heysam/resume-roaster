"use client"

import { useState } from 'react'

interface ExtractedResumeData {
  text: string
  metadata: {
    pages: number
    wordCount: number
    fileName: string
    fileSize: number
    extractedAt: string
  }
}

interface PdfExtractionState {
  isExtracting: boolean
  extractedData: ExtractedResumeData | null
  error: string | null
}

export function usePdfExtraction() {
  const [state, setState] = useState<PdfExtractionState>({
    isExtracting: false,
    extractedData: null,
    error: null
  })

  const extractPdf = async (file: File): Promise<ExtractedResumeData | null> => {
    setState(prev => ({ ...prev, isExtracting: true, error: null }))

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const response = await fetch('/api/extract-resume', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to extract PDF text')
      }

      const extractedData = result.data as ExtractedResumeData
      setState({
        isExtracting: false,
        extractedData,
        error: null
      })

      return extractedData
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
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