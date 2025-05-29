"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { 
  FileText, 
  Target, 
  Zap, 
  Sparkles, 
  CheckCircle
} from "lucide-react"

// Custom loading component for resume optimization
export const ResumeOptimizationLoading = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState('')
  const [showSparkles, setShowSparkles] = useState(false)

  const optimizationSteps = [
    { 
      icon: <FileText className="h-8 w-8 text-blue-500" />, 
      text: "Analyzing your resume data...", 
      detail: "Processing personal information and experience",
      duration: 15 
    },
    { 
      icon: <Target className="h-8 w-8 text-purple-500" />, 
      text: "Matching job requirements...", 
      detail: "Extracting keywords from job description",
      duration: 20 
    },
    { 
      icon: <Zap className="h-8 w-8 text-orange-500" />, 
      text: "Optimizing content for ATS...", 
      detail: "Enhancing keywords and formatting",
      duration: 25 
    },
    { 
      icon: <Sparkles className="h-8 w-8 text-green-500" />, 
      text: "Applying template styling...", 
      detail: "Creating professional layout",
      duration: 20 
    },
    { 
      icon: <CheckCircle className="h-8 w-8 text-indigo-500" />, 
      text: "Finalizing your optimized resume...", 
      detail: "Almost ready for download!",
      duration: 20 
    }
  ]

  const encouragingMessages = [
    "🎯 Tailoring your resume for maximum impact!",
    "🚀 Optimizing for ATS compatibility",
    "💼 Creating a professional presentation",
    "⭐ Highlighting your best achievements",
    "🔥 Making your skills shine",
    "✨ Crafting the perfect resume for this role"
  ]

  // Auto-advance through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex(prev => (prev + 1) % optimizationSteps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Animate progress bar
  useEffect(() => {
    const targetProgress = Math.min((currentStepIndex + 1) * 20, 100)
    const increment = (targetProgress - animatedProgress) / 20
    
    const progressInterval = setInterval(() => {
      setAnimatedProgress(prev => {
        const next = prev + increment
        if (Math.abs(next - targetProgress) < 0.5) {
          return targetProgress
        }
        return next
      })
    }, 50)

    return () => clearInterval(progressInterval)
  }, [currentStepIndex, animatedProgress])

  // Rotate encouraging messages
  useEffect(() => {
    setCurrentMessage(encouragingMessages[0])
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = encouragingMessages.indexOf(prev)
        const nextIndex = (currentIndex + 1) % encouragingMessages.length
        return encouragingMessages[nextIndex]
      })
    }, 4000)
    return () => clearInterval(messageInterval)
  }, [])

  // Sparkle animation
  useEffect(() => {
    const sparkleInterval = setInterval(() => {
      setShowSparkles(prev => !prev)
    }, 1500)
    return () => clearInterval(sparkleInterval)
  }, [])

  const currentStepData = optimizationSteps[currentStepIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating icons */}
        <div className="absolute top-1/4 left-1/4 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <Zap className="h-6 w-6 text-orange-300 opacity-60" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <Target className="h-5 w-5 text-purple-300 opacity-50" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}>
          <Sparkles className="h-7 w-7 text-yellow-300 opacity-40" />
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-bounce" style={{ animationDelay: '3s', animationDuration: '3.5s' }}>
          <FileText className="h-6 w-6 text-blue-300 opacity-55" />
        </div>
        
        {/* Sparkles */}
        {showSparkles && (
          <>
            <div className="absolute top-1/5 left-1/5 animate-ping">
              <div className="h-2 w-2 bg-yellow-400 rounded-full opacity-75"></div>
            </div>
            <div className="absolute top-2/3 right-1/5 animate-ping" style={{ animationDelay: '0.5s' }}>
              <div className="h-1.5 w-1.5 bg-pink-400 rounded-full opacity-75"></div>
            </div>
            <div className="absolute bottom-1/5 left-2/3 animate-ping" style={{ animationDelay: '1s' }}>
              <div className="h-2 w-2 bg-purple-400 rounded-full opacity-75"></div>
            </div>
          </>
        )}
      </div>

      {/* Two-column layout */}
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-start">
        {/* Main loading content */}
        <Card className="w-full bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="p-8">
            {/* Main optimization icon */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
                  <Zap className="h-12 w-12 text-white animate-bounce" />
                </div>
                {/* Animated rings */}
                <div className="absolute inset-0 border-4 border-orange-200 rounded-full animate-ping opacity-20"></div>
                <div className="absolute inset-2 border-2 border-red-200 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
              </div>
              
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                Resume Optimization in Progress
              </h2>
              <p className="text-gray-600 text-lg">
                Creating your perfect resume...
              </p>
            </div>

            {/* Current step indicator */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="animate-spin">
                  {currentStepData.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{currentStepData.text}</h3>
                  <p className="text-sm text-gray-600">{currentStepData.detail}</p>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Optimization Progress</span>
                <span className="text-sm text-gray-500">{Math.round(animatedProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${animatedProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Steps preview */}
            <div className="mb-6">
              <div className="grid grid-cols-5 gap-2">
                {optimizationSteps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-center p-2 rounded-lg border transition-all duration-300 ${
                      index <= currentStepIndex 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : index === currentStepIndex + 1
                        ? 'bg-blue-50 border-blue-200 text-blue-700 animate-pulse'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    {index <= currentStepIndex ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-current"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Encouraging message */}
            <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-700 font-medium animate-pulse">
                {currentMessage}
              </p>
            </div>

            {/* Time estimate */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                ⏱️ This usually takes 10-15 seconds for the best optimization
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mini-game sidebar */}
        <div className="space-y-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span>Word Scramble</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-center p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Unscramble career-related words while we optimize!
                </p>
                <div className="space-y-3">
                  <div className="text-xl font-bold text-orange-600 tracking-wider">
                    EMUSRE
                  </div>
                  <input
                    type="text"
                    placeholder="Type your answer here"
                    className="w-full p-2 border border-gray-300 rounded text-center text-sm uppercase tracking-wider"
                    maxLength={6}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement
                        if (input.value.toUpperCase() === 'RESUME') {
                          input.style.backgroundColor = '#dcfce7'
                          input.style.borderColor = '#16a34a'
                          input.value = '🎉 CORRECT!'
                          setTimeout(() => {
                            input.style.backgroundColor = ''
                            input.style.borderColor = ''
                            input.value = ''
                            input.placeholder = 'Great job! Try another...'
                          }, 2000)
                        } else {
                          input.style.backgroundColor = '#fef2f2'
                          input.style.borderColor = '#dc2626'
                          setTimeout(() => {
                            input.style.backgroundColor = ''
                            input.style.borderColor = ''
                          }, 1000)
                        }
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500">
                    💡 Hint: What you're optimizing right now!
                  </p>
                  <p className="text-xs text-blue-600">
                    Press Enter to check your answer
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Resume tips card */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-green-500" />
                <span>💡 Resume Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Use action verbs to start bullet points</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Quantify achievements with numbers</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Keep it concise and relevant</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 