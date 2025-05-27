"use client"

import { useState, useEffect } from "react"
import { FileText, TrendingUp, Calendar, Search, Filter, Eye, Download, ArrowLeft, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/ui/navigation"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Footer } from "@/components/ui/footer"

interface AnalysisResult {
  id: string
  type: 'RESUME_ANALYSIS'
  createdAt: string
  overallScore?: number
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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
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
        const data = await response.json()
        setAnalyses(data.analyses || [])
        setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 })
      }
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
      const response = await fetch(`/api/user/analysis-history/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Refresh the list
        fetchAnalyses(pagination.page, searchTerm)
      }
    } catch (error) {
      console.error('Error deleting analysis:', error)
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
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resume Analysis History</span>
              <Link href="/">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  New Analysis
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>
              View and manage your resume analysis results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : analyses.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
                <p className="text-gray-600 mb-4">Get started by analyzing your first resume!</p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    Analyze Resume
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={getScoreBadgeVariant(analysis.overallScore)}>
                            Score: {analysis.overallScore || 'N/A'}%
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDate(analysis.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {analysis.data.jobDescription ? 
                            `Job: ${analysis.data.jobDescription.substring(0, 100)}...` : 
                            'Resume analysis'
                          }
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Store analysis data and navigate to analysis page
                            sessionStorage.setItem('analysisResults', JSON.stringify(analysis.data.analysis))
                            sessionStorage.setItem('resumeData', JSON.stringify(analysis.data.resumeData))
                            sessionStorage.setItem('jobDescription', analysis.data.jobDescription || '')
                            router.push('/analysis')
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(analysis.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-gray-600">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
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