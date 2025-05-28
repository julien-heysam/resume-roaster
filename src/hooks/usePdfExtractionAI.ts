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
  summary?: string
  sections?: string[]
  currentProvider: 'anthropic' | 'openai'
}

export function usePdfExtractionAI() {
  const [state, setState] = useState<PdfExtractionState>({
    isExtracting: false,
    extractedData: null,
    error: null,
    currentProvider: 'anthropic'
  })

  const extractPdf = async (file: File, provider: 'anthropic' | 'openai' = 'anthropic'): Promise<ExtractedResumeData | null> => {
    setState(prev => ({ 
      ...prev, 
      isExtracting: true, 
      error: null, 
      currentProvider: provider 
    }))

    try {
      // Validate file type
      if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        throw new Error('Only PDF files are supported for extraction')
      }

      // Validate file size (10MB limit for direct PDF processing)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum 10MB allowed for PDF processing.')
      }

      // Create FormData to send the file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('provider', provider)

      // Call the AI extraction API endpoint
      const response = await fetch('/api/extract-pdf-ai', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to extract PDF text using AI')
      }

      if (!result.success || !result.data) {
        throw new Error('Invalid response from AI extraction service')
      }

      const extractedData: ExtractedResumeData = result.data

      setState({
        isExtracting: false,
        extractedData,
        error: null,
        summary: result.summary,
        sections: result.sections,
        currentProvider: provider
      })

      return extractedData
    } catch (error) {
      console.error('AI PDF extraction error:', error)
      
      let errorMessage = 'Failed to extract text from PDF using AI.'
      
      if (error instanceof Error) {
        if (error.message.includes('API key') || error.message.includes('configuration')) {
          errorMessage = 'AI service configuration error. Please check ANTHROPIC_API_KEY in environment variables.'
        } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
          errorMessage = 'AI service rate limit reached. Please try again later.'
        } else if (error.message.includes('size too large')) {
          errorMessage = 'File size too large. Maximum 10MB allowed for PDF processing.'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else {
          errorMessage = error.message
        }
      }
      
      setState(prev => ({
        ...prev,
        isExtracting: false,
        error: errorMessage
      }))
      return null
    }
  }

  const switchProvider = (provider: 'anthropic' | 'openai') => {
    // Always use anthropic for now
    setState(prev => ({
      ...prev,
      currentProvider: 'anthropic',
      error: null
    }))
  }

  const clearExtraction = () => {
    setState({
      isExtracting: false,
      extractedData: null,
      error: null,
      currentProvider: 'anthropic'
    })
  }

  const retryExtraction = async (file: File, provider?: 'anthropic' | 'openai') => {
    return await extractPdf(file, 'anthropic')
  }

  return {
    ...state,
    extractPdf,
    switchProvider,
    clearExtraction,
    retryExtraction
  }
} 