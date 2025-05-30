import { NextRequest, NextResponse } from 'next/server'
import { ResumeService } from '@/lib/database'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resumeId = searchParams.get('id')
    const fileHash = searchParams.get('fileHash')
    const userId = searchParams.get('userId') // Optional for authorization

    if (!resumeId && !fileHash) {
      return NextResponse.json(
        { error: 'Either resumeId or fileHash is required' },
        { status: 400 }
      )
    }

    // Find the resume first to check ownership if userId is provided
    let resume
    if (resumeId) {
      resume = await ResumeService.findById(resumeId)
    } else if (fileHash) {
      resume = await ResumeService.findByHash(fileHash)
    }

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    // Check authorization if userId is provided
    if (userId && resume.userId && resume.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only delete your own resumes' },
        { status: 403 }
      )
    }

    // Delete the resume
    if (resumeId) {
      await ResumeService.deleteById(resumeId)
    } else if (fileHash) {
      await ResumeService.deleteByHash(fileHash)
    }

    console.log(`Resume deleted: ${resume.filename} (${resume.id})`)

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully',
      deletedResume: {
        id: resume.id,
        filename: resume.filename,
        fileHash: resume.fileHash
      }
    })

  } catch (error) {
    console.error('Delete resume error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to delete resume',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
} 