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
    aiProvider?: string
    fromCache?: boolean
  }
}

interface FileExtractionState {
  isExtracting: boolean
  extractedData: ExtractedResumeData | null
  error: string | null
  images?: string[]
  summary?: string
  sections?: string[]
  extractionMethod?: 'basic' | 'ai' | 'auto'
  documentId?: string
  fileHash?: string
}

export function useFileExtraction() {
  const [state, setState] = useState<FileExtractionState>({
    isExtracting: false,
    extractedData: null,
    error: null,
    images: []
  })

  const extractFile = async (
    file: File, 
    userId?: string, 
    extractionMethod: 'basic' | 'ai' | 'auto' = 'auto',
    provider: 'anthropic' | 'openai' = 'anthropic',
    bypassCache: boolean = false
  ): Promise<ExtractedResumeData | null> => {
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
        // Use AI extraction endpoint for PDF files (supports both basic and AI)
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
      
      // Add bypassCache parameter to all endpoints
      formData.append('bypassCache', bypassCache.toString())
      
      // For PDF files, add extraction method and provider parameters
      if (apiEndpoint === '/api/extract-pdf-ai') {
        formData.append('extractionMethod', extractionMethod)
        formData.append('provider', provider)
      }

      // Call the appropriate API endpoint
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to extract file content')
      }

      if (!result.success || !result.data) {
        throw new Error('Invalid response from extraction service')
      }

      const extractedData: ExtractedResumeData = {
        ...result.data,
        documentId: result.documentId
      }

      setState({
        isExtracting: false,
        extractedData,
        error: null,
        images: result.images,
        summary: result.summary,
        sections: result.sections,
        extractionMethod: result.extractionMethod,
        documentId: result.documentId,
        fileHash: result.fileHash
      })

      return extractedData
    } catch (error) {
      console.error('File extraction error:', error)
      
      let errorMessage = 'Failed to extract file content.'
      
      if (error instanceof Error) {
        if (error.message.includes('API key') || error.message.includes('configuration')) {
          errorMessage = 'AI service configuration error. Please check ANTHROPIC_API_KEY in environment variables.'
        } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
          errorMessage = 'AI service rate limit reached. Please try again later.'
        } else if (error.message.includes('size too large')) {
          errorMessage = 'File size too large. Maximum 10MB allowed.'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.message.includes('limit exceeded')) {
          errorMessage = error.message // Pass through limit exceeded messages
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
      error: null,
      images: []
    })
  }

  const deleteDocument = async (userId?: string): Promise<boolean> => {
    const { documentId, fileHash } = state
    
    if (!documentId && !fileHash) {
      console.warn('No document ID or file hash available for deletion')
      return false
    }

    try {
      const params = new URLSearchParams()
      if (documentId) params.append('id', documentId)
      if (fileHash) params.append('fileHash', fileHash)
      if (userId) params.append('userId', userId)

      const response = await fetch(`/api/delete-document?${params.toString()}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete document')
      }

      console.log('Document deleted successfully:', result.deletedDocument)
      
      // Clear the extraction state after successful deletion
      clearExtraction()
      
      return true
    } catch (error) {
      console.error('Document deletion error:', error)
      return false
    }
  }

  const retryExtraction = async (
    file: File, 
    userId?: string, 
    extractionMethod?: 'basic' | 'ai' | 'auto',
    provider?: 'anthropic' | 'openai',
    bypassCache: boolean = true
  ) => {
    return await extractFile(file, userId, extractionMethod, provider, bypassCache)
  }

  const getFileTypeInfo = (file: File) => {
    const fileName = file.name.toLowerCase()
    const fileType = file.type

    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return {
        type: 'PDF',
        description: 'Supports both basic and AI extraction',
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
    deleteDocument,
    retryExtraction,
    getFileTypeInfo
  }
} 