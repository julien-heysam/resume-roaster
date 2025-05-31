import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'
import { createHash } from 'crypto'
import { generateInterviewQuestions } from '@/lib/llm/interview-prep'
import { OPENAI_MODELS } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { resumeData, jobDescription, analysisData, analysisId, llm = OPENAI_MODELS.MINI } = await request.json()

    if (!resumeData) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      )
    }

    // Create content hash for deduplication (include LLM in hash)
    const contentString = JSON.stringify({
      resumeData,
      jobDescription: jobDescription || '',
      analysisData: analysisData || {},
      llm
    })
    const contentHash = createHash('sha256').update(contentString).digest('hex')

    // Check if we already have interview prep for this content
    const existingInterviewPrep = await db.interviewPrep.findUnique({
      where: { contentHash }
    })

    if (existingInterviewPrep) {
      return NextResponse.json({
        interviewPrep: existingInterviewPrep.data,
        cached: true
      })
    }

    // Generate new interview prep using AI
    const interviewPrepData = await generateInterviewQuestions({
      resumeData,
      jobDescription,
      analysisData,
      llm
    })

    // Save to database
    const savedInterviewPrep = await db.interviewPrep.create({
      data: {
        userId: session?.user?.id || null,
        analysisId: analysisId || 'general', // Use analysisId if provided, otherwise use 'general'
        contentHash,
        data: interviewPrepData as any,
        difficulty: 'medium', // Default difficulty
        category: 'general'   // Default category
      }
    })

    return NextResponse.json({
      interviewPrep: interviewPrepData,
      cached: false,
      id: savedInterviewPrep.id
    })

  } catch (error) {
    console.error('Error generating interview prep:', error)
    return NextResponse.json(
      { error: 'Failed to generate interview prep' },
      { status: 500 }
    )
  }
} 