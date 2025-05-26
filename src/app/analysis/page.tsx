"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Download, Share2, AlertTriangle, CheckCircle, XCircle, Zap } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAnalysisActions } from "@/hooks/useAnalysisActions"

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
  
  const { downloadReport, shareAnalysis, isDownloading, isSharing } = useAnalysisActions()

  useEffect(() => {
    // Load analysis results from sessionStorage
    const storedAnalysis = sessionStorage.getItem('analysisResults')
    const storedResumeData = sessionStorage.getItem('resumeData')
    const storedJobDescription = sessionStorage.getItem('jobDescription')
    
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
    
    if (storedAnalysis) {
      try {
        const analysis = JSON.parse(storedAnalysis)
        setAnalysisData(analysis)
      } catch (error) {
        console.error('Failed to parse analysis results:', error)
        // Fall back to mock data if parsing fails
        setAnalysisData(getMockData())
      }
    } else {
      // Use mock data if no real analysis is available
      setAnalysisData(getMockData())
    }
    
    setIsLoading(false)
  }, [])

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
                onClick={() => shareAnalysis(analysisData)}
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
                  <Button className="w-full" size="sm">
                    Generate Optimized Version
                  </Button>
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
            <Card className="bg-gradient-to-b from-orange-50 to-red-50 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-700">Unlock Premium Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li>• Unlimited resume roasts</li>
                  <li>• AI-powered rewriting</li>
                  <li>• ATS optimization</li>
                  <li>• Cover letter generation</li>
                </ul>
                <Button className="w-full" size="sm">
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 