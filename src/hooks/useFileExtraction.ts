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
    fileType?: string
    aiProvider?: string
    fromCache?: boolean
  }
}

interface FileExtractionState {
  isExtracting: boolean
  extractedData: ExtractedResumeData | null
  error: string | null
  summary?: string
  sections?: string[]
}

export function useFileExtraction() {
  const [state, setState] = useState<FileExtractionState>({
    isExtracting: false,
    extractedData: null,
    error: null
  })

  const extractFile = async (file: File, userId?: string): Promise<ExtractedResumeData | null> => {
    setState(prev => ({ 
      ...prev, 
      isExtracting: true, 
      error: null 
    }))

    try {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error('File size too large. Maximum 10MB allowed.')
      }

      // Determine which API endpoint to use based on file type
      const fileName = file.name.toLowerCase()
      const fileType = file.type
      let apiEndpoint: string

      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        // Use AI extraction for PDF files
        apiEndpoint = '/api/extract-pdf-ai'
      } else if (
        fileType === 'text/plain' || fileName.endsWith('.txt') ||
        fileType === 'application/msword' || fileName.endsWith('.doc') ||
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')
      ) {
        // Use native text extraction for other file types
        apiEndpoint = '/api/extract-text'
      } else {
        throw new Error('Unsupported file type. Please upload PDF, TXT, DOC, or DOCX files.')
      }

      // Create FormData to send the file
      const formData = new FormData()
      formData.append('file', file)
      if (userId) {
        formData.append('userId', userId)
      }
      
      // For PDF files, also add provider parameter
      if (apiEndpoint === '/api/extract-pdf-ai') {
        formData.append('provider', 'anthropic')
      }

      // Call the appropriate API endpoint
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to extract text from file')
      }

      if (!result.success || !result.data) {
        throw new Error('Invalid response from extraction service')
      }

      const extractedData: ExtractedResumeData = result.data

      setState({
        isExtracting: false,
        extractedData,
        error: null,
        summary: result.summary,
        sections: result.sections
      })

      return extractedData
    } catch (error) {
      console.error('File extraction error:', error)
      
      let errorMessage = 'Failed to extract text from file.'
      
      if (error instanceof Error) {
        if (error.message.includes('API key') || error.message.includes('configuration')) {
          errorMessage = 'AI service configuration error. Please check ANTHROPIC_API_KEY in environment variables.'
        } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
          errorMessage = 'AI service rate limit reached. Please try again later.'
        } else if (error.message.includes('size too large')) {
          errorMessage = 'File size too large. Maximum 10MB allowed.'
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

  const clearExtraction = () => {
    setState({
      isExtracting: false,
      extractedData: null,
      error: null
    })
  }

  const retryExtraction = async (file: File, userId?: string) => {
    return await extractFile(file, userId)
  }

  const getFileTypeInfo = (file: File) => {
    const fileName = file.name.toLowerCase()
    const fileType = file.type

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return {
        type: 'PDF',
        description: 'Will use AI extraction',
        icon: '📄',
        color: 'text-red-600'
      }
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return {
        type: 'TXT',
        description: 'Plain text file',
        icon: '📝',
        color: 'text-blue-600'
      }
    } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      return {
        type: 'DOC',
        description: 'Microsoft Word document',
        icon: '📘',
        color: 'text-blue-600'
      }
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      return {
        type: 'DOCX',
        description: 'Microsoft Word document',
        icon: '📘',
        color: 'text-blue-600'
      }
    } else {
      return {
        type: 'Unknown',
        description: 'Unsupported file type',
        icon: '❓',
        color: 'text-gray-600'
      }
    }
  }

  return {
    ...state,
    extractFile,
    clearExtraction,
    retryExtraction,
    getFileTypeInfo
  }
} 