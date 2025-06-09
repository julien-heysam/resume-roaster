import Anthropic from '@anthropic-ai/sdk'
import { parseJSONResponse } from '@/lib/json-utils'

// Initialize Anthropic client with error handling
let anthropic: Anthropic

try {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
} catch (error) {
  console.error('Failed to initialize Anthropic client:', error)
  throw new Error('Anthropic client initialization failed')
}

// Default model constants
export const ANTHROPIC_MODELS = {
  HAIKU: 'claude-3-5-haiku-20241022',
  SONNET: 'claude-sonnet-4-20250514', 
  OPUS: 'claude-opus-4-20250514',
} as const

// Default context size constants (max tokens)
export const ANTHROPIC_CONTEXT_SIZES = {
  MINI: 1000,
  NORMAL: 4000,
  LARGE: 8000,
  XLARGE: 40000,
  MAX: 200000 // Claude's maximum context
} as const

// Default temperature constants
export const ANTHROPIC_TEMPERATURES = {
  DETERMINISTIC: 0,
  LOW: 0.1,
  NORMAL: 0.3,
  HIGH: 0.7,
  CREATIVE: 1.0
} as const

export interface AnthropicCallOptions {
  model?: string
  maxTokens?: number
  temperature?: number
  timeout?: number
  systemPrompt?: string
  tools?: Anthropic.Tool[]
  toolChoice?: Anthropic.ToolChoice
}

export interface AnthropicResponse<T = any> {
  data: T
  usage: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
  cost: number
  processingTime: number
  stopReason: string
  usedTools?: boolean
}

export interface AnthropicError extends Error {
  code?: string
  status?: number
  type?: string
}

// Default options
const DEFAULT_OPTIONS = {
  model: ANTHROPIC_MODELS.SONNET,
  maxTokens: ANTHROPIC_CONTEXT_SIZES.NORMAL,
  temperature: ANTHROPIC_TEMPERATURES.NORMAL,
  timeout: 800000, // 800 seconds - maximum allowed on Pro plan
  systemPrompt: ''
} as const

// Pricing per 1K tokens (input/output) - Updated pricing as of 2024
const ANTHROPIC_MODEL_PRICING: Record<string, { input: number; output: number }> = {
  [ANTHROPIC_MODELS.HAIKU]: { input: 0.00025, output: 0.00125 },
  [ANTHROPIC_MODELS.SONNET]: { input: 0.003, output: 0.015 },
  [ANTHROPIC_MODELS.OPUS]: { input: 0.015, output: 0.075 },
}

/**
 * Get pricing for a model (with fallback for legacy model names)
 */
function getModelPricing(model: string): { input: number; output: number } {
  // Check if it's already in our pricing table
  if (ANTHROPIC_MODEL_PRICING[model]) {
    return ANTHROPIC_MODEL_PRICING[model]
  }
  
  // Handle legacy model names
  const legacyMapping: Record<string, string> = {
    'claude-3.5-haiku': ANTHROPIC_MODELS.HAIKU,
    'claude-4-sonnet': ANTHROPIC_MODELS.SONNET,
    'claude-4-opus': ANTHROPIC_MODELS.OPUS,
  }
  
  const mappedModel = legacyMapping[model]
  if (mappedModel && ANTHROPIC_MODEL_PRICING[mappedModel]) {
    return ANTHROPIC_MODEL_PRICING[mappedModel]
  }
  
  // Default fallback to Sonnet pricing
  return ANTHROPIC_MODEL_PRICING[ANTHROPIC_MODELS.SONNET]
}

/**
 * Calculate cost based on token usage and model
 */
function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = getModelPricing(model)
  return (inputTokens * pricing.input + outputTokens * pricing.output) / 1000
}

/**
 * Main Anthropic API call function with tool support and error handling
 */
export async function callAnthropic<T = any>(
  userPrompt: string,
  options: AnthropicCallOptions = {}
): Promise<AnthropicResponse<T>> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const startTime = Date.now()

  console.log('🚀 Starting Anthropic API call...')
  console.log('Model:', opts.model)
  console.log('Max tokens:', opts.maxTokens)
  console.log('Temperature:', opts.temperature)
  console.log('Has tools:', !!(opts.tools && opts.tools.length > 0))
  console.log('Prompt length:', userPrompt.length)

  try {
    // Prepare request options
    const requestOptions: Anthropic.MessageCreateParams = {
      model: opts.model,
      max_tokens: opts.maxTokens,
      temperature: opts.temperature,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    }

    // Add system prompt if provided
    if (opts.systemPrompt) {
      requestOptions.system = opts.systemPrompt
    }

    // Add tools if provided
    if (opts.tools && opts.tools.length > 0) {
      requestOptions.tools = opts.tools
      if (opts.toolChoice) {
        requestOptions.tool_choice = opts.toolChoice
      }
    }

    // Make the API call with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), opts.timeout)

    let message: Anthropic.Message
    try {
      message = await anthropic.messages.create(requestOptions)
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${opts.timeout / 1000} seconds`)
      }
      throw error
    }

    clearTimeout(timeoutId)
    const apiCallTime = Date.now() - startTime
    console.log(`✅ Anthropic API call completed in ${apiCallTime}ms`)

    if (!message.content || message.content.length === 0) {
      throw new Error('No content generated')
    }

    const usage = message.usage || { input_tokens: 0, output_tokens: 0 }
    const cost = calculateCost(opts.model, usage.input_tokens, usage.output_tokens)
    const stopReason = message.stop_reason || 'end_turn'

    let parsedData: T
    let finalContent = ''
    let usedTools = false

    // Handle tool use response
    const toolUseContent = message.content.find(content => content.type === 'tool_use')
    if (toolUseContent && toolUseContent.type === 'tool_use') {
      console.log('✅ Tool use response received')
      try {
        parsedData = toolUseContent.input as T
        finalContent = JSON.stringify(toolUseContent.input)
        usedTools = true
        console.log('✅ Tool use input parsed successfully')
      } catch (parseError) {
        console.error('❌ Failed to parse tool use input:', parseError)
        throw new Error('Failed to parse tool use response')
      }
    } else {
      // Handle regular text response
      const textContent = message.content.find(content => content.type === 'text')
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text content found in response')
      }

      finalContent = textContent.text

      // Try to parse as JSON if it looks like JSON, otherwise return as string
      try {
        parsedData = parseJSONResponse(textContent.text) as T
        console.log('✅ JSON parsing successful')
      } catch (parseError) {
        // Return content as string if not JSON
        parsedData = textContent.text as T
      }
    }

    const processingTime = Date.now() - startTime
    const finalCost = calculateCost(opts.model, usage.input_tokens, usage.output_tokens)

    console.log('📊 Anthropic call completed successfully')
    console.log('Processing time:', processingTime, 'ms')
    console.log('Tokens used:', usage.input_tokens + usage.output_tokens)
    console.log('Cost:', finalCost)
    console.log('Used tools:', usedTools)

    return {
      data: parsedData,
      usage: {
        inputTokens: usage.input_tokens,
        outputTokens: usage.output_tokens,
        totalTokens: usage.input_tokens + usage.output_tokens
      },
      cost: finalCost,
      processingTime,
      stopReason,
      usedTools
    }

  } catch (error: any) {
    const processingTime = Date.now() - startTime
    console.error('❌ Anthropic API call failed:', error)
    
    // Create a more informative error
    const anthropicError: AnthropicError = new Error(error.message || 'Anthropic API call failed')
    anthropicError.code = error.code
    anthropicError.status = error.status
    anthropicError.type = error.type
    anthropicError.name = 'AnthropicError'
    
    throw anthropicError
  }
}

/**
 * Convenience function for text generation
 */
export async function callAnthropicText(
  userPrompt: string,
  options: Omit<AnthropicCallOptions, 'tools'> = {}
): Promise<AnthropicResponse<string>> {
  return callAnthropic<string>(userPrompt, options)
}

/**
 * Helper function for resume optimization with tool calling
 */
export async function callAnthropicResumeOptimization(
  userPrompt: string,
  options: Omit<AnthropicCallOptions, 'tools' | 'toolChoice'> = {}
): Promise<AnthropicResponse<any>> {
  const tools: Anthropic.Tool[] = [
    {
      name: 'optimize_resume_data',
      description: 'Optimizes resume data for ATS systems and job requirements while maintaining truthfulness',
      input_schema: {
        type: 'object',
        properties: {
          personalInfo: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              location: { type: 'string' },
              linkedin: { type: 'string' },
              website: { type: 'string' },
              jobTitle: { type: 'string' },
              jobDescription: { type: 'string' },
            },
            required: ['name']
          },
          summary: { type: 'string' },
          experience: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                company: { type: 'string' },
                startDate: { type: 'string' },
                endDate: { type: 'string' },
                location: { type: 'string' },
                achievements: {
                  type: 'array',
                  items: { type: 'string' }
                },
                description: {
                  type: 'array',
                  items: { type: 'string' }
                }
              },
              required: ['title', 'company', 'startDate', 'endDate']
            }
          },
          education: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                degree: { type: 'string' },
                school: { type: 'string' },
                graduationDate: { type: 'string' },
                gpa: { type: 'string' },
                location: { type: 'string' },
                honors: {
                  type: 'array',
                  items: { type: 'string' }
                }
              },
              required: ['degree', 'school']
            }
          },
          skills: {
            type: 'object',
            properties: {
              technical: {
                type: 'array',
                items: { type: 'string' }
              },
              soft: {
                type: 'array',
                items: { type: 'string' }
              },
              languages: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          },
          certifications: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                issuer: { type: 'string' },
                date: { type: 'string' },
                expirationDate: { type: 'string' }
              },
              required: ['name', 'issuer']
            }
          },
          projects: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                technologies: {
                  type: 'array',
                  items: { type: 'string' }
                },
                url: { type: 'string' }
              },
              required: ['name', 'description']
            }
          }
        },
        required: ['personalInfo']
      }
    }
  ]

  return callAnthropic(userPrompt, {
    ...options,
    tools,
    toolChoice: { type: 'tool', name: 'optimize_resume_data' }
  })
}

/**
 * Helper function for job description summarization with tool calling
 */
export async function callAnthropicJobSummary(
  userPrompt: string,
  options: Omit<AnthropicCallOptions, 'tools' | 'toolChoice'> = {}
): Promise<AnthropicResponse<any>> {
  const tools: Anthropic.Tool[] = [
    {
      name: 'summarize_job_description',
      description: 'Analyzes and summarizes a job description, extracting key information',
      input_schema: {
        type: 'object',
        properties: {
          summary: {
            type: 'string',
            description: 'A concise 2-3 paragraph summary of the role, responsibilities, and company (max 500 words)'
          },
          keyRequirements: {
            type: 'array',
            items: { type: 'string' },
            description: 'Essential skills and qualifications required for the role'
          },
          companyName: {
            type: 'string',
            description: 'Company name if mentioned in the job description'
          },
          jobTitle: {
            type: 'string',
            description: 'Job title or position name'
          },
          location: {
            type: 'string',
            description: 'Job location if mentioned'
          },
          salaryRange: {
            type: 'string',
            description: 'Salary range if mentioned'
          }
        },
        required: ['summary', 'keyRequirements']
      }
    }
  ]

  return callAnthropic(userPrompt, {
    ...options,
    tools,
    toolChoice: { type: 'tool', name: 'summarize_job_description' }
  })
}

/**
 * Helper function for PDF extraction with tool calling (text-only, backward compatibility)
 */
export async function callAnthropicPDFExtraction(
  userPrompt: string,
  options: Omit<AnthropicCallOptions, 'tools' | 'toolChoice'> = {}
): Promise<AnthropicResponse<any>> {
  const tools: Anthropic.Tool[] = [
    {
      name: 'extract_resume_content',
      description: 'Extracts and formats resume content from PDF text as clean, professional markdown',
      input_schema: {
        type: 'object',
        properties: {
          markdown: {
            type: 'string',
            description: 'The extracted content formatted as clean, professional markdown'
          },
          summary: {
            type: 'string',
            description: 'A brief summary of the resume content'
          },
          sections: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of main sections found in the resume'
          }
        },
        required: ['markdown', 'summary', 'sections']
      }
    }
  ]

  return callAnthropic(userPrompt, {
    ...options,
    tools,
    toolChoice: { type: 'tool', name: 'extract_resume_content' }
  })
}

/**
 * Helper function for PDF extraction with vision capabilities
 */
export async function callAnthropicPDFExtractionWithVision(
  userPrompt: string,
  images: string[], // Base64 encoded images
  options: Omit<AnthropicCallOptions, 'tools' | 'toolChoice'> = {}
): Promise<AnthropicResponse<any>> {
  const tools: Anthropic.Tool[] = [
    {
      name: 'extract_resume_content',
      description: 'Extracts and formats resume content from PDF images as clean, professional markdown',
      input_schema: {
        type: 'object',
        properties: {
          markdown: {
            type: 'string',
            description: 'The extracted content formatted as clean, professional markdown'
          },
          summary: {
            type: 'string',
            description: 'A brief summary of the resume content and key highlights'
          },
          sections: {
            type: 'array',
            items: { type: 'string' },
            description: 'Array of main sections found in the resume (e.g., Personal Info, Experience, Education, Skills)'
          },
          personalInfo: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              location: { type: 'string' },
              linkedin: { type: 'string' },
              website: { type: 'string' }
            }
          },
          keySkills: {
            type: 'array',
            items: { type: 'string' },
            description: 'Key technical and professional skills identified'
          },
          experience: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                company: { type: 'string' },
                duration: { type: 'string' },
                description: { type: 'string' }
              }
            }
          },
          education: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                degree: { type: 'string' },
                institution: { type: 'string' },
                year: { type: 'string' }
              }
            }
          }
        },
        required: ['markdown', 'summary', 'sections']
      }
    }
  ]

  // Create content array with images and text
  const content: any[] = []
  
  // Add images first
  images.forEach((imageBase64, index) => {
    if (index > 0) {
      content.push({
        type: 'text',
        text: `\n\nPage ${index + 1}:`
      })
    }
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: 'image/png',
        data: imageBase64
      }
    })
  })
  
  // Add the text prompt
  content.push({
    type: 'text',
    text: userPrompt
  })

  // Use the enhanced callAnthropic function with multimodal content
  return callAnthropicWithContent(content, {
    ...options,
    tools,
    toolChoice: { type: 'tool', name: 'extract_resume_content' }
  })
}

/**
 * Enhanced callAnthropic function that supports multimodal content
 */
export async function callAnthropicWithContent<T = any>(
  content: any[],
  options: AnthropicCallOptions = {}
): Promise<AnthropicResponse<T>> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const startTime = Date.now()

  console.log('🚀 Starting Anthropic API call with multimodal content...')
  console.log('Model:', opts.model)
  console.log('Max tokens:', opts.maxTokens)
  console.log('Temperature:', opts.temperature)
  console.log('Has tools:', !!(opts.tools && opts.tools.length > 0))
  console.log('Content blocks:', content.length)

  try {
    // Prepare request options
    const requestOptions: Anthropic.MessageCreateParams = {
      model: opts.model,
      max_tokens: opts.maxTokens,
      temperature: opts.temperature,
      messages: [
        {
          role: 'user',
          content: content
        }
      ]
    }

    // Add system prompt if provided
    if (opts.systemPrompt) {
      requestOptions.system = opts.systemPrompt
    }

    // Add tools if provided
    if (opts.tools && opts.tools.length > 0) {
      requestOptions.tools = opts.tools
      if (opts.toolChoice) {
        requestOptions.tool_choice = opts.toolChoice
      }
    }

    // Make the API call with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), opts.timeout)

    let message: Anthropic.Message
    try {
      message = await anthropic.messages.create(requestOptions)
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${opts.timeout / 1000} seconds`)
      }
      throw error
    }

    clearTimeout(timeoutId)
    const apiCallTime = Date.now() - startTime
    console.log(`✅ Anthropic API call completed in ${apiCallTime}ms`)

    if (!message.content || message.content.length === 0) {
      throw new Error('No content generated')
    }

    const usage = message.usage || { input_tokens: 0, output_tokens: 0 }
    const cost = calculateCost(opts.model, usage.input_tokens, usage.output_tokens)
    const stopReason = message.stop_reason || 'end_turn'

    let parsedData: T
    let finalContent = ''
    let usedTools = false

    // Handle tool use response
    const toolUseContent = message.content.find(content => content.type === 'tool_use')
    if (toolUseContent && toolUseContent.type === 'tool_use') {
      console.log('✅ Tool use response received')
      try {
        parsedData = toolUseContent.input as T
        finalContent = JSON.stringify(toolUseContent.input)
        usedTools = true
        console.log('✅ Tool use input parsed successfully')
      } catch (parseError) {
        console.error('❌ Failed to parse tool use input:', parseError)
        throw new Error('Failed to parse tool use response')
      }
    } else {
      // Handle regular text response
      const textContent = message.content.find(content => content.type === 'text')
      if (!textContent || textContent.type !== 'text') {
        throw new Error('No text content found in response')
      }

      finalContent = textContent.text

      // Try to parse as JSON if it looks like JSON, otherwise return as string
      try {
        parsedData = parseJSONResponse(textContent.text) as T
        console.log('✅ JSON parsing successful')
      } catch (parseError) {
        // Return content as string if not JSON
        parsedData = textContent.text as T
      }
    }

    const processingTime = Date.now() - startTime
    const finalCost = calculateCost(opts.model, usage.input_tokens, usage.output_tokens)

    console.log('📊 Anthropic multimodal call completed successfully')
    console.log('Processing time:', processingTime, 'ms')
    console.log('Tokens used:', usage.input_tokens + usage.output_tokens)
    console.log('Cost:', finalCost)
    console.log('Used tools:', usedTools)

    return {
      data: parsedData,
      usage: {
        inputTokens: usage.input_tokens,
        outputTokens: usage.output_tokens,
        totalTokens: usage.input_tokens + usage.output_tokens
      },
      cost: finalCost,
      processingTime,
      stopReason,
      usedTools
    }

  } catch (error: any) {
    const processingTime = Date.now() - startTime
    console.error('❌ Anthropic multimodal API call failed:', error)
    
    // Create a more informative error
    const anthropicError: AnthropicError = new Error(error.message || 'Anthropic multimodal API call failed')
    anthropicError.code = error.code
    anthropicError.status = error.status
    anthropicError.type = error.type
    anthropicError.name = 'AnthropicError'
    
    throw anthropicError
  }
}

/**
 * Generate interview preparation using Anthropic with structured tool output
 */
export async function callAnthropicInterviewPrep(
  userPrompt: string,
  options: Omit<AnthropicCallOptions, 'tools' | 'toolChoice'> = {}
): Promise<AnthropicResponse<any>> {
  const interviewPrepTool: Anthropic.Tool = {
    name: 'generate_interview_prep',
    description: 'Generate personalized interview questions and preparation materials',
    input_schema: {
      type: 'object',
      properties: {
        questions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              question: { type: 'string' },
              category: { 
                type: 'string',
                enum: ['behavioral', 'technical', 'situational', 'general']
              },
              difficulty: { 
                type: 'string',
                enum: ['easy', 'medium', 'hard']
              },
              suggestedAnswer: { type: 'string' },
              tips: { 
                type: 'array',
                items: { type: 'string' }
              },
              followUpQuestions: { 
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['id', 'question', 'category', 'difficulty', 'suggestedAnswer', 'tips']
          }
        },
        overallTips: {
          type: 'array',
          items: { type: 'string' }
        },
        companyResearch: {
          type: 'array',
          items: { type: 'string' }
        },
        salaryNegotiation: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: ['questions', 'overallTips']
    }
  }

  return callAnthropic(userPrompt, {
    ...options,
    tools: [interviewPrepTool],
    toolChoice: { type: 'tool', name: 'generate_interview_prep' }
  })
} 


export async function callAnthropicResumeAnalysis(
  userPrompt: string,
  options: Omit<AnthropicCallOptions, 'tools' | 'toolChoice'> = {}
): Promise<AnthropicResponse<any>> {
  const resumeAnalysisTool: Anthropic.Tool = {
    name: 'analyze_resume',
    description: 'Analyze a resume against a job description and provide detailed scoring and feedback',
    input_schema: {
      type: 'object',
      properties: {
        overallScore: {
          type: 'number',
          description: 'Overall score from 0-100 based on resume quality and job match',
          minimum: 0,
          maximum: 100
        },
        scoringBreakdown: {
          type: 'object',
          description: 'Detailed breakdown of scoring components',
          properties: {
            skills: {
              type: 'number',
              description: 'Skills match score out of 40 points',
              minimum: 0,
              maximum: 40
            },
            experience: {
              type: 'number',
              description: 'Experience relevance score out of 35 points',
              minimum: 0,
              maximum: 35
            },
            achievements: {
              type: 'number',
              description: 'Achievement alignment score out of 20 points',
              minimum: 0,
              maximum: 20
            },
            presentation: {
              type: 'number',
              description: 'Presentation quality score out of 5 points',
              minimum: 0,
              maximum: 5
            }
          },
          required: ['skills', 'experience', 'achievements', 'presentation']
        },
        scoreJustification: {
          type: 'string',
          description: 'Detailed markdown-formatted explanation of the score with emojis and professional tone'
        },
        scoreLabel: {
          type: 'string',
          enum: ['Exceptional Match', 'Strong Match', 'Good Match', 'Fair Match', 'Weak Match', 'Poor Match'],
          description: 'Label describing the overall score level'
        },
        strengths: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of 3-5 strong points that give competitive advantage',
          minItems: 3,
          maxItems: 5
        },
        weaknesses: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of 3-7 critical issues that need attention',
          minItems: 3,
          maxItems: 7
        },
        suggestions: {
          type: 'array',
          description: 'Specific actionable improvement suggestions',
          items: {
            type: 'object',
            properties: {
              section: {
                type: 'string',
                description: 'Resume section this suggestion applies to'
              },
              issue: {
                type: 'string',
                description: 'Specific issue identified'
              },
              solution: {
                type: 'string',
                description: 'Actionable solution with examples'
              },
              priority: {
                type: 'string',
                enum: ['critical', 'high', 'medium', 'low'],
                description: 'Priority level for this improvement'
              }
            },
            required: ['section', 'issue', 'solution', 'priority']
          }
        },
        keywordMatch: {
          type: 'object',
          description: 'Keyword analysis for ATS optimization',
          properties: {
            matched: {
              type: 'array',
              items: { type: 'string' },
              description: 'Keywords found in both resume and job description'
            },
            missing: {
              type: 'array',
              items: { type: 'string' },
              description: 'Important keywords missing from resume'
            },
            matchPercentage: {
              type: 'number',
              description: 'Percentage of important keywords matched',
              minimum: 0,
              maximum: 100
            }
          },
          required: ['matched', 'missing', 'matchPercentage']
        },
        atsIssues: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of ATS compatibility issues found'
        }
      },
      required: [
        'overallScore',
        'scoringBreakdown', 
        'scoreJustification',
        'scoreLabel',
        'strengths',
        'weaknesses',
        'suggestions',
        'keywordMatch',
        'atsIssues'
      ]
    }
  }

  const response = await callAnthropic(userPrompt, {
    ...options,
    tools: [resumeAnalysisTool],
    toolChoice: { type: 'tool', name: 'analyze_resume' }
  })

  // Validate and fix the analysis data to ensure all scores are within proper ranges
  try {
    const validatedData = validateAnalysisData(response.data)
    console.log('✅ Analysis data validated and corrected')
    
    return {
      ...response,
      data: validatedData
    }
  } catch (validationError) {
    console.error('❌ Analysis data validation failed:', validationError)
    throw new Error('Invalid analysis data structure returned by AI')
  }
}

/**
 * Validate and fix scoring breakdown to ensure all values are within proper ranges
 */
function validateScoringBreakdown(scoringBreakdown: any): any {
  if (!scoringBreakdown || typeof scoringBreakdown !== 'object') {
    return {
      skills: 0,
      experience: 0,
      achievements: 0,
      presentation: 0
    }
  }

  const originalPresentation = Number(scoringBreakdown.presentation) || 0
  const validatedPresentation = Math.max(0, Math.min(5, originalPresentation))
  
  // Log if we had to correct a negative presentation score
  if (originalPresentation < 0) {
    console.log(`🔧 Corrected negative presentation score: ${originalPresentation} → ${validatedPresentation}`)
  }

  return {
    skills: Math.max(0, Math.min(40, Number(scoringBreakdown.skills) || 0)),
    experience: Math.max(0, Math.min(35, Number(scoringBreakdown.experience) || 0)),
    achievements: Math.max(0, Math.min(20, Number(scoringBreakdown.achievements) || 0)),
    presentation: validatedPresentation
  }
}

/**
 * Validate and fix overall analysis data to ensure consistency
 */
function validateAnalysisData(analysisData: any): any {
  if (!analysisData || typeof analysisData !== 'object') {
    throw new Error('Invalid analysis data structure')
  }

  // Validate scoring breakdown
  const validatedBreakdown = validateScoringBreakdown(analysisData.scoringBreakdown)
  
  // Calculate corrected overall score based on validated breakdown
  const calculatedScore = validatedBreakdown.skills + validatedBreakdown.experience + 
                         validatedBreakdown.achievements + validatedBreakdown.presentation
  
  // Ensure overall score is within 0-100 range
  const overallScore = Math.max(0, Math.min(100, Number(analysisData.overallScore) || calculatedScore))

  return {
    ...analysisData,
    overallScore,
    scoringBreakdown: validatedBreakdown,
    // Ensure other required fields have defaults
    strengths: Array.isArray(analysisData.strengths) ? analysisData.strengths : [],
    weaknesses: Array.isArray(analysisData.weaknesses) ? analysisData.weaknesses : [],
    suggestions: Array.isArray(analysisData.suggestions) ? analysisData.suggestions : [],
    keywordMatch: analysisData.keywordMatch || { matched: [], missing: [], matchPercentage: 0 },
    atsIssues: Array.isArray(analysisData.atsIssues) ? analysisData.atsIssues : []
  }
}

/**
 * Streaming Anthropic API call function
 */
export async function callAnthropicStream(
  userPrompt: string,
  options: Omit<AnthropicCallOptions, 'tools'> = {}
): Promise<ReadableStream<Uint8Array>> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  console.log('🚀 Starting Anthropic streaming API call...')
  console.log('Model:', opts.model)
  console.log('Max tokens:', opts.maxTokens)
  console.log('Temperature:', opts.temperature)
  console.log('Prompt length:', userPrompt.length)

  // Prepare request options for streaming
  const requestOptions: Anthropic.MessageCreateParams = {
    model: opts.model,
    max_tokens: opts.maxTokens,
    temperature: opts.temperature,
    messages: [
      {
        role: 'user',
        content: userPrompt
      }
    ],
    stream: true
  }

  // Add system prompt if provided
  if (opts.systemPrompt) {
    requestOptions.system = opts.systemPrompt
  }

  try {
    const stream = await anthropic.messages.create(requestOptions)
    
    return new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        let accumulatedContent = ''
        let inputTokens = 0
        let outputTokens = 0
        
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              const content = chunk.delta.text
              accumulatedContent += content
              outputTokens += 1 // Rough estimation
              
              const data = JSON.stringify({
                chunk: content,
                isComplete: false,
                hasLatexCode: false
              })
              
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
            
            // Check if stream is finished
            if (chunk.type === 'message_stop') {
              const hasLatexCode = accumulatedContent.includes('```latex')
              
              const finalData = JSON.stringify({
                chunk: '',
                isComplete: true,
                hasLatexCode,
                metadata: {
                  tokensUsed: inputTokens + outputTokens,
                  estimatedCost: calculateCost(opts.model, inputTokens, outputTokens),
                  stopReason: 'end_turn'
                }
              })
              
              controller.enqueue(encoder.encode(`data: ${finalData}\n\n`))
              controller.close()
              break
            }
          }
        } catch (error) {
          console.error('Anthropic streaming error:', error)
          const errorData = JSON.stringify({
            chunk: '',
            isComplete: true,
            hasLatexCode: false,
            error: error instanceof Error ? error.message : 'Unknown streaming error'
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      }
    })
  } catch (error) {
    console.error('Failed to create Anthropic stream:', error)
    throw error
  }
} 