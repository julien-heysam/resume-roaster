import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'
import { getOrCreateJobSummary, shouldSummarizeJobDescription } from '@/lib/job-summary-utils'
import { getOrCreateOptimizedResume, saveOptimizedResumeToCache } from '@/lib/cache-utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const startTime = Date.now()
    
    const { 
      resumeText, 
      analysisData, 
      jobDescription, 
      documentId, 
      analysisId
    } = await request.json()

    console.log('=== EXTRACT RESUME DATA DEBUG ===')
    console.log('Resume text length:', resumeText?.length || 0)
    console.log('Has analysis data:', !!analysisData)
    console.log('Job description length:', jobDescription?.length || 0)
    console.log('Document ID:', documentId)
    console.log('Analysis ID:', analysisId)

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Truncate resume text if too long (keep within reasonable limits for API)
    const maxResumeLength = 8000 // Reasonable limit for resume text
    const truncatedResumeText = resumeText.length > maxResumeLength 
      ? resumeText.substring(0, maxResumeLength) + '\n\n[Resume truncated for processing...]'
      : resumeText

    console.log('Truncated resume text length:', truncatedResumeText.length)
    console.log('Job description length:', jobDescription?.length || 0)

    // Get or create job description summary if provided and long
    let jobSummaryData = null
    let effectiveJobDescription = jobDescription || ''

    if (jobDescription && shouldSummarizeJobDescription(jobDescription, 3000)) {
      console.log('Job description is long, getting/creating summary...')
      
      try {
        jobSummaryData = await getOrCreateJobSummary(jobDescription)
        effectiveJobDescription = jobSummaryData.summary
        console.log('Using job summary:', jobSummaryData.cached ? 'cached' : 'newly generated')
        console.log('Summary length:', effectiveJobDescription.length)
      } catch (error) {
        console.error('Error getting job summary:', error)
        effectiveJobDescription = jobDescription.substring(0, 3000) + '\n\n[Job description truncated for length...]'
      }
    }

    console.log('Effective job description length:', effectiveJobDescription.length)

    // Use a default template ID for now (we can make this configurable later)
    const templateId = 'modern-professional'

    // Check for cached optimized resume first
    const cachedOptimizedResume = await getOrCreateOptimizedResume(
      user.id,
      truncatedResumeText,
      jobSummaryData?.id || null,
      templateId,
      analysisId,
      documentId
    )

    if (cachedOptimizedResume) {
      console.log('Returning cached optimized resume')
      return NextResponse.json({
        success: true,
        data: JSON.parse(cachedOptimizedResume.extractedData),
        cached: true,
        usageCount: cachedOptimizedResume.usageCount,
        metadata: {
          processingTime: Date.now() - startTime,
          fromCache: true,
          atsScore: cachedOptimizedResume.atsScore,
          keywordsMatched: cachedOptimizedResume.keywordsMatched,
          optimizationSuggestions: cachedOptimizedResume.optimizationSuggestions
        }
      })
    }

    console.log('No cached extracted resume found, generating new one...')

    // Create the extraction prompt
    const prompt = `Extract and structure the following resume data into a comprehensive JSON format:

${effectiveJobDescription ? `
TARGET JOB DESCRIPTION:
${effectiveJobDescription}
` : ''}

RESUME TEXT:
${truncatedResumeText}

${analysisData ? `
ANALYSIS INSIGHTS:
- Overall Score: ${analysisData.overallScore}%
- Key Strengths: ${analysisData.strengths?.slice(0, 3).join(', ')}
- Areas for Improvement: ${analysisData.weaknesses?.slice(0, 3).join(', ')}
- Matched Keywords: ${analysisData.keywordMatch?.matched?.slice(0, 5).join(', ')}
- Missing Keywords: ${analysisData.keywordMatch?.missing?.slice(0, 5).join(', ')}
` : ''}

${jobSummaryData ? `
EXTRACTED JOB DETAILS:
- Company: ${jobSummaryData.companyName || 'Not specified'}
- Position: ${jobSummaryData.jobTitle || 'Not specified'}
- Location: ${jobSummaryData.location || 'Not specified'}
- Key Requirements: ${jobSummaryData.keyRequirements?.slice(0, 5).join(', ') || 'See job description'}
` : ''}

Make sure you dont omit any information from the resume text, this is the most important part of the process.

Please extract and return ONLY a valid JSON object with the following structure:
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

IMPORTANT INSTRUCTIONS:
1. Extract information accurately from the resume text
2. Optimize content for ATS compatibility
3. Include quantified achievements where possible
4. Match keywords from the job description naturally
5. Ensure all dates are in MM/YYYY format
6. Return ONLY the JSON object, no additional text or formatting
7. If information is missing, use null or empty arrays as appropriate


EXAMPLE OUTPUT:
{
  personalInfo: {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/alexjohnson",
    portfolio: "https://alexjohnson.dev",
    github: "https://github.com/alexjohnson",
    jobTitle: "Software Engineer",
    jobDescription: "Experienced Software Engineer"
  },
  summary: "Experienced Software Engineer with 5+ years developing scalable web applications. Proven track record of leading cross-functional teams and delivering high-impact solutions that drive business growth.",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "2022",
      endDate: "Present",
      description: [
        "Led development of microservices architecture serving 1M+ users",
        "Mentored junior developers and established coding best practices"
      ],
      achievements: [
        "Reduced system latency by 40% through optimization initiatives",
        "Increased team productivity by 25% through process improvements"
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "University of California",
      location: "Berkeley, CA",
      graduationDate: "2019",
      gpa: "3.8",
      honors: ["Magna Cum Laude"]
    }
  ],
  skills: {
    technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker"],
    soft: ["Leadership", "Problem-solving", "Communication", "Team Management"],
    languages: ["English", "Spanish"],
    certifications: ["AWS Certified Solutions Architect"]
  },
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform with React and Node.js",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      link: "https://github.com/alexjohnson/ecommerce"
    }
  ]
}`

    console.log('Final prompt length:', prompt.length)
    console.log('Estimated tokens (rough):', Math.ceil(prompt.length / 4))
    console.log('=== END DEBUG ===')

    // Call Anthropic API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        temperature: 0.3,
        system: 'You are an expert resume parser and career coach. Extract resume data into structured JSON format that is optimized for ATS systems and tailored for the target job. Always return valid JSON only.',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    })

    if (!anthropicResponse.ok) {
      const errorData = await anthropicResponse.json()
      console.error('Anthropic API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to extract resume data' },
        { status: 500 }
      )
    }

    const anthropicData = await anthropicResponse.json()
    const extractedContent = anthropicData.content[0]?.text

    if (!extractedContent) {
      return NextResponse.json(
        { error: 'No data extracted' },
        { status: 500 }
      )
    }

    // Parse the JSON response
    let extractedData
    try {
      // Method 1: Try parsing as direct JSON (remove any leading/trailing whitespace)
      const jsonText = extractedContent.trim()
      extractedData = JSON.parse(jsonText)
      
    } catch (parseError) {
      console.log('Method 1 failed, trying fallback methods...')
      
      try {
        // Method 2: Extract text between ```json ... ```
        const jsonMatch = extractedContent.match(/```json\s*([\s\S]*?)\s*```/)
        if (jsonMatch && jsonMatch[1]) {
          extractedData = JSON.parse(jsonMatch[1].trim())
        } else {
          throw new Error('No JSON code block found')
        }
        
      } catch (secondParseError) {
        console.log('Method 2 failed, trying method 3...')
        
        try {
          // Method 3: Find first { and last } and extract JSON
          const firstBrace = extractedContent.indexOf('{')
          const lastBrace = extractedContent.lastIndexOf('}')
          
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const jsonText = extractedContent.substring(firstBrace, lastBrace + 1)
            extractedData = JSON.parse(jsonText)
          } else {
            throw new Error('No valid JSON braces found')
          }
          
        } catch (thirdParseError) {
          // Method 4: Return the error if all methods fail
          console.error('All parsing methods failed:', {
            method1: parseError,
            method2: secondParseError,
            method3: thirdParseError
          })
          console.error('Raw content:', extractedContent)
          return NextResponse.json(
            { error: 'Failed to parse extracted data' },
            { status: 500 }
          )
        }
      }
    }

    const processingTime = Date.now() - startTime
    const tokensUsed = (anthropicData.usage?.input_tokens || 0) + (anthropicData.usage?.output_tokens || 0)
    const estimatedCost = ((anthropicData.usage?.input_tokens || 0) * 0.003 + (anthropicData.usage?.output_tokens || 0) * 0.015) / 1000 // Claude 3.5 Sonnet pricing

    // Calculate ATS score and keyword matching
    const atsScore = calculateATSScore(extractedData, effectiveJobDescription)
    const keywordsMatched = extractKeywordsMatched(extractedData, effectiveJobDescription)
    const optimizationSuggestions = generateOptimizationSuggestions(extractedData, analysisData)

    // Store the extraction in database using LLMConversation
    let conversationId = null
    try {
      // Create LLM conversation record
      const conversation = await db.lLMConversation.create({
        data: {
          userId: user.id,
          type: 'RESUME_EXTRACTION',
          title: `Resume Extraction - ${new Date().toLocaleDateString()}`,
          provider: 'anthropic',
          model: 'claude-sonnet-4-20250514',
          totalTokensUsed: tokensUsed,
          totalCost: estimatedCost,
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      conversationId = conversation.id

      // Create messages for the conversation
      await db.lLMMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'USER',
          content: prompt,
          messageIndex: 0,
          inputTokens: anthropicData.usage?.input_tokens || 0,
          totalTokens: anthropicData.usage?.input_tokens || 0
        }
      })

      await db.lLMMessage.create({
        data: {
          conversationId: conversation.id,
          role: 'ASSISTANT',
          content: extractedContent,
          messageIndex: 1,
          outputTokens: anthropicData.usage?.output_tokens || 0,
          totalTokens: anthropicData.usage?.output_tokens || 0,
          cost: estimatedCost,
          processingTime: processingTime,
          finishReason: anthropicData.stop_reason || 'end_turn',
          temperature: 0.3,
          maxTokens: 2000
        }
      })

      console.log('Resume extraction stored in database')
    } catch (dbError) {
      console.error('Failed to store resume extraction:', dbError)
      // Continue without failing the request
    }

    // Generate optimized resume content (HTML/markdown)
    const optimizedContent = generateOptimizedResumeContent(extractedData, templateId)

    // Save to cache
    let cachedResult = null
    cachedResult = await saveOptimizedResumeToCache(
      user.id,
      optimizedContent,
      JSON.stringify(extractedData),
      templateId,
      truncatedResumeText,
      jobSummaryData?.id || null,
      atsScore,
      keywordsMatched,
      optimizationSuggestions,
      {
        tokensUsed,
        processingTime,
        estimatedCost,
        provider: 'anthropic',
        model: 'claude-sonnet-4-20250514',
        conversationId: conversationId || undefined
      },
      analysisId,
      documentId
    )
    console.log('Optimized resume saved to cache')

    return NextResponse.json({
      success: true,
      data: extractedData,
      cached: false,
      usageCount: 1,
      metadata: {
        tokensUsed,
        processingTime,
        estimatedCost,
        atsScore,
        keywordsMatched,
        optimizationSuggestions
      }
    })

  } catch (error) {
    console.error('Error extracting resume data:', error)
    return NextResponse.json(
      { error: 'Failed to extract resume data' },
      { status: 500 }
    )
  }
}

// Helper functions
function calculateATSScore(extractedData: any, jobDescription: string): number {
  // Simple ATS score calculation based on completeness and keyword matching
  let score = 0
  
  // Check for required fields
  if (extractedData.personalInfo?.name) score += 10
  if (extractedData.personalInfo?.email) score += 10
  if (extractedData.personalInfo?.phone) score += 5
  if (extractedData.summary) score += 15
  if (extractedData.experience?.length > 0) score += 20
  if (extractedData.education?.length > 0) score += 10
  if (extractedData.skills?.technical?.length > 0) score += 15
  
  // Check for quantified achievements
  const hasQuantifiedAchievements = extractedData.experience?.some((exp: any) => 
    exp.achievements?.some((achievement: string) => /\d+/.test(achievement))
  )
  if (hasQuantifiedAchievements) score += 15
  
  return Math.min(score, 100)
}

function extractKeywordsMatched(extractedData: any, jobDescription: string): string[] {
  if (!jobDescription) return []
  
  const jobKeywords = jobDescription.toLowerCase().match(/\b\w+\b/g) || []
  const resumeText = JSON.stringify(extractedData).toLowerCase()
  
  const matched = jobKeywords.filter(keyword => 
    keyword.length > 3 && resumeText.includes(keyword)
  )
  
  // Remove duplicates and return top 10
  return [...new Set(matched)].slice(0, 10)
}

function generateOptimizationSuggestions(extractedData: any, analysisData: any): string[] {
  const suggestions = []
  
  if (!extractedData.summary || extractedData.summary.length < 50) {
    suggestions.push('Add a compelling professional summary')
  }
  
  if (!extractedData.experience?.length) {
    suggestions.push('Include professional experience section')
  }
  
  if (extractedData.experience?.some((exp: any) => !exp.achievements?.length)) {
    suggestions.push('Add quantified achievements to experience entries')
  }
  
  if (!extractedData.skills?.technical?.length) {
    suggestions.push('Include technical skills section')
  }
  
  if (analysisData?.keywordMatch?.missing?.length > 0) {
    suggestions.push(`Add missing keywords: ${analysisData.keywordMatch.missing.slice(0, 3).join(', ')}`)
  }
  
  return suggestions
}

function generateOptimizedResumeContent(extractedData: any, templateId: string): string {
  // Generate HTML content based on the template
  // This is a simplified version - in a real app, you'd have proper templates
  
  return `
    <div class="resume-${templateId}">
      <header>
        <h1>${extractedData.personalInfo?.name || 'Name'}</h1>
        <div class="contact-info">
          ${extractedData.personalInfo?.email ? `<span>${extractedData.personalInfo.email}</span>` : ''}
          ${extractedData.personalInfo?.phone ? `<span>${extractedData.personalInfo.phone}</span>` : ''}
          ${extractedData.personalInfo?.location ? `<span>${extractedData.personalInfo.location}</span>` : ''}
        </div>
      </header>
      
      ${extractedData.summary ? `
        <section class="summary">
          <h2>Professional Summary</h2>
          <p>${extractedData.summary}</p>
        </section>
      ` : ''}
      
      ${extractedData.experience?.length ? `
        <section class="experience">
          <h2>Professional Experience</h2>
          ${extractedData.experience.map((exp: any) => `
            <div class="experience-item">
              <h3>${exp.position} - ${exp.company}</h3>
              <div class="dates">${exp.startDate} - ${exp.endDate}</div>
              ${exp.achievements?.length ? `
                <ul>
                  ${exp.achievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
          `).join('')}
        </section>
      ` : ''}
      
      ${extractedData.skills?.technical?.length ? `
        <section class="skills">
          <h2>Technical Skills</h2>
          <div class="skills-list">
            ${extractedData.skills.technical.join(', ')}
          </div>
        </section>
      ` : ''}
      
      ${extractedData.education?.length ? `
        <section class="education">
          <h2>Education</h2>
          ${extractedData.education.map((edu: any) => `
            <div class="education-item">
              <h3>${edu.degree} in ${edu.field}</h3>
              <div>${edu.institution} - ${edu.graduationDate}</div>
            </div>
          `).join('')}
        </section>
      ` : ''}
    </div>
  `
}