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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { Eye, EyeOff, FileText, Hash, Calendar, HardDrive, Link, Loader, Briefcase, Flame, RotateCcw, X, ChevronLeft, ChevronRight, Image } from "lucide-react"

interface ExtractedResumeData {
  text: string
  documentId?: string
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
  images?: string[]
  onProceed?: (resumeData: ExtractedResumeData, jobDescription: string, analysisName?: string) => void
  onClear?: () => void
  isProcessing?: boolean
  isAnalyzing?: boolean
}

export function ExtractedTextPreview({ 
  data, 
  images = [],
  onProceed, 
  onClear,
  isProcessing = false,
  isAnalyzing = false 
}: ExtractedTextPreviewProps) {
  const [showFullText, setShowFullText] = useState(false)
  const [jobDescriptionText, setJobDescriptionText] = useState("")
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState("")
  const [analysisName, setAnalysisName] = useState("")
  const [activeTab, setActiveTab] = useState("text")
  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false)
  const [renderKey, setRenderKey] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleToggleFullText = () => {
    setShowFullText(prev => !prev)
    setRenderKey(prev => prev + 1) // Force re-render
  }

  const handleOpenImageModal = () => {
    if (images.length > 0) {
      setCurrentImageIndex(0)
      setShowImageModal(true)
    }
  }

  const handleCloseImageModal = () => {
    setShowImageModal(false)
    setCurrentImageIndex(0)
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)
  }

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)
  }

  const handleProceed = () => {
    if (onProceed && !isProcessing && !isAnalyzing && !isStartingAnalysis && jobDescriptionText.trim()) {
      setIsStartingAnalysis(true)
      onProceed(data, jobDescriptionText, analysisName.trim() || undefined)
      // Reset after a short delay to prevent multiple clicks
      setTimeout(() => setIsStartingAnalysis(false), 2000)
    }
  }

  const handleClear = () => {
    if (onClear && !isProcessing && !isAnalyzing && !isStartingAnalysis) {
      onClear()
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
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                ✓ Ready
              </Badge>
              {onClear && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  disabled={isProcessing || isAnalyzing || isStartingAnalysis}
                  className="text-gray-600 hover:text-red-600 border-gray-300 hover:border-red-300"
                  title="Clear extraction and upload a new file"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
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

          {/* PDF Images Preview Button */}
          {images.length > 0 && (
            <div className="mb-6 flex justify-center">
              <Button
                variant="outline"
                onClick={handleOpenImageModal}
                className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100"
              >
                <Image className="h-4 w-4 mr-2" />
                View PDF Images ({images.length})
              </Button>
            </div>
          )}

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
            
            <ScrollArea className={showFullText ? "w-full" : "max-h-64 w-full"}>
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

      {/* Analysis Name Input */}
      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
          <CardTitle className="flex items-center space-x-2 text-purple-700">
            <FileText className="h-5 w-5" />
            <span>Analysis Name (Optional)</span>
          </CardTitle>
          <CardDescription className="text-gray-600">
            Give your analysis a custom name to easily identify it later. If left empty, we'll auto-generate one.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Input
            placeholder="e.g., Senior Developer at TechCorp, Marketing Manager Role, etc."
            value={analysisName}
            onChange={(e) => setAnalysisName(e.target.value)}
            className="border-gray-300 focus:border-purple-500"
            disabled={isAnalyzing}
            maxLength={100}
          />
          <div className="text-sm text-gray-500 mt-2 flex justify-between">
            <span>💡 This helps you organize multiple analyses</span>
            <span>{analysisName.length}/100</span>
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

      {/* Action Buttons */}
      <div className="flex justify-center items-center space-x-4 pt-4">
        {onClear && (
          <Button 
            variant="outline"
            onClick={handleClear}
            disabled={isProcessing || isAnalyzing || isStartingAnalysis}
            size="lg"
            className="px-6 text-gray-600 hover:text-red-600 border-gray-300 hover:border-red-300"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Start Over
          </Button>
        )}
        
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

      {/* PDF Images Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>PDF Preview - Page {currentImageIndex + 1} of {images.length}</span>
              </span>
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseImageModal}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button> */}
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative flex-1 p-6 pt-2">
            {images.length > 0 && (
              <div className="relative">
                {/* Main Image */}
                <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 min-h-[400px]">
                  <img
                    src={`data:image/png;base64,${images[currentImageIndex]}`}
                    alt={`PDF Page ${currentImageIndex + 1}`}
                    className="max-w-full max-h-[60vh] object-contain shadow-lg rounded"
                  />
                </div>
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
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
                {images.length > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    {images.map((_, index) => (
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
    </div>
  )
} 