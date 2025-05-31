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
  AlertCircle,
  Zap,
  Crown
} from "lucide-react"
import { toast } from 'sonner'
import { OPENAI_MODELS, ANTHROPIC_MODELS } from "@/lib/constants"

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
  const [selectedLLM, setSelectedLLM] = useState<string>(OPENAI_MODELS.MINI)
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null)
  const [letterMetadata, setLetterMetadata] = useState<any>(null)
  const { generateCoverLetter, isGenerating, error } = useCoverLetter()

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal and confident tone' },
    { value: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic and passionate tone' },
    { value: 'conversational', label: 'Conversational', description: 'Friendly but professional tone' }
  ]

  const llmOptions = [
    { 
      value: OPENAI_MODELS.MINI,
      label: 'GPT-4 Mini', 
      description: 'Fast and efficient generation',
      credits: 0.5,
      icon: Zap,
      badge: 'Fast'
    },
    { 
      value: ANTHROPIC_MODELS.SONNET, 
      label: 'Claude Sonnet 4', 
      description: 'Premium quality with superior accuracy',
      credits: 1,
      icon: Crown,
      badge: 'Premium'
    }
  ]

  const handleGenerate = async () => {
    if (!jobDescription) {
      toast.error('Job description is required to generate a cover letter')
      return
    }

    const result = await generateCoverLetter(resumeData, jobDescription, analysisData, selectedTone, analysisId, selectedLLM)
    if (result) {
      setGeneratedLetter(result.coverLetter)
      setLetterMetadata({
        ...result.metadata,
        cached: result.cached,
        usageCount: result.usageCount,
        wordCount: result.wordCount,
        llmUsed: selectedLLM,
        creditsUsed: llmOptions.find(llm => llm.value === selectedLLM)?.credits || 0.5
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

                {/* LLM Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Choose AI Model
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {llmOptions.map((llm) => {
                      const IconComponent = llm.icon
                      return (
                        <div
                          key={llm.value}
                          className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedLLM === llm.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedLLM(llm.value)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <IconComponent className={`h-5 w-5 ${
                                llm.value === OPENAI_MODELS.MINI ? 'text-blue-600' : 'text-purple-600'
                              }`} />
                              <span className="font-medium text-gray-900">{llm.label}</span>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge variant="outline" className={`text-xs ${
                                llm.value === OPENAI_MODELS.MINI 
                                  ? 'bg-blue-100 text-blue-700 border-blue-200' 
                                  : 'bg-purple-100 text-purple-700 border-purple-200'
                              }`}>
                                {llm.badge}
                              </Badge>
                              <Badge variant="secondary" className={`text-xs ${
                                llm.value === OPENAI_MODELS.MINI
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {llm.credits} Credit{llm.credits !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{llm.description}</p>
                          {selectedLLM === llm.value && (
                            <div className="absolute top-2 left-2">
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
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
                        {letterMetadata.llmUsed && (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            {letterMetadata.llmUsed === OPENAI_MODELS.MINI ? (
                              <Zap className="h-3 w-3 mr-1" />
                            ) : (
                              <Crown className="h-3 w-3 mr-1" />
                            )}
                            {letterMetadata.llmUsed === OPENAI_MODELS.MINI ? 'GPT-4 Mini' : 'Claude Sonnet'}
                          </Badge>
                        )}
                        {letterMetadata.creditsUsed && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {letterMetadata.creditsUsed} Credit{letterMetadata.creditsUsed !== 1 ? 's' : ''}
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