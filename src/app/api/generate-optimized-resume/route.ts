import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  ResumeData, 
  getTemplateById, 
  optimizeResumeForJob,
  allTemplates 
} from '@/lib/resume-templates'
import { latexTemplates, getLatexTemplate } from '@/lib/latex-templates'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      resumeData, 
      jobDescription, 
      templateId = 'classic-professional',
      format = 'html' // 'html' or 'markdown'
    }: {
      resumeData: ResumeData
      jobDescription: string
      templateId?: string
      format?: 'html' | 'markdown'
    } = body

    // Validate required fields
    if (!resumeData || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume data and job description are required' },
        { status: 400 }
      )
    }

    // Check if it's a LaTeX template
    const latexTemplate = getLatexTemplate(templateId)
    if (latexTemplate) {
      // Handle LaTeX template
      const { optimizedData, suggestions } = optimizeResumeForJob(
        resumeData, 
        jobDescription, 
        templateId
      )

      // Generate LaTeX source
      const generatedLatex = latexTemplate.generateLaTeX(optimizedData)

      return NextResponse.json({
        success: true,
        data: {
          resume: generatedLatex,
          format: 'latex',
          template: {
            id: latexTemplate.id,
            name: latexTemplate.name,
            description: latexTemplate.description,
            category: latexTemplate.category,
            atsOptimized: latexTemplate.atsOptimized,
            type: 'latex'
          },
          optimizations: {
            suggestions,
            keywordsFound: extractJobKeywords(jobDescription).filter(keyword =>
              resumeData.summary.toLowerCase().includes(keyword.toLowerCase()) ||
              resumeData.skills.technical.some(skill => 
                skill.toLowerCase().includes(keyword.toLowerCase())
              ) ||
              resumeData.skills.soft.some(skill => 
                skill.toLowerCase().includes(keyword.toLowerCase())
              )
            ),
            atsScore: calculateATSScore(optimizedData, jobDescription)
          }
        }
      })
    }

    // Handle HTML template (existing logic)
    const template = getTemplateById(templateId)
    if (!template) {
      return NextResponse.json(
        { error: `Template ${templateId} not found` },
        { status: 400 }
      )
    }

    // Optimize resume for the job
    const { optimizedData, suggestions } = optimizeResumeForJob(
      resumeData, 
      jobDescription, 
      templateId
    )

    // Generate the resume
    const generatedResume = format === 'html' 
      ? template.generateHTML(optimizedData, jobDescription)
      : template.generateMarkdown(optimizedData, jobDescription)

    // Return the optimized resume
    return NextResponse.json({
      success: true,
      data: {
        resume: generatedResume,
        format,
        template: {
          id: template.id,
          name: template.name,
          description: template.description,
          category: template.category,
          atsOptimized: template.atsOptimized,
          type: 'html'
        },
        optimizations: {
          suggestions,
          keywordsFound: extractJobKeywords(jobDescription).filter(keyword =>
            resumeData.summary.toLowerCase().includes(keyword.toLowerCase()) ||
            resumeData.skills.technical.some(skill => 
              skill.toLowerCase().includes(keyword.toLowerCase())
            ) ||
            resumeData.skills.soft.some(skill => 
              skill.toLowerCase().includes(keyword.toLowerCase())
            )
          ),
          atsScore: calculateATSScore(optimizedData, jobDescription)
        }
      }
    })

  } catch (error) {
    console.error('Error generating optimized resume:', error)
    return NextResponse.json(
      { error: 'Failed to generate optimized resume' },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch available templates
export async function GET() {
  try {
    // Combine HTML templates with LaTeX templates
    const htmlTemplates = allTemplates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      atsOptimized: template.atsOptimized,
      type: 'html' as const
    }))

    const latexTemplatesFormatted = latexTemplates.map(template => ({
      id: template.id,
      name: `${template.name} (LaTeX)`,
      description: `${template.description} - Professional LaTeX typesetting`,
      category: template.category,
      atsOptimized: template.atsOptimized,
      type: 'latex' as const
    }))

    const allAvailableTemplates = [...htmlTemplates, ...latexTemplatesFormatted]

    return NextResponse.json({
      success: true,
      data: {
        templates: allAvailableTemplates
      }
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// Helper function to extract keywords from job description
const extractJobKeywords = (jobDescription: string): string[] => {
  const commonKeywords = [
    // Technical skills
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 'Kubernetes',
    'Git', 'Agile', 'Scrum', 'REST', 'API', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL', 'Microservices',
    
    // Soft skills
    'Leadership', 'Communication', 'Problem-solving', 'Team management', 'Project management', 'Strategic planning',
    'Collaboration', 'Innovation', 'Analytical', 'Decision-making', 'Mentoring', 'Cross-functional',
    
    // Business terms
    'Revenue', 'Growth', 'Optimization', 'Efficiency', 'ROI', 'KPI', 'Metrics', 'Analytics', 'Strategy',
    'Operations', 'Process improvement', 'Customer experience', 'Stakeholder management'
  ]

  return commonKeywords.filter(keyword =>
    jobDescription.toLowerCase().includes(keyword.toLowerCase())
  )
}

// Helper function to calculate ATS compatibility score
const calculateATSScore = (resumeData: ResumeData, jobDescription: string): number => {
  let score = 0
  const maxScore = 100

  // Check for keywords in summary (30 points)
  const jobKeywords = extractJobKeywords(jobDescription)
  const summaryKeywords = jobKeywords.filter(keyword =>
    resumeData.summary.toLowerCase().includes(keyword.toLowerCase())
  )
  score += Math.min(30, (summaryKeywords.length / Math.max(jobKeywords.length, 1)) * 30)

  // Check for technical skills match (25 points)
  const techSkillsMatch = jobKeywords.filter(keyword =>
    resumeData.skills.technical.some(skill => 
      skill.toLowerCase().includes(keyword.toLowerCase())
    )
  )
  score += Math.min(25, (techSkillsMatch.length / Math.max(jobKeywords.length, 1)) * 25)

  // Check for soft skills match (15 points)
  const softSkillsMatch = jobKeywords.filter(keyword =>
    resumeData.skills.soft.some(skill => 
      skill.toLowerCase().includes(keyword.toLowerCase())
    )
  )
  score += Math.min(15, (softSkillsMatch.length / Math.max(jobKeywords.length, 1)) * 15)

  // Check for experience relevance (20 points)
  const experienceKeywords = resumeData.experience.flatMap(job => 
    [...job.description, ...job.achievements]
  ).join(' ').toLowerCase()
  
  const experienceMatches = jobKeywords.filter(keyword =>
    experienceKeywords.includes(keyword.toLowerCase())
  )
  score += Math.min(20, (experienceMatches.length / Math.max(jobKeywords.length, 1)) * 20)

  // Basic formatting and structure (10 points)
  let structureScore = 0
  if (resumeData.personalInfo.email && resumeData.personalInfo.phone) structureScore += 3
  if (resumeData.summary && resumeData.summary.length > 50) structureScore += 3
  if (resumeData.experience.length > 0) structureScore += 2
  if (resumeData.skills.technical.length > 0) structureScore += 2
  score += structureScore

  return Math.round(Math.min(maxScore, score))
} 