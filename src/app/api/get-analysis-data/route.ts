import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roastId = searchParams.get('roastId')

    if (!roastId) {
      return NextResponse.json({ error: 'Roast ID is required' }, { status: 400 })
    }

    console.log('Fetching data for roast ID:', roastId)

    // Fetch the roast data with related extracted resume and job description using Prisma
    const roastData = await db.generatedRoast.findUnique({
      where: { id: roastId },
      include: {
        extractedResume: true,
        extractedJob: true
      }
    })

    if (!roastData) {
      return NextResponse.json({ error: 'Roast not found' }, { status: 404 })
    }

    // Extract the relevant data
    const resumeText = (roastData.extractedResume?.data as any)?.text || ''
    let jobDescription = roastData.extractedJob?.originalText || ''
    
    // Clean up job description formatting
    if (jobDescription) {
      jobDescription = jobDescription
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .replace(/Apply on employer site/g, '') // Remove job site artifacts
        .replace(/Show more/g, '') // Remove "Show more" text
        .replace(/Your qualifications for this job/g, '') // Remove qualification headers
        .replace(/Edit/g, '') // Remove "Edit" text
        .replace(/\$\d+K\s*-\s*\$\d+K\s*\(Employer est\.\)/g, '') // Remove salary estimates
        .replace(/Do you also have these qualifications\?/g, '') // Remove qualification prompts
        .replace(/X\n/g, '') // Remove "X" markers
        .trim()
    }
    
    const analysisResults = roastData.data || null

    // Return resume data as raw text instead of parsing it
    const resumeData = { text: resumeText }

    const response = {
      jobDescription,
      resumeData,
      analysisResults,
      roastId
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in get-analysis-data API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Simple resume text parser to extract structured data
function parseResumeText(text: string) {
  if (!text) {
    console.log('No resume text provided')
    return null
  }

  console.log('Parsing resume text, length:', text.length)
  console.log('First 500 characters:', text.substring(0, 500))

  const lines = text.split('\n').filter(line => line.trim())
  const resumeData: any = {
    personalInfo: {},
    summary: '',
    experience: [],
    education: [],
    skills: []
  }

  let currentSection = ''
  let currentJob: any = null
  let currentEdu: any = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip empty lines
    if (!line) continue

    // Detect email
    if (line.includes('@') && !resumeData.personalInfo.email) {
      resumeData.personalInfo.email = line.match(/\S+@\S+\.\S+/)?.[0] || line
      console.log('Found email:', resumeData.personalInfo.email)
      continue
    }

    // Detect phone
    if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(line) && !resumeData.personalInfo.phone) {
      resumeData.personalInfo.phone = line.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/)?.[0] || line
      console.log('Found phone:', resumeData.personalInfo.phone)
      continue
    }

    // Detect sections (case insensitive)
    const lowerLine = line.toLowerCase()
    if (lowerLine.includes('experience') || lowerLine.includes('employment') || lowerLine.includes('work history')) {
      currentSection = 'experience'
      console.log('Found experience section')
      continue
    }
    if (lowerLine.includes('education') || lowerLine.includes('academic')) {
      currentSection = 'education'
      console.log('Found education section')
      continue
    }
    if (lowerLine.includes('skills') || lowerLine.includes('competencies') || lowerLine.includes('technologies')) {
      currentSection = 'skills'
      console.log('Found skills section')
      continue
    }
    if (lowerLine.includes('summary') || lowerLine.includes('objective') || lowerLine.includes('profile')) {
      currentSection = 'summary'
      console.log('Found summary section')
      continue
    }

    // Parse based on current section
    if (currentSection === 'experience') {
      // Look for job titles and companies
      if (line.includes(' at ') || line.includes(' | ') || line.includes(' - ') || line.includes(',')) {
        if (currentJob) {
          resumeData.experience.push(currentJob)
          console.log('Added job:', currentJob.title, 'at', currentJob.company)
        }
        const parts = line.split(/ at | \| | - |,/)
        currentJob = {
          title: parts[0]?.trim() || '',
          company: parts[1]?.trim() || '',
          description: ''
        }
      } else if (currentJob && line.length > 20) {
        // Add to job description
        currentJob.description += (currentJob.description ? '\n' : '') + line
      } else if (!currentJob && line.length > 10) {
        // Might be a standalone job title
        currentJob = {
          title: line,
          company: '',
          description: ''
        }
      }
    } else if (currentSection === 'education') {
      if (lowerLine.includes('university') || lowerLine.includes('college') || lowerLine.includes('school') || lowerLine.includes('institute')) {
        if (currentEdu) {
          resumeData.education.push(currentEdu)
          console.log('Added education:', currentEdu.degree, 'at', currentEdu.school)
        }
        currentEdu = {
          school: line,
          degree: '',
          field: ''
        }
      } else if (currentEdu && (lowerLine.includes('bachelor') || lowerLine.includes('master') || lowerLine.includes('phd') || lowerLine.includes('degree'))) {
        currentEdu.degree = line
      } else if (!currentEdu && line.length > 10) {
        // Might be a degree without school mentioned yet
        currentEdu = {
          school: '',
          degree: line,
          field: ''
        }
      }
    } else if (currentSection === 'skills') {
      // Parse skills (comma-separated or bullet points)
      const skills = line.replace(/^[-•*]\s*/, '').split(/[,;]/).map(s => s.trim()).filter(s => s && s.length > 1)
      if (skills.length > 0) {
        resumeData.skills.push(...skills)
        console.log('Added skills:', skills)
      }
    } else if (currentSection === 'summary') {
      resumeData.summary += (resumeData.summary ? ' ' : '') + line
    } else if (!currentSection && i < 10) {
      // First few lines might be name/contact info
      if (!resumeData.personalInfo.name && line.length < 50 && !line.includes('@') && !/\d{3}/.test(line) && line.length > 3) {
        resumeData.personalInfo.name = line
        console.log('Found name:', resumeData.personalInfo.name)
      }
    }
  }

  // Add final job/education if exists
  if (currentJob) {
    resumeData.experience.push(currentJob)
    console.log('Added final job:', currentJob.title, 'at', currentJob.company)
  }
  if (currentEdu) {
    resumeData.education.push(currentEdu)
    console.log('Added final education:', currentEdu.degree, 'at', currentEdu.school)
  }

  // If we couldn't parse much, provide the raw text as a fallback
  if (!resumeData.personalInfo.name && !resumeData.experience.length && !resumeData.education.length && !resumeData.skills.length) {
    console.log('Parsing failed, providing raw text fallback')
    resumeData.rawText = text
    resumeData.summary = text.substring(0, 500) + (text.length > 500 ? '...' : '')
  }

  console.log('Final parsed resume data:', resumeData)
  return resumeData
} 