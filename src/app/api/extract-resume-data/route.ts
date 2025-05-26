import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ResumeData } from '@/lib/resume-templates'

const EXTRACTION_PROMPT = `You are an expert resume data extraction specialist. Your task is to analyze a resume text and its analysis results, then extract structured data that can be used to pre-fill a resume builder form.

You will be given:
1. The original resume text (markdown format)
2. Analysis results with suggestions and insights
3. A job description (if available)

Your goal is to extract and structure the resume data into a standardized format that can be used to pre-fill a resume optimizer form. Use the analysis insights to improve and optimize the extracted data.

**EXTRACTION GUIDELINES:**

1. **Personal Information**: Extract name, email, phone, location, LinkedIn, portfolio/website, GitHub
2. **Professional Summary**: Create an optimized summary based on the original and analysis suggestions
3. **Experience**: Extract all work experience with proper formatting and quantified achievements
4. **Education**: Extract all educational background with degrees, schools, dates, GPA if mentioned
5. **Skills**: Categorize into technical and soft skills, removing duplicates and organizing logically
6. **Projects**: Extract notable projects with descriptions and technologies

**OPTIMIZATION RULES:**
- Use analysis suggestions to improve content where applicable
- Ensure all achievements are quantified when possible
- Remove weak or generic content identified in the analysis
- Add missing keywords from the job description naturally
- Maintain professional tone and ATS-friendly formatting
- Fix any issues identified in the analysis (dates, formatting, etc.)

**RESPONSE FORMAT:**
Return a JSON object with the following structure:

{
  "personalInfo": {
    "name": string,
    "email": string,
    "phone": string,
    "location": string,
    "linkedin": string,
    "portfolio": string,
    "github": string,
    "jobTitle": string,
    "jobDescription": string
  },
  "summary": string,
  "experience": [
    {
      "title": string,
      "company": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "description": [string],
      "achievements": [string]
    }
  ],
  "education": [
    {
      "degree": string,
      "school": string,
      "location": string,
      "graduationDate": string,
      "gpa": string,
      "honors": [string]
    }
  ],
  "skills": {
    "technical": [string],
    "soft": [string],
    "languages": [string],
    "certifications": [string]
  },
  "projects": [
    {
      "name": string,
      "description": string,
      "technologies": [string],
      "link": string
    }
  ]
}

**IMPORTANT NOTES:**
- Extract actual data from the resume, don't make up information
- If information is missing, use empty strings or empty arrays
- Dates should be in format like "Jan 2022" or "2019-2023"
- Ensure all arrays contain strings, not objects
- Optimize content based on analysis suggestions but keep it truthful
- If the analysis suggests adding keywords, incorporate them naturally where they fit
- Remove or improve weak bullet points identified in the analysis`

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { resumeText, analysisData, jobDescription } = await request.json()

    if (!resumeText || !analysisData) {
      return NextResponse.json(
        { error: 'Resume text and analysis data are required' },
        { status: 400 }
      )
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not found in environment variables.' },
        { status: 500 }
      )
    }

    console.log('Extracting structured resume data with AI optimization...')

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const userPrompt = `Please extract and optimize the resume data from the following information:

ORIGINAL RESUME TEXT:
${resumeText}

ANALYSIS RESULTS:
Overall Score: ${analysisData.overallScore}/100
Strengths: ${analysisData.strengths?.join(', ') || 'None listed'}
Weaknesses: ${analysisData.weaknesses?.join(', ') || 'None listed'}

Key Suggestions:
${analysisData.suggestions?.map((s: any) => `- ${s.section}: ${s.issue} → ${s.solution}`).join('\n') || 'None'}

Missing Keywords: ${analysisData.keywordMatch?.missing?.join(', ') || 'None'}
ATS Issues: ${analysisData.atsIssues?.join(', ') || 'None'}

${jobDescription ? `JOB DESCRIPTION:
${jobDescription}` : ''}

Extract the resume data into the specified JSON format, incorporating the analysis insights to create optimized content that addresses the identified weaknesses and missing elements while maintaining truthfulness to the original resume.`

    const startTime = Date.now()
    
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      temperature: 0.2,
      system: EXTRACTION_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ]
    })

    const processingTime = Date.now() - startTime

    // Extract text content from the response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    let extractedData: ResumeData
    
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
      
      // Validate required structure
      if (!extractedData.personalInfo || !extractedData.experience || !extractedData.skills) {
        throw new Error('Invalid resume data structure')
      }
      
    } catch (parseError) {
      console.error('Failed to parse extraction response:', parseError)
      console.log('Raw response:', responseText)
      
      return NextResponse.json(
        { error: 'Failed to parse extracted resume data. Please try again.' },
        { status: 500 }
      )
    }

    console.log(`Resume data extracted successfully in ${processingTime}ms`)

    return NextResponse.json({
      success: true,
      data: extractedData,
      metadata: {
        processingTime,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        optimizationsApplied: analysisData.suggestions?.length || 0
      }
    })

  } catch (error) {
    console.error('Resume data extraction error:', error)
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('401')) {
        return NextResponse.json(
          { error: 'AI service configuration error. Please check your ANTHROPIC_API_KEY.' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('rate limit') || error.message.includes('quota') || error.message.includes('429')) {
        return NextResponse.json(
          { error: 'AI service rate limit reached. Please try again later.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to extract resume data. Please try again.' },
      { status: 500 }
    )
  }
} 