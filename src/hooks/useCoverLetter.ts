import { OPENAI_MODELS } from '@/lib/constants'
import { useState } from 'react'
import { toast } from 'sonner'

interface CoverLetterData {
  coverLetter: string
  tone: string
  wordCount: number
  cached?: boolean
  usageCount?: number
  metadata: {
    tokensUsed?: number
    processingTime: number
    estimatedCost?: number
    fromCache?: boolean
  }
}

interface UseCoverLetterReturn {
  generateCoverLetter: (resumeData: any, jobDescription: string, analysisData?: any, tone?: string, analysisId?: string, llm?: string) => Promise<CoverLetterData | null>
  isGenerating: boolean
  error: string | null
}

export function useCoverLetter(): UseCoverLetterReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateCoverLetter = async (
    resumeData: any,
    jobDescription: string,
    analysisData?: any,
    tone: string = 'professional',
    analysisId?: string,
    llm: string = OPENAI_MODELS.MINI
  ): Promise<CoverLetterData | null> => {
    if (!resumeData || !jobDescription) {
      const errorMsg = 'Resume data and job description are required'
      setError(errorMsg)
      toast.error(errorMsg)
      return null
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          jobDescription,
          analysisData,
          tone,
          analysisId,
          llm
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate cover letter')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate cover letter')
      }

      const successMessage = result.data.cached 
        ? `Cover letter retrieved from cache (used ${result.data.usageCount} times)!`
        : 'Cover letter generated successfully!'
      
      toast.success(successMessage)
      return result.data

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      toast.error(`Failed to generate cover letter: ${errorMessage}`)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generateCoverLetter,
    isGenerating,
    error
  }
} 