"use client"

import { useState } from "react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Badge } from "./badge"
import { ScrollArea } from "./scroll-area"
import { Textarea } from "./textarea"
import { Input } from "./input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { Eye, EyeOff, FileText, Hash, Calendar, HardDrive, Link, Loader, Briefcase, Flame } from "lucide-react"

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

interface ExtractedTextPreviewProps {
  data: ExtractedResumeData
  onProceed?: (resumeData: ExtractedResumeData, jobDescription: string) => void
  isProcessing?: boolean
  isAnalyzing?: boolean
}

export function ExtractedTextPreview({ 
  data, 
  onProceed, 
  isProcessing = false,
  isAnalyzing = false 
}: ExtractedTextPreviewProps) {
  const [showFullText, setShowFullText] = useState(false)
  const [jobDescriptionText, setJobDescriptionText] = useState("")
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState("")
  const [activeTab, setActiveTab] = useState("text")
  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false)
  const [renderKey, setRenderKey] = useState(0)

  const handleToggleFullText = () => {
    setShowFullText(prev => !prev)
    setRenderKey(prev => prev + 1) // Force re-render
  }

  const handleProceed = () => {
    if (onProceed && !isProcessing && !isAnalyzing && !isStartingAnalysis && jobDescriptionText.trim()) {
      setIsStartingAnalysis(true)
      onProceed(data, jobDescriptionText)
      // Reset after a short delay to prevent multiple clicks
      setTimeout(() => setIsStartingAnalysis(false), 2000)
    }
  }

  const displayText = showFullText ? data.text : data.text.slice(0, 1000) + (data.text.length > 1000 ? "..." : "")

  return (
    <div className="space-y-6">
      {/* Resume Preview Card */}
      <Card className="border-orange-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-orange-700">
                <FileText className="h-5 w-5" />
                <span>Resume Extracted Successfully! 🎉</span>
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your resume has been processed and is ready for roasting
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
              ✓ Ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Hash className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <div className="font-semibold">{data.metadata.wordCount}</div>
                <div className="text-gray-500">Words</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <div className="font-semibold">{data.metadata.pages}</div>
                <div className="text-gray-500">Pages</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <HardDrive className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <div className="font-semibold">{(data.metadata.fileSize / 1024 / 1024).toFixed(1)}MB</div>
                <div className="text-gray-500">Size</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div className="text-sm">
                <div className="font-semibold">
                  {new Date(data.metadata.extractedAt).toLocaleDateString()}
                </div>
                <div className="text-gray-500">Extracted</div>
              </div>
            </div>
          </div>

          {/* Resume Text Preview */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">Resume Content</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {data.text.length} chars | {showFullText ? 'Full' : 'Truncated'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleFullText}
                  className="text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-300"
                >
                  {showFullText ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Show Full Content
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Truncation Warning Banner */}
            {!showFullText && data.text.length > 1000 && (
              <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                <p className="text-sm text-orange-700 font-medium">
                  📄 Content is truncated - Click "Show Full Content" to see the complete resume ({data.text.length} characters total)
                </p>
              </div>
            )}
            
            <ScrollArea className="max-h-64 w-full">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown 
                  key={`${renderKey}-${data.text.length}`}
                  remarkPlugins={[remarkGfm]}
                >
                  {displayText}
                </ReactMarkdown>
                {!showFullText && data.text.length > 1000 && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <p className="text-sm text-orange-700">
                      📄 Content truncated - Click "Show Full Content" to see the complete resume
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Job Description Input */}
      <Card className="border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200">
          <CardTitle className="flex items-center space-x-2 text-blue-700">
            <Briefcase className="h-5 w-5" />
            <span>Job Description</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            Paste the job posting to get targeted feedback and keyword analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="text" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Paste Text</span>
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center space-x-2">
                <Link className="h-4 w-4" />
                <span>Job URL</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              <Textarea
                placeholder="Paste the complete job description here including requirements, responsibilities, and preferred qualifications..."
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
                className="min-h-32 resize-none border-gray-300 focus:border-blue-500"
                disabled={isAnalyzing}
              />
              <div className="text-sm text-gray-500 flex justify-between">
                <span>💡 Include the entire job posting for best results</span>
                <span>{jobDescriptionText.length} characters</span>
              </div>
            </TabsContent>
            
            <TabsContent value="url" className="space-y-4">
              <Input
                placeholder="https://company.com/jobs/position"
                value={jobDescriptionUrl}
                onChange={(e) => setJobDescriptionUrl(e.target.value)}
                className="border-gray-300 focus:border-blue-500"
                disabled={isAnalyzing}
              />
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="text-yellow-600 mt-0.5">⚠️</div>
                  <div className="text-sm text-yellow-800">
                    <strong>Coming Soon:</strong> URL extraction is not yet available. 
                    Please copy and paste the job description text for now.
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center pt-4">
        <Button 
          onClick={handleProceed}
          disabled={isProcessing || isAnalyzing || isStartingAnalysis || !jobDescriptionText.trim()}
          size="lg"
          className="px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          {isStartingAnalysis ? (
            <>
              <Flame className="mr-2 h-5 w-5 animate-spin" />
              Starting Analysis...
            </>
          ) : isAnalyzing ? (
            <>
              <Flame className="mr-2 h-5 w-5 animate-spin" />
              Roasting in Progress...
            </>
          ) : isProcessing ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Flame className="mr-2 h-5 w-5" />
              Start the Roast! 🔥
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 