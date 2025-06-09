import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db, UserService } from '@/lib/database'
import { run } from '@openai/agents'
import { getMainAgent } from '@/lib/agents'
import { ConversationService } from '@/lib/database'

const SYSTEM_PROMPT = `You are an expert resume optimization assistant. Your role is to help users create the perfect resume for their target job.

When users provide enough information about their background and target job, you should:
1. Generate a complete LaTeX resume using the selected template
2. Return the LaTeX source code wrapped in \`\`\`latex code blocks
3. Provide clear explanations of your optimization choices

Focus on:
- Tailoring content to the specific job requirements
- Highlighting relevant skills and achievements
- Using strong action verbs and quantifiable results
- Optimizing for ATS (Applicant Tracking Systems)
- Following best practices for the selected template style

Always be helpful, professional, and provide actionable advice.`

const MAX_CONVERSATION_TOKENS = 100000

// Simple token estimation function (roughly 4 characters = 1 token)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Trim conversation history to stay within token limit
function trimConversationHistory(conversation: any[]): any[] {
  if (!conversation || !Array.isArray(conversation)) {
    return []
  }

  // Filter out loading messages and invalid entries
  const validMessages = conversation.filter((msg: any) => 
    msg.sender && msg.content && !msg.isLoading
  )

  // Calculate total tokens for all messages
  let totalTokens = 0
  const messagesWithTokens = validMessages.map((msg: any) => {
    const tokens = estimateTokens(msg.content)
    totalTokens += tokens
    return { ...msg, tokens }
  })

  // If under limit, return all messages
  if (totalTokens <= MAX_CONVERSATION_TOKENS) {
    return validMessages
  }

  console.log(`Conversation history exceeds ${MAX_CONVERSATION_TOKENS} tokens (${totalTokens}), trimming...`)

  // Keep the most recent messages that fit within the limit
  const trimmedMessages = []
  let currentTokens = 0

  // Start from the end (most recent) and work backwards
  for (let i = messagesWithTokens.length - 1; i >= 0; i--) {
    const msg = messagesWithTokens[i]
    if (currentTokens + msg.tokens <= MAX_CONVERSATION_TOKENS) {
      trimmedMessages.unshift(msg) // Add to beginning to maintain order
      currentTokens += msg.tokens
    } else {
      break
    }
  }

  console.log(`Trimmed conversation from ${validMessages.length} to ${trimmedMessages.length} messages (${currentTokens} tokens)`)
  return trimmedMessages
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { message, conversation, conversationId, selectedTemplate, selectedLLM = 'gpt-4o-mini', stream = true } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Handle conversation persistence
    let currentConversationId = conversationId
    let shouldCreateConversation = false

    // If no conversationId provided, we'll create a new conversation after getting the response
    if (!currentConversationId) {
      shouldCreateConversation = true
    } else {
      // Verify the conversation exists and belongs to the user
      const existingConversation = await ConversationService.getConversationWithMessages(currentConversationId, user.id)
      if (!existingConversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        )
      }
    }

    // Build conversation context with token limit
    let conversationContext = ''
    if (conversation && Array.isArray(conversation)) {
      const trimmedConversation = trimConversationHistory(conversation)
      conversationContext = trimmedConversation
        .map((msg: any) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n')
      
      // Log conversation stats
      const originalLength = conversation.filter((msg: any) => msg.sender && msg.content && !msg.isLoading).length
      const trimmedLength = trimmedConversation.length
      const contextTokens = estimateTokens(conversationContext)
      
      console.log(`Conversation context: ${trimmedLength}/${originalLength} messages, ~${contextTokens} tokens`)
    }

    // Create the prompt with template context and conversation history
    const templateInfo = selectedTemplate ? `\nSelected LaTeX template: ${selectedTemplate}` : ''
    const fullPrompt = `${conversationContext ? `Previous conversation:\n${conversationContext}\n\n` : ''}User: ${message}${templateInfo}`

    console.log('Chat resume optimize request:', {
      userEmail: session.user.email,
      messageLength: message.length,
      hasConversation: !!conversationContext,
      selectedTemplate,
      selectedLLM
    })

    // TEMPORARY: Resume optimization is FREE for limited time!
    // Check if user can afford this model (for future reference, but don't block)
    const affordability = await UserService.checkModelAffordability(user.id, selectedLLM)
    
    // Override affordability for free promotion
    const freeAffordability = {
      ...affordability,
      canAfford: true,
      creditCost: 0, // Free for now!
      isPromotion: true
    }

    // Handle streaming responses
    if (stream) {
      return handleStreamingResponse(user, selectedLLM, fullPrompt, freeAffordability, selectedTemplate, conversation, message, currentConversationId, shouldCreateConversation)
    }

    // Non-streaming fallback
    try {
      const agent = getMainAgent(selectedLLM)
      const result = await run(agent, fullPrompt, {
        maxTurns: 10
      })

      // TEMPORARY: Don't deduct credits during free promotion
      // await UserService.deductModelCredits(user.id, selectedLLM)
      await logLLMCall(user.id, 'openai', selectedLLM, 0, freeAffordability.creditCost, fullPrompt, result.finalOutput || '')

      const hasLatexCode = (result.finalOutput || '').includes('```latex')

      return NextResponse.json({
        success: true,
        response: result.finalOutput || '',
        hasLatexCode,
        metadata: {
          selectedTemplate,
          selectedLLM,
          provider: 'openai-agents',
          creditsDeducted: freeAffordability.creditCost,
          isPromotion: true,
          promotionMessage: "🎉 Resume optimization is FREE for a limited time!"
        }
      })

    } catch (llmError) {
      console.error('Agent run failed:', llmError)
      return NextResponse.json(
        { error: 'Failed to generate response. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in chat resume optimize:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

async function handleStreamingResponse(user: any, model: string, fullPrompt: string, affordability: any, selectedTemplate: string, conversation: any[], userMessage: string, conversationId?: string, shouldCreateConversation?: boolean) {
  try {
    console.log('Starting agent-based streaming response...')
    
    // Send initial chunk with conversation stats
    const conversationStats = {
      totalMessages: conversation?.length || 0,
      contextMessages: trimConversationHistory(conversation || []).length,
      estimatedTokens: estimateTokens(fullPrompt),
      wasTrimmed: (conversation?.length || 0) > (trimConversationHistory(conversation || []).length)
    }
    
    // Create a streaming response using the agent system
    const enhancedStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        let accumulatedResponse = ''
        let hasLatexCode = false
        let isFirstChunk = true
        
        try {
          // Send conversation stats first
          if (isFirstChunk) {
            const statsData = {
              chunk: '',
              isComplete: false,
              hasLatexCode: false,
              metadata: undefined,
              conversationStats: conversationStats
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(statsData)}\n\n`))
            isFirstChunk = false
          }
          
          // Use real streaming with the selected model
          const agent = getMainAgent(model)
          const result = await run(agent, fullPrompt, {
            maxTurns: 10,
            stream: true
          })
          
          // Process streaming events
          for await (const event of result) {
            if (
              event.type === 'raw_model_stream_event' &&
              event.data.type === 'output_text_delta'
            ) {
              const chunk = event.data.delta
              accumulatedResponse += chunk
              
              const data = {
                chunk: chunk,
                isComplete: false,
                hasLatexCode: false,
                metadata: undefined
              }
              
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
            }
          }
          
          // Send final completion with metadata
          hasLatexCode = accumulatedResponse.includes('```latex')
          const finalData = {
            chunk: '',
            isComplete: true,
            hasLatexCode: hasLatexCode,
            metadata: {
              selectedTemplate: selectedTemplate,
              selectedLLM: model,
              provider: 'openai-agents',
              creditsDeducted: affordability.creditCost,
              isPromotion: true,
              promotionMessage: "🎉 Resume optimization is FREE for a limited time!"
            }
          }
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalData)}\n\n`))
          
          // TEMPORARY: Don't deduct credits during free promotion
          // await UserService.deductModelCredits(user.id, model)
          
          // Save conversation if needed
          let finalConversationId = conversationId
          if (shouldCreateConversation && userMessage) {
            try {
              const title = ConversationService.generateTitle(userMessage)
              const newConversation = await ConversationService.create({
                userId: user.id,
                title,
                selectedTemplate,
                selectedModel: model
              })
              finalConversationId = newConversation.id
            } catch (convError) {
              console.error('Failed to create conversation:', convError)
            }
          }

          // Save messages to conversation
          if (finalConversationId && accumulatedResponse) {
            try {
              // Save user message
              await ConversationService.addMessage({
                conversationId: finalConversationId,
                role: 'user',
                content: userMessage,
                model,
                template: selectedTemplate
              })

              // Save assistant response
              await ConversationService.addMessage({
                conversationId: finalConversationId,
                role: 'assistant',
                content: accumulatedResponse,
                model,
                template: selectedTemplate,
                tokensUsed: 0, // Agent system doesn't provide token counts
                costUsd: affordability.creditCost,
                hasLatexCode: hasLatexCode
              })
            } catch (convError) {
              console.error('Failed to save conversation messages:', convError)
            }
          }
          
          // Send final completion signal
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
          controller.close()
          
        } catch (error) {
          console.error('Agent streaming error:', error)
          const errorData = JSON.stringify({
            chunk: `\n\nI apologize, but I encountered an error while processing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
            isComplete: true,
            hasLatexCode: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
          controller.close()
        }
      }
    })

    return new Response(enhancedStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })

  } catch (error) {
    console.error('Streaming setup error:', error)
    
    // Return error as streaming response
    const encoder = new TextEncoder()
    const errorStream = new ReadableStream({
      start(controller) {
        const errorData = JSON.stringify({
          chunk: `I apologize, but I encountered an error while setting up the streaming response: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
          isComplete: true,
          hasLatexCode: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
        controller.close()
      }
    })

    return new Response(errorStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }
}

async function logLLMCall(userId: string, provider: string, model: string, tokensUsed: number, estimatedCost: number, prompt: string, responseContent: string) {
  try {
    const llmCall = await db.llmCall.create({
      data: {
        userId: userId,
        provider: provider,
        model: model,
        operationType: 'resume_chat',
        totalTokens: tokensUsed,
        totalCostUsd: estimatedCost,
        status: 'COMPLETED',
        completedAt: new Date()
      }
    })

    await db.llmMessage.create({
      data: {
        llmCallId: llmCall.id,
        role: 'user',
        content: prompt,
        messageIndex: 0,
        totalTokens: Math.floor(tokensUsed * 0.8)
      }
    })

    await db.llmMessage.create({
      data: {
        llmCallId: llmCall.id,
        role: 'assistant',
        content: responseContent,
        messageIndex: 1,
        totalTokens: Math.floor(tokensUsed * 0.2)
      }
    })
  } catch (dbError) {
    console.error('Failed to log LLM call:', dbError)
  }
} 