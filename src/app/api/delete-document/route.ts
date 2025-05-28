import { NextRequest, NextResponse } from 'next/server'
import { DocumentService } from '@/lib/database'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')
    const fileHash = searchParams.get('fileHash')
    const userId = searchParams.get('userId') // Optional for authorization

    if (!documentId && !fileHash) {
      return NextResponse.json(
        { error: 'Either documentId or fileHash is required' },
        { status: 400 }
      )
    }

    // Find the document first to check ownership if userId is provided
    let document
    if (documentId) {
      document = await DocumentService.findById(documentId)
    } else if (fileHash) {
      document = await DocumentService.findByHash(fileHash)
    }

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Check authorization if userId is provided
    if (userId && document.userId && document.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only delete your own documents' },
        { status: 403 }
      )
    }

    // Delete the document
    if (documentId) {
      await DocumentService.deleteById(documentId)
    } else if (fileHash) {
      await DocumentService.deleteByHash(fileHash)
    }

    console.log(`Document deleted: ${document.filename} (${document.id})`)

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
      deletedDocument: {
        id: document.id,
        filename: document.filename,
        fileHash: document.fileHash
      }
    })

  } catch (error) {
    console.error('Document deletion error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Record to delete does not exist')) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    )
  }
} 