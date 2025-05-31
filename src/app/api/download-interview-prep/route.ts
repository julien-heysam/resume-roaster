import { NextRequest, NextResponse } from 'next/server'
import { generateInterviewPrepPDF } from '@/lib/document-generators'

export async function POST(request: NextRequest) {
  try {
    const { interviewData, resumeData, jobDescription } = await request.json()

    if (!interviewData) {
      return NextResponse.json(
        { error: 'Interview prep data is required' },
        { status: 400 }
      )
    }

    // Generate PDF
    const pdfBuffer = await generateInterviewPrepPDF({
      interviewData,
      resumeData,
      jobDescription
    })

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="interview-prep.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('Error generating interview prep PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
} 