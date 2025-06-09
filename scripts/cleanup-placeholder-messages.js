const { PrismaClient } = require('../src/generated/prisma')

const prisma = new PrismaClient()

async function cleanupPlaceholderMessages() {
  try {
    console.log('Starting cleanup of placeholder messages...')
    
    // Find all conversation messages with the placeholder text
    const placeholderMessages = await prisma.conversationMessage.findMany({
      where: {
        content: 'Response saved during streaming'
      },
      include: {
        conversation: true
      }
    })
    
    console.log(`Found ${placeholderMessages.length} placeholder messages`)
    
    if (placeholderMessages.length === 0) {
      console.log('No placeholder messages found. Cleanup complete.')
      return
    }
    
    // Get unique conversation IDs that have placeholder messages
    const conversationIds = [...new Set(placeholderMessages.map(msg => msg.conversationId))]
    
    console.log(`Affected conversations: ${conversationIds.length}`)
    
    // Delete the placeholder messages
    const deleteResult = await prisma.conversationMessage.deleteMany({
      where: {
        content: 'Response saved during streaming'
      }
    })
    
    console.log(`Deleted ${deleteResult.count} placeholder messages`)
    
    // Update message counts for affected conversations
    for (const conversationId of conversationIds) {
      const messageCount = await prisma.conversationMessage.count({
        where: { conversationId }
      })
      
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { messageCount }
      })
      
      console.log(`Updated message count for conversation ${conversationId}: ${messageCount}`)
    }
    
    console.log('Cleanup completed successfully!')
    
  } catch (error) {
    console.error('Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupPlaceholderMessages() 