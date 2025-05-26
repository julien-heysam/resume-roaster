"use client"

import { useState } from "react"
import { Flame, Zap, Target, FileCheck, ArrowRight, Upload, Loader, Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/ui/file-upload"
import { RoastLimitBanner } from "@/components/ui/roast-limit-banner"
import { ExtractedTextPreview } from "@/components/ui/extracted-text-preview"
import { AnalysisLoading } from "@/components/ui/analysis-loading"
import { useRoastLimit } from "@/hooks/useRoastLimit"
import { usePdfExtractionAI } from "@/hooks/usePdfExtractionAI"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [step, setStep] = useState<'upload' | 'extracted' | 'analyzing'>('upload')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const { data: session, status } = useSession()
  
  const { 
    roastCount, 
    canRoast, 
    isLoading, 
    remainingRoasts, 
    maxRoasts, 
    tier,
    isAuthenticated,
    incrementRoastCount 
  } = useRoastLimit()
  
  const {
    isExtracting,
    extractedData,
    error: extractionError,
    summary,
    sections,
    currentProvider,
    extractPdf,
    switchProvider,
    clearExtraction
  } = usePdfExtractionAI()
  
  const router = useRouter()

  const features = [
    {
      icon: <Flame className="h-8 w-8 text-orange-500" />,
      title: "AI-Powered Analysis",
      description: "Get honest, no-holds-barred feedback powered by the most powerful AI."
    },
    {
      icon: <Target className="h-8 w-8 text-red-500" />,
      title: "Smart PDF Extraction",
      description: "Advanced AI extracts and formats your resume content with perfect accuracy."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-500" />,
      title: "Instant Markdown Formatting",
      description: "Your resume is automatically formatted as clean, professional markdown."
    },
    {
      icon: <FileCheck className="h-8 w-8 text-green-500" />,
      title: "ATS-Friendly Format",
      description: "Ensure your resume passes through applicant tracking systems successfully."
    }
  ]

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    
    // Only extract PDF files automatically
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      const extracted = await extractPdf(file, currentProvider)
      if (extracted) {
        setStep('extracted')
      }
    }
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
    setStep('upload')
    setAnalysisProgress(0)
    clearExtraction()
  }

  const handleStartRoasting = async (resumeData: any, jobDescription: string) => {
    if (!resumeData) {
      alert("Please upload a resume first!")
      return
    }

    if (!canRoast) {
      alert("You've reached your free roast limit. Please upgrade to continue!")
      return
    }

    if (!jobDescription.trim()) {
      alert("Please provide a job description!")
      return
    }

    try {
      // Show loading state
      setStep('analyzing')
      setAnalysisProgress(0)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 95) return prev
          return prev + Math.random() * 5
        })
      }, 1000)

      // Call the analysis API
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          jobDescription: jobDescription.trim()
        }),
      })

      const result = await response.json()

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze resume')
      }

      // Complete the progress
      setAnalysisProgress(100)

      // Increment the roast count
      incrementRoastCount()
      
      // Store analysis results in sessionStorage to pass to analysis page
      sessionStorage.setItem('analysisResults', JSON.stringify(result.analysis))
      sessionStorage.setItem('resumeData', JSON.stringify(resumeData))
      sessionStorage.setItem('jobDescription', jobDescription)
      
      // Small delay to show 100% completion
      setTimeout(() => {
        // Navigate to analysis page
        router.push("/analysis")
      }, 500)
    } catch (error) {
      console.error('Analysis error:', error)
      alert(error instanceof Error ? error.message : 'Failed to analyze resume. Please try again.')
      
      // Reset to previous step on error
      setStep('extracted')
      setAnalysisProgress(0)
    }
  }

  const handleUpgrade = () => {
    router.push("/pricing")
  }

  const handleRetryExtraction = async () => {
    if (selectedFile) {
      await extractPdf(selectedFile, currentProvider)
    }
  }

  const handleProviderSwitch = (provider: 'anthropic' | 'openai') => {
    switchProvider(provider)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Flame className="h-12 w-12 text-orange-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading Resume Roaster...</p>
        </div>
      </div>
    )
  }

  // Show analysis loading screen
  if (step === 'analyzing') {
    return <AnalysisLoading progress={analysisProgress} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="border-b border-orange-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-orange-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Resume Roaster
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                    Dashboard
                  </Button>
                  <Button variant="ghost" onClick={() => router.push('/pricing')}>
                    Pricing
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        {session?.user?.name || session?.user?.email}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/pricing')}>
                        Pricing
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => router.push('/pricing')}>
                    Pricing
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/auth/signin')}>
                    Sign In
                  </Button>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-orange-100">
              <div className="flex flex-col space-y-2 pt-4">
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => router.push('/dashboard')}>
                      Dashboard
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => router.push('/pricing')}>
                      Pricing
                    </Button>
                    <div className="px-3 py-2 text-sm text-gray-600">
                      {session?.user?.name || session?.user?.email}
                    </div>
                    <Button variant="ghost" className="justify-start text-red-600" onClick={() => signOut()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => router.push('/pricing')}>
                      Pricing
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => router.push('/auth/signin')}>
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent leading-tight">
              Get Your Resume Roasted
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            AI-powered resume feedback turning weak resumes into interview magnets.
              <br />
              <span className="text-orange-500 font-semibold">Because nice feedback won't get you hired.</span>
            </p>
            
            {/* Roast Limit Banner */}
            <div className="max-w-lg mx-auto">
              <RoastLimitBanner 
                remainingRoasts={remainingRoasts}
                maxRoasts={maxRoasts}
                canRoast={canRoast}
                tier={tier}
                isAuthenticated={isAuthenticated}
                onUpgrade={handleUpgrade}
              />
            </div>

            {/* File Upload or Extracted Preview */}
            <div className="max-w-2xl mx-auto mb-8">
              {step === 'upload' ? (
                <div>
                  <FileUpload
                    selectedFile={selectedFile}
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    accept={{
                      'application/pdf': ['.pdf']
                    }}
                  />
                  
                  {/* Extraction Loading */}
                  {isExtracting && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-center space-x-3">
                        <Loader className="h-5 w-5 animate-spin text-blue-500" />
                        <span className="text-blue-700">
                          Extracting text using {currentProvider === 'anthropic' ? 'Local LLM' : 'Fine-tuned LLM'}...
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Extraction Error */}
                  {extractionError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-red-700 text-sm">{extractionError}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleRetryExtraction}
                          disabled={!selectedFile}
                        >
                          Retry with Claude
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                extractedData && (
                  <ExtractedTextPreview 
                    data={extractedData}
                    onProceed={handleStartRoasting}
                    isProcessing={isExtracting}
                    isAnalyzing={false}
                  />
                )
              )}
            </div>

            <div className="text-center">
              <Button size="lg" variant="outline" className="group">
                <Upload className="mr-2 h-5 w-5" />
                Browse More Examples
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Resume Roaster?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stop getting polite feedback that doesn't help. Get the brutal truth that transforms your resume into an interview magnet.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Resume?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of job seekers who've improved their interview rates with AI-powered Resume Roaster.
            </p>
            <Button size="lg" variant="secondary" className="group" onClick={handleUpgrade}>
              <Upload className="mr-2 h-5 w-5" />
              Upgrade to Premium
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Flame className="h-6 w-6 text-orange-500" />
                <span className="text-lg font-bold">Resume Roaster</span>
              </div>
              <p className="text-gray-400 text-sm">
                Brutally honest AI-powered resume feedback that actually helps you get hired.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Resume Roaster. All rights reserved. Get roasted responsibly. 🔥</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
