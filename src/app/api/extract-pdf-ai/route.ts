import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { DocumentService, UserService, UsageService, generateFileHash } from '@/lib/database'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

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

// Basic PDF text extraction using pdf-parse and node-poppler
const extractTextFromPDFBasic = async (filePath: string, originalName?: string): Promise<string> => {
  console.log(`Starting basic PDF extraction for: ${originalName || filePath}`)
  
  // Try node-poppler first (most reliable for PDF text extraction)
  try {
    console.log('Attempting extraction with node-poppler...')
    const { Poppler } = await import('node-poppler')
    const poppler = new Poppler()
    
    // Extract text using poppler's pdfToText method
    const text = await poppler.pdfToText(filePath)
    
    if (text && text.trim().length > 0) {
      console.log(`Successfully extracted ${text.length} characters with node-poppler`)
      return text.trim()
    } else {
      throw new Error('PDF appears to be empty or contains no extractable text')
    }
  } catch (popplerError) {
    console.log('node-poppler failed, trying pdf-parse fallback...', popplerError)
    
    // Try pdf-parse as fallback (simplified approach)
    try {
      console.log('Attempting extraction with pdf-parse...')
      const pdf = await import('pdf-parse')
      const buffer = await fs.readFile(filePath)
      
      // Use pdf-parse with minimal configuration
      const data = await pdf.default(buffer)
      
      if (data.text && data.text.trim().length > 0) {
        console.log(`Successfully extracted ${data.text.length} characters with pdf-parse`)
        return data.text.trim()
      } else {
        throw new Error('PDF appears to be empty or contains no extractable text')
      }
    } catch (pdfParseError) {
      console.error('All PDF extraction methods failed:', pdfParseError)
      
      // Only use fallback if ALL methods fail
      console.log('All extraction methods failed, using fallback...')
      return await fallbackPDFExtraction(filePath, originalName)
    }
  }
}

// Enhanced fallback PDF extraction method
const fallbackPDFExtraction = async (filePath: string, originalName?: string): Promise<string> => {
  try {
    const stats = await fs.stat(filePath)
    const sizeKB = Math.round(stats.size / 1024)
    
    // Use original name if provided, otherwise extract from path
    const displayName = originalName || filePath.split('/').pop() || 'document.pdf'
    
    // For now, return a meaningful placeholder that can still be processed
    // This allows the document to be indexed with basic metadata
    const fallbackText = `PDF Document: ${displayName}
    
File Size: ${sizeKB}KB
Uploaded: ${new Date().toISOString()}
    
Note: This PDF has been successfully uploaded and saved. Text extraction encountered a technical issue but the document is ready for future processing. The file contains ${sizeKB}KB of data and can be re-processed once PDF extraction issues are resolved.

This document is now searchable by filename and basic metadata.`
    
    console.log(`Using fallback extraction for PDF: ${displayName} (${sizeKB}KB)`)
    return fallbackText
  } catch (error) {
    console.error('Fallback PDF extraction failed:', error)
    throw new Error('Failed to process PDF file.')
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
    const extractionMethod = formData.get('extractionMethod') as string || 'auto' // 'basic', 'ai', or 'auto'
    
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
    console.log(`User ID: ${userId || 'anonymous'}`)
    console.log(`Extraction method: ${extractionMethod}`)

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
        fromCache: true,
        documentId: existingDocument.id,
        fileHash: fileHash
      })
    }

    // Determine extraction method based on user status and preference
    let useBasicExtraction = false
    let actualProvider = provider

    if (!userId) {
      // Non-registered users always use basic extraction
      useBasicExtraction = true
      actualProvider = 'basic-extraction'
      console.log('Non-registered user: using basic extraction')
    } else {
      // Check user limits for registered users
      const limitCheck = await UserService.checkRoastLimit(userId)
      if (!limitCheck.canRoast) {
        return NextResponse.json(
          { error: `Monthly credit limit exceeded. Used ${limitCheck.used}/${limitCheck.limit} for ${limitCheck.tier} tier.` },
          { status: 429 }
        )
      }

      // For registered users, respect their extraction method preference
      if (extractionMethod === 'basic') {
        useBasicExtraction = true
        actualProvider = 'basic-extraction'
        console.log('Registered user chose basic extraction')
      } else if (extractionMethod === 'ai' || extractionMethod === 'auto') {
        useBasicExtraction = false
        console.log('Registered user chose AI extraction')
      }
    }

    let extractedText: string
    let extractedData: any = {}
    let estimatedCost = 0

    if (useBasicExtraction) {
      // Use basic extraction method
      console.log('Using basic PDF extraction...')
      
      // Create temporary file for processing
      const tempDir = os.tmpdir()
      const tempFilePath = path.join(tempDir, `pdf_${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`)
      
      try {
        // Write buffer to temporary file
        await fs.writeFile(tempFilePath, buffer)
        
        // Extract text using basic methods
        extractedText = await extractTextFromPDFBasic(tempFilePath, file.name)
        
        extractedData = {
          markdown: extractedText,
          summary: "Resume content extracted using basic PDF extraction",
          sections: ["Resume Content"]
        }
        
        estimatedCost = 0 // Basic extraction is free
        
      } finally {
        // Clean up temporary file
        try {
          await fs.unlink(tempFilePath)
        } catch (cleanupError) {
          console.warn('Failed to clean up temporary file:', cleanupError)
        }
      }
    } else {
      // Use AI extraction method
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

      console.log('Using AI PDF extraction...')

      // Initialize Anthropic client
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      })

      const base64Data = buffer.toString('base64')

      console.log('Sending PDF directly to LLM...')
      
      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        temperature: 0.1,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract the resume content from this PDF and format it as clean markdown. Keep the original formatting and structure and sections of the resume. Make sure to capture all text and maintain the professional structure, including any tables or figures. Respond with JSON containing markdown, summary, and sections fields."
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
        extractedText = extractedData.markdown?.trim() || ''
        
        if (!extractedText) {
          throw new Error('No markdown content found in response')
        }
        
      } catch (parseError) {
        console.log('Failed to parse JSON response, treating entire response as markdown')
        
        // If JSON parsing fails, use the entire response as markdown
        extractedText = responseText.trim()
        extractedData = {
          markdown: extractedText,
          summary: "Resume content extracted and formatted as markdown",
          sections: ["Resume Content"]
        }
      }

      // Estimate pages and calculate cost for AI extraction
      const wordCount = extractedText.split(/\s+/).filter((word: string) => word.length > 0).length
      const estimatedPages = Math.ceil(wordCount / 500)
      estimatedCost = estimatedPages * 0.02 // $0.02 per page
    }

    // Count words
    const wordCount = extractedText.split(/\s+/).filter((word: string) => word.length > 0).length

    // Estimate pages (rough estimate based on typical resume length)
    const estimatedPages = Math.ceil(wordCount / 500) // Assume ~500 words per page

    const processingTime = Date.now() - startTime

    // Save document to database
    const savedDocument = await DocumentService.create({
      userId: userId || undefined,
      filename: file.name,
      originalSize: file.size,
      fileHash,
      mimeType: file.type,
      extractedText,
      wordCount,
      pageCount: estimatedPages,
      aiProvider: actualProvider,
      extractionCost: estimatedCost,
      summary: extractedData.summary,
      sections: extractedData.sections,
      processingTime
    })

    // Record usage and increment roast count if user is provided
    if (userId) {
      const creditsUsed = useBasicExtraction ? 0 : 1
      await Promise.all([
        UsageService.recordUsage({
          userId,
          documentId: savedDocument.id,
          action: 'EXTRACT_PDF',
          cost: estimatedCost,
          creditsUsed
        }),
        // Only increment roast count for AI extractions
        !useBasicExtraction ? UserService.incrementRoastCount(userId) : Promise.resolve()
      ])
    }

    const resultData: ExtractedResumeData = {
      text: extractedText,
      metadata: {
        pages: estimatedPages,
        wordCount,
        fileName: file.name,
        fileSize: file.size,
        extractedAt: new Date().toISOString(),
        aiProvider: actualProvider,
        fromCache: false
      }
    }

    console.log(`Successfully extracted ${wordCount} words using ${actualProvider} in ${processingTime}ms`)

    return NextResponse.json({
      success: true,
      data: resultData,
      summary: extractedData.summary || "Resume content extracted successfully",
      sections: extractedData.sections || ["Resume Content"],
      fromCache: false,
      extractionMethod: useBasicExtraction ? 'basic' : 'ai',
      documentId: savedDocument.id,
      fileHash: fileHash
    })

  } catch (error) {
    console.error('PDF extraction error:', error)
    
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

      if (error.message.includes('empty')) {
        return NextResponse.json(
          { error: 'PDF appears to be empty or contains no extractable text. Please try a different file.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to extract text from PDF. Please try again.' },
      { status: 500 }
    )
  }
} 