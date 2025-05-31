import { NextRequest, NextResponse } from 'next/server';
import { documentationIndexer } from '@/lib/documentation-indexer';

export async function POST(request: NextRequest) {
  try {
    console.log('📚 Starting documentation indexing...');
    await documentationIndexer.indexDocumentation();
    
    return NextResponse.json({
      success: true,
      message: 'Documentation indexed successfully'
    });
  } catch (error) {
    console.error('❌ Error indexing documentation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const status = await documentationIndexer.getIndexStatus();
    
    return NextResponse.json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('❌ Error getting index status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        totalChunks: 0,
        sections: []
      },
      { status: 500 }
    );
  }
} 