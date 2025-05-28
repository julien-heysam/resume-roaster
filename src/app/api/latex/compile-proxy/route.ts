import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { source, engine = 'pdflatex' } = await request.json()

    if (!source) {
      return NextResponse.json(
        { success: false, error: 'LaTeX source code is required' },
        { status: 400 }
      )
    }

    // Try multiple LaTeX compilation services with timeout handling
    
    // Method 1: Try LaTeX Online with timeout and improved request format
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      // Try the correct format for LaTeX Online
      const formData = new URLSearchParams()
      formData.append('text', source)
      formData.append('command', engine)
      
      console.log('Attempting LaTeX compilation with LaTeX Online...')
      
      const latexOnlineResponse = await fetch('https://latexonline.cc/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Resume-Roaster/1.0'
        },
        body: formData,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      
      console.log(`LaTeX Online response status: ${latexOnlineResponse.status}`)

      if (latexOnlineResponse.ok) {
        const contentType = latexOnlineResponse.headers.get('content-type')
        console.log(`LaTeX Online content type: ${contentType}`)
        
        if (contentType && contentType.includes('application/pdf')) {
          const pdfBuffer = await latexOnlineResponse.arrayBuffer()
          const base64Pdf = Buffer.from(pdfBuffer).toString('base64')
          
          console.log('LaTeX compilation successful!')
          
          return NextResponse.json({
            success: true,
            pdf: base64Pdf,
            service: 'latexonline.cc'
          })
        } else {
          const responseText = await latexOnlineResponse.text()
          console.log('LaTeX Online response (not PDF):', responseText.substring(0, 200))
        }
      } else {
        const errorText = await latexOnlineResponse.text()
        console.log(`LaTeX Online failed with status: ${latexOnlineResponse.status}, error: ${errorText.substring(0, 200)}`)
      }
    } catch (error) {
      console.log('LaTeX Online failed:', error instanceof Error ? error.message : 'Unknown error')
    }

    // If LaTeX Online fails, provide helpful fallback message
    // Note: Most LaTeX compilation APIs are not publicly available or require authentication
    // The best fallback is manual compilation which always works and provides professional results
    
    return NextResponse.json({
      success: false,
      error: 'LaTeX compilation services are currently unavailable. Please download the .tex file and compile it manually using Overleaf (overleaf.com), TeXShop, MiKTeX, or any other LaTeX editor.',
      suggestion: 'You can upload the .tex file to Overleaf.com for free online compilation.',
      details: 'Online LaTeX compilation services may be temporarily unavailable. Manual compilation always works and provides the same professional results.'
    }, { status: 503 })

  } catch (error) {
    console.error('LaTeX compilation proxy error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during LaTeX compilation',
        suggestion: 'Please download the .tex file and compile it manually using Overleaf.com or any LaTeX editor.'
      },
      { status: 500 }
    )
  }
} 