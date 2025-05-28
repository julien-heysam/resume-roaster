// Debug script to test documentId flow
const { PrismaClient } = require('./src/generated/prisma')

const prisma = new PrismaClient()

async function debugDocumentId() {
  try {
    console.log('🔍 Checking specific analysis mentioned by user...')
    
    const specificAnalysis = await prisma.analysis.findUnique({
      where: {
        id: 'cmb7ygl0600098cqkninqei79'
      },
      include: {
        document: {
          select: {
            id: true,
            filename: true,
            images: true
          }
        }
      }
    })
    
    if (specificAnalysis) {
      console.log('Found specific analysis:')
      console.log(`- ID: ${specificAnalysis.id}`)
      console.log(`- Title: ${specificAnalysis.title}`)
      console.log(`- DocumentId: ${specificAnalysis.documentId}`)
      console.log(`- Document: ${specificAnalysis.document ? specificAnalysis.document.filename : 'null'}`)
      console.log(`- Document has images: ${specificAnalysis.document?.images?.length || 0}`)
    } else {
      console.log('Analysis not found')
    }
    
    console.log('\n🔍 Checking analyses with null documentId...')
    
    const analysesWithNullDocId = await prisma.analysis.findMany({
      where: {
        documentId: null
      },
      select: {
        id: true,
        title: true,
        documentId: true,
        createdAt: true
      }
    })
    
    console.log(`Found ${analysesWithNullDocId.length} analyses with null documentId:`)
    analysesWithNullDocId.forEach(analysis => {
      console.log(`- ${analysis.id}: ${analysis.title} (created: ${analysis.createdAt})`)
    })
    
    console.log('\n🔍 Checking recent documents...')
    const recentDocuments = await prisma.document.findMany({
      take: 5,
      orderBy: {
        processedAt: 'desc'
      },
      select: {
        id: true,
        filename: true,
        processedAt: true,
        images: true,
        analyses: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
    
    console.log(`Found ${recentDocuments.length} recent documents:`)
    recentDocuments.forEach(doc => {
      console.log(`- ${doc.id}: ${doc.filename} (${doc.analyses.length} analyses, ${doc.images.length} images)`)
      doc.analyses.forEach(analysis => {
        console.log(`  └─ ${analysis.id}: ${analysis.title}`)
      })
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugDocumentId() 