import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') || 'RESUME_ANALYSIS'
    const search = searchParams.get('search') || ''

    // Calculate offset for pagination
    const offset = (page - 1) * limit

    // Create search variations for better matching
    const searchVariations = search ? [
      search,
      search.toLowerCase(),
      search.toUpperCase(),
      search.charAt(0).toUpperCase() + search.slice(1).toLowerCase() // Title case
    ].filter((v, i, arr) => arr.indexOf(v) === i) : [] // Remove duplicates

    // Fetch user's analyses with related document data
    const analyses = await db.generatedRoast.findMany({
      where: {
        userId: userId,
        ...(search && {
          OR: searchVariations.flatMap(searchTerm => [
            // Search in the analysis data (convert JSON to text)
            {
              data: {
                string_contains: searchTerm
              }
            },
            // Search in extracted job data
            {
              extractedJob: {
                data: {
                  string_contains: searchTerm
                }
              }
            },
            // Search in extracted resume data
            {
              extractedResume: {
                data: {
                  string_contains: searchTerm
                }
              }
            }
          ])
        })
      },
      include: {
        resume: true, // Include resume data with PDF images
        extractedJob: {
          include: {
            summarizedJobDescriptions: true // Include summarized job descriptions
          }
        }, // Include job description data with summaries
        extractedResume: true // Include extracted resume data
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: offset,
      take: limit
    })

    // Get total count for pagination
    const total = await db.generatedRoast.count({
      where: {
        userId: userId,
        ...(search && {
          OR: searchVariations.flatMap(searchTerm => [
            // Search in the analysis data (convert JSON to text)
            {
              data: {
                string_contains: searchTerm
              }
            },
            // Search in extracted job data
            {
              extractedJob: {
                data: {
                  string_contains: searchTerm
                }
              }
            },
            // Search in extracted resume data
            {
              extractedResume: {
                data: {
                  string_contains: searchTerm
                }
              }
            }
          ])
        })
      }
    })

    // Transform the data to match expected format
    const transformedAnalyses = analyses.map(analysis => {
      // Extract job description - prefer summarized version over raw text
      let jobDescription = null
      
      // First, try to get the summarized job description
      if (analysis.extractedJob && analysis.extractedJob.summarizedJobDescriptions && analysis.extractedJob.summarizedJobDescriptions.length > 0) {
        const summarizedJob = analysis.extractedJob.summarizedJobDescriptions[0]
        if (summarizedJob.summary) {
          jobDescription = typeof summarizedJob.summary === 'string' 
            ? summarizedJob.summary 
            : JSON.stringify(summarizedJob.summary, null, 2)
          console.log('Using summarized job description for analysis:', analysis.id)
        }
      }
      
      // Fallback to original job description if no summary available
      if (!jobDescription && analysis.extractedJob && analysis.extractedJob.data) {
        const jobData = analysis.extractedJob.data as any
        jobDescription = jobData.originalText || jobData.text || null
        console.log('Using original job description for analysis:', analysis.id)
      }
      
      // Final fallback: check if job description is stored in analysis data itself
      if (!jobDescription && analysis.data) {
        const analysisData = analysis.data as any
        if (analysisData.jobDescription) {
          jobDescription = analysisData.jobDescription
        }
      }

      // Extract PDF images from resume relation
      let pdfImages: string[] = []
      if (analysis.resume && analysis.resume.images) {
        pdfImages = analysis.resume.images
      }

      // Extract resume data from extractedResume relation
      let resumeData = null
      if (analysis.extractedResume && analysis.extractedResume.data) {
        resumeData = analysis.extractedResume.data
      }

      return {
        id: analysis.id,
        type: 'RESUME_ANALYSIS' as const,
        createdAt: analysis.createdAt.toISOString(),
        overallScore: analysis.overallScore,
        title: `Resume Analysis - ${analysis.createdAt.toLocaleDateString()}`,
        documentId: analysis.resumeId,
        pdfImages: pdfImages, // Include PDF images
        jobDescription: jobDescription, // Include job description
        data: {
          analysis: analysis.data, // The roast analysis data
          resumeData: resumeData, // The extracted resume data
          jobDescription: jobDescription // Also include in data object for compatibility
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedAnalyses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Analysis history fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analysis history' },
      { status: 500 }
    )
  }
} 