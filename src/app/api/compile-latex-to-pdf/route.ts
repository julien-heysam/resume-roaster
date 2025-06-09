import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { latex_code, filename } = body

    if (!latex_code) {
      return NextResponse.json(
        { error: 'LaTeX code is required' },
        { status: 400 }
      )
    }

    // Get the PDF converter service URL from environment variables
    // Default to localhost for development
    const pdfServiceUrl = process.env.PDF_CONVERTER_SERVICE_URL || 'http://localhost:8000'
    
    // Try Tectonic first (faster), fallback to regular pdflatex if it fails
    let response = await fetch(`${pdfServiceUrl}/latex-to-pdf-tectonic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latex_code,
        filename: filename || 'document.pdf'
      }),
    })

    // If Tectonic fails, try regular pdflatex
    if (!response.ok) {
      const errorText = await response.text()
      console.warn('Tectonic compilation failed, trying regular pdflatex:', errorText)
      
      response = await fetch(`${pdfServiceUrl}/latex-to-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latex_code,
          filename: filename || 'document.pdf'
        }),
      })
      
      if (!response.ok) {
        const fallbackErrorText = await response.text()
        console.error('Both PDF compilation methods failed:', fallbackErrorText)
        return NextResponse.json(
          { error: `PDF compilation failed: ${fallbackErrorText}` },
          { status: response.status }
        )
      }
    }

    // Get the PDF blob from the service
    const pdfBuffer = await response.arrayBuffer()
    
    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename || 'document.pdf'}"`,
      },
    })

  } catch (error) {
    console.error('Error in compile-latex-to-pdf API:', error)
    return NextResponse.json(
      { error: 'Internal server error during PDF compilation' },
      { status: 500 }
    )
  }
} 