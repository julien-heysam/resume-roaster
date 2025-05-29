import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'
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

    const { jobDescription } = await request.json()

    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json(
        { error: 'Job description is required' },
        { status: 400 }
      )
    }

    // Create hash of the job description for deduplication
    const contentHash = crypto
      .createHash('sha256')
      .update(jobDescription.trim().toLowerCase())
      .digest('hex')

    console.log('=== JOB DESCRIPTION SUMMARIZATION ===')
    console.log('Original length:', jobDescription.length)
    console.log('Content hash:', contentHash)

    // Check if we already have a summary for this job description
    let existingSummary = await db.jobDescriptionSummary.findUnique({
      where: { contentHash }
    })

    if (existingSummary) {
      console.log('Found existing summary, updating usage count')
      
      // Update usage count and last used timestamp
      existingSummary = await db.jobDescriptionSummary.update({
        where: { id: existingSummary.id },
        data: {
          usageCount: { increment: 1 },
          lastUsedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          id: existingSummary.id,
          summary: existingSummary.summary,
          keyRequirements: existingSummary.keyRequirements,
          companyName: existingSummary.companyName,
          jobTitle: existingSummary.jobTitle,
          location: existingSummary.location,
          salaryRange: existingSummary.salaryRange,
          usageCount: existingSummary.usageCount,
          cached: true
        }
      })
    }

    console.log('No existing summary found, generating new one...')

    const startTime = Date.now()

    // Create summarization prompt
    const prompt = `Analyze and summarize the following job description. Extract key information and create a concise summary.

JOB DESCRIPTION:
${jobDescription}

Please provide a JSON response with the following structure:
{
  "summary": "A concise 2-3 paragraph summary of the role, responsibilities, and company (max 500 words)",
  "keyRequirements": ["requirement1", "requirement2", "requirement3", ...],
  "companyName": "Company name if mentioned",
  "jobTitle": "Job title",
  "location": "Location if mentioned",
  "salaryRange": "Salary range if mentioned"
}

Focus on:
- Core responsibilities and role purpose
- Essential skills and qualifications
- Company culture and values (if mentioned)
- Key benefits or perks (if mentioned)
- Remove redundant information and marketing fluff
- Keep technical requirements specific but concise

Respond only with valid JSON.`

    // Use GPT-4o-mini for fast, cost-effective summarization
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR analyst and job description summarizer. You extract key information and create concise, useful summaries while preserving all important details. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3, // Lower temperature for more consistent extraction
        response_format: { type: "json_object" }
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to summarize job description' },
        { status: 500 }
      )
    }

    const openaiData = await openaiResponse.json()
    const summaryContent = openaiData.choices[0]?.message?.content

    if (!summaryContent) {
      return NextResponse.json(
        { error: 'No summary generated' },
        { status: 500 }
      )
    }

    let parsedSummary
    try {
      parsedSummary = JSON.parse(summaryContent)
    } catch (error) {
      console.error('Failed to parse summary JSON:', error)
      return NextResponse.json(
        { error: 'Invalid summary format generated' },
        { status: 500 }
      )
    }

    const processingTime = Date.now() - startTime
    const tokensUsed = openaiData.usage?.total_tokens || 0
    const estimatedCost = (tokensUsed / 1000) * 0.002 // GPT-4o-mini pricing

    console.log('Summary generated successfully')
    console.log('Processing time:', processingTime, 'ms')
    console.log('Tokens used:', tokensUsed)
    console.log('Summary length:', parsedSummary.summary?.length || 0)

    // Save the summary to database
    const savedSummary = await db.jobDescriptionSummary.create({
      data: {
        contentHash,
        originalText: jobDescription,
        summary: parsedSummary.summary || '',
        keyRequirements: parsedSummary.keyRequirements || [],
        companyName: parsedSummary.companyName || null,
        jobTitle: parsedSummary.jobTitle || null,
        location: parsedSummary.location || null,
        salaryRange: parsedSummary.salaryRange || null,
        provider: 'openai',
        model: 'gpt-4.1-mini',
        totalTokensUsed: tokensUsed,
        totalCost: estimatedCost,
        processingTime: processingTime
      }
    })

    console.log('Summary saved to database with ID:', savedSummary.id)

    return NextResponse.json({
      success: true,
      data: {
        id: savedSummary.id,
        summary: savedSummary.summary,
        keyRequirements: savedSummary.keyRequirements,
        companyName: savedSummary.companyName,
        jobTitle: savedSummary.jobTitle,
        location: savedSummary.location,
        salaryRange: savedSummary.salaryRange,
        usageCount: 1,
        cached: false,
        metadata: {
          tokensUsed,
          processingTime,
          estimatedCost,
          originalLength: jobDescription.length,
          summaryLength: savedSummary.summary.length
        }
      }
    })

  } catch (error) {
    console.error('Error summarizing job description:', error)
    return NextResponse.json(
      { error: 'Failed to summarize job description' },
      { status: 500 }
    )
  }
} 