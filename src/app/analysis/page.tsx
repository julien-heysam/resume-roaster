"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAlertDialog } from "@/components/ui/alert-dialog"
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  TrendingUp, 
  Target, 
  FileText, 
  Zap,
  ArrowRight,
  Download,
  Share2,
  Sparkles,
  Flame,
  Crown,
  Star,
  XCircle,
  Image,
  ChevronLeft,
  ChevronRight,
  Briefcase
} from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from "next/link"
import { ArrowLeft, ChevronDown, Info } from "lucide-react"
import { useAnalysisActions } from "@/hooks/useAnalysisActions"
import { useSubscription } from "@/hooks/useSubscription"
import { Footer } from "@/components/ui/footer"

interface AnalysisData {
  overallScore: number
  scoreLabel: string
  scoringBreakdown?: {
    skills: number
    experience: number
    achievements: number
    presentation: number
  }
  scoreJustification?: string
  strengths: string[]
  weaknesses: string[]
  suggestions: Array<{
    section: string
    issue: string
    solution: string
    priority: 'high' | 'medium' | 'low'
  }>
  keywordMatch: {
    matched: string[]
    missing: string[]
    matchPercentage?: number
  }
  atsIssues?: string[]
}

export default function AnalysisPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState<any>(null)
  const [jobDescription, setJobDescription] = useState<string | undefined>(undefined)
  const [isGeneratingOptimized, setIsGeneratingOptimized] = useState(false)
  const [cachedExtractionData, setCachedExtractionData] = useState<any>(null)
  const [cacheKey, setCacheKey] = useState<string | null>(null)
  const [isDebugExpanded, setIsDebugExpanded] = useState(false)
  const [pdfImages, setPdfImages] = useState<string[]>([])
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const { downloadReport, shareAnalysis, isDownloading, isSharing } = useAnalysisActions()
  const { subscription } = useSubscription()
  const router = useRouter()
  const { showAlert, AlertDialog } = useAlertDialog()

  // Generate cache key based on analysis data and job description
  const generateCacheKey = (analysis: AnalysisData, resume: any, jobDesc: string) => {
    try {
      // Simple hash function that works in all environments
      const simpleHash = (str: string) => {
        let hash = 0
        if (str.length === 0) return hash.toString(36)
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i)
          hash = ((hash << 5) - hash) + char
          hash = hash & hash // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36)
      }

      const analysisData = JSON.stringify({
        score: analysis.overallScore,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        suggestions: analysis.suggestions.map(s => s.solution),
        keywords: analysis.keywordMatch
      })
      
      const resumeText = typeof resume === 'string' ? resume.slice(0, 200) : 
        (resume?.text || resume?.extractedText || '').slice(0, 200)
      
      const jobText = jobDesc.slice(0, 200)
      
      const analysisHash = simpleHash(analysisData)
      const resumeHash = simpleHash(resumeText)
      const jobHash = simpleHash(jobText)
      
      return `extraction_${analysisHash}_${resumeHash}_${jobHash}`
    } catch (error) {
      console.error('Failed to generate cache key:', error)
      // Fallback to timestamp-based key
      return `extraction_fallback_${Date.now()}`
    }
  }

  // Load cached extraction data
  const loadCachedExtraction = (key: string) => {
    try {
      const cached = localStorage.getItem(key)
      if (cached) {
        const parsedCache = JSON.parse(cached)
        // Check if cache is not older than 24 hours
        const cacheAge = Date.now() - parsedCache.timestamp
        const maxAge = 24 * 60 * 60 * 1000 // 24 hours
        
        if (cacheAge < maxAge) {
          return parsedCache.data
        } else {
          // Remove expired cache
          localStorage.removeItem(key)
        }
      }
    } catch (error) {
      console.error('Failed to load cached extraction:', error)
    }
    return null
  }

  // Save extraction data to cache
  const saveCachedExtraction = (key: string, data: any) => {
    try {
      const cacheData = {
        data: data,
        timestamp: Date.now(),
        version: '1.0'
      }
      localStorage.setItem(key, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Failed to save extraction to cache:', error)
    }
  }

  // Clean up old cache entries to prevent localStorage bloat
  const cleanupOldCaches = () => {
    try {
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      const keysToRemove: string[] = []
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('extraction_')) {
          try {
            const cached = localStorage.getItem(key)
            if (cached) {
              const parsedCache = JSON.parse(cached)
              const cacheAge = Date.now() - parsedCache.timestamp
              
              if (cacheAge > maxAge) {
                keysToRemove.push(key)
              }
            }
          } catch (error) {
            // If we can't parse it, it's probably corrupted, remove it
            keysToRemove.push(key)
          }
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      if (keysToRemove.length > 0) {
        console.log(`Cleaned up ${keysToRemove.length} old extraction cache entries`)
      }
    } catch (error) {
      console.error('Failed to cleanup old caches:', error)
    }
  }

  // Handle generating optimized version
  const handleGenerateOptimized = async () => {
    // Check if we have analysis data
    if (!analysisData) {
      showAlert({
        title: "Analysis Data Missing",
        description: "Analysis data not available. Please try analyzing your resume again.",
        type: "warning",
        confirmText: "Go Back",
        onConfirm: () => router.push('/')
      })
      return
    }

    // Check if we have resume data, if not, provide options
    if (!resumeData) {
      showAlert({
        title: "Resume Text Not Found",
        description: "Resume text not found in session. Would you like to go to Resume Optimizer and enter your details manually, or upload and analyze your resume first?",
        type: "warning",
        confirmText: "Go to Resume Optimizer",
        cancelText: "Upload Resume First",
        showCancel: true,
        onConfirm: () => router.push('/resume-optimizer'),
        onCancel: () => router.push('/')
      })
      return
    }

    setIsGeneratingOptimized(true)
    
    try {
      // Prepare resume text - handle different possible formats
      let resumeText = ''
      if (typeof resumeData === 'string') {
        resumeText = resumeData
      } else if (resumeData.text) {
        resumeText = resumeData.text
      } else if (resumeData.extractedText) {
        resumeText = resumeData.extractedText
      } else if (resumeData.content) {
        resumeText = resumeData.content
      } else {
        // If we still don't have text, create a basic structure from analysis
        resumeText = `Resume Analysis Results:
        
Overall Score: ${analysisData.overallScore}/100
Strengths: ${analysisData.strengths.join(', ')}
Areas for Improvement: ${analysisData.weaknesses.join(', ')}

Note: Original resume text was not available, using analysis data for optimization.`
      }

      // Generate cache key for this specific combination
      const currentCacheKey = generateCacheKey(analysisData, resumeData, jobDescription || '')
      
      // Check if we have cached data for this exact combination
      let extractedData = loadCachedExtraction(currentCacheKey)
      
      if (extractedData) {
        console.log('Using cached extraction data - skipping AI processing')
        
        // Show user that we're using cached data
        showAlert({
          title: "🚀 Cached Data Found!",
          description: "Found cached optimization data for this analysis! This will be much faster than re-processing. Would you like to use the cached data or re-process with AI?",
          type: "info",
          confirmText: "Use Cached Data (Instant)",
          cancelText: "Re-process with AI",
          showCancel: true,
          onConfirm: () => {
            // Continue with cached data
            proceedWithExtractedData(extractedData)
          },
          onCancel: () => {
            // User wants fresh processing, remove cache and continue
            localStorage.removeItem(currentCacheKey)
            proceedWithFreshExtraction(resumeText, currentCacheKey)
          }
        })
        return
      }
      
      // No cached data, proceed with fresh extraction
      await proceedWithFreshExtraction(resumeText, currentCacheKey)
      
    } catch (error) {
      console.error('Error generating optimized version:', error)
      
      // Provide more helpful error messages
      let errorMessage = 'Failed to generate optimized version.'
      
      if (error instanceof Error) {
        if (error.message.includes('Authentication required')) {
          errorMessage = 'Please sign in to use the AI optimization feature.'
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'AI service is busy. Please try again in a few minutes.'
        } else if (error.message.includes('API key')) {
          errorMessage = 'AI service is temporarily unavailable. Please try again later.'
        } else {
          errorMessage = error.message
        }
      }
      
      showAlert({
        title: "Optimization Failed",
        description: `${errorMessage}\n\nWould you like to go to Resume Optimizer to enter your details manually instead?`,
        type: "error",
        confirmText: "Go to Resume Optimizer",
        cancelText: "Try Again Later",
        showCancel: true,
        onConfirm: () => router.push('/resume-optimizer')
      })
    } finally {
      setIsGeneratingOptimized(false)
    }
  }

  // Helper function to proceed with extracted data
  const proceedWithExtractedData = (extractedData: any) => {
    console.log('Resume data ready:', extractedData)
    
    // Store the extracted data in session storage
    sessionStorage.setItem('extractedResumeData', JSON.stringify(extractedData))
    if (jobDescription) {
      sessionStorage.setItem('analysisJobDescription', jobDescription)
    }
    
    // Redirect to Resume Optimizer with prefilled parameter
    router.push('/resume-optimizer?prefilled=true')
  }

  // Helper function to proceed with fresh extraction
  const proceedWithFreshExtraction = async (resumeText: string, currentCacheKey: string) => {
    console.log('No cached data found - running AI extraction...')
    
    // Call the extraction API
    const response = await fetch('/api/extract-resume-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeText: resumeText,
        analysisData: analysisData,
        jobDescription: jobDescription || ''
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to extract resume data')
    }

    const extractedData = result.data
    
    // Cache the result for future use
    saveCachedExtraction(currentCacheKey, extractedData)
    console.log('Extraction completed and cached for future use')
    
    // Proceed with the extracted data
    proceedWithExtractedData(extractedData)
  }

  // Handle PDF image modal
  const handleOpenImageModal = () => {
    if (pdfImages.length > 0) {
      setCurrentImageIndex(0)
      setShowImageModal(true)
    }
  }

  const handleCloseImageModal = () => {
    setShowImageModal(false)
    setCurrentImageIndex(0)
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : pdfImages.length - 1)
  }

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev < pdfImages.length - 1 ? prev + 1 : 0)
  }

  useEffect(() => {
    // Clean up old cache entries first
    cleanupOldCaches()
    
    // Load analysis results from sessionStorage
    const storedAnalysis = sessionStorage.getItem('analysisResults')
    const storedResumeData = sessionStorage.getItem('resumeData')
    const storedJobDescription = sessionStorage.getItem('jobDescription')
    const storedPdfImages = sessionStorage.getItem('pdfImages')
    
    if (storedResumeData) {
      try {
        setResumeData(JSON.parse(storedResumeData))
      } catch (error) {
        console.error('Failed to parse resume data:', error)
      }
    }
    
    if (storedJobDescription) {
      setJobDescription(storedJobDescription)
    }
    
    if (storedPdfImages) {
      try {
        setPdfImages(JSON.parse(storedPdfImages))
      } catch (error) {
        console.error('Failed to parse PDF images:', error)
      }
    }
    
    if (storedAnalysis) {
      try {
        const analysis = JSON.parse(storedAnalysis)
        setAnalysisData(analysis)
      } catch (error) {
        console.error('Failed to parse analysis results:', error)
        // Fall back to mock data if parsing fails
        setAnalysisData(getMockData())
        // Also set mock resume data for demo purposes
        if (!storedResumeData) {
          setResumeData(getMockResumeData())
        }
      }
    } else {
      // Use mock data if no real analysis is available
      setAnalysisData(getMockData())
      // Also set mock resume data for demo purposes
      if (!storedResumeData) {
        setResumeData(getMockResumeData())
      }
    }
    
    setIsLoading(false)
  }, [])

  // Generate cache key when data is available
  useEffect(() => {
    if (analysisData && resumeData) {
      const key = generateCacheKey(analysisData, resumeData, jobDescription || '')
      setCacheKey(key)
      
      // Check if we have cached extraction data
      const cached = loadCachedExtraction(key)
      if (cached) {
        setCachedExtractionData(cached)
        console.log('Found cached extraction data for current analysis')
      }
    }
  }, [analysisData, resumeData, jobDescription])

  const getMockResumeData = () => ({
    text: `John Doe
Software Engineer
john.doe@email.com | (555) 123-4567 | San Francisco, CA
LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years developing web applications. Skilled in JavaScript, React, and Node.js. Looking for senior developer opportunities.

EXPERIENCE
Software Engineer | TechCorp Inc. | San Francisco, CA | 2020 - Present
• Developed web applications using React and Node.js
• Worked with team of 5 developers
• Fixed bugs and implemented new features
• Used Git for version control

Junior Developer | StartupXYZ | San Francisco, CA | 2019 - 2020
• Built websites using HTML, CSS, and JavaScript
• Learned new technologies
• Participated in code reviews

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2019
GPA: 3.5

SKILLS
JavaScript, React, Node.js, HTML, CSS, Git, MongoDB, Express.js`,
    extractedText: `John Doe - Software Engineer with 5+ years experience in web development using JavaScript, React, and Node.js. Currently at TechCorp Inc. developing applications and working with development teams.`,
    fileName: 'demo-resume.pdf'
  })

  const getMockData = (): AnalysisData => ({
    overallScore: 67,
    scoreLabel: "Needs Improvement",
    scoringBreakdown: {
      skills: 30,        // 30/40 = 75%
      experience: 19,    // 19/30 = 63%
      achievements: 9,   // 9/20 = 45%
      presentation: 8    // 8/10 = 80%
    },
    scoreJustification: "Your resume shows solid technical skills and professional presentation, but lacks quantified achievements and specific metrics that would make you stand out to hiring managers. The experience section needs more impact-driven content.",
    strengths: [
      "Strong technical skills section with relevant technologies",
      "Clear employment history with specific dates",
      "Good use of action verbs in bullet points",
      "Professional email address and contact information"
    ],
    weaknesses: [
      "Missing quantifiable achievements and metrics",
      "Generic summary that doesn't stand out",
      "No keywords matching the target job posting",
      "Inconsistent formatting in bullet points",
      "Missing industry-specific certifications"
    ],
    suggestions: [
      {
        section: "Summary",
        issue: "Generic and forgettable summary statement",
        solution: "Craft a compelling summary that highlights your unique value proposition with specific achievements",
        priority: "high"
      },
      {
        section: "Experience", 
        issue: "Bullet points lack impact and metrics",
        solution: "Transform weak bullet points into achievement-focused statements with quantifiable results",
        priority: "high"
      },
      {
        section: "Skills",
        issue: "Missing key technologies from job posting",
        solution: "Add React, TypeScript, and AWS to match job requirements",
        priority: "medium"
      },
      {
        section: "Format",
        issue: "ATS compatibility issues detected",
        solution: "Simplify formatting and use standard section headers for better parsing",
        priority: "low"
      }
    ],
    keywordMatch: {
      matched: ["JavaScript", "Node.js", "API", "Database", "Git"],
      missing: ["React", "TypeScript", "AWS", "Docker", "Kubernetes", "CI/CD"],
      matchPercentage: 45
    }
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600" 
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Strong Resume"
    if (score >= 60) return "Needs Improvement"
    return "Needs Major Work"
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default: return <AlertTriangle className="h-4 w-4 text-blue-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No analysis data available.</p>
          <Link href="/">
            <Button>Upload Resume</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 text-gray-600 hover:text-orange-500 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Upload</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => shareAnalysis(analysisData, undefined, resumeData, jobDescription, pdfImages)}
                disabled={isSharing || !analysisData}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {isSharing ? 'Creating Link...' : 'Share Results'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => downloadReport(analysisData, resumeData, jobDescription)}
                disabled={isDownloading || !analysisData}
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? 'Generating...' : 'Download Report'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Score Overview */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Resume Roast Complete! 🔥</h1>
                  <p className="text-lg opacity-90">Here's your brutally honest feedback</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold mb-2">{analysisData.overallScore}%</div>
                  <div className="text-lg">{analysisData.scoreLabel || getScoreLabel(analysisData.overallScore)}</div>
                </div>
              </div>
              <div className="mt-6">
                <Progress value={analysisData.overallScore} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </div>

{/* Scoring Breakdown */}
{analysisData.scoringBreakdown && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Score Breakdown</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-cyan-100 to-teal-200 border-cyan-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="p-3 bg-cyan-500/20 rounded-lg w-fit mx-auto mb-3">
                      <Zap className="h-8 w-8 text-cyan-600" />
                    </div>
                    <p className="text-sm font-medium text-cyan-700 mb-2">Skills</p>
                    <div className="relative">
                      <div className="text-3xl font-bold text-cyan-800 mb-2">{Math.round((analysisData.scoringBreakdown.skills / 40) * 100)}%</div>
                      <Progress value={Math.round((analysisData.scoringBreakdown.skills / 40) * 100)} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-100 to-purple-200 border-indigo-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="p-3 bg-indigo-500/20 rounded-lg w-fit mx-auto mb-3">
                      <CheckCircle className="h-8 w-8 text-indigo-600" />
                    </div>
                    <p className="text-sm font-medium text-indigo-700 mb-2">Experience</p>
                    <div className="relative">
                      <div className="text-3xl font-bold text-indigo-800 mb-2">{Math.round((analysisData.scoringBreakdown.experience / 30) * 100)}%</div>
                      <Progress value={Math.round((analysisData.scoringBreakdown.experience / 30) * 100)} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-100 to-orange-200 border-yellow-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="p-3 bg-yellow-500/20 rounded-lg w-fit mx-auto mb-3">
                      <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    </div>
                    <p className="text-sm font-medium text-yellow-700 mb-2">Achievements</p>
                    <div className="relative">
                      <div className="text-3xl font-bold text-yellow-800 mb-2">{Math.round((analysisData.scoringBreakdown.achievements / 20) * 100)}%</div>
                      <Progress value={Math.round((analysisData.scoringBreakdown.achievements / 20) * 100)} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-100 to-rose-200 border-pink-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="p-3 bg-pink-500/20 rounded-lg w-fit mx-auto mb-3">
                      <XCircle className="h-8 w-8 text-pink-600" />
                    </div>
                    <p className="text-sm font-medium text-pink-700 mb-2">Presentation</p>
                    <div className="relative">
                      <div className="text-3xl font-bold text-pink-800 mb-2">{Math.round((analysisData.scoringBreakdown.presentation / 10) * 100)}%</div>
                      <Progress value={Math.round((analysisData.scoringBreakdown.presentation / 10) * 100)} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {/* Original Resume Section */}
        {pdfImages.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Image className="h-6 w-6 text-blue-500" />
                <span>Original Resume</span>
              </CardTitle>
              <CardDescription>
                Your uploaded resume for reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleOpenImageModal}
                  className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100"
                >
                  <Image className="h-4 w-4 mr-2" />
                  View Resume ({pdfImages.length} page{pdfImages.length > 1 ? 's' : ''})
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Job Description Section */}
        {jobDescription && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-6 w-6 text-purple-500" />
                <span>Target Job Description</span>
              </CardTitle>
              <CardDescription>
                The job posting you're targeting with this analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {jobDescription}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span>What's Working</span>
                </CardTitle>
                <CardDescription>
                  These are the strong points we found in your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 prose prose-sm max-w-none text-gray-700 [&>p]:mb-0 [&>p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-900">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {strength}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <XCircle className="h-6 w-6 text-red-500" />
                  <span>The Brutal Truth</span>
                </CardTitle>
                <CardDescription>
                  Areas that need immediate attention (this is where the roasting happens)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData.weaknesses.map((weakness, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <XCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                      <div className="flex-1 prose prose-sm max-w-none text-gray-700 [&>p]:mb-0 [&>p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-900">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {weakness}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Improvement Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-yellow-500" />
                  <span>How to Fix It</span>
                </CardTitle>
                <CardDescription>
                  Specific, actionable suggestions to transform your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData.suggestions.map((suggestion, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{suggestion.section}</h4>
                        <div className="flex items-center space-x-1">
                          {getPriorityIcon(suggestion.priority)}
                          <span className="text-sm capitalize text-gray-600">{suggestion.priority} Priority</span>
                        </div>
                      </div>
                      <div className="text-red-600 text-sm mb-2">
                        <strong>Issue:</strong>
                        <div className="prose prose-sm max-w-none mt-1 [&>p]:mb-0 [&>p]:leading-relaxed [&_strong]:font-semibold">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {suggestion.issue}
                          </ReactMarkdown>
                        </div>
                      </div>
                      <div className="text-green-600 text-sm">
                        <strong>Solution:</strong>
                        <div className="prose prose-sm max-w-none mt-1 [&>p]:mb-0 [&>p]:leading-relaxed [&_strong]:font-semibold">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {suggestion.solution}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Justification */}
            {analysisData.scoreJustification && (
              <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="text-orange-700">Score Explanation</span>
                  </CardTitle>
                  <CardDescription>
                    Why your resume received this score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white/70 p-4 rounded-lg border border-orange-200">
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {analysisData.scoreJustification}
                      </ReactMarkdown>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Keyword Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Keyword Match</CardTitle>
                <CardDescription>
                  How well your resume matches the job posting
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Keyword Match Percentage */}
                {analysisData.keywordMatch.matchPercentage !== undefined && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Match Rate</span>
                      <span className={`text-2xl font-bold ${
                        analysisData.keywordMatch.matchPercentage >= 70 
                          ? 'text-green-600' 
                          : analysisData.keywordMatch.matchPercentage >= 50
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}>
                        {analysisData.keywordMatch.matchPercentage}%
                      </span>
                    </div>
                    <Progress 
                      value={analysisData.keywordMatch.matchPercentage} 
                      className={`h-2 ${
                        analysisData.keywordMatch.matchPercentage >= 70 
                          ? '[&>*]:bg-green-600' 
                          : analysisData.keywordMatch.matchPercentage >= 50
                            ? '[&>*]:bg-yellow-600'
                            : '[&>*]:bg-red-600'
                      }`}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      {analysisData.keywordMatch.matchPercentage >= 70 
                        ? 'Excellent keyword optimization!' 
                        : analysisData.keywordMatch.matchPercentage >= 50
                          ? 'Good match, but room for improvement'
                          : 'Needs significant keyword optimization'
                      }
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Matched Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.keywordMatch.matched.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.keywordMatch.missing.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ATS Issues */}
            {analysisData.atsIssues && analysisData.atsIssues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>ATS Compatibility</CardTitle>
                  <CardDescription>
                    Issues that might prevent ATS systems from parsing your resume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisData.atsIssues.map((issue, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                        <div className="flex-1 prose prose-sm max-w-none text-gray-700 [&>p]:mb-0 [&>p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-900">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {issue}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Items */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Next steps to improve your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium" 
                    size="sm" 
                    onClick={handleGenerateOptimized}
                    disabled={isGeneratingOptimized}
                  >
                    {isGeneratingOptimized ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : cachedExtractionData ? (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Optimized Version (Instant)
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Optimized Version
                      </>
                    )}
                  </Button>
                  
                  {/* Debug Panel */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setIsDebugExpanded(!isDebugExpanded)}
                      className="w-full px-3 py-2 flex items-center justify-between text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Info className="h-3 w-3" />
                        <span>System Status</span>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            analysisData && resumeData ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                          <span className="text-gray-500">
                            {cachedExtractionData ? 'Cached' : 'Ready'}
                          </span>
                        </div>
                      </div>
                      {isDebugExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </button>
                    
                    {isDebugExpanded && (
                      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50/50">
                        <div className="space-y-2">
                          {/* Data Status Grid */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Analysis</span>
                              <span className={`font-medium ${analysisData ? 'text-green-600' : 'text-red-600'}`}>
                                {analysisData ? '✓' : '✗'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Resume</span>
                              <span className={`font-medium ${resumeData ? 'text-green-600' : 'text-red-600'}`}>
                                {resumeData ? '✓' : '✗'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Job Desc</span>
                              <span className={`font-medium ${jobDescription ? 'text-green-600' : 'text-gray-400'}`}>
                                {jobDescription ? '✓' : '○'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Cache</span>
                              <span className={`font-medium ${cachedExtractionData ? 'text-blue-600' : 'text-gray-400'}`}>
                                {cachedExtractionData ? '⚡' : '○'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Resume Type */}
                          {resumeData && (
                            <div className="pt-2 border-t border-gray-200">
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">Format:</span> {
                                  typeof resumeData === 'string' ? 'Plain Text' : 
                                  resumeData.text ? 'Structured (text)' : 
                                  resumeData.extractedText ? 'Structured (extracted)' : 
                                  'Unknown'
                                }
                              </div>
                            </div>
                          )}
                          
                          {/* Cache Management */}
                          {cacheKey && cachedExtractionData && (
                            <div className="pt-2 border-t border-gray-200">
                              <button 
                                onClick={() => {
                                  if (cacheKey) {
                                    showAlert({
                                      title: "Clear Cache",
                                      description: "Clear cached extraction data? Next optimization will be slower but fresh.",
                                      type: "warning",
                                      confirmText: "Clear Cache",
                                      cancelText: "Keep Cache",
                                      showCancel: true,
                                      onConfirm: () => {
                                        localStorage.removeItem(cacheKey)
                                        setCachedExtractionData(null)
                                      }
                                    })
                                  }
                                }}
                                className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                              >
                                Clear Cache
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    Get Cover Letter
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    LinkedIn Optimization
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Interview Prep
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade Prompt */}
            {(!subscription || subscription.tier === 'FREE' || subscription.tier === 'PRO') && (
              <Card className="bg-gradient-to-b from-orange-50 to-red-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-700">
                    {!subscription || subscription.tier === 'FREE' 
                      ? 'Unlock Premium Features' 
                      : 'Upgrade to Enterprise'
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    {!subscription || subscription.tier === 'FREE' ? (
                      <>
                        <li>• Unlimited resume roasts</li>
                        <li>• AI-powered rewriting</li>
                        <li>• ATS optimization</li>
                        <li>• Cover letter generation</li>
                      </>
                    ) : (
                      <>
                        <li>• Team collaboration tools</li>
                        <li>• API access</li>
                        <li>• Custom branding</li>
                        <li>• Bulk processing</li>
                        <li>• Advanced analytics</li>
                        <li>• Dedicated account manager</li>
                      </>
                    )}
                  </ul>
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => router.push('/pricing')}
                  >
                    {!subscription || subscription.tier === 'FREE' 
                      ? 'Upgrade to Premium' 
                      : 'Upgrade to Enterprise'
                    }
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Alert Dialog */}
      {AlertDialog}

      {/* PDF Images Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Resume Preview - Page {currentImageIndex + 1} of {pdfImages.length}</span>
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative flex-1 p-6 pt-2">
            {pdfImages.length > 0 && (
              <div className="relative">
                {/* Main Image */}
                <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 min-h-[400px]">
                  <img
                    src={`data:image/png;base64,${pdfImages[currentImageIndex]}`}
                    alt={`Resume Page ${currentImageIndex + 1}`}
                    className="max-w-full max-h-[60vh] object-contain shadow-lg rounded"
                  />
                </div>
                
                {/* Navigation Arrows */}
                {pdfImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {/* Page Indicators */}
                {pdfImages.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {pdfImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex 
                            ? 'bg-blue-600' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
} 