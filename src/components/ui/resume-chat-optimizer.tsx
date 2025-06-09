/**
 * Resume Chat Optimizer Component
 * 
 * Features:
 * - Interactive chat interface for resume optimization
 * - Custom variable system with {{VARIABLE_NAME}} syntax
 * - @ Mention system for referencing user's resumes and job offers
 *   - Type @ to trigger mention dropdown
 *   - Shows user's uploaded resumes and analyzed job descriptions
 *   - Use arrow keys to navigate, Enter to select, Esc to close
 *   - Mentions are replaced with actual data when sending messages
 * - HTML/CSS template support with preview functionality
 * - Conversation history and management
 */

"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Input } from "./input"
import { Textarea } from "./textarea"
import { Label } from "./label"

import { Badge } from "./badge"
import { useAlertDialog } from "./alert-dialog"
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  Settings,
  ArrowLeft,
  Zap,
  Eye,
  Palette,
  Crown,
  Sparkles,
  AlertTriangle,
  X,
  Copy,
  MessageSquare,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { MODEL_TIER_LABELS, MODEL_CREDIT_COSTS, getModelCreditCost, OPENAI_MODELS } from '@/lib/constants'
import { allTemplates, getTemplateById } from '@/lib/resume-templates'


interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  isLoading?: boolean
}

interface ConversationStats {
  totalMessages: number
  contextMessages: number
  estimatedTokens: number
  wasTrimmed: boolean
}

interface HtmlTemplate {
  id: string
  name: string
  description: string
  category: 'modern' | 'classic' | 'tech' | 'creative' | 'executive'
  preview?: string
}

interface Conversation {
  id: string
  title: string
  lastMessageAt: string
  messageCount: number
  selectedTemplate?: string
  selectedModel?: string
  createdAt: string
}

interface MentionItem {
  id: string
  type: 'resume' | 'job_offer'
  title: string
  subtitle: string
  description: string
  createdAt: string
  data: any
}

interface MentionCategory {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  type: 'resume' | 'job_offer'
}

const mentionCategories: MentionCategory[] = [
  {
    id: 'resume',
    name: 'Resume',
    description: 'Your uploaded resumes',
    icon: <User className="w-4 h-4" />,
    type: 'resume'
  },
  {
    id: 'job_offer',
    name: 'Job Description',
    description: 'Job postings you\'ve analyzed',
    icon: <FileText className="w-4 h-4" />,
    type: 'job_offer'
  }
]

// HTML templates are now imported from resume-templates.ts
// const htmlTemplates are available via allTemplates import

const categoryIcons = {
  modern: <Sparkles className="h-4 w-4" />,
  classic: <FileText className="h-4 w-4" />,
  tech: <FileText className="h-4 w-4" />,
  creative: <Palette className="h-4 w-4" />,
  executive: <Crown className="h-4 w-4" />
}

const categoryColors = {
  modern: "bg-blue-50 border-blue-200 text-blue-700",
  classic: "bg-gray-50 border-gray-200 text-gray-700",
  tech: "bg-green-50 border-green-200 text-green-700",
  creative: "bg-purple-50 border-purple-200 text-purple-700",
  executive: "bg-amber-50 border-amber-200 text-amber-700"
}



// Helper function to get available models with their metadata
const getAvailableModels = () => [
  { 
    id: OPENAI_MODELS.NANO, 
    name: MODEL_TIER_LABELS[OPENAI_MODELS.NANO], 
    description: `Fast and cheap (FREE for limited time! 🎉)`, 
    category: 'openai',
    credits: 0, // Free during promotion
    originalCredits: MODEL_CREDIT_COSTS[OPENAI_MODELS.NANO]
  },
  { 
    id: OPENAI_MODELS.MINI, 
    name: MODEL_TIER_LABELS[OPENAI_MODELS.MINI], 
    description: `Fast and cost-effective (FREE for limited time! 🎉)`, 
    category: 'openai',
    credits: 0, // Free during promotion
    originalCredits: MODEL_CREDIT_COSTS[OPENAI_MODELS.MINI]
  }
]

export default function ResumeChatOptimizer() {
  const { data: session } = useSession()
  const router = useRouter()
  const { showAlert, AlertDialog } = useAlertDialog()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('your-resume-style')
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false)
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [hasHtmlGenerated, setHasHtmlGenerated] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [selectedLLM, setSelectedLLM] = useState<string>(OPENAI_MODELS.MINI)
  const [conversationStats, setConversationStats] = useState<ConversationStats | null>(null)
  const [customVariables, setCustomVariables] = useState<Record<string, string>>({})
  const [showVariableEditor, setShowVariableEditor] = useState(false)
  const [editingVariable, setEditingVariable] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showSidebar, setShowSidebar] = useState(true)
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionItems, setMentionItems] = useState<MentionItem[]>([])
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0)
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 })
  const [loadingMentions, setLoadingMentions] = useState(false)
  const [mentionStep, setMentionStep] = useState<'category' | 'items'>('category')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showVariableHelp, setShowVariableHelp] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewHtml, setPreviewHtml] = useState<string>('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const mentionDropdownRef = useRef<HTMLDivElement>(null)
  const mentionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-scroll during streaming
  useEffect(() => {
    if (isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isTyping, messages])

  // Additional auto-scroll for streaming content updates
  useEffect(() => {
    if (isTyping && messages.some(msg => msg.isLoading)) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [messages, isTyping])

  // Immediate scroll on content changes during streaming
  useEffect(() => {
    if (isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
    }
  }, [messages.map(m => m.content).join(''), isTyping])

  // Focus input when component loads
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Auto-resize textarea when input value changes
  useEffect(() => {
    if (inputRef.current) {
      const textarea = inputRef.current
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [inputValue])

  // Load conversations on component mount
  useEffect(() => {
    if (session?.user) {
      fetchConversations()
    }
  }, [session])





  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.template-dropdown') && !target.closest('.model-dropdown')) {
        setShowTemplateDropdown(false)
        setShowModelDropdown(false)
      }
      
      // Close mention dropdown if clicking outside
      if (showMentions && mentionDropdownRef.current && !mentionDropdownRef.current.contains(target as Node)) {
        setShowMentions(false)
        setMentionQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMentions])

  // Cleanup mention timeout on unmount
  useEffect(() => {
    return () => {
      if (mentionTimeoutRef.current) {
        clearTimeout(mentionTimeoutRef.current)
      }
    }
  }, [])

  // Handle prefilled data from analysis/dashboard
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const isPrefilled = urlParams.get('prefilled') === 'true'
    const roastId = urlParams.get('roastId') || sessionStorage.getItem('roastId')
    
    if (isPrefilled && isFirstLoad && roastId) {
      fetchAnalysisData(roastId)
      setIsFirstLoad(false)
    } else if (isFirstLoad) {
      // Show welcome message for direct visits
      const welcomeMessage: Message = {
        id: '1',
        content: "🎉 **Special Offer!** Welcome to the Resume Optimizer! For a limited time, all resume optimization is completely **FREE** - no credits required!\n\nI'm here to help you create the perfect LaTeX resume. Tell me about the job you're applying for, share your current resume details, and I'll generate optimized LaTeX code for you to download and compile.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
      setIsFirstLoad(false)
    }
  }, [isFirstLoad])



  const generatePreview = async (templateId: string) => {
    try {
      const template = getTemplateById(templateId)
      if (!template) {
        console.error('Template not found:', templateId)
        return
      }

      // Sample data for preview
      const sampleData = {
        personalInfo: {
          name: "Alex Johnson",
          email: "alex.johnson@email.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          linkedin: "https://linkedin.com/in/alexjohnson",
          portfolio: "https://alexjohnson.dev",
          github: "https://github.com/alexjohnson",
          jobTitle: "Software Engineer",
          jobDescription: "Experienced Software Engineer"
        },
        summary: "Experienced Software Engineer with 5+ years developing scalable web applications. Proven track record of leading cross-functional teams and delivering high-impact solutions that drive business growth.",
        experience: [
          {
            title: "Senior Software Engineer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            startDate: "2022",
            endDate: "Present",
            description: [
              "Led development of microservices architecture serving 1M+ users",
              "Mentored junior developers and established coding best practices"
            ],
            achievements: [
              "Reduced system latency by 40% through optimization initiatives",
              "Increased team productivity by 25% through process improvements"
            ]
          }
        ],
        education: [
          {
            degree: "Bachelor of Science in Computer Science",
            school: "University of California",
            location: "Berkeley, CA",
            graduationDate: "2019",
            gpa: "3.8",
            honors: ["Magna Cum Laude", "Dean's List"]
          }
        ],
        skills: {
          technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "Kubernetes"],
          soft: ["Leadership", "Problem Solving", "Communication", "Team Collaboration"],
          languages: ["Spanish", "French"]
        },
        projects: [
          {
            name: "E-commerce Platform",
            description: "Built a full-stack e-commerce platform with React and Node.js",
            technologies: ["React", "Node.js", "MongoDB", "Stripe"],
            link: "https://github.com/alexjohnson/ecommerce"
          }
        ]
      }

      const html = template.generateHTML(sampleData)
      setPreviewHtml(html)
      setShowPreview(true)
    } catch (error) {
      console.error('Error generating preview:', error)
    }
  }

  const fetchAnalysisData = async (roastId: string) => {
    try {
      const response = await fetch(`/api/get-analysis-data?roastId=${roastId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch analysis data')
      }
      
      const data = await response.json()
      
      // Debug logging to see what data we're getting
      console.log('Fetched analysis data:', data)
      console.log('Job description:', data.jobDescription)
      console.log('Resume data:', data.resumeData)
      console.log('Analysis results:', data.analysisResults)
      
      // Prepare variables for the prompt
      const resumeText = data.resumeData.text || 'No resume text available'
      const jobDescription = data.jobDescription || 'No job description available'
      
      const analysisResults = data.analysisResults ? `
### Overall Assessment
- **Score:** ${data.analysisResults.overallScore || 'N/A'}/100
- **Rating:** ${data.analysisResults.scoreLabel || 'Not rated'}

### What's Working Well
${data.analysisResults.strengths && Array.isArray(data.analysisResults.strengths) 
  ? data.analysisResults.strengths.map((s: string) => `- ${s}`).join('\n')
  : 'No strengths identified'}

### Areas for Improvement
${data.analysisResults.weaknesses && Array.isArray(data.analysisResults.weaknesses)
  ? data.analysisResults.weaknesses.map((w: string) => `- ${w}`).join('\n')
  : 'No weaknesses identified'}

### Specific Recommendations
${data.analysisResults.suggestions && Array.isArray(data.analysisResults.suggestions)
  ? data.analysisResults.suggestions.map((s: any) => `- **${s.section}:** ${s.issue} → ${s.solution} (${s.priority} priority)`).join('\n')
  : 'No specific recommendations available'}

### ATS Compatibility Issues
${data.analysisResults.atsIssues && Array.isArray(data.analysisResults.atsIssues)
  ? data.analysisResults.atsIssues.map((issue: string) => `- ${issue}`).join('\n')
  : 'No ATS issues identified'}

### Keyword Analysis
- **Keywords Found:** ${data.analysisResults.keywordMatch?.matched?.join(', ') || 'None identified'}
- **Missing Keywords:** ${data.analysisResults.keywordMatch?.missing?.join(', ') || 'None identified'}
- **Match Rate:** ${data.analysisResults.keywordMatch?.matchPercentage || 0}%` : 'No analysis results available'

      // Set up default variables
      setCustomVariables(prev => ({
        ...prev,
        'RESUME': resumeText,
        'JOB_DESC': jobDescription,
        'ANALYSIS': analysisResults
      }))

      // Format the data in a user-friendly way using variables (keep as variables in the UI)
      let predefinedPrompt = `I'd like to optimize my resume for this specific job. Here's my information:

## My Current Resume
{{RESUME}}

## Job Description
{{JOB_DESC}}

## Resume Analysis Results
{{ANALYSIS}}

## What I Need

Please help me create an optimized HTML resume that:
- Addresses all the feedback and recommendations above
- Is perfectly tailored to this specific job description
- Passes ATS systems effectively
- Looks professional and modern
- Uses the selected template format

Please provide the complete HTML source code wrapped in \`\`\`html code blocks when ready.`
      
      setInputValue(predefinedPrompt)
      
      // Add a welcome message
      const welcomeMessage: Message = {
        id: '1',
        content: "Hi! I've loaded your resume and analysis data from the database. I've prepared a comprehensive, easy-to-read prompt with all your information. You can review and edit it, or send it as-is to get your optimized HTML resume!",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
      
    } catch (error) {
      console.error('Failed to fetch analysis data:', error)
      
      // Show error message
      const errorMessage: Message = {
        id: '1',
        content: "I had trouble loading your analysis data. You can still use the optimizer by manually describing your resume and target job!",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages([errorMessage])
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return

    // Detect custom variables and ensure they have values
    const detectedVars = detectCustomVariables(inputValue)
    const missingVars = detectedVars.filter(varName => !customVariables[varName])
    
    if (missingVars.length > 0) {
      showAlert({
        title: 'Missing Variable Values',
        description: `Please provide values for these variables: ${missingVars.map(v => `{{${v}}}`).join(', ')}`,
        type: 'warning'
      })
      return
    }

    // Process mentions and replace with actual data
    let processedInput = inputValue.trim()
    
    // Replace mentions with actual data
    const mentionRegex = /@(resume|job_offer):([a-zA-Z0-9_-]+)/g
    processedInput = processedInput.replace(mentionRegex, (match, type, id) => {
      const mentionData = customVariables[`MENTION_${type}_${id}`]
      if (mentionData) {
        try {
          const data = JSON.parse(mentionData)
          if (type === 'resume') {
            const extractedData = data.extractedData
            if (extractedData) {
              return `\n\n**Resume Data (${data.filename}):**\n${JSON.stringify(extractedData, null, 2)}\n\n`
            } else {
              return `\n\n**Resume File:** ${data.filename}\n(Note: This resume hasn't been processed yet. Please upload and analyze it first for detailed data.)\n\n`
            }
          } else if (type === 'job_offer') {
            return `\n\n**Job Description:**\n${data.originalText}\n\n`
          }
        } catch (error) {
          console.error('Error parsing mention data:', error)
        }
      }
      return match // Return original if can't process
    })
    
    // Replace custom variables in the input
    processedInput = replaceVariables(processedInput, customVariables)

    const userMessage: Message = {
      id: Date.now().toString(),
      content: processedInput,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = processedInput
    setInputValue('')
    setIsTyping(true)

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    }
    setMessages(prev => [...prev, loadingMessage])

    try {
      // Call the resume optimization API with streaming
      const response = await fetch('/api/chat-resume-optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversation: messages,
          conversationId: conversationId,
          selectedTemplate: selectedTemplate || 'altacv',
          selectedLLM: selectedLLM,
          stream: true
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)
        throw new Error(`Failed to process message: ${response.status}`)
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedContent = ''
      let buffer = ''

      if (reader) {
        let streamTimeout = setTimeout(() => {
          console.error('Stream timeout after 60 seconds')
          reader.cancel()
        }, 60000)

        try {
          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              console.log('Stream reading completed')
              clearTimeout(streamTimeout)
              break
            }

            const chunk = decoder.decode(value, { stream: true })
            buffer += chunk
            
            // Process complete lines from buffer
            const lines = buffer.split('\n')
            buffer = lines.pop() || '' // Keep incomplete line in buffer
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const jsonData = line.slice(6).trim()
                  if (!jsonData || jsonData === '[DONE]') {
                    console.log('Received [DONE] signal - ending stream')
                    setIsTyping(false)
                    clearTimeout(streamTimeout)
                    break
                  }
                  
                  const data = JSON.parse(jsonData)
                  console.log('Parsed streaming data:', data)
                  
                  if (data.error) {
                    throw new Error(data.error)
                  }

                  // Handle chunk content (can be empty for completion signals)
                  if (data.chunk) {
                    accumulatedContent += data.chunk
                    console.log('Streaming chunk received:', data.chunk)
                  }
                  
                  console.log('Accumulated content length:', accumulatedContent.length)
                  console.log('Is complete:', data.isComplete)
                  
                  // ALWAYS update the main chat message
                  setMessages(prev => {
                    const updated = prev.map(msg => 
                      msg.isLoading ? {
                        ...msg,
                        content: accumulatedContent,
                        isLoading: !data.isComplete
                      } : msg
                    )
                    console.log('Updated messages:', updated.length, 'Message loading state:', updated.find(m => m.sender === 'bot')?.isLoading)
                    return updated
                  })
                  
                  // Check for completion regardless of chunk content
                  if (data.isComplete) {
                    console.log('Stream completed - setting isTyping to false')
                    setIsTyping(false)
                    
                            // Check if HTML was generated (using hasLatexCode field for backward compatibility)
        if (data.hasLatexCode || accumulatedContent.includes('```html')) {
          setHasHtmlGenerated(true)
        }
                    
                    // Refresh conversations list to show new conversation
                    fetchConversations()
                    
                    clearTimeout(streamTimeout)
                    break
                  }

                  // Update conversation stats if provided
                  if (data.conversationStats) {
                    setConversationStats(data.conversationStats)
                  }
                } catch (parseError) {
                  console.error('Error parsing streaming data:', parseError, 'Raw line:', line)
                }
              }
            }
          }
        } catch (streamError) {
          console.error('Stream reading error:', streamError)
          clearTimeout(streamTimeout)
        }
      } else {
        console.error('No reader available for response body')
        throw new Error('No response body reader available')
      }

    } catch (error) {
      console.error('Error sending message:', error)
      
      // Replace loading message with error
      setMessages(prev => 
        prev.map(msg => 
          msg.isLoading ? {
            ...msg,
            content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment!",
            isLoading: false
          } : msg
        )
      )
    } finally {
      setIsTyping(false)
    }
  }



  const formatMessage = (content: string) => {
    // Handle HTML code blocks specially
    const htmlCodeRegex = /```html\n([\s\S]*?)\n```/g
    const generalCodeRegex = /```(\w+)?\n([\s\S]*?)\n```/g
    
    // First handle HTML blocks
    const htmlParts = content.split(htmlCodeRegex)
    const elements: React.ReactNode[] = []
    
    for (let i = 0; i < htmlParts.length; i++) {
      if (i % 2 === 0) {
        // Regular text - check for other code blocks
        const text = htmlParts[i]
        if (text.trim()) {
          // Handle other code blocks
          const codeParts = text.split(generalCodeRegex)
          for (let j = 0; j < codeParts.length; j++) {
            if (j % 3 === 0) {
              // Regular text
              const regularText = codeParts[j]
              if (regularText.trim()) {
                elements.push(
                  <div key={`text-${i}-${j}`} className="mb-2">
                    {formatRegularText(regularText)}
                  </div>
                )
              }
            } else if (j % 3 === 2) {
              // Code block (non-LaTeX)
              const language = codeParts[j - 1] || 'text'
              const code = codeParts[j]
              elements.push(
                <div key={`code-${i}-${j}`} className="my-4 w-full">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden w-full">
                    <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{language.toUpperCase()} Code</span>
                      <button
                        onClick={() => copyToClipboard(code)}
                        className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="w-full overflow-hidden">
                      <pre className="p-4 text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto w-full whitespace-pre-wrap break-all">
                        <code>{code}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              )
            }
          }
        }
      } else {
        // HTML code
        const htmlCode = htmlParts[i]
        elements.push(
          <div key={`html-${i}`} className="my-4 w-full">
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden w-full">
              <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">HTML Source Code</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setPreviewHtml(htmlCode)
                      setShowPreview(true)
                    }}
                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => copyToClipboard(htmlCode)}
                    className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="w-full overflow-hidden">
                <pre className="p-4 text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto w-full whitespace-pre-wrap break-all">
                  <code>{htmlCode}</code>
                </pre>
              </div>
            </div>
          </div>
        )
      }
    }
    
    return elements
  }

  const formatRegularText = (content: string) => {
    return content.split('\n').map((line, index) => {
      // Handle headers
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mt-4 mb-2">{line.slice(3)}</h2>
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-4 mb-2">{line.slice(2)}</h1>
      }
      
      // Handle blockquotes
      if (line.startsWith('> ')) {
        const content = line.slice(2)
        const formattedContent = formatInlineMarkdown(content)
        return (
          <div key={index} className="border-l-4 border-gray-300 pl-4 py-2 my-2 bg-gray-50 italic">
            <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
          </div>
        )
      }
      
      // Handle horizontal rules
      if (line.trim() === '---' || line.trim() === '***') {
        return <hr key={index} className="my-4 border-gray-300" />
      }
      
      // Handle bullet points
      if (line.match(/^[\s]*[-*+]\s/)) {
        const content = line.replace(/^[\s]*[-*+]\s/, '')
        const formattedContent = formatInlineMarkdown(content)
        return (
          <div key={index} className="flex items-start gap-2 my-1">
            <span className="text-gray-600 mt-1">•</span>
            <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
          </div>
        )
      }
      
      // Handle numbered lists
      if (line.match(/^[\s]*\d+\.\s/)) {
        const match = line.match(/^[\s]*(\d+)\.\s(.*)/)
        if (match) {
          const number = match[1]
          const content = match[2]
          const formattedContent = formatInlineMarkdown(content)
          return (
            <div key={index} className="flex items-start gap-2 my-1">
              <span className="text-gray-600 mt-1 font-medium">{number}.</span>
              <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
            </div>
          )
        }
      }
      
      // Handle empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2" />
      }
      
      // Handle regular paragraphs
      const formattedLine = formatInlineMarkdown(line)
      return (
        <div key={index} className="my-1">
          <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
        </div>
      )
    })
  }

  const formatInlineMarkdown = (content: string) => {
    let formatted = content
    
    // Handle bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    
    // Handle italic *text*
    formatted = formatted.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="italic">$1</em>')
    
    // Handle inline code `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    
    // Handle links [text](url)
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    
    return formatted
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
      console.log('Copied to clipboard')
    })
  }

  // CollapsibleMessage component for handling long messages
  const CollapsibleMessage = ({ content }: { content: string }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    
    // Count the number of lines in the content
    const lines = content.split('\n')
    const shouldCollapse = lines.length > 10
    
    // If it doesn't need collapsing, just render normally
    if (!shouldCollapse) {
      return (
        <div className="text-sm whitespace-pre-wrap break-words">
          {formatMessage(content)}
        </div>
      )
    }
    
    // Show first 10 lines when collapsed
    const visibleContent = isExpanded ? content : lines.slice(0, 10).join('\n')
    const hiddenLinesCount = lines.length - 10
    
    return (
      <div className="text-sm whitespace-pre-wrap break-words">
        {formatMessage(visibleContent)}
        {!isExpanded && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ChevronDown className="h-3 w-3" />
              Show {hiddenLinesCount} more lines
            </button>
          </div>
        )}
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => setIsExpanded(false)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ChevronUp className="h-3 w-3" />
              Show less
            </button>
          </div>
        )}
      </div>
    )
  }

  // Function to detect custom variables in text
  const detectCustomVariables = (text: string): string[] => {
    const regex = /\{\{([A-Z_][A-Z0-9_]*)\}\}/g
    const matches = []
    let match
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1])
    }
    return [...new Set(matches)] // Remove duplicates
  }

  // Function to replace all variables in text
  const replaceVariables = (text: string, variables: Record<string, string>): string => {
    let result = text
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      result = result.replace(regex, value)
    })
    return result
  }

  // Function to update custom variable
  const updateCustomVariable = (name: string, value: string) => {
    setCustomVariables(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Function to render input with variable highlighting
  const renderInputWithHighlighting = () => {
    const overlayRef = useRef<HTMLDivElement>(null)
    
    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
      if (overlayRef.current) {
        overlayRef.current.scrollTop = e.currentTarget.scrollTop
        overlayRef.current.scrollLeft = e.currentTarget.scrollLeft
      }
    }

    const autoResize = (textarea: HTMLTextAreaElement) => {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      // Set height to scrollHeight to fit content
      textarea.style.height = `${textarea.scrollHeight}px`
      
      // Also update overlay heights
      if (overlayRef.current) {
        overlayRef.current.style.height = `${textarea.scrollHeight}px`
      }
    }
    
    return (
      <div className="relative border border-gray-200 rounded-lg bg-white focus-within:border-gray-300 transition-all duration-200">
        {/* Actual textarea with transparent text for variables */}
        <div className="relative">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => {
              handleInputChange(e.target.value)
              autoResize(e.target)
            }}
            onScroll={handleScroll}
            onKeyDown={(e) => {
              // Handle mention navigation first
              if (showMentions) {
                handleMentionKeyDown(e)
                return
              }
              
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Message Resume Optimizer... (Type @ to mention resumes/jobs, use {{VARIABLES}} for dynamic content)"
            className="w-full border-0 focus:ring-0 focus:border-0 min-h-[80px] resize-none relative z-20 chat-input-textarea anthropic-input"
            disabled={isTyping}
            style={{ 
              fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
              fontSize: '14px',
              lineHeight: '20px',
              padding: '12px',
              overflow: 'auto',
              color: 'transparent',
              caretColor: '#374151',
              backgroundColor: 'transparent'
            }}
          />
          
          {/* Highlighted text overlay */}
          <div 
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words overflow-hidden z-10"
            style={{ 
              fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
              fontSize: '14px',
              lineHeight: '20px',
              padding: '12px',
              color: '#374151'
            }}
          >
            {inputValue.split(/(\{\{[A-Z_][A-Z0-9_]*\}\}|@(?:resume|job_offer):[a-zA-Z0-9_-]+)/g).map((part, index) => {
              if (part.match(/\{\{[A-Z_][A-Z0-9_]*\}\}/)) {
                return (
                  <span 
                    key={index} 
                    className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded border border-orange-300"
                  >
                    {part}
                  </span>
                )
              }
              if (part.match(/@(?:resume|job_offer):[a-zA-Z0-9_-]+/)) {
                const [, type] = part.match(/@(resume|job_offer):/) || []
                return (
                  <span 
                    key={index} 
                    className={`px-1 py-0.5 rounded border ${
                      type === 'resume' 
                        ? 'bg-blue-100 text-blue-700 border-blue-300' 
                        : 'bg-green-100 text-green-700 border-green-300'
                    }`}
                  >
                    {part}
                  </span>
                )
              }
              return <span key={index}>{part}</span>
            })}
          </div>

          {/* Send button positioned absolutely */}
          <div className="absolute bottom-3 right-3 z-40">
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="sm"
              className={`rounded-lg h-8 w-8 p-0 transition-all duration-200 ${
                !inputValue.trim() || isTyping
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-gray-800 text-white hover:scale-105'
              }`}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Bottom info bar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-500">
              <kbd className="px-1.5 py-0.5 text-xs bg-white border border-gray-200 rounded shadow-sm">⏎</kbd> to send, 
              <kbd className="px-1.5 py-0.5 text-xs bg-white border border-gray-200 rounded shadow-sm ml-1">⇧⏎</kbd> for new line
            </p>
            
            {/* Template Selector */}
            <div className="relative template-dropdown">
              <button
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1 transition-colors hover:bg-gray-100 px-2 py-1 rounded"
              >
                <FileText className="w-3 h-3" />
                {getTemplateById(selectedTemplate)?.name || 'Template'}
              </button>
              
              {showTemplateDropdown && (
                <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[280px]">
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-700 mb-2">HTML Template</p>
                    {allTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template.id)
                          setShowTemplateDropdown(false)
                        }}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-gray-50 ${
                          selectedTemplate === template.id ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{template.name}</span>
                          <div className="flex items-center gap-1">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              template.category === 'modern' ? 'bg-blue-100 text-blue-700' :
                              template.category === 'classic' ? 'bg-gray-100 text-gray-700' :
                              template.category === 'tech' ? 'bg-green-100 text-green-700' :
                              template.category === 'creative' ? 'bg-purple-100 text-purple-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {template.category}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                generatePreview(template.id)
                              }}
                              className="h-5 w-5 p-0 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-gray-500 text-xs">{template.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {(detectCustomVariables(inputValue).length > 0 || inputValue.match(/@(?:resume|job_offer):[a-zA-Z0-9_-]+/g)) && (
              <button
                onClick={() => setShowVariableEditor(true)}
                className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors hover:bg-orange-50 px-2 py-1 rounded"
              >
                <Settings className="w-3 h-3" />
                Edit Variables ({detectCustomVariables(inputValue).length + (inputValue.match(/@(?:resume|job_offer):[a-zA-Z0-9_-]+/g)?.length || 0)})
              </button>
            )}
            
            <button
              onClick={() => setShowVariableHelp(true)}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors hover:bg-blue-50 px-2 py-1 rounded"
              title="Learn about variables and mentions"
            >
              <span className="text-xs">?</span>
              Help
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Model Selector */}
            <div className="relative model-dropdown">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1 transition-colors hover:bg-gray-100 px-2 py-1 rounded"
              >
                <Bot className="w-3 h-3" />
                {MODEL_TIER_LABELS[selectedLLM as keyof typeof MODEL_TIER_LABELS] || 'Model'}
              </button>
              
              {showModelDropdown && (
                <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                  <div className="p-2">
                    <div className="bg-green-50 border border-green-200 rounded-md p-2 mb-2">
                      <p className="text-xs font-medium text-green-700 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        FREE Limited Time!
                      </p>
                      <p className="text-xs text-green-600">All models are free during our promotion</p>
                    </div>
                    <p className="text-xs font-medium text-gray-700 mb-2">AI Model</p>
                    {getAvailableModels().map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedLLM(model.id)
                          setShowModelDropdown(false)
                        }}
                        className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-gray-50 ${
                          selectedLLM === model.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{model.name}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            model.category === 'openai' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {model.category}
                          </span>
                        </div>
                        <div className="text-gray-500 text-xs">{model.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-400">
              {inputValue.length} chars
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const startNewConversation = () => {
    setMessages([])
    setHasHtmlGenerated(false)
    setConversationId(null)
    setConversationStats(null)
    setCustomVariables({})
    setInputValue('')
    

    
    // Add welcome message
    const welcomeMessage: Message = {
      id: '1',
      content: "🎉 **Special Offer!** Hello! For a limited time, resume optimization is completely **FREE**!\n\nI'm here to help you create the perfect HTML resume. Tell me about the job you're applying for, share your current resume details, and I'll generate optimized HTML code with professional styling that you can download and customize.",
      sender: 'bot',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
    
    // Focus input after clearing
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }



  // Removed Overleaf integration - now using HTML/CSS templates



  // Fetch user's conversations
  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  // Load a specific conversation
  const loadConversation = async (conversation: Conversation) => {
    try {
      const response = await fetch(`/api/conversations/${conversation.id}`)
      if (response.ok) {
        const data = await response.json()
        const conv = data.conversation
        
        // Convert conversation messages to our Message format
        const convertedMessages: Message[] = conv.messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.role === 'user' ? 'user' : 'bot',
          timestamp: new Date(msg.createdAt),
          isLoading: false
        }))
        
        setMessages(convertedMessages)
        setConversationId(conversation.id)
        setSelectedTemplate(conversation.selectedTemplate || 'altacv')
        setSelectedLLM(conversation.selectedModel || OPENAI_MODELS.MINI)
        setHasHtmlGenerated(convertedMessages.some(msg => msg.content.includes('```html')))
        

      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  // Delete a conversation
  const deleteConversation = async (convId: string) => {
    try {
      const response = await fetch(`/api/conversations/${convId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setConversations(prev => prev.filter(conv => conv.id !== convId))
        // If we're currently viewing this conversation, start a new one
        if (convId === conversationId) {
          startNewConversation()
        }
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    }
  }

  // Generate random conversation names
  const generateRandomName = () => {
    const adjectives = ['Stellar', 'Dynamic', 'Professional', 'Creative', 'Strategic', 'Innovative', 'Polished', 'Expert', 'Modern', 'Optimized']
    const nouns = ['Resume', 'Profile', 'CV', 'Application', 'Portfolio', 'Document', 'Presentation', 'Summary', 'Overview', 'Showcase']
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
    return `${randomAdjective} ${randomNoun}`
  }

  // Fetch mentions from API
  const fetchMentions = async (query: string = '', type?: 'resume' | 'job_offer') => {
    setLoadingMentions(true)
    try {
      console.log('Fetching mentions with query:', query, 'type:', type)
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      if (type) params.append('type', type)
      
      const response = await fetch(`/api/user/mentions?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Mentions response:', data)
        setMentionItems(data.data || [])
      } else {
        console.error('Mentions API error:', response.status, response.statusText)
        setMentionItems([])
      }
    } catch (error) {
      console.error('Failed to fetch mentions:', error)
      setMentionItems([])
    } finally {
      setLoadingMentions(false)
    }
  }

  // Handle category selection
  const selectCategory = (category: MentionCategory) => {
    setSelectedCategory(category.id)
    setMentionStep('items')
    setSelectedMentionIndex(0)
    setMentionQuery('')
    // Fetch items for this category
    fetchMentions('', category.type)
  }

  // Handle mention selection
  const selectMention = (mention: MentionItem) => {
    const textarea = inputRef.current
    if (!textarea) return

    const value = inputValue
    const cursorPos = textarea.selectionStart
    
    // Find the @ symbol position
    const beforeCursor = value.substring(0, cursorPos)
    const atIndex = beforeCursor.lastIndexOf('@')
    
    if (atIndex === -1) return

    // Replace @query with mention
    const beforeAt = value.substring(0, atIndex)
    const afterCursor = value.substring(cursorPos)
    const mentionText = `@${mention.type}:${mention.id}`
    
    const newValue = beforeAt + mentionText + ' ' + afterCursor
    setInputValue(newValue)
    
    // Set cursor position after the mention
    setTimeout(() => {
      const newCursorPos = atIndex + mentionText.length + 1
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      textarea.focus()
    }, 0)
    
    // Store mention data for later use
    setCustomVariables(prev => ({
      ...prev,
      [`MENTION_${mention.type}_${mention.id.replace(`${mention.type}_`, '')}`]: JSON.stringify(mention.data)
    }))
    
    setShowMentions(false)
    setMentionQuery('')
    setSelectedMentionIndex(0)
    setMentionStep('category')
    setSelectedCategory(null)
  }

  // Handle @ symbol detection and mention triggering
  const handleInputChange = (value: string) => {
    setInputValue(value)
    
    const textarea = inputRef.current
    if (!textarea) return

    const cursorPos = textarea.selectionStart
    const beforeCursor = value.substring(0, cursorPos)
    
    // Check if we're typing after an @ symbol
    const atMatch = beforeCursor.match(/@([^@\s]*)$/)
    
    console.log('Input change:', { value, atMatch, beforeCursor })
    
    if (atMatch) {
      const query = atMatch[1]
      setMentionQuery(query)
      setShowMentions(true)
      setSelectedMentionIndex(0)
      
      // Calculate position for dropdown (moved higher)
      const rect = textarea.getBoundingClientRect()
      const textBeforeAt = beforeCursor.substring(0, beforeCursor.lastIndexOf('@'))
      
      // Rough calculation for cursor position
      const lineHeight = 20
      const charWidth = 8
      const lines = textBeforeAt.split('\n')
      const currentLine = lines[lines.length - 1]
      
      setMentionPosition({
        top: rect.top + (lines.length - 1) * lineHeight - 200, // Much higher to avoid truncation
        left: rect.left + currentLine.length * charWidth + 10
      })
      
      // ALWAYS start with categories when @ is first typed
      if (query.length === 0) {
        console.log('Showing categories - empty query')
        setMentionStep('category')
        setSelectedCategory(null)
        setMentionItems([])
      } else if (selectedCategory && mentionStep === 'items') {
        // Only search if we're in items mode and have a selected category
        console.log('Searching in category:', selectedCategory, 'query:', query)
        if (mentionTimeoutRef.current) {
          clearTimeout(mentionTimeoutRef.current)
        }
        
        mentionTimeoutRef.current = setTimeout(() => {
          const categoryType = mentionCategories.find(c => c.id === selectedCategory)?.type
          fetchMentions(query, categoryType)
        }, 300)
      } else {
        // If we have a query but we're still in category mode, filter categories
        console.log('In category mode with query:', query)
        // Reset selection when filtering
        setSelectedMentionIndex(0)
      }
    } else {
      setShowMentions(false)
      setMentionQuery('')
      setMentionStep('category')
      setSelectedCategory(null)
    }
  }

  // Handle keyboard navigation in mentions
  const handleMentionKeyDown = (e: React.KeyboardEvent) => {
    if (!showMentions) return

    if (mentionStep === 'category') {
      const filteredCategories = mentionCategories.filter(category => 
        mentionQuery.length === 0 || 
        category.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(mentionQuery.toLowerCase())
      )
      const maxIndex = filteredCategories.length - 1
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedMentionIndex(prev => prev < maxIndex ? prev + 1 : 0)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedMentionIndex(prev => prev > 0 ? prev - 1 : maxIndex)
          break
        case 'Enter':
        case 'Tab':
          e.preventDefault()
          if (filteredCategories[selectedMentionIndex]) {
            selectCategory(filteredCategories[selectedMentionIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          setShowMentions(false)
          setMentionQuery('')
          setMentionStep('category')
          setSelectedCategory(null)
          break
      }
    } else if (mentionStep === 'items') {
      const maxIndex = mentionItems.length - 1
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedMentionIndex(prev => prev < maxIndex ? prev + 1 : 0)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedMentionIndex(prev => prev > 0 ? prev - 1 : maxIndex)
          break
        case 'Enter':
        case 'Tab':
          e.preventDefault()
          if (mentionItems[selectedMentionIndex]) {
            selectMention(mentionItems[selectedMentionIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          setShowMentions(false)
          setMentionQuery('')
          setMentionStep('category')
          setSelectedCategory(null)
          break
        case 'Backspace':
          // If query becomes empty, go back to categories
          if (mentionQuery.length <= 1) {
            e.preventDefault()
            setMentionStep('category')
            setSelectedCategory(null)
            setSelectedMentionIndex(0)
            setMentionItems([])
          }
          break
      }
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {AlertDialog}
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 header-section flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Resume Optimizer</h1>
                <p className="text-sm text-gray-600">AI-powered resume optimization</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {messages.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={startNewConversation}
                className="flex items-center gap-2"
              >
                <Bot className="h-4 w-4" />
                New Chat
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-4 py-3 promo-section flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-green-700">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">
              🎉 Limited Time Offer: Resume optimization is completely FREE! No credits required.
            </span>
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Conversation Stats Indicator */}
      {conversationStats && conversationStats.wasTrimmed && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 stats-section flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              <span>
                Conversation history trimmed to stay within limits. 
                Showing {conversationStats.contextMessages} of {conversationStats.totalMessages} messages 
                (~{conversationStats.estimatedTokens.toLocaleString()} tokens).
              </span>
            </div>
          </div>
        </div>
      )}



      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
            {/* Sidebar Header */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Conversations</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSidebar(false)}
                  className="hover:bg-gray-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={startNewConversation}
                className="w-full mt-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-2">
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No conversations yet</p>
                    <p className="text-xs">Start a new conversation to get started</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                          conversationId === conversation.id
                            ? 'bg-orange-50 border border-orange-200'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => loadConversation(conversation)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-gray-900 truncate">
                              {conversation.title || generateRandomName()}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {conversation.messageCount} message{conversation.messageCount !== 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(conversation.lastMessageAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteConversation(conversation.id)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Toggle Button (when sidebar is hidden) */}
        {!showSidebar && (
          <div className="absolute top-4 left-4 z-50">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSidebar(true)}
              className="bg-white shadow-md hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col transition-all duration-300 overflow-hidden min-w-0">
          <div className="flex-1 overflow-y-auto bg-white min-h-0">
            <div className="min-h-full flex flex-col justify-end p-4">
              <div className="space-y-6 max-w-4xl mx-auto w-full">
                {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className={`flex-1 min-w-0 ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-2xl max-w-full ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-white border border-gray-200 shadow-sm'
                    }`}>
                      {message.isLoading ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span className="text-sm text-gray-500">
                              {message.content ? 'Streaming...' : 'Optimizing...'}
                            </span>
                          </div>
                          {message.content && (
                            <CollapsibleMessage content={message.content} />
                          )}
                        </div>
                      ) : (
                        <CollapsibleMessage content={message.content} />
                      )}
                    </div>
                    <div className={`text-xs text-gray-400 mt-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-4">
          {/* Variable Editor Modal */}
          {showVariableEditor && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Edit Variables</h3>
                  <button
                    onClick={() => {
                      setShowVariableEditor(false)
                      setEditingVariable(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {(() => {
                    const detectedVars = detectCustomVariables(inputValue)
                    return detectedVars.map((varName) => (
                      <div key={varName} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-600 font-mono text-sm bg-orange-50 px-2 py-1 rounded">
                            {`{{${varName}}}`}
                          </span>
                          {editingVariable === varName && (
                            <Badge variant="outline" className="text-xs">Currently editing</Badge>
                          )}
                        </div>
                        <div className="relative">
                          <div className="relative">
                            {/* Actual textarea */}
                            <Textarea
                              value={customVariables[varName] || ''}
                              onChange={(e) => updateCustomVariable(varName, e.target.value)}
                              onScroll={(e) => {
                                const target = e.currentTarget
                                const overlays = target.parentElement?.querySelectorAll('.variable-overlay')
                                overlays?.forEach((overlay) => {
                                  if (overlay instanceof HTMLElement) {
                                    overlay.scrollTop = target.scrollTop
                                    overlay.scrollLeft = target.scrollLeft
                                  }
                                })
                              }}
                              placeholder="Enter value (supports markdown formatting)..."
                              className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 min-h-[120px] font-mono text-sm relative z-10 bg-transparent caret-black"
                              rows={6}
                              style={{ 
                                color: 'transparent',
                                overflow: 'auto'
                              }}
                            />
                            
                            {/* Markdown highlighting overlay */}
                            <div 
                              className="absolute inset-0 p-3 pointer-events-none whitespace-pre-wrap break-words overflow-auto variable-overlay"
                              style={{ 
                                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                fontSize: '0.875rem',
                                lineHeight: '1.25rem',
                                border: '1px solid transparent',
                                borderRadius: '6px',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                              }}
                            >
                              {(() => {
                                const text = customVariables[varName] || ''
                                return text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|#{1,6}\s.*|>\s.*)/g).map((part, index) => {
                                  // Bold **text**
                                  if (part.match(/^\*\*.*\*\*$/)) {
                                    return <span key={index} className="font-bold text-blue-600">{part}</span>
                                  }
                                  // Italic *text*
                                  if (part.match(/^\*.*\*$/) && !part.match(/^\*\*.*\*\*$/)) {
                                    return <span key={index} className="italic text-green-600">{part}</span>
                                  }
                                  // Code `text`
                                  if (part.match(/^`.*`$/)) {
                                    return <span key={index} className="bg-gray-200 text-red-600 px-1 rounded">{part}</span>
                                  }
                                  // Headers # ## ###
                                  if (part.match(/^#{1,6}\s/)) {
                                    return <span key={index} className="font-bold text-purple-600">{part}</span>
                                  }
                                  // Blockquotes > text
                                  if (part.match(/^>\s/)) {
                                    return <span key={index} className="text-gray-600 italic">{part}</span>
                                  }
                                  return <span key={index} style={{ color: 'transparent' }}>{part}</span>
                                })
                              })()}
                            </div>
                            
                            {/* Text overlay for normal text */}
                            <div 
                              className="absolute inset-0 p-3 pointer-events-none whitespace-pre-wrap break-words overflow-auto variable-overlay"
                              style={{ 
                                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                fontSize: '0.875rem',
                                lineHeight: '1.25rem',
                                border: '1px solid transparent',
                                borderRadius: '6px',
                                color: '#374151',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                              }}
                            >
                              {(() => {
                                const text = customVariables[varName] || ''
                                return text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|#{1,6}\s.*|>\s.*)/g).map((part, index) => {
                                  // Hide markdown syntax parts (they're shown in the highlighting overlay)
                                  if (part.match(/^\*\*.*\*\*$|^\*.*\*$|^`.*`$|^#{1,6}\s|^>\s/)) {
                                    return <span key={index} style={{ color: 'transparent' }}>{part}</span>
                                  }
                                  return <span key={index}>{part}</span>
                                })
                              })()}
                            </div>
                          </div>
                          
                          <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-1 rounded">
                            Markdown: **bold** *italic* `code` # header {'>'}quote
                          </div>
                        </div>
                      </div>
                    ))
                  })()}
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowVariableEditor(false)
                      setEditingVariable(null)
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}

                        {/* HTML Resume Preview Section */}
              {hasHtmlGenerated && (
                <div className="mb-4 space-y-4">
                  {/* Action Buttons */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-800 mb-1">HTML Resume Generated!</h4>
                        <p className="text-sm text-green-600">
                          Professional HTML/CSS resume ready for download and customization.
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex gap-2">
                        <Button
                          onClick={() => {
                            // Extract HTML from the last message
                            const htmlMessage = messages
                              .slice()
                              .reverse()
                              .find(msg => msg.content.includes('```html'))
                            
                            if (htmlMessage) {
                              const htmlMatch = htmlMessage.content.match(/```html\n([\s\S]*?)\n```/)
                              if (htmlMatch) {
                                setPreviewHtml(htmlMatch[1])
                                setShowPreview(true)
                              }
                            }
                          }}
                          variant="outline"
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          onClick={() => {
                            // Extract HTML from the last message and download
                            const htmlMessage = messages
                              .slice()
                              .reverse()
                              .find(msg => msg.content.includes('```html'))
                            
                            if (htmlMessage) {
                              const htmlMatch = htmlMessage.content.match(/```html\n([\s\S]*?)\n```/)
                              if (htmlMatch) {
                                const blob = new Blob([htmlMatch[1]], { type: 'text/html' })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = 'resume.html'
                                document.body.appendChild(a)
                                a.click()
                                document.body.removeChild(a)
                                URL.revokeObjectURL(url)
                              }
                            }
                          }}
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-sm px-6 py-2 font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5l5 5 5-5m-5 5V3"/>
                          </svg>
                          Download HTML
                        </Button>
                      </div>
                    </div>
                  </div>
            </div>
          )}

          {/* Variable Help Modal */}
          {showVariableHelp && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Variables & Mentions Guide</h3>
                  <button
                    onClick={() => setShowVariableHelp(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Variables Section */}
                  <div>
                    <h4 className="text-md font-semibold text-orange-600 mb-3 flex items-center gap-2">
                      <span className="bg-orange-100 p-1 rounded">📝</span>
                      Custom Variables
                    </h4>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-orange-800 mb-3">
                        Variables let you create reusable content blocks that you can reference throughout your messages.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-orange-700 mb-1">How to create a variable:</p>
                          <div className="bg-white border border-orange-200 rounded p-2 font-mono text-sm">
                            Type: <span className="bg-orange-100 px-1 rounded">{'{{VARIABLE_NAME}}'}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-orange-700 mb-1">Rules:</p>
                          <ul className="text-sm text-orange-600 space-y-1 ml-4">
                            <li>• Must be UPPERCASE</li>
                            <li>• Can contain letters, numbers, and underscores</li>
                            <li>• Must start with a letter or underscore</li>
                            <li>• Examples: {'{{RESUME}}'}, {'{{JOB_DESC}}'}, {'{{MY_SKILLS}}'}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Example Usage:</p>
                      <div className="bg-white border border-gray-200 rounded p-3 font-mono text-sm mb-3">
                        <div className="text-gray-600">// In your message:</div>
                        <div>Please optimize my resume for this job:</div>
                        <div className="text-orange-600">{'{{JOB_DESCRIPTION}}'}</div>
                        <div className="mt-2">Here's my current resume:</div>
                        <div className="text-orange-600">{'{{MY_RESUME}}'}</div>
                      </div>
                      <p className="text-xs text-gray-600">
                        When you type a variable, you'll see an "Edit Variables" button appear where you can set the actual content.
                      </p>
                    </div>
                  </div>

                  {/* Mentions Section */}
                  <div>
                    <h4 className="text-md font-semibold text-blue-600 mb-3 flex items-center gap-2">
                      <span className="bg-blue-100 p-1 rounded">@</span>
                      Mentions System
                    </h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-800 mb-3">
                        Mentions let you reference your uploaded resumes and analyzed job descriptions directly.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">How to use mentions:</p>
                          <div className="bg-white border border-blue-200 rounded p-2 font-mono text-sm">
                            Type: <span className="bg-blue-100 px-1 rounded">@</span> then select from dropdown
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-700 mb-1">Navigation:</p>
                          <ul className="text-sm text-blue-600 space-y-1 ml-4">
                            <li>• <kbd className="bg-white border px-1 rounded text-xs">↑↓</kbd> to navigate options</li>
                            <li>• <kbd className="bg-white border px-1 rounded text-xs">Enter</kbd> to select</li>
                            <li>• <kbd className="bg-white border px-1 rounded text-xs">Esc</kbd> to close</li>
                            <li>• <kbd className="bg-white border px-1 rounded text-xs">Backspace</kbd> to go back</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">Resume Mentions</span>
                        </div>
                        <p className="text-xs text-blue-600 mb-2">Reference your uploaded resume files</p>
                        <div className="bg-white border border-blue-200 rounded p-2 font-mono text-xs">
                          @resume:my_resume_2024
                        </div>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">Job Mentions</span>
                        </div>
                        <p className="text-xs text-green-600 mb-2">Reference analyzed job descriptions</p>
                        <div className="bg-white border border-green-200 rounded p-2 font-mono text-xs">
                          @job_offer:software_engineer
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips Section */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="bg-gray-100 p-1 rounded">💡</span>
                      Pro Tips
                    </h4>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-orange-500 font-bold">•</span>
                          <span><strong>Variables</strong> are perfect for long, reusable content like full resume text or detailed job descriptions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 font-bold">•</span>
                          <span><strong>Mentions</strong> automatically pull data from your uploaded files - no manual copying needed</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 font-bold">•</span>
                          <span>You can combine both in the same message for maximum flexibility</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-500 font-bold">•</span>
                          <span>Variables support <strong>markdown formatting</strong> (bold, italic, code, headers, etc.)</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Example Section */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-700 mb-3">Complete Example</h4>
                    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm">
                      <div className="text-green-400">// Complete message using both systems:</div>
                      <div className="mt-2">
                        <div>Please help me optimize my resume for this position:</div>
                        <div className="text-green-300">@job_offer:senior_developer_role</div>
                        <div className="mt-2">Here are my additional requirements:</div>
                        <div className="text-orange-300">{'{{SPECIAL_REQUIREMENTS}}'}</div>
                        <div className="mt-2">And here's my current resume:</div>
                        <div className="text-blue-300">@resume:current_resume_v3</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    onClick={() => setShowVariableHelp(false)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    Got it!
                  </Button>
                </div>
              </div>
            </div>
          )}

            <div className="max-w-4xl mx-auto">
              {renderInputWithHighlighting()}
            </div>
          </div>
        </div>
      </div>

      {/* Mention Dropdown */}
      {showMentions && (
        <div
          ref={mentionDropdownRef}
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-80"
          style={{
            top: Math.max(10, mentionPosition.top), // Ensure it's never off-screen
            left: mentionPosition.left,
            maxHeight: '300px'
          }}
        >
                    <div className="p-2 max-h-72 overflow-y-auto">
            {mentionStep === 'category' ? (
              <>
                <div className="text-xs text-gray-500 mb-2 px-2">
                  Choose what to reference
                </div>
                {mentionCategories
                  .filter(category => 
                    mentionQuery.length === 0 || 
                    category.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
                    category.description.toLowerCase().includes(mentionQuery.toLowerCase())
                  )
                  .map((category, index) => (
                  <div
                    key={category.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedMentionIndex
                        ? 'bg-orange-50 border border-orange-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => selectCategory(category)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">
                          {category.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="text-xs text-gray-500 mb-2 px-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMentionStep('category')
                      setSelectedCategory(null)
                      setSelectedMentionIndex(0)
                      setMentionItems([])
                    }}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    ← Back
                  </button>
                  {loadingMentions ? 'Loading...' : mentionQuery ? `Searching "${mentionQuery}"` : `Select ${selectedCategory}`}
                </div>
                {loadingMentions ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    <div className="animate-spin w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    Loading...
                  </div>
                ) : mentionItems.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto">
                    {mentionItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        index === selectedMentionIndex
                          ? 'bg-orange-50 border border-orange-200'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => selectMention(item)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.type === 'resume' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {item.type === 'resume' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {item.subtitle}
                          </div>
                          <div className="text-xs text-gray-400 mt-1" style={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {item.description}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 flex-shrink-0">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    {mentionQuery ? (
                      <div>
                        <p>No items matching "{mentionQuery}"</p>
                        <p className="text-xs mt-1">Try a different search term</p>
                      </div>
                    ) : (
                      <div>
                        <p>No {selectedCategory} found</p>
                        <p className="text-xs mt-1">
                          {selectedCategory === 'resume' 
                            ? 'Upload a resume first' 
                            : 'Analyze a job posting first'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="border-t border-gray-100 p-2 bg-gray-50 rounded-b-lg">
            <div className="text-xs text-gray-500 text-center">
              {mentionStep === 'category' 
                ? 'Use ↑↓ to navigate, Enter to select, Esc to close'
                : 'Use ↑↓ to navigate, Enter to select, Backspace to go back, Esc to close'
              }
            </div>
          </div>
        </div>
      )}

      {/* HTML Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Resume Preview</h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    if (previewHtml) {
                      const blob = new Blob([previewHtml], { type: 'text/html' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'resume.html'
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    }
                  }}
                  variant="outline"
                  size="sm"
                >
                  Download HTML
                </Button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full border-0"
                title="Resume Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}