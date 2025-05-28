import { NextRequest, NextResponse } from 'next/server'
import { DocumentService, UserService, UsageService, generateFileHash } from '@/lib/database'
import JSZip from 'jszip'

interface ExtractedResumeData {
  text: string
  documentId?: string
  metadata: {
    pages: number
    wordCount: number
    fileName: string
    fileSize: number
    extractedAt: string
    fileType: string
    fromCache?: boolean
  }
}

// Helper function to extract text from TXT files
async function extractFromTxt(buffer: Buffer): Promise<string> {
  return buffer.toString('utf-8')
}

// Helper function to extract text from DOC files (basic implementation)
async function extractFromDoc(buffer: Buffer): Promise<string> {
  // For now, we'll try to extract basic text from DOC files
  // This is a simplified approach - in production, you might want to use a library like 'mammoth'
  try {
    const text = buffer.toString('utf-8')
    // Remove common DOC binary artifacts and extract readable text
    const cleanText = text
      .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ') // Remove control characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
    
    if (cleanText.length < 50) {
      throw new Error('Unable to extract meaningful text from DOC file')
    }
    
    return cleanText
  } catch (error) {
    throw new Error('Failed to extract text from DOC file. Please convert to PDF or DOCX format.')
  }
}

// Helper function to extract text from DOCX files
async function extractFromDocx(buffer: Buffer): Promise<string> {
  try {
    // For DOCX files, we'll use a simple approach to extract text
    // In production, you might want to use a library like 'mammoth' or 'docx-parser'
    const zip = await JSZip.loadAsync(buffer)
    
    // DOCX files contain the main document in word/document.xml
    const documentXml = await zip.file('word/document.xml')?.async('string')
    
    if (!documentXml) {
      throw new Error('Invalid DOCX file structure')
    }
    
    // Extract text from XML (basic approach)
    const textContent = documentXml
      .replace(/<[^>]*>/g, ' ') // Remove XML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
    
    if (textContent.length < 10) {
      throw new Error('Unable to extract meaningful text from DOCX file')
    }
    
    return textContent
  } catch (error) {
    throw new Error('Failed to extract text from DOCX file. Please convert to PDF format.')
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string | null
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 10MB allowed.' },
        { status: 400 }
      )
    }

    // Determine file type
    const fileName = file.name.toLowerCase()
    const fileType = file.type
    let extractionMethod: string

    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      extractionMethod = 'txt'
    } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      extractionMethod = 'doc'
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      extractionMethod = 'docx'
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // For PDF files, redirect to the AI extraction endpoint
      return NextResponse.json(
        { error: 'PDF files should use the AI extraction endpoint at /api/extract-pdf-ai' },
        { status: 400 }
      )
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload TXT, DOC, DOCX, or PDF files.' },
        { status: 400 }
      )
    }

    console.log(`Starting ${extractionMethod.toUpperCase()} extraction for: ${file.name}`)

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
          fileType: extractionMethod,
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
        summary: existingDocument.summary || `${extractionMethod.toUpperCase()} content extracted from cache`,
        sections: existingDocument.sections || ["Resume Content"],
        fromCache: true,
        documentId: existingDocument.id,
        fileHash: fileHash
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

    // Extract text based on file type
    let extractedText: string
    
    try {
      switch (extractionMethod) {
        case 'txt':
          extractedText = await extractFromTxt(buffer)
          break
        case 'doc':
          extractedText = await extractFromDoc(buffer)
          break
        case 'docx':
          extractedText = await extractFromDocx(buffer)
          break
        default:
          throw new Error('Unsupported extraction method')
      }
    } catch (error) {
      console.error(`${extractionMethod.toUpperCase()} extraction error:`, error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : `Failed to extract text from ${extractionMethod.toUpperCase()} file` },
        { status: 400 }
      )
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Unable to extract meaningful text from the file. Please check the file content.' },
        { status: 400 }
      )
    }

    // Count words
    const wordCount = extractedText.split(/\s+/).filter((word: string) => word.length > 0).length

    // Estimate pages (rough estimate based on typical resume length)
    const estimatedPages = Math.max(1, Math.ceil(wordCount / 500)) // Assume ~500 words per page

    const processingTime = Date.now() - startTime

    // Text extraction is free (no AI cost)
    const extractionCost = 0

    // Generate summary and sections
    const summary = `${extractionMethod.toUpperCase()} resume content extracted successfully`
    const sections = ["Resume Content"]

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
      aiProvider: 'native', // Not using AI for these file types
      extractionCost,
      summary,
      sections,
      processingTime
    })

    // Record usage if user is provided (but don't increment roast count for text extraction)
    if (userId) {
      await UsageService.recordUsage({
        userId,
        documentId: savedDocument.id,
        action: 'EXTRACT_PDF',
        cost: extractionCost,
        creditsUsed: 0 // Text extraction doesn't count against roast limit
      })
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
        fileType: extractionMethod,
        fromCache: false
      }
    }

    console.log(`Successfully extracted ${wordCount} words from ${extractionMethod.toUpperCase()} in ${processingTime}ms`)

    return NextResponse.json({
      success: true,
      data: resultData,
      summary,
      sections,
      fromCache: false,
      documentId: savedDocument.id,
      fileHash: fileHash
    })

  } catch (error) {
    console.error('Text extraction error:', error)
    
    return NextResponse.json(
      { error: 'Failed to extract text from file. Please try again or use a different file format.' },
      { status: 500 }
    )
  }
} 