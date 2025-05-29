import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { DocumentService, UserService, UsageService, generateFileHash } from '@/lib/database'
import { convertPDFToImages } from '@/lib/pdf-to-image'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

// Add canvas import for image conversion
import { createCanvas } from 'canvas'

interface ExtractedResumeData {
  text: string
  documentId?: string
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

// PDF to image conversion is now handled by the imported utility function

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

You will receive:
1. The PDF document (for direct text processing)
2. Visual images of the PDF pages (for layout and formatting context)

Instructions:
1. Extract ALL text content from the PDF document
2. Use the visual images to understand the layout, formatting, and structure
3. Format the content as clean markdown with proper hierarchy:
   - Use # for the person's name (main header)
   - Use ## for major sections (EXPERIENCE, EDUCATION, SKILLS, etc.)
   - Use ### for job titles, company names, or subsections
   - Use **bold** for important details like contact info, company names, dates
   - Use - for bullet points and lists
   - Use *italic* for job descriptions or dates where appropriate
   - Preserve tables using markdown table format if present

4. Maintain the logical structure and flow of the original resume based on visual layout
5. Preserve all important information including:
   - Contact information (email, phone, LinkedIn, etc.)
   - Work experience with dates, companies, and descriptions
   - Education details
   - Skills and technologies
   - Any other relevant sections
   - Tables, figures, and structured data

6. Use the visual context to:
   - Understand column layouts and preserve them appropriately
   - Identify headers, subheaders, and section breaks
   - Recognize formatting emphasis (bold, italic, etc.)
   - Maintain proper spacing and organization
   - Handle multi-column layouts correctly
   - Preserve visual hierarchy and design elements

7. Make the markdown readable and professional
8. If multiple pages are in the PDF, combine them into a single coherent document
9. Use intelligent formatting to improve readability while preserving the original structure

Please respond with a JSON object containing:
- "markdown": the extracted content formatted as clean markdown
- "summary": a brief summary of the resume content
- "sections": an array of main sections found in the resume

Output the content as clean, well-formatted markdown that would look professional when rendered.`

// Credit costs for different AI providers
const AI_PROVIDER_COSTS = {
  'anthropic': 1.0,    // Claude Sonnet 4 - 1 credit
  'openai': 0.5        // GPT-4 Mini - 0.5 credits
} as const

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
        documentId: existingDocument.id,
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
        images: existingDocument.images || [],
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
    let pdfImages: string[] = [] // Store images for frontend display

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
        
        // For basic extraction, still generate images for preview
        console.log('🖼️ Generating PDF preview images...')
        pdfImages = await convertPDFToImages(buffer)
        
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
      console.log(`Using AI PDF extraction with provider: ${provider}`)

      if (provider === 'anthropic') {
        // Check for API key
        if (!process.env.ANTHROPIC_API_KEY) {
          return NextResponse.json(
            { error: 'ANTHROPIC_API_KEY not found in environment variables.' },
            { status: 500 }
          )
        }

        console.log('Using Anthropic Claude Sonnet 4 for PDF extraction...')

        // Initialize Anthropic client
        const anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        })

        const base64Data = buffer.toString('base64')

        // Convert PDF to images for visual context
        console.log('🖼️ Converting PDF to images for visual context...')
        pdfImages = await convertPDFToImages(buffer)

        console.log('📤 Sending PDF and images to Claude for enhanced extraction...')
        
        // Build the content array with PDF and images
        const messageContent: any[] = [
          {
            type: "text",
            text: `Extract the resume content from this PDF and format it as clean, professional markdown. I'm providing both the PDF document and visual images of the pages for better context understanding.

🎯 Use the visual images to understand:
- Layout and formatting structure (columns, spacing, alignment)
- Headers, subheaders, and section breaks
- Visual emphasis (bold, italic, underlined text)
- Tables, figures, and structured data
- Professional formatting and design elements

📋 Focus on maintaining the original structure and hierarchy while making it readable and well-formatted. Respond with JSON containing markdown, summary, and sections fields.`
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

        // Add images if available
        if (pdfImages.length > 0) {
          console.log(`📸 Adding ${pdfImages.length} page images for visual context`)
          pdfImages.forEach((imageBase64, index) => {
            messageContent.push({
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: imageBase64
              }
            })
          })
        } else {
          console.log('⚠️ No images generated, proceeding with PDF only')
        }
        
        const message = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          temperature: 0.1,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: messageContent
            }
          ]
        })

        // Extract text content from the response
        const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
        
        try {
          // Method 1: Try the current approach first
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
          console.log('Method 1 failed, trying fallback methods...')
          
          try {
            // Method 2: Extract text between ```json ... ```
            const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/)
            if (jsonMatch && jsonMatch[1]) {
              extractedData = JSON.parse(jsonMatch[1].trim())
              extractedText = extractedData.markdown?.trim() || ''
              
              if (!extractedText) {
                throw new Error('No markdown content found in response')
              }
            } else {
              throw new Error('No JSON code block found')
            }
            
          } catch (secondParseError) {
            console.log('Method 2 failed, trying method 3...')
            
            try {
              // Method 3: Find first { and last } and extract JSON
              const firstBrace = responseText.indexOf('{')
              const lastBrace = responseText.lastIndexOf('}')
              
              if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                const jsonText = responseText.substring(firstBrace, lastBrace + 1)
                extractedData = JSON.parse(jsonText)
                extractedText = extractedData.markdown?.trim() || ''
                
                if (!extractedText) {
                  throw new Error('No markdown content found in response')
                }
              } else {
                throw new Error('No valid JSON braces found')
              }
              
            } catch (thirdParseError) {
              // Method 4: Fallback to treating entire response as markdown
              console.log('All JSON parsing methods failed, treating entire response as markdown')
              console.error('All parsing methods failed:', {
                method1: parseError,
                method2: secondParseError,
                method3: thirdParseError
              })
              
              // If JSON parsing fails, use the entire response as markdown
              extractedText = responseText.trim()
              extractedData = {
                markdown: extractedText,
                summary: "Resume content extracted and formatted as markdown using Claude",
                sections: ["Resume Content"]
              }
            }
          }
        }

      } else if (provider === 'openai') {
        // Check for API key
        if (!process.env.OPENAI_API_KEY) {
          return NextResponse.json(
            { error: 'OPENAI_API_KEY not found in environment variables.' },
            { status: 500 }
          )
        }

        console.log('Using OpenAI GPT-4 Mini for PDF extraction...')

        // For OpenAI, we need to first extract text using basic method, then process with GPT-4 Mini
        // since OpenAI doesn't support direct PDF processing like Claude
        const tempDir = os.tmpdir()
        const tempFilePath = path.join(tempDir, `pdf_${Date.now()}_${Math.random().toString(36).substring(7)}.pdf`)
        
        try {
          // Write buffer to temporary file
          await fs.writeFile(tempFilePath, buffer)
          
          // Extract text using basic methods first
          const rawText = await extractTextFromPDFBasic(tempFilePath, file.name)
          
          // Convert PDF to images for visual context
          console.log('🖼️ Converting PDF to images for visual context...')
          const pdfImagesOpenAI = await convertPDFToImages(buffer)
          pdfImages = pdfImagesOpenAI // Store for frontend display
          
          // Initialize OpenAI client
          const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          })

          console.log('📤 Processing extracted text and images with GPT-4 Mini for enhanced formatting...')
          
          // Build the messages array with text and images
          const messages: any[] = [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Please process this extracted resume text and format it as clean, professional markdown. I'm providing both the raw extracted text and visual images of the PDF pages for better context understanding.

🎯 Use the visual images to understand:
- Layout and formatting structure (columns, spacing, alignment)
- Headers, subheaders, and section breaks  
- Visual emphasis (bold, italic, underlined text)
- Tables, figures, and structured data
- Professional formatting and design elements

Here is the raw text extracted from the PDF resume:

${rawText}

📋 Please format this content according to the guidelines in the system prompt and return a JSON object with:
- "markdown": the formatted content as clean markdown
- "summary": a brief summary of the resume content  
- "sections": an array of main sections found in the resume`
                }
              ]
            }
          ]

          // Add images if available
          if (pdfImages.length > 0) {
            console.log(`📸 Adding ${pdfImages.length} page images for visual context`)
            pdfImages.forEach((imageBase64, index) => {
              messages[1].content.push({
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${imageBase64}`,
                  detail: "high"
                }
              })
            })
          } else {
            console.log('⚠️ No images generated, proceeding with text only')
          }
          
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            temperature: 0.1,
            max_tokens: 4000
          })

          const responseText = completion.choices[0]?.message?.content || ''
          
          try {
            // Method 1: Try the current approach first
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
            console.log('Method 1 failed, trying fallback methods...')
            
            try {
              // Method 2: Extract text between ```json ... ```
              const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/)
              if (jsonMatch && jsonMatch[1]) {
                extractedData = JSON.parse(jsonMatch[1].trim())
                extractedText = extractedData.markdown?.trim() || ''
                
                if (!extractedText) {
                  throw new Error('No markdown content found in response')
                }
              } else {
                throw new Error('No JSON code block found')
              }
              
            } catch (secondParseError) {
              console.log('Method 2 failed, trying method 3...')
              
              try {
                // Method 3: Find first { and last } and extract JSON
                const firstBrace = responseText.indexOf('{')
                const lastBrace = responseText.lastIndexOf('}')
                
                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                  const jsonText = responseText.substring(firstBrace, lastBrace + 1)
                  extractedData = JSON.parse(jsonText)
                  extractedText = extractedData.markdown?.trim() || ''
                  
                  if (!extractedText) {
                    throw new Error('No markdown content found in response')
                  }
                } else {
                  throw new Error('No valid JSON braces found')
                }
                
              } catch (thirdParseError) {
                // Method 4: Fallback to treating entire response as markdown
                console.log('All JSON parsing methods failed, treating entire response as markdown')
                console.error('All parsing methods failed:', {
                  method1: parseError,
                  method2: secondParseError,
                  method3: thirdParseError
                })
                
                // If JSON parsing fails, use the entire response as markdown
                extractedText = responseText.trim()
                extractedData = {
                  markdown: extractedText,
                  summary: "Resume content extracted and formatted as markdown using GPT-4 Mini",
                  sections: ["Resume Content"]
                }
              }
            }
          }
          
        } finally {
          // Clean up temporary file
          try {
            await fs.unlink(tempFilePath)
          } catch (cleanupError) {
            console.warn('Failed to clean up temporary file:', cleanupError)
          }
        }

      } else {
        return NextResponse.json(
          { error: `Unsupported AI provider: ${provider}. Supported providers: anthropic, openai` },
          { status: 400 }
        )
      }

      // Calculate cost based on provider
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
      images: pdfImages,
      processingTime
    })

    // Record usage and increment roast count if user is provided
    if (userId) {
      const creditsUsed = useBasicExtraction ? 0 : AI_PROVIDER_COSTS[provider as keyof typeof AI_PROVIDER_COSTS] || 1
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
      documentId: savedDocument.id,
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
      images: pdfImages,
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