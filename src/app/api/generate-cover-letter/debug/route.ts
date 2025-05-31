import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'
import { generateCoverLetterHash } from '@/lib/cache-utils'
import crypto from 'crypto'
import { OPENAI_MODELS } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { resumeData, jobDescription, analysisData, tone = 'professional', analysisId } = await request.json()

    if (!resumeData || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume data and job description are required' },
        { status: 400 }
      )
    }

    // Get user for cache checking
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    // Extract key information from resume
    const resumeText = typeof resumeData === 'string' ? resumeData : 
      resumeData.text || resumeData.extractedText || JSON.stringify(resumeData)

    // Truncate resume text to prevent token overflow
    const truncatedResumeText = resumeText.length > 8000 
      ? resumeText.substring(0, 8000) + '\n\n[Resume content truncated for length...]'
      : resumeText

    // Check for job summary
    let jobSummaryInfo = null
    let effectiveJobDescription = jobDescription

    if (jobDescription.length > 2000) {
      // Check if we have an existing summary
      const contentHash = crypto
        .createHash('sha256')
        .update(jobDescription.trim().toLowerCase())
        .digest('hex')

      const existingSummary = await db.summarizedJobDescription.findUnique({
        where: { contentHash }
      })

      if (existingSummary) {
        jobSummaryInfo = {
          id: existingSummary.id,
          exists: true,
          cached: true,
          summaryLength: existingSummary.summary ? String(existingSummary.summary).length : 0,
          usageCount: 0, // Not tracked in new schema
          companyName: 'N/A', // Not stored in new schema
          jobTitle: 'N/A', // Not stored in new schema
          keyRequirements: [] // Not stored in new schema
        }
        effectiveJobDescription = existingSummary.summary
      } else {
        jobSummaryInfo = {
          id: null,
          exists: false,
          cached: false,
          wouldSummarize: true,
          reason: 'Job description is longer than 2000 characters'
        }
        effectiveJobDescription = jobDescription.substring(0, 2000) + '\n\n[Would be summarized in actual generation...]'
      }
    }

    // Check for cached cover letter
    let coverLetterCacheInfo = null
    if (user) {
      const coverLetterHash = generateCoverLetterHash(
        truncatedResumeText,
        jobSummaryInfo?.id || null,
        tone,
        analysisId,
        OPENAI_MODELS.MINI // Pass the default LLM for debug purposes
      )

      const existingCoverLetter = await db.generatedCoverLetter.findUnique({
        where: { contentHash: coverLetterHash }
      })

      coverLetterCacheInfo = {
        hash: coverLetterHash,
        exists: !!existingCoverLetter,
        usageCount: 0, // Not tracked in new schema
        wordCount: existingCoverLetter?.content ? existingCoverLetter.content.split(' ').length : 0,
        lastUsed: existingCoverLetter?.createdAt || null
      }
    }

    // Create the cover letter prompt (same as in the actual generation)
    const prompt = `Generate a compelling cover letter based on the following information:

RESUME DATA:
${truncatedResumeText}

JOB DESCRIPTION:
${effectiveJobDescription.extractedText}

${analysisData ? `
ANALYSIS INSIGHTS:
- Overall Score: ${analysisData.overallScore}%
- Key Strengths: ${analysisData.strengths?.slice(0, 3).join(', ')}
- Matched Keywords: ${analysisData.keywordMatch?.matched?.slice(0, 5).join(', ')}
` : ''}

${jobSummaryInfo?.exists ? `
EXTRACTED JOB DETAILS:
- Company: ${jobSummaryInfo.companyName || 'Not specified'}
- Position: ${jobSummaryInfo.jobTitle || 'Not specified'}
- Key Requirements: ${jobSummaryInfo.keyRequirements?.slice(0, 5).join(', ') || 'See job description'}
` : ''}

REQUIREMENTS:
1. Write a ${tone} cover letter that's 3-4 paragraphs long
2. Address the hiring manager professionally
3. Highlight relevant experience and skills from the resume
4. Show enthusiasm for the specific role and company
5. Include specific examples and achievements when possible
6. Use keywords from the job description naturally
7. End with a strong call to action
8. Keep it concise but impactful (250-400 words)

TONE: ${tone === 'professional' ? 'Professional and confident' : 
       tone === 'enthusiastic' ? 'Enthusiastic and energetic' :
       tone === 'conversational' ? 'Conversational but professional' : 'Professional'}

Generate only the cover letter content without any additional formatting or explanations.`

    const systemPrompt = 'You are an expert career coach and professional writer specializing in creating compelling cover letters that get results. Write cover letters that are personalized, engaging, and demonstrate clear value to employers.'

    return NextResponse.json({
      success: true,
      debug: {
        originalResumeLength: resumeText.length,
        truncatedResumeLength: truncatedResumeText.length,
        originalJobDescriptionLength: jobDescription.length,
        effectiveJobDescriptionLength: effectiveJobDescription.length,
        promptLength: prompt.length,
        estimatedTokens: Math.ceil(prompt.length / 4),
        resumeDataType: typeof resumeData,
        resumeDataKeys: typeof resumeData === 'object' ? Object.keys(resumeData) : 'N/A',
        tone,
        systemPrompt,
        prompt,
        jobSummaryInfo,
        coverLetterCacheInfo
      }
    })

  } catch (error) {
    console.error('Error in cover letter debug:', error)
    return NextResponse.json(
      { error: 'Failed to generate debug info' },
      { status: 500 }
    )
  }
} 