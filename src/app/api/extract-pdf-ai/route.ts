import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { DocumentService, UserService, UsageService, generateFileHash } from '@/lib/database'

interface ExtractedResumeData {
  text: string
  metadata: {
    pages: number
    wordCount: number
    fileName: string
    fileSize: number
    extractedAt: string
    aiProvider: string
    fromCache?: boolean
  }
}

const SYSTEM_PROMPT = `You are an expert resume parser and markdown formatter. Your task is to extract text content from PDF documents and format it as clean, professional markdown.

Instructions:
1. Extract ALL text content from the PDF document
2. Format the content as clean markdown with proper hierarchy:
   - Use # for the person's name (main header)
   - Use ## for major sections (EXPERIENCE, EDUCATION, SKILLS, etc.)
   - Use ### for job titles, company names, or subsections
   - Use **bold** for important details like contact info, company names, dates
   - Use - for bullet points and lists
   - Use *italic* for job descriptions or dates where appropriate
   - Preserve tables using markdown table format if present

3. Maintain the logical structure and flow of the original resume
4. Preserve all important information including:
   - Contact information (email, phone, LinkedIn, etc.)
   - Work experience with dates, companies, and descriptions
   - Education details
   - Skills and technologies
   - Any other relevant sections
   - Tables, figures, and structured data

5. Make the markdown readable and professional
6. If multiple pages are in the PDF, combine them into a single coherent document

Please respond with a JSON object containing:
- "markdown": the extracted content formatted as clean markdown
- "summary": a brief summary of the resume content
- "sections": an array of main sections found in the resume

Output the content as clean, well-formatted markdown that would look professional when rendered.`

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const provider = formData.get('provider') as string || 'anthropic'
    const userId = formData.get('userId') as string | null // Optional user ID
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are supported for extraction' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit for direct PDF processing)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 10MB allowed for PDF processing.' },
        { status: 400 }
      )
    }

    console.log(`Starting PDF extraction for: ${file.name}`)
    console.log(`Using AI provider: ${provider}`)

    // Convert file to buffer and generate hash
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileHash = generateFileHash(buffer)
    
    console.log(`File hash: ${fileHash}`)

    // Check if document was already processed
    const existingDocument = await DocumentService.findByHash(fileHash)
    
    if (existingDocument) {
      console.log(`Found cached document for ${file.name}`)
      
      // Return cached result
      const extractedData: ExtractedResumeData = {
        text: existingDocument.extractedText,
        metadata: {
          pages: existingDocument.pageCount,
          wordCount: existingDocument.wordCount,
          fileName: file.name,
          fileSize: file.size,
          extractedAt: existingDocument.processedAt.toISOString(),
          aiProvider: existingDocument.aiProvider,
          fromCache: true
        }
      }

      // Record usage if user is provided
      if (userId) {
        await UsageService.recordUsage({
          userId,
          documentId: existingDocument.id,
          action: 'EXTRACT_PDF',
          cost: 0, // Free from cache
          creditsUsed: 0
        })
      }

      return NextResponse.json({
        success: true,
        data: extractedData,
        summary: existingDocument.summary || "Resume content extracted from cache",
        sections: existingDocument.sections || ["Resume Content"],
        fromCache: true
      })
    }

    // Check user limits if user ID is provided
    if (userId) {
      const limitCheck = await UserService.checkRoastLimit(userId)
      if (!limitCheck.canRoast) {
        return NextResponse.json(
          { error: `Monthly roast limit exceeded. Used ${limitCheck.used}/${limitCheck.limit} for ${limitCheck.tier} tier.` },
          { status: 429 }
        )
      }
    }

    if (provider !== 'anthropic') {
      return NextResponse.json(
        { error: 'Only Anthropic Claude provider supports direct PDF processing.' },
        { status: 400 }
      )
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not found in environment variables.' },
        { status: 500 }
      )
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const base64Data = buffer.toString('base64')

    console.log('Sending PDF directly to LLM...')
    
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the resume content from this PDF and format it as clean markdown. Make sure to capture all text and maintain the professional structure, including any tables or figures. Respond with JSON containing markdown, summary, and sections fields."
            },
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64Data
              }
            }
          ]
        }
      ]
    })

    // Extract text content from the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    let extractedData: any
    let cleanText: string
    
    try {
      // Claude might wrap JSON in code blocks, so let's handle that
      let jsonText = responseText.trim()
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/```\s*$/, '')
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/```\s*$/, '')
      }
      
      // Try to parse as JSON
      extractedData = JSON.parse(jsonText)
      
      // Extract only the markdown content
      cleanText = extractedData.markdown?.trim() || ''
      
      if (!cleanText) {
        throw new Error('No markdown content found in response')
      }
      
    } catch (parseError) {
      console.log('Failed to parse JSON response, treating entire response as markdown')
      
      // If JSON parsing fails, use the entire response as markdown
      cleanText = responseText.trim()
      extractedData = {
        markdown: cleanText,
        summary: "Resume content extracted and formatted as markdown",
        sections: ["Resume Content"]
      }
    }

    // Count words
    const wordCount = cleanText.split(/\s+/).filter((word: string) => word.length > 0).length

    // Estimate pages (rough estimate based on typical resume length)
    const estimatedPages = Math.ceil(wordCount / 500) // Assume ~500 words per page

    const processingTime = Date.now() - startTime

    // Calculate extraction cost (rough estimate)
    const estimatedCost = estimatedPages * 0.02 // $0.02 per page

    // Save document to database
    const savedDocument = await DocumentService.create({
      userId: userId || undefined,
      filename: file.name,
      originalSize: file.size,
      fileHash,
      mimeType: file.type,
      extractedText: cleanText,
      wordCount,
      pageCount: estimatedPages,
      aiProvider: provider,
      extractionCost: estimatedCost,
      summary: extractedData.summary,
      sections: extractedData.sections,
      processingTime
    })

    // Record usage and increment roast count if user is provided
    if (userId) {
      await Promise.all([
        UsageService.recordUsage({
          userId,
          documentId: savedDocument.id,
          action: 'EXTRACT_PDF',
          cost: estimatedCost,
          creditsUsed: 1
        }),
        UserService.incrementRoastCount(userId)
      ])
    }

    const resultData: ExtractedResumeData = {
      text: cleanText,
      metadata: {
        pages: estimatedPages,
        wordCount,
        fileName: file.name,
        fileSize: file.size,
        extractedAt: new Date().toISOString(),
        aiProvider: provider,
        fromCache: false
      }
    }

    console.log(`Successfully extracted ${wordCount} words using ${provider} in ${processingTime}ms`)

    return NextResponse.json({
      success: true,
      data: resultData,
      summary: extractedData.summary || "Resume content extracted successfully",
      sections: extractedData.sections || ["Resume Content"],
      fromCache: false
    })

  } catch (error) {
    console.error('AI PDF extraction error:', error)
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('401')) {
        return NextResponse.json(
          { error: 'AI service configuration error. Please check your ANTHROPIC_API_KEY in environment variables.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('rate limit') || error.message.includes('quota') || error.message.includes('429')) {
        return NextResponse.json(
          { error: 'AI service rate limit reached. Please try again later.' },
          { status: 429 }
        )
      }

      if (error.message.includes('overloaded') || error.message.includes('500')) {
        return NextResponse.json(
          { error: 'AI service is temporarily overloaded. Please try again in a moment.' },
          { status: 503 }
        )
      }

      if (error.message.includes('document')) {
        return NextResponse.json(
          { error: 'PDF document could not be processed. Please ensure the file is a valid PDF.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to extract text from PDF using AI. Please try again.' },
      { status: 500 }
    )
  }
} 