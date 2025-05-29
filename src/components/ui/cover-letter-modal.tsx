"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { Separator } from "./separator"
import { useCoverLetter } from "@/hooks/useCoverLetter"
import { 
  FileText, 
  Download, 
  Copy, 
  Sparkles, 
  Clock, 
  Target,
  Loader,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { toast } from 'sonner'

interface CoverLetterModalProps {
  isOpen: boolean
  onClose: () => void
  resumeData: any
  jobDescription?: string
  analysisData?: any
  analysisId?: string
  onCoverLetterGenerated?: (cached: boolean, usageCount: number) => void
}

export function CoverLetterModal({ 
  isOpen, 
  onClose, 
  resumeData, 
  jobDescription, 
  analysisData, 
  analysisId,
  onCoverLetterGenerated
}: CoverLetterModalProps) {
  const [selectedTone, setSelectedTone] = useState('professional')
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null)
  const [letterMetadata, setLetterMetadata] = useState<any>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)
  const { generateCoverLetter, isGenerating, error } = useCoverLetter()

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal and confident tone' },
    { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and passionate tone' },
    { value: 'conversational', label: 'Conversational', description: 'Friendly but professional tone' }
  ]

  const handleGenerate = async () => {
    if (!jobDescription) {
      toast.error('Job description is required to generate a cover letter')
      return
    }

    const result = await generateCoverLetter(resumeData, jobDescription, analysisData, selectedTone, analysisId)
    if (result) {
      setGeneratedLetter(result.coverLetter)
      setLetterMetadata({
        ...result.metadata,
        cached: result.cached,
        usageCount: result.usageCount,
        wordCount: result.wordCount
      })
      if (onCoverLetterGenerated) {
        onCoverLetterGenerated(result.cached || false, result.usageCount || 1)
      }
    }
  }

  const handleCopy = async () => {
    if (generatedLetter) {
      try {
        await navigator.clipboard.writeText(generatedLetter)
        toast.success('Cover letter copied to clipboard!')
      } catch (err) {
        toast.error('Failed to copy to clipboard')
      }
    }
  }

  const handleDownload = () => {
    if (generatedLetter) {
      const blob = new Blob([generatedLetter], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cover-letter-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Cover letter downloaded!')
    }
  }

  const handleClose = () => {
    setGeneratedLetter(null)
    setLetterMetadata(null)
    onClose()
  }

  const handleDebug = async () => {
    if (!jobDescription) {
      toast.error('Job description is required to debug')
      return
    }

    try {
      const response = await fetch('/api/generate-cover-letter/debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          jobDescription,
          analysisData,
          tone: selectedTone,
          analysisId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get debug info')
      }

      const result = await response.json()
      setDebugInfo(result.debug)
      setShowDebug(true)
      toast.success('Debug info loaded!')
    } catch (err) {
      toast.error('Failed to get debug info')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <span>AI Cover Letter Generator</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 p-1">
          {/* Generation Controls */}
          {!generatedLetter && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span>Generate Your Cover Letter</span>
                </CardTitle>
                <CardDescription>
                  Create a personalized cover letter based on your resume and the job description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tone Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Choose Tone
                  </label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {toneOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} - {option.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Requirements Check */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {resumeData ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">Resume data available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {jobDescription ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">Job description available</span>
                  </div>
                  {analysisData && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Analysis insights will be included</span>
                    </div>
                  )}
                </div>

                {!jobDescription && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      A job description is required to generate a targeted cover letter. 
                      Please go back and add a job description to your analysis.
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !jobDescription || !resumeData}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Generating Cover Letter...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>

                {/* Debug Button */}
                <Button 
                  variant="outline"
                  onClick={handleDebug}
                  disabled={!jobDescription || !resumeData}
                  className="w-full mt-2"
                >
                  🐛 Debug Prompt (Show what will be sent to AI)
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Debug Information */}
          {showDebug && debugInfo && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <span>Debug Information</span>
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowDebug(false)}
                  >
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Original Resume</div>
                    <div className="font-bold text-lg">{debugInfo.originalResumeLength.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">characters</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Job Description</div>
                    <div className="font-bold text-lg">{debugInfo.originalJobDescriptionLength.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      {debugInfo.jobSummaryInfo?.wouldSummarize ? 'will be summarized' : 'characters'}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Final Prompt</div>
                    <div className="font-bold text-lg">{debugInfo.promptLength.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">characters</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Est. Tokens</div>
                    <div className="font-bold text-lg">{debugInfo.estimatedTokens.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">~tokens</div>
                  </div>
                </div>

                {/* Job Summary Info */}
                {debugInfo.jobSummaryInfo && (
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">Job Description Processing:</div>
                    <div className="text-xs text-gray-600 space-y-1">
                      {debugInfo.jobSummaryInfo.wouldSummarize && (
                        <div className="text-orange-600">
                          ⚠️ Job description is {debugInfo.originalJobDescriptionLength.toLocaleString()} characters and will be summarized
                        </div>
                      )}
                      {debugInfo.jobSummaryInfo.cached && (
                        <div className="text-green-600">
                          ✅ Using cached summary (used {debugInfo.jobSummaryInfo.usageCount} times)
                        </div>
                      )}
                      {debugInfo.jobSummaryInfo.exists && (
                        <div>
                          <div>Summary length: {debugInfo.jobSummaryInfo.summaryLength} characters</div>
                          {debugInfo.jobSummaryInfo.companyName && (
                            <div>Company: {debugInfo.jobSummaryInfo.companyName}</div>
                          )}
                          {debugInfo.jobSummaryInfo.jobTitle && (
                            <div>Position: {debugInfo.jobSummaryInfo.jobTitle}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Cover Letter Cache Info */}
                {debugInfo.coverLetterCacheInfo && (
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">Cover Letter Cache Status:</div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Content Hash: <span className="font-mono text-xs">{debugInfo.coverLetterCacheInfo.hash.substring(0, 16)}...</span></div>
                      {debugInfo.coverLetterCacheInfo.exists ? (
                        <div className="text-green-600">
                          ✅ Found cached cover letter (used {debugInfo.coverLetterCacheInfo.usageCount} times)
                          <div>Word count: {debugInfo.coverLetterCacheInfo.wordCount}</div>
                          {debugInfo.coverLetterCacheInfo.lastUsed && (
                            <div>Last used: {new Date(debugInfo.coverLetterCacheInfo.lastUsed).toLocaleString()}</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-blue-600">
                          ℹ️ No cached version found - will generate new cover letter
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Resume Data Info */}
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Resume Data Structure:</div>
                  <div className="text-xs text-gray-600">
                    <div>Type: {debugInfo.resumeDataType}</div>
                    {debugInfo.resumeDataKeys !== 'N/A' && (
                      <div>Keys: {Array.isArray(debugInfo.resumeDataKeys) ? debugInfo.resumeDataKeys.join(', ') : debugInfo.resumeDataKeys}</div>
                    )}
                  </div>
                </div>

                {/* Prompt Preview */}
                <div className="bg-white p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">System Prompt:</div>
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border max-h-20 overflow-y-auto">
                    {debugInfo.systemPrompt}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">User Prompt (first 1000 chars):</div>
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border max-h-40 overflow-y-auto">
                    {debugInfo.prompt.substring(0, 1000)}
                    {debugInfo.prompt.length > 1000 && '...'}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
                    toast.success('Debug info copied to clipboard!')
                  }}
                >
                  Copy Full Debug Info
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Generated Cover Letter */}
          {generatedLetter && (
            <div className="space-y-4">
              {/* Metadata */}
              {letterMetadata && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Target className="h-3 w-3 mr-1" />
                          {selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)} Tone
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <FileText className="h-3 w-3 mr-1" />
                          {letterMetadata.wordCount || 0} words
                        </Badge>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          <Clock className="h-3 w-3 mr-1" />
                          {Math.round(letterMetadata.processingTime / 1000)}s
                        </Badge>
                        {letterMetadata.cached && (
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Cached ({letterMetadata.usageCount} uses)
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cover Letter Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Generated Cover Letter</CardTitle>
                  <CardDescription>
                    Review and customize as needed before using
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border rounded-lg p-6 min-h-[400px]">
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {generatedLetter}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setGeneratedLetter(null)
                    setLetterMetadata(null)
                  }}
                >
                  Generate New Letter
                </Button>
                <Button onClick={handleClose}>
                  Done
                </Button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Error: {error}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 