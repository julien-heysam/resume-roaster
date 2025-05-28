"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, FileText, Sparkles, Clock, DollarSign } from 'lucide-react'

interface ExtractionMethodSelectorProps {
  isRegistered: boolean
  onMethodSelect: (method: 'basic' | 'ai') => void
  selectedMethod?: 'basic' | 'ai'
  disabled?: boolean
}

export function ExtractionMethodSelector({ 
  isRegistered, 
  onMethodSelect, 
  selectedMethod,
  disabled = false 
}: ExtractionMethodSelectorProps) {
  const [hoveredMethod, setHoveredMethod] = useState<'basic' | 'ai' | null>(null)

  if (!isRegistered) {
    return (
      <div className="mb-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-900">Basic PDF Extraction</CardTitle>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Free</Badge>
            </div>
            <CardDescription className="text-blue-700">
              Available for all users - simple text extraction from PDF files
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Fast processing (5-10 seconds)</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Completely free</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Basic text extraction without formatting</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Sign up</strong> to unlock AI-powered extraction with advanced formatting and better accuracy!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Choose Extraction Method</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Extraction */}
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            selectedMethod === 'basic' 
              ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' 
              : hoveredMethod === 'basic'
              ? 'border-blue-300 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !disabled && onMethodSelect('basic')}
          onMouseEnter={() => !disabled && setHoveredMethod('basic')}
          onMouseLeave={() => setHoveredMethod(null)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Basic Extraction</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Free</Badge>
            </div>
            <CardDescription>
              Fast and simple text extraction from PDF files
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span>Fast processing (5-10 seconds)</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span>No credits used</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Plain text extraction</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                Best for: Simple resumes, quick processing, preserving credits
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Extraction */}
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            selectedMethod === 'ai' 
              ? 'ring-2 ring-purple-500 border-purple-500 bg-purple-50' 
              : hoveredMethod === 'ai'
              ? 'border-purple-300 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !disabled && onMethodSelect('ai')}
          onMouseEnter={() => !disabled && setHoveredMethod('ai')}
          onMouseLeave={() => setHoveredMethod(null)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">AI Extraction</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">Premium</Badge>
            </div>
            <CardDescription>
              Advanced AI-powered extraction with formatting and structure
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <span>AI processing (15-30 seconds)</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-orange-600" />
                <span>Uses 1 credit (~$0.02-0.05)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span>Formatted markdown output</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                Best for: Complex resumes, better formatting, professional structure
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedMethod && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Selected:</strong> {selectedMethod === 'basic' ? 'Basic Extraction' : 'AI Extraction'} - 
            {selectedMethod === 'basic' 
              ? ' Fast and free text extraction' 
              : ' Advanced AI processing with formatting'
            }
          </p>
        </div>
      )}
    </div>
  )
} 