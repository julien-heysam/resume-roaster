import Anthropic from '@anthropic-ai/sdk'
import { parseJSONResponse } from '@/lib/json-utils'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

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
  timeout: 240000, // 4 minutes
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
 * Helper function for PDF extraction with tool calling
 */
export async function callAnthropicPDFExtraction(
  userPrompt: string,
  options: Omit<AnthropicCallOptions, 'tools' | 'toolChoice'> = {}
): Promise<AnthropicResponse<any>> {
  const pdfExtractionTool: Anthropic.Tool = {
    name: 'extract_resume_data',
    description: 'Extract structured data from a resume PDF',
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
            github: { type: 'string' },
            portfolio: { type: 'string' }
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
              location: { type: 'string' },
              startDate: { type: 'string' },
              endDate: { type: 'string' },
              description: { type: 'array', items: { type: 'string' } },
              achievements: { type: 'array', items: { type: 'string' } }
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
              location: { type: 'string' },
              graduationDate: { type: 'string' },
              gpa: { type: 'string' },
              honors: { type: 'array', items: { type: 'string' } }
            },
            required: ['degree', 'school', 'graduationDate']
          }
        },
        skills: {
          type: 'object',
          properties: {
            technical: { type: 'array', items: { type: 'string' } },
            soft: { type: 'array', items: { type: 'string' } },
            languages: { type: 'array', items: { type: 'string' } },
            certifications: { type: 'array', items: { type: 'string' } }
          }
        },
        projects: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              technologies: { type: 'array', items: { type: 'string' } },
              link: { type: 'string' }
            },
            required: ['name', 'description', 'technologies']
          }
        }
      },
      required: ['personalInfo', 'experience', 'education', 'skills']
    }
  }

  return callAnthropic(userPrompt, {
    ...options,
    tools: [pdfExtractionTool],
    toolChoice: { type: 'tool', name: 'extract_resume_data' }
  })
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