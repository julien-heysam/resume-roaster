import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'
import { legacyParseJSON } from '@/lib/json-utils'
import { callAnthropicResumeOptimization, ANTHROPIC_MODELS, ANTHROPIC_CONTEXT_SIZES, ANTHROPIC_TEMPERATURES } from '@/lib/anthropic-utils'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const startTime = Date.now()
    
    const { 
      resumeText, 
      documentId, 
      analysisId
    } = await request.json()

    console.log('=== EXTRACT RESUME DEBUG ===')
    console.log('Resume text length:', resumeText?.length || 0)
    console.log('Document ID:', documentId)
    console.log('Analysis ID:', analysisId)

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
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

    // Truncate resume text if too long (keep within reasonable limits for API)
    const maxResumeLength = 30_000 // Reasonable limit for resume text
    const truncatedResumeText = resumeText.length > maxResumeLength 
      ? resumeText.substring(0, maxResumeLength) + '\n\n[Resume truncated for processing...]'
      : resumeText

    console.log('Truncated resume text length:', truncatedResumeText.length)

    // Create content hash for deduplication
    const contentHash = crypto
      .createHash('sha256')
      .update(truncatedResumeText)
      .digest('hex')

    // Check for cached extracted resume first
    const cachedExtractedResume = await db.extractedResume.findUnique({
      where: { contentHash },
      include: {
        user: true,
        document: true,
        analysis: true
      }
    })

    if (cachedExtractedResume) {
      console.log('Returning cached extracted resume')
      
      // Update usage count and last used
      await db.extractedResume.update({
        where: { id: cachedExtractedResume.id },
        data: {
          usageCount: { increment: 1 },
          lastUsedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        data: JSON.parse(cachedExtractedResume.extractedData),
        cached: true,
        usageCount: cachedExtractedResume.usageCount + 1,
        extractedResumeId: cachedExtractedResume.id,
        metadata: {
          processingTime: Date.now() - startTime,
          fromCache: true
        }
      })
    }

    console.log('No cached extracted resume found, generating new one...')

    // Create the extraction prompt (no job description, just pure extraction)
    const prompt = `Extract and structure the following resume data into a comprehensive JSON format.

RESUME TEXT:
${truncatedResumeText}

IMPORTANT INSTRUCTIONS:
1. Extract information accurately from the resume text
2. Preserve all original content and details
3. Ensure all dates are in MM/YYYY format
4. If information is missing, use null or empty arrays as appropriate
5. Do not optimize or modify the content - just extract it as-is

Please use the optimize_resume_data function to return the structured data.`

    console.log('Final prompt length:', prompt.length)
    console.log('Estimated tokens (rough):', Math.ceil(prompt.length / 4))
    console.log('=== END DEBUG ===')

    // Use centralized Anthropic utility with function calling
    const response = await callAnthropicResumeOptimization(prompt, {
      model: ANTHROPIC_MODELS.SONNET,
      maxTokens: ANTHROPIC_CONTEXT_SIZES.NORMAL,
      temperature: ANTHROPIC_TEMPERATURES.DETERMINISTIC,
      systemPrompt: 'You are an expert resume parser. Extract resume data into structured JSON format exactly as provided in the resume. Do not optimize or modify content - just extract it accurately. Use the provided tool to return structured data.'
    })

    const extractedData = response.data
    const processingTime = response.processingTime
    const tokensUsed = response.usage.totalTokens
    const estimatedCost = response.cost

    console.log('Resume extraction completed successfully')
    console.log('Processing time:', processingTime, 'ms')
    console.log('Tokens used:', tokensUsed)
    console.log('Used tools:', response.usedTools)

    // Store the extraction in database using LLMConversation
    let conversationId = null
    try {
      // Create LLM conversation record
      const conversation = await db.lLMConversation.create({
        data: {
          userId: user.id,
          type: 'RESUME_EXTRACTION',
          title: `Resume Extraction - ${new Date().toLocaleDateString()}`,
          provider: 'anthropic',
          model: 'claude-sonnet-4-20250514',
          totalTokensUsed: tokensUsed,
          totalCost: estimatedCost,
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      conversationId = conversation.id

      // Create messages for the conversation
      await db.lLMMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'USER',
          content: `Extract resume data:\n\nResume length: ${truncatedResumeText.length} chars`,
          messageIndex: 0,
          inputTokens: tokensUsed,
          totalTokens: tokensUsed
        }
      })

      await db.lLMMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'ASSISTANT',
          content: extractedData,
          messageIndex: 1,
          outputTokens: tokensUsed,
          totalTokens: tokensUsed,
          cost: estimatedCost,
          processingTime: processingTime,
          finishReason: response.stopReason || 'end_turn',
          temperature: 0.1,
          maxTokens: ANTHROPIC_CONTEXT_SIZES.NORMAL
        }
      })

      console.log('Resume extraction stored in database')
    } catch (dbError) {
      console.error('Failed to store resume extraction:', dbError)
      // Continue without failing the request
    }

    // Save extracted resume to database
    let extractedResumeId = null
    try {
      const extractedResume = await db.extractedResume.create({
        data: {
          userId: user.id,
          documentId: documentId || null,
          analysisId: analysisId || null,
          contentHash,
          resumeText: truncatedResumeText,
          extractedData: JSON.stringify(extractedData),
          provider: 'anthropic',
          model: 'claude-sonnet-4-20250514',
          conversationId: conversationId || null,
          totalTokensUsed: tokensUsed,
          totalCost: estimatedCost,
          processingTime: processingTime,
          usageCount: 1,
          lastUsedAt: new Date()
        }
      })
      
      extractedResumeId = extractedResume.id
      console.log('Extracted resume saved to database')
    } catch (dbError) {
      console.error('Failed to save extracted resume:', dbError)
      // Continue without failing the request
    }

    // Record usage
    if (documentId) {
      try {
        await db.usageRecord.create({
          data: {
            userId: user.id,
            documentId: documentId,
            action: 'RESUME_EXTRACTION',
            cost: estimatedCost,
            creditsUsed: 1,
            billingMonth: new Date().toISOString().slice(0, 7) // YYYY-MM format
          }
        })
      } catch (usageError) {
        console.error('Failed to record usage:', usageError)
      }
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
      cached: false,
      usageCount: 1,
      extractedResumeId,
      metadata: {
        tokensUsed,
        processingTime,
        estimatedCost,
        fromCache: false
      }
    })

  } catch (error) {
    console.error('Error extracting resume data:', error)
    return NextResponse.json(
      { error: 'Failed to extract resume data' },
      { status: 500 }
    )
  }
} 