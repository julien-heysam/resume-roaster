import OpenAI from 'openai'
import { parseJSONResponse, isContentIncomplete } from '@/lib/json-utils'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Default model constants
export const OPENAI_MODELS = {
  NANO: 'gpt-4.1-nano',
  MINI: 'gpt-4.1-mini',
  NORMAL: 'gpt-4.1',
  LARGE: 'o4-mini-high'
} as const

// Default context size constants
export const CONTEXT_SIZES = {
  MINI: 1000,
  NORMAL: 4000,
  LARGE: 8000,
  XLARGE: 40000
} as const

// Default temperature constants
export const TEMPERATURES = {
  DETERMINISTIC: 0,
  LOW: 0.1,
  NORMAL: 0.3,
  HIGH: 0.7,
  CREATIVE: 1.0
} as const

export interface OpenAICallOptions {
  model?: string
  maxTokens?: number
  temperature?: number
  timeout?: number
  enforceJSON?: boolean
  systemPrompt?: string
  retryOnIncomplete?: boolean
  tools?: OpenAI.Chat.Completions.ChatCompletionTool[]
  toolChoice?: OpenAI.Chat.Completions.ChatCompletionToolChoiceOption
}

export interface OpenAIResponse<T = any> {
  data: T
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  cost: number
  processingTime: number
  finishReason: string
  usedContinuation?: boolean
}

export interface OpenAIError extends Error {
  code?: string
  status?: number
  type?: string
}

// Default options (excluding optional tool properties)
const DEFAULT_OPTIONS = {
  model: OPENAI_MODELS.MINI,
  maxTokens: CONTEXT_SIZES.NORMAL,
  temperature: TEMPERATURES.NORMAL,
  timeout: 240000, // 4 minutes
  enforceJSON: false,
  systemPrompt: '',
  retryOnIncomplete: true
} as const

// Pricing per 1K tokens (input/output)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  [OPENAI_MODELS.MINI]: { input: 0.00015, output: 0.0006 },
  [OPENAI_MODELS.NANO]: { input: 0.00015, output: 0.0006 },
  [OPENAI_MODELS.NORMAL]: { input: 0.005, output: 0.015 },
  [OPENAI_MODELS.LARGE]: { input: 0.03, output: 0.06 }
}

/**
 * Get pricing for a model (with fallback for legacy model names)
 */
function getModelPricing(model: string): { input: number; output: number } {
  // Check if it's already in our pricing table
  if (MODEL_PRICING[model]) {
    return MODEL_PRICING[model]
  }
  
  // Handle legacy model names
  const legacyMapping: Record<string, string> = {
    'gpt-4.1-nano': OPENAI_MODELS.NANO,
    'gpt-4.1-mini': OPENAI_MODELS.MINI,
    'gpt-4.1': OPENAI_MODELS.NORMAL,
    'o4-mini-high': OPENAI_MODELS.LARGE
  }
  
  const mappedModel = legacyMapping[model]
  if (mappedModel && MODEL_PRICING[mappedModel]) {
    return MODEL_PRICING[mappedModel]
  }
  
  // Default fallback
  return MODEL_PRICING[OPENAI_MODELS.MINI]
}

/**
 * Calculate cost based on token usage and model
 */
function calculateCost(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = getModelPricing(model)
  return (promptTokens * pricing.input + completionTokens * pricing.output) / 1000
}

/**
 * Main OpenAI API call function with JSON enforcement and error handling
 */
export async function callOpenAI<T = any>(
  userPrompt: string,
  options: OpenAICallOptions = {}
): Promise<OpenAIResponse<T>> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const startTime = Date.now()

  console.log('🚀 Starting OpenAI API call...')
  console.log('Model:', opts.model)
  console.log('Max tokens:', opts.maxTokens)
  console.log('Temperature:', opts.temperature)
  console.log('Enforce JSON:', opts.enforceJSON)
  console.log('Prompt length:', userPrompt.length)

  try {
    // Prepare messages
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = []
    
    if (opts.systemPrompt) {
      messages.push({
        role: 'system',
        content: opts.systemPrompt
      })
    }
    
    messages.push({
      role: 'user',
      content: userPrompt
    })

    // Prepare request options
    const requestOptions: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
      model: opts.model,
      messages,
      max_tokens: opts.maxTokens,
      temperature: opts.temperature,
    }

    // Add JSON format enforcement if requested (and no tools)
    if (opts.enforceJSON && !opts.tools) {
      requestOptions.response_format = { type: 'json_object' }
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

    let completion: OpenAI.Chat.Completions.ChatCompletion
    try {
      completion = await openai.chat.completions.create(requestOptions)
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${opts.timeout / 1000} seconds`)
      }
      throw error
    }

    clearTimeout(timeoutId)
    const apiCallTime = Date.now() - startTime
    console.log(`✅ OpenAI API call completed in ${apiCallTime}ms`)

    const message = completion.choices[0]?.message
    if (!message) {
      throw new Error('No message generated')
    }

    const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    const cost = calculateCost(opts.model, usage.prompt_tokens, usage.completion_tokens)
    const finishReason = completion.choices[0]?.finish_reason || 'stop'

    let parsedData: T
    let finalContent = ''
    let usedContinuation = false

    // Handle function calling response
    if (message.tool_calls && message.tool_calls.length > 0) {
      console.log('✅ Function call response received')
      const toolCall = message.tool_calls[0]
      if (toolCall.function?.arguments) {
        try {
          parsedData = JSON.parse(toolCall.function.arguments) as T
          finalContent = toolCall.function.arguments
          console.log('✅ Function call arguments parsed successfully')
        } catch (parseError) {
          console.error('❌ Failed to parse function call arguments:', parseError)
          throw new Error('Failed to parse function call response')
        }
      } else {
        throw new Error('No function arguments in tool call')
      }
    } else {
      // Handle regular content response
      const content = message.content
      if (!content) {
        throw new Error('No content generated')
      }
      finalContent = content

      // Handle JSON parsing if enforced
      if (opts.enforceJSON) {
        try {
          parsedData = JSON.parse(content) as T
          console.log('✅ JSON parsing successful')
        } catch (parseError) {
          console.error('❌ JSON parsing failed despite enforcement:', parseError)
          throw new Error('Failed to parse JSON response despite enforcement')
        }
      } else {
        // Try to parse as JSON if it looks like JSON, otherwise return as string
        // First check if content contains at least one '{' - if not, it's definitely not JSON
        if (!content.includes('{')) {
          console.log('✅ No JSON braces found, returning as plain text')
          parsedData = content as T
        } else {
          try {
            parsedData = parseJSONResponse(content) as T
            console.log('✅ JSON parsing successful')
          } catch (parseError) {
            // Check if content appears incomplete and retry with continuation
            if (opts.retryOnIncomplete && isContentIncomplete(content)) {
              console.log('🔄 Content appears incomplete, attempting continuation...')
              
              try {
                const continuationMessages = [
                  ...messages,
                  { role: 'assistant' as const, content },
                  { role: 'user' as const, content: 'Continue please. Complete the JSON response from where you left off.' }
                ]

                const continuationCompletion = await openai.chat.completions.create({
                  model: opts.model,
                  messages: continuationMessages,
                  max_tokens: Math.min(opts.maxTokens, 20000),
                  temperature: opts.temperature,
                  ...(opts.enforceJSON ? { response_format: { type: 'json_object' as const } } : {})
                })

                const continuationContent = continuationCompletion.choices[0]?.message?.content || ''
                finalContent = content + continuationContent
                usedContinuation = true

                // Update usage and cost
                const continuationUsage = continuationCompletion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
                usage.prompt_tokens += continuationUsage.prompt_tokens
                usage.completion_tokens += continuationUsage.completion_tokens
                usage.total_tokens += continuationUsage.total_tokens

                console.log('🔗 Continuation completed, attempting to parse combined content...')
                
                if (opts.enforceJSON) {
                  parsedData = JSON.parse(finalContent) as T
                } else {
                  parsedData = parseJSONResponse(finalContent) as T
                }
                
                console.log('✅ JSON parsing successful after continuation')
              } catch (continuationError) {
                console.error('❌ Continuation failed:', continuationError)
                throw new Error('Failed to complete response even with continuation')
              }
            } else {
              // Return content as string if not JSON
              parsedData = content as T
            }
          }
        }
      }
    }

    const processingTime = Date.now() - startTime
    const finalCost = calculateCost(opts.model, usage.prompt_tokens, usage.completion_tokens)

    console.log('📊 OpenAI call completed successfully')
    console.log('Processing time:', processingTime, 'ms')
    console.log('Tokens used:', usage.total_tokens)
    console.log('Cost:', finalCost)
    console.log('Used continuation:', usedContinuation)

    return {
      data: parsedData,
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens
      },
      cost: finalCost,
      processingTime,
      finishReason,
      usedContinuation
    }

  } catch (error: any) {
    const processingTime = Date.now() - startTime
    console.error('❌ OpenAI API call failed:', error)
    
    // Create a more informative error
    const openaiError: OpenAIError = new Error(error.message || 'OpenAI API call failed')
    openaiError.code = error.code
    openaiError.status = error.status
    openaiError.type = error.type
    openaiError.name = 'OpenAIError'
    
    throw openaiError
  }
}

/**
 * Convenience function for JSON-enforced calls
 */
export async function callOpenAIJSON<T = any>(
  userPrompt: string,
  options: Omit<OpenAICallOptions, 'enforceJSON'> = {}
): Promise<OpenAIResponse<T>> {
  return callOpenAI<T>(userPrompt, { ...options, enforceJSON: true })
}

/**
 * Convenience function for text generation
 */
export async function callOpenAIText(
  userPrompt: string,
  options: Omit<OpenAICallOptions, 'enforceJSON'> = {}
): Promise<OpenAIResponse<string>> {
  return callOpenAI<string>(userPrompt, { ...options, enforceJSON: false })
}

/**
 * Helper function for resume optimization with function calling
 */
export async function callOpenAIResumeOptimization(
  userPrompt: string,
  options: Omit<OpenAICallOptions, 'tools' | 'toolChoice' | 'enforceJSON'> = {}
): Promise<OpenAIResponse<any>> {
  const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
      type: 'function',
      function: {
        name: 'optimize_resume_data',
        description: 'Optimizes resume data for ATS systems and job requirements while maintaining truthfulness',
        parameters: {
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
    }
  ]

  return callOpenAI(userPrompt, {
    ...options,
    tools,
    toolChoice: { type: 'function', function: { name: 'optimize_resume_data' } }
  })
}

/**
 * Helper function for job description summarization with function calling
 */
export async function callOpenAIJobSummary(
  userPrompt: string,
  options: Omit<OpenAICallOptions, 'tools' | 'toolChoice' | 'enforceJSON'> = {}
): Promise<OpenAIResponse<any>> {
  const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
      type: 'function',
      function: {
        name: 'summarize_job_description',
        description: 'Analyzes and summarizes a job description, extracting key information',
        parameters: {
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
    }
  ]

  return callOpenAI(userPrompt, {
    ...options,
    tools,
    toolChoice: { type: 'function', function: { name: 'summarize_job_description' } }
  })
}

/**
 * Helper function for PDF extraction with function calling
 */
export async function callOpenAIPDFExtraction(
  userPrompt: string,
  options: Omit<OpenAICallOptions, 'tools' | 'toolChoice' | 'enforceJSON'> = {}
): Promise<OpenAIResponse<any>> {
  const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
      type: 'function',
      function: {
        name: 'extract_resume_content',
        description: 'Extracts and formats resume content from PDF as clean, professional markdown',
        parameters: {
          type: 'object',
          properties: {
            markdown: {
              type: 'string',
              description: 'The extracted content formatted as clean markdown'
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
    }
  ]

  return callOpenAI(userPrompt, {
    ...options,
    tools,
    toolChoice: { type: 'function', function: { name: 'extract_resume_content' } }
  })
} 