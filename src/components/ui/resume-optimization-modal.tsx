"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { useCoverLetter } from "@/hooks/useCoverLetter"
import { 
  FileText, 
  Sparkles, 
  Loader,
  CheckCircle,
  AlertCircle,
  Zap,
  Crown
} from "lucide-react"
import { toast } from 'sonner'
import { OPENAI_MODELS, ANTHROPIC_MODELS } from "@/lib/constants"

interface ResumeOptimizationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedLLM: string) => void
  isGenerating?: boolean
}

export function ResumeOptimizationModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  isGenerating = false
}: ResumeOptimizationModalProps) {
  const [selectedLLM, setSelectedLLM] = useState<string>(OPENAI_MODELS.MINI)

  const llmOptions = [
    { 
      value: OPENAI_MODELS.MINI, 
      label: 'GPT-4 Mini', 
      description: 'Fast and efficient optimization',
      credits: 0.5,
      icon: Zap,
      badge: 'Fast',
      features: ['Quick processing', 'Good quality', 'Cost effective']
    },
    { 
      value: ANTHROPIC_MODELS.SONNET, 
      label: 'Claude Sonnet 4', 
      description: 'Premium quality with superior accuracy',
      credits: 1,
      icon: Crown,
      badge: 'Premium',
      features: ['Superior accuracy', 'Advanced reasoning', 'Best quality']
    }
  ]

  const handleConfirm = () => {
    onConfirm(selectedLLM)
  }

  const handleClose = () => {
    if (!isGenerating) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-orange-500" />
            <span>Choose AI Model for Resume Optimization</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 p-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span>Select Your Optimization Model</span>
              </CardTitle>
              <CardDescription>
                Choose the AI model that best fits your needs and budget
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* LLM Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {llmOptions.map((llm) => {
                  const IconComponent = llm.icon
                  return (
                    <div
                      key={llm.value}
                      className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        selectedLLM === llm.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedLLM(llm.value)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <IconComponent className={`h-6 w-6 ${
                            llm.value === OPENAI_MODELS.MINI ? 'text-blue-600' : 'text-purple-600'
                          }`} />
                          <div>
                            <span className="font-semibold text-gray-900 text-lg">{llm.label}</span>
                            <p className="text-sm text-gray-600 mt-1">{llm.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant="outline" className={`text-xs ${
                            llm.value === OPENAI_MODELS.MINI 
                              ? 'bg-blue-100 text-blue-700 border-blue-200' 
                              : 'bg-purple-100 text-purple-700 border-purple-200'
                          }`}>
                            {llm.badge}
                          </Badge>
                          <Badge variant="secondary" className={`text-sm font-semibold ${
                            llm.value === OPENAI_MODELS.MINI
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {llm.credits} Credit{llm.credits !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Features */}
                      <div className="space-y-2">
                        {llm.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {selectedLLM === llm.value && (
                        <div className="absolute top-3 left-3">
                          <CheckCircle className="h-5 w-5 text-orange-500" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Info Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">What happens next?</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      The AI will analyze your resume and the job description to create an optimized version 
                      with improved keywords, better formatting, and enhanced content tailored to the position.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={isGenerating}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirm}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Optimized Resume ({llmOptions.find(llm => llm.value === selectedLLM)?.credits} credit{llmOptions.find(llm => llm.value === selectedLLM)?.credits !== 1 ? 's' : ''})
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 