import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
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

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase() || ''
    const type = searchParams.get('type') // 'resume', 'job_offer', or null for both

    // Fetch user's resumes with extracted data
    const resumes = await db.resume.findMany({
      where: { 
        userId: user.id,
        ...(query && {
          filename: {
            contains: query,
            mode: 'insensitive'
          }
        })
      },
      include: {
        extractedResumes: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    // Fetch user's job descriptions from analyses
    const jobDescriptions = await db.extractedJobDescription.findMany({
      where: {
        generatedRoasts: {
          some: {
            userId: user.id
          }
        },
        ...(query && {
          originalText: {
            contains: query,
            mode: 'insensitive'
          }
        })
      },
      include: {
        generatedRoasts: {
          where: { userId: user.id },
          take: 1,
          orderBy: { createdAt: 'desc' }
        },
        summarizedJobDescriptions: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    // Transform resumes for mention system
    const resumeMentions = resumes
      .filter(() => !type || type === 'resume')
      .map(resume => {
        const extractedData = resume.extractedResumes[0]?.data as any
        const name = extractedData?.personalInfo?.name || 'Unknown User'
        const title = extractedData?.personalInfo?.jobTitle || extractedData?.summary?.substring(0, 50) || 'Resume'
        
        // Fallback to filename if no extracted data
        const displayTitle = extractedData ? `${name} - ${title}` : resume.filename.replace(/\.[^/.]+$/, "")
        const description = extractedData?.summary?.substring(0, 100) + '...' || 'Resume file - click to use in conversation'
        
        return {
          id: `resume_${resume.id}`,
          type: 'resume' as const,
          title: displayTitle,
          subtitle: resume.filename,
          description: description,
          createdAt: resume.createdAt.toISOString(),
          data: {
            resumeId: resume.id,
            extractedResumeId: resume.extractedResumes[0]?.id,
            extractedData: extractedData,
            filename: resume.filename
          }
        }
      })

    // Transform job descriptions for mention system
    const jobMentions = jobDescriptions
      .filter(() => !type || type === 'job_offer')
      .map(job => {
        const jobData = job.data as any
        const summary = job.summarizedJobDescriptions[0]?.summary as any
        const title = jobData?.title || summary?.title || 'Job Opportunity'
        const company = jobData?.company || summary?.company || 'Unknown Company'
        
        return {
          id: `job_${job.id}`,
          type: 'job_offer' as const,
          title: `${title} at ${company}`,
          subtitle: `Job Description`,
          description: job.originalText.substring(0, 100) + '...',
          createdAt: job.createdAt.toISOString(),
          data: {
            jobId: job.id,
            originalText: job.originalText,
            extractedData: jobData,
            summary: summary
          }
        }
      })

    // Debug logging
    console.log('=== MENTIONS DEBUG ===')
    console.log('User ID:', user.id)
    console.log('Query:', query)
    console.log('Type filter:', type)
    console.log('Resumes found:', resumes.length)
    console.log('Job descriptions found:', jobDescriptions.length)
    console.log('Resume mentions:', resumeMentions.length)
    console.log('Job mentions:', jobMentions.length)

    // Combine and sort by relevance and recency
    const allMentions = [...resumeMentions, ...jobMentions]
      .sort((a, b) => {
        // If there's a query, prioritize matches in title
        if (query) {
          const aMatches = a.title.toLowerCase().includes(query)
          const bMatches = b.title.toLowerCase().includes(query)
          if (aMatches && !bMatches) return -1
          if (!aMatches && bMatches) return 1
        }
        
        // Then sort by recency
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      .slice(0, 10) // Limit to 10 results

    console.log('Total mentions returned:', allMentions.length)
    console.log('Mentions:', allMentions.map(m => ({ type: m.type, title: m.title })))

    return NextResponse.json({
      success: true,
      data: allMentions
    })

  } catch (error) {
    console.error('Mentions fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mentions' },
      { status: 500 }
    )
  }
} 