"use client"

import { useState, useEffect, Suspense } from "react"
import { FileText, TrendingUp, Calendar, Search, Filter, Eye, Download, ArrowLeft, Trash2, ExternalLink, ChevronDown, ChevronUp, MoreHorizontal, Star, Clock, Target, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/ui/navigation"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Footer } from "@/components/ui/footer"
import { toast } from 'sonner'

interface AnalysisResult {
  id: string
  type: 'RESUME_ANALYSIS'
  createdAt: string
  overallScore?: number
  title?: string
  documentId?: string
  pdfImages?: string[]
  jobDescription?: string
  data: {
    resumeData?: any
    jobDescription?: string
    analysis?: any
  }
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

function DashboardContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  // Handle Stripe success redirect
  useEffect(() => {
    const success = searchParams.get('success')
    const tier = searchParams.get('tier')
    const sessionId = searchParams.get('session_id')
    
    if (success === 'true' && tier) {
      toast.success(`🎉 Welcome to ${tier} plan! Your subscription is now active.`, {
        duration: 5000,
      })
      
      // Clean up URL parameters
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      url.searchParams.delete('tier')
      url.searchParams.delete('session_id')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  // Fetch analysis history
  const fetchAnalyses = async (page = 1, search = '') => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        type: 'RESUME_ANALYSIS'
      })
      
      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`/api/user/analysis-history?${params}`)
      if (response.ok) {
        const result = await response.json()
        
        // Transform the API response to match the expected format
        const transformedAnalyses = (result.data || []).map((item: any) => ({
          id: item.id,
          type: 'RESUME_ANALYSIS',
          createdAt: item.createdAt,
          overallScore: item.overallScore,
          title: item.title,
          pdfImages: item.pdfImages,
          jobDescription: item.jobDescription,
          data: {
            resumeData: item.document,
            jobDescription: item.jobDescription || '',
            analysis: item.analysisData
          }
        }))
        
        setAnalyses(transformedAnalyses)
        setPagination(result.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
      } else {
        console.error('Failed to fetch analyses:', response.status, response.statusText)
        setAnalyses([])
      }
    } catch (error) {
      console.error('Error fetching analyses:', error)
      setAnalyses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAnalyses()
    }
  }, [status])

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchAnalyses(1, searchTerm)
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchAnalyses(newPage, searchTerm)
  }

  // Delete analysis
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return
    
    try {
      setDeletingId(id)
      const response = await fetch(`/api/user/analysis-history/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Refresh the list
        fetchAnalyses(pagination.page, searchTerm)
      } else {
        const errorData = await response.json()
        console.error('Delete failed:', errorData)
        alert('Failed to delete analysis. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting analysis:', error)
      alert('Failed to delete analysis. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  // Get score color
  const getScoreColor = (score?: number) => {
    if (!score) return 'text-gray-500'
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get score badge variant
  const getScoreBadgeVariant = (score?: number) => {
    if (!score) return 'secondary'
    if (score >= 80) return 'default'
    if (score >= 60) return 'secondary'
    return 'destructive'
  }

  // Get keyword match status
  const getKeywordMatchStatus = (percentage?: number) => {
    if (!percentage) return { text: 'No data available', color: 'text-gray-500' }
    if (percentage >= 70) return { text: 'Excellent keyword optimization', color: 'text-green-600' }
    if (percentage >= 40) return { text: 'Good match, room for improvement', color: 'text-yellow-600' }
    return { text: 'Needs significant keyword optimization', color: 'text-red-600' }
  }

  // Format category names
  const formatCategoryName = (category: string) => {
    return category
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  // Toggle card expansion
  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex flex-col">
      {/* Navigation */}
      <Navigation currentPage="dashboard" />

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
          
          <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-700">This Month</p>
                  <p className="text-3xl font-bold text-purple-800">
                    {analyses.filter(a => {
                      const analysisDate = new Date(a.createdAt)
                      const now = new Date()
                      return analysisDate.getMonth() === now.getMonth() && 
                             analysisDate.getFullYear() === now.getFullYear()
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-100 to-red-200 border-orange-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-700">Best Score</p>
                  <p className="text-3xl font-bold text-orange-800">
                    {analyses.length > 0 
                      ? Math.max(...analyses.map(a => a.overallScore || 0))
                      : 0
                    }%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search analyses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/90 backdrop-blur-sm border-orange-200 focus:border-orange-400 shadow-sm"
                />
              </div>
            </div>
            <Button 
              type="submit"
              variant="outline" 
              size="sm"
              className="bg-white/90 backdrop-blur-sm border-orange-200 hover:bg-orange-50 shadow-sm"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchTerm('')
                fetchAnalyses(1, '')
              }}
              className="bg-white/90 backdrop-blur-sm border-orange-200 hover:bg-orange-50 shadow-sm"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </form>
        </div>

        {/* Analysis History */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Resume Analysis History</h2>
              <p className="text-gray-600 mt-1">View and manage your resume analysis results</p>
            </div>
            <div className="flex items-center space-x-3">
              {analyses.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (expandedCards.size === analyses.length) {
                      setExpandedCards(new Set())
                    } else {
                      setExpandedCards(new Set(analyses.map(a => a.id)))
                    }
                  }}
                  className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50 shadow-sm"
                >
                  {expandedCards.size === analyses.length ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Collapse All
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Expand All
                    </>
                  )}
                </Button>
              )}
              <Link href="/">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg">
                  <FileText className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </Link>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-lg">
              <CardContent className="p-12">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <span className="ml-3 text-gray-600">Loading your analyses...</span>
                </div>
              </CardContent>
            </Card>
          ) : analyses.length === 0 ? (
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-lg">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No analyses yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">Get started by analyzing your first resume and see how it matches with job descriptions!</p>
                  <Link href="/">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg">
                      <FileText className="h-4 w-4 mr-2" />
                      Analyze Resume
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => {
                const isExpanded = expandedCards.has(analysis.id)
                
                return (
                  <Card key={analysis.id} className="bg-white/95 backdrop-blur-sm border border-gray-200/80 hover:border-orange-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      {/* Main Content */}
                      <div className="p-6">
                        {/* Header Row */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <Badge 
                                variant={getScoreBadgeVariant(analysis.overallScore)} 
                                className="text-sm font-semibold px-3 py-1"
                              >
                                {analysis.overallScore || 'N/A'}%
                              </Badge>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatDate(analysis.createdAt)}
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                              {analysis.title || 'Resume Analysis'}
                            </h3>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCardExpansion(analysis.id)}
                              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (!analysis.data.analysis) {
                                  alert('Analysis data is not available for this item.')
                                  return
                                }
                                sessionStorage.setItem('analysisResults', JSON.stringify(analysis.data.analysis))
                                sessionStorage.setItem('resumeData', JSON.stringify(analysis.data.resumeData))
                                sessionStorage.setItem('jobDescription', analysis.data.jobDescription || '')
                                
                                // Store analysis ID and document ID for proper caching
                                sessionStorage.setItem('analysisId', analysis.id)
                                if (analysis.documentId) {
                                  sessionStorage.setItem('documentId', analysis.documentId)
                                } else {
                                  sessionStorage.removeItem('documentId')
                                }
                                
                                // Store PDF images if available
                                if (analysis.pdfImages && analysis.pdfImages.length > 0) {
                                  sessionStorage.setItem('pdfImages', JSON.stringify(analysis.pdfImages))
                                } else {
                                  sessionStorage.removeItem('pdfImages')
                                }
                                
                                router.push('/analysis')
                              }}
                              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(analysis.id)}
                              disabled={deletingId === analysis.id}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Quick Stats Grid */}
                        {analysis.data.analysis && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                              <div className="flex items-center justify-between mb-2">
                                <Star className="h-5 w-5 text-green-600" />
                                <span className="text-2xl font-bold text-green-700">
                                  {analysis.data.analysis.strengths?.length || 0}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-green-700">Strengths</div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
                              <div className="flex items-center justify-between mb-2">
                                <Target className="h-5 w-5 text-red-600" />
                                <span className="text-2xl font-bold text-red-700">
                                  {analysis.data.analysis.weaknesses?.length || 0}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-red-700">Issues</div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                              <div className="flex items-center justify-between mb-2">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                <span className="text-2xl font-bold text-blue-700">
                                  {analysis.data.analysis.suggestions?.length || 0}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-blue-700">Tips</div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                              <div className="flex items-center justify-between mb-2">
                                <Search className="h-5 w-5 text-orange-600" />
                                <span className="text-2xl font-bold text-orange-700">
                                  {analysis.data.analysis.keywordMatch?.matchPercentage || 0}%
                                </span>
                              </div>
                              <div className="text-sm font-medium text-orange-700">Match</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Expandable Content */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/50">
                          <div className="p-6 space-y-8">
                            {/* Detailed Score Breakdown */}
                            {analysis.data.analysis?.scoringBreakdown ? (
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                  <TrendingUp className="h-5 w-5 mr-2 text-gray-600" />
                                  Score Breakdown
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  {Object.entries(analysis.data.analysis.scoringBreakdown).map(([category, score]) => (
                                    <div key={category} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                                      <div className="text-sm font-medium text-gray-700 mb-3">
                                        {formatCategoryName(category)}
                                      </div>
                                      <div className="text-3xl font-bold text-gray-900 mb-3">
                                        {String(score)}%
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className={`h-2 rounded-full transition-all duration-500 ${
                                            Number(score) >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                            Number(score) >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                                            'bg-gradient-to-r from-red-500 to-pink-500'
                                          }`}
                                          style={{ width: `${score}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                  <TrendingUp className="h-5 w-5 mr-2 text-gray-600" />
                                  Score Breakdown
                                </h4>
                                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FileText className="h-6 w-6 text-gray-400" />
                                  </div>
                                  <p className="text-gray-600">Detailed score breakdown not available</p>
                                </div>
                              </div>
                            )}

                            {/* Keyword Match Section */}
                            {analysis.data.analysis?.keywordMatch ? (
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                  <Search className="h-5 w-5 mr-2 text-gray-600" />
                                  Keyword Match Analysis
                                </h4>
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                  <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium text-gray-700">Resume-Job Match Rate</span>
                                    <span className="text-lg font-bold text-gray-900">
                                      {analysis.data.analysis.keywordMatch.matchPercentage}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                                    <div 
                                      className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-700"
                                      style={{ width: `${analysis.data.analysis.keywordMatch.matchPercentage}%` }}
                                    ></div>
                                  </div>
                                  <p className={`text-sm font-medium ${getKeywordMatchStatus(analysis.data.analysis.keywordMatch.matchPercentage).color}`}>
                                    {getKeywordMatchStatus(analysis.data.analysis.keywordMatch.matchPercentage).text}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                  <Search className="h-5 w-5 mr-2 text-gray-600" />
                                  Keyword Match Analysis
                                </h4>
                                <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Search className="h-6 w-6 text-gray-400" />
                                  </div>
                                  <p className="text-gray-600">Keyword analysis not available</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={pagination.page <= 1}
                          className="bg-white hover:bg-gray-50 border-gray-300"
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={pagination.page >= pagination.totalPages}
                          className="bg-white hover:bg-gray-50 border-gray-300"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
} 