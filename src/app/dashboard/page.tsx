'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Search, 
  Filter,
  Eye,
  Download,
  Share2,
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/ui/footer'
import { useAnalysisActions } from '@/hooks/useAnalysisActions'

interface AnalysisHistoryItem {
  id: string
  title: string
  createdAt: string
  completedAt: string | null
  status: string
  totalCost: number
  totalTokensUsed: number
  provider: string
  model: string
  document: {
    id: string
    filename: string
    originalSize: number
    wordCount: number
    pageCount: number
    summary: string | null
    processedAt: string
  } | null
  analysisData: any
  overallScore: number | null
  scoreLabel: string | null
  strengthsCount: number
  weaknessesCount: number
  suggestionsCount: number
  atsIssuesCount: number
  keywordMatchPercentage: number | null
  scoringBreakdown: {
    skills: number
    experience: number
    achievements: number
    presentation: number
  } | null
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { downloadReport, shareAnalysis, isDownloading, isSharing } = useAnalysisActions()
  
  const [analyses, setAnalyses] = useState<AnalysisHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
  }, [status, router])

  // Fetch analysis history
  const fetchAnalyses = async (page = 1, search = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        type: 'RESUME_ANALYSIS'
      })
      
      const response = await fetch(`/api/user/analysis-history?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analysis history')
      }
      
      const result = await response.json()
      setAnalyses(result.data)
      setPagination(result.pagination)
    } catch (error) {
      console.error('Error fetching analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAnalyses()
    }
  }, [status])

  const handleViewAnalysis = (analysis: AnalysisHistoryItem) => {
    // Store analysis data in sessionStorage and navigate to analysis page
    if (analysis.analysisData) {
      sessionStorage.setItem('analysisResults', JSON.stringify(analysis.analysisData))
      if (analysis.document) {
        sessionStorage.setItem('resumeData', JSON.stringify({
          filename: analysis.document.filename,
          wordCount: analysis.document.wordCount,
          pageCount: analysis.document.pageCount
        }))
      }
      router.push('/analysis')
    }
  }

  const handleDownload = async (analysis: AnalysisHistoryItem) => {
    if (analysis.analysisData) {
      await downloadReport(
        analysis.analysisData,
        analysis.document ? {
          filename: analysis.document.filename,
          wordCount: analysis.document.wordCount,
          pageCount: analysis.document.pageCount
        } : null,
        undefined // job description not stored separately yet
      )
    }
  }

  const handleShare = async (analysis: AnalysisHistoryItem) => {
    if (analysis.analysisData) {
      await shareAnalysis(analysis.analysisData)
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500'
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      case 'FAILED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Failed
        </Badge>
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="h-3 w-3 mr-1" />
          {status}
        </Badge>
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 text-gray-600 hover:text-orange-500 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-orange-200"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                Welcome, {session?.user?.name || session?.user?.email}
              </span>
              <Button 
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                New Analysis
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-100 to-blue-200 border-blue-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-700">Total Analyses</p>
                  <p className="text-3xl font-bold text-blue-800">{pagination.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-100 to-emerald-200 border-green-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-700">Avg. Score</p>
                  <p className="text-3xl font-bold text-green-800">
                    {analyses.length > 0 
                      ? Math.round(analyses.reduce((sum, a) => sum + (a.overallScore || 0), 0) / analyses.length)
                      : 0
                    }%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-100 to-red-200 border-orange-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <Search className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-700">Avg. Keyword Match</p>
                  <p className="text-3xl font-bold text-orange-800">
                    {analyses.length > 0 
                      ? Math.round(analyses.reduce((sum, a) => sum + (a.keywordMatchPercentage || 0), 0) / analyses.length)
                      : 0
                    }%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-100 to-pink-200 border-purple-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-700">Completed</p>
                  <p className="text-3xl font-bold text-purple-800">
                    {analyses.filter(a => a.status === 'COMPLETED').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        {analyses.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-cyan-100 to-teal-200 border-cyan-200 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-cyan-500/20 rounded-lg w-fit mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-cyan-600" />
                  </div>
                  <p className="text-sm font-medium text-cyan-700 mb-1">Avg. Skills Score</p>
                  <p className="text-3xl font-bold text-cyan-800">
                    {Math.round(analyses.reduce((sum, a) => sum + ((a.scoringBreakdown?.skills || 0) / 40 * 100), 0) / analyses.length)}%
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-indigo-100 to-purple-200 border-indigo-200 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-indigo-500/20 rounded-lg w-fit mx-auto mb-3">
                    <Clock className="h-8 w-8 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-indigo-700 mb-1">Avg. Experience</p>
                  <p className="text-3xl font-bold text-indigo-800">
                    {Math.round(analyses.reduce((sum, a) => sum + ((a.scoringBreakdown?.experience || 0) / 30 * 100), 0) / analyses.length)}%
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-yellow-100 to-orange-200 border-yellow-200 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-yellow-500/20 rounded-lg w-fit mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-yellow-600" />
                  </div>
                  <p className="text-sm font-medium text-yellow-700 mb-1">Avg. Achievements</p>
                  <p className="text-3xl font-bold text-yellow-800">
                    {Math.round(analyses.reduce((sum, a) => sum + ((a.scoringBreakdown?.achievements || 0) / 20 * 100), 0) / analyses.length)}%
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-100 to-pink-200 border-red-200 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="p-3 bg-red-500/20 rounded-lg w-fit mx-auto mb-3">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-sm font-medium text-red-700 mb-1">Avg. ATS Issues</p>
                  <p className="text-3xl font-bold text-red-800">
                    {Math.round(analyses.reduce((sum, a) => sum + (a.atsIssuesCount || 0), 0) / analyses.length)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search analyses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 backdrop-blur-sm border-orange-200 focus:border-orange-400"
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/80 backdrop-blur-sm border-orange-200 hover:bg-orange-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Analysis History */}
        <Card className="bg-white/80 backdrop-blur-sm border-orange-100 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100 border-b border-orange-200">
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <span>Analysis History</span>
              <span className="text-orange-500">🔥</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              View and manage your resume analysis history
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading analyses...</p>
              </div>
            ) : analyses.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No analyses yet</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">Ready to get your resume roasted? Start by uploading your first resume for analysis and see how we can transform it!</p>
                <Button 
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3"
                >
                  Upload Resume
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="bg-gradient-to-r from-white to-orange-50/50 border border-orange-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:from-orange-50/30 hover:to-red-50/30">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-gray-900 text-lg">{analysis.title}</h3>
                          {getStatusBadge(analysis.status)}
                          {analysis.overallScore && (
                            <Badge 
                              variant="outline" 
                              className={`${getScoreColor(analysis.overallScore)} font-semibold px-3 py-1`}
                            >
                              {analysis.overallScore}% - {analysis.scoreLabel}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
                          </div>
                          {analysis.document && (
                            <>
                              <div className="flex items-center space-x-1">
                                <FileText className="h-4 w-4 text-orange-500" />
                                <span className="font-medium">{analysis.document.filename}</span>
                              </div>
                              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                                {formatFileSize(analysis.document.originalSize)}
                              </span>
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                {analysis.document.wordCount} words
                              </span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            {analysis.strengthsCount} strengths
                          </span>
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                            {analysis.weaknessesCount} issues
                          </span>
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                            {analysis.suggestionsCount} suggestions
                          </span>
                          {analysis.atsIssuesCount > 0 && (
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                              {analysis.atsIssuesCount} ATS issues
                            </span>
                          )}
                          {analysis.keywordMatchPercentage !== null && (
                            <span className={`px-3 py-1 rounded-full font-medium ${
                              analysis.keywordMatchPercentage >= 80 
                                ? 'bg-emerald-100 text-emerald-700'
                                : analysis.keywordMatchPercentage >= 60
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                            }`}>
                              {analysis.keywordMatchPercentage}% keywords
                            </span>
                          )}
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                            ${analysis.totalCost.toFixed(4)} cost
                          </span>
                        </div>
                        
                        {/* Scoring Breakdown */}
                        {analysis.scoringBreakdown && (
                          <div className="mt-3 pt-3 border-t border-orange-100">
                            <p className="text-xs text-gray-600 mb-2 font-medium">Score Breakdown:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                              <div className="bg-white/70 px-2 py-1 rounded border border-cyan-200">
                                <span className="text-cyan-700 font-medium">Skills: </span>
                                <span className="text-cyan-800 font-bold">{Math.round((analysis.scoringBreakdown.skills / 40) * 100)}%</span>
                              </div>
                              <div className="bg-white/70 px-2 py-1 rounded border border-indigo-200">
                                <span className="text-indigo-700 font-medium">Experience: </span>
                                <span className="text-indigo-800 font-bold">{Math.round((analysis.scoringBreakdown.experience / 30) * 100)}%</span>
                              </div>
                              <div className="bg-white/70 px-2 py-1 rounded border border-yellow-200">
                                <span className="text-yellow-700 font-medium">Achievements: </span>
                                <span className="text-yellow-800 font-bold">{Math.round((analysis.scoringBreakdown.achievements / 20) * 100)}%</span>
                              </div>
                              <div className="bg-white/70 px-2 py-1 rounded border border-pink-200">
                                <span className="text-pink-700 font-medium">Presentation: </span>
                                <span className="text-pink-800 font-bold">{Math.round((analysis.scoringBreakdown.presentation / 10) * 100)}%</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewAnalysis(analysis)}
                          disabled={!analysis.analysisData}
                          className="border-orange-200 hover:bg-orange-50 text-orange-600 hover:text-orange-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(analysis)}
                          disabled={isDownloading || !analysis.analysisData}
                          className="border-blue-200 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {isDownloading ? 'Downloading...' : 'Download'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare(analysis)}
                          disabled={isSharing || !analysis.analysisData}
                          className="border-green-200 hover:bg-green-50 text-green-600 hover:text-green-700"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          {isSharing ? 'Sharing...' : 'Share'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-orange-100">
                    <p className="text-sm text-gray-600 bg-white/60 px-3 py-2 rounded-full">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} results
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchAnalyses(pagination.page - 1)}
                        disabled={pagination.page === 1 || loading}
                        className="border-orange-200 hover:bg-orange-50"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchAnalyses(pagination.page + 1)}
                        disabled={!pagination.hasMore || loading}
                        className="border-orange-200 hover:bg-orange-50"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
} 