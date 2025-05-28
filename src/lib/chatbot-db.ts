import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export interface ChatbotMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatbotConversation {
  id: string;
  title: string;
  messages: ChatbotMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export async function createChatbotConversation(
  userId: string | null,
  title: string,
  firstMessage: string
): Promise<ChatbotConversation> {
  const conversation = await prisma.lLMConversation.create({
    data: {
      userId,
      type: 'CHATBOT_SUPPORT',
      title,
      provider: 'internal',
      model: 'chatbot-v1',
      status: 'ACTIVE',
      messages: {
        create: {
          role: 'USER',
          content: firstMessage,
          messageIndex: 0,
        }
      }
    },
    include: {
      messages: {
        orderBy: { messageIndex: 'asc' }
      }
    }
  });

  return {
    id: conversation.id,
    title: conversation.title || title,
    messages: conversation.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.role === 'USER' ? 'user' : 'bot',
      timestamp: msg.createdAt,
    })),
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
}

export async function addMessageToConversation(
  conversationId: string,
  content: string,
  role: 'USER' | 'ASSISTANT'
): Promise<ChatbotMessage> {
  // Get the current message count to determine the next index
  const messageCount = await prisma.lLMMessage.count({
    where: { conversationId }
  });

  const message = await prisma.lLMMessage.create({
    data: {
      conversationId,
      role,
      content,
      messageIndex: messageCount,
    }
  });

  // Update conversation timestamp
  await prisma.lLMConversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() }
  });

  return {
    id: message.id,
    content: message.content,
    sender: role === 'USER' ? 'user' : 'bot',
    timestamp: message.createdAt,
  };
}

export async function getChatbotConversations(
  userId: string | null
): Promise<ChatbotConversation[]> {
  const conversations = await prisma.lLMConversation.findMany({
    where: {
      userId,
      type: 'CHATBOT_SUPPORT',
    },
    include: {
      messages: {
        orderBy: { messageIndex: 'asc' }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return conversations.map(conv => ({
    id: conv.id,
    title: conv.title || 'Untitled Conversation',
    messages: conv.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.role === 'USER' ? 'user' : 'bot',
      timestamp: msg.createdAt,
    })),
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt,
  }));
}

export async function getChatbotConversation(
  conversationId: string,
  userId: string | null
): Promise<ChatbotConversation | null> {
  const conversation = await prisma.lLMConversation.findFirst({
    where: {
      id: conversationId,
      userId,
      type: 'CHATBOT_SUPPORT',
    },
    include: {
      messages: {
        orderBy: { messageIndex: 'asc' }
      }
    }
  });

  if (!conversation) return null;

  return {
    id: conversation.id,
    title: conversation.title || 'Untitled Conversation',
    messages: conversation.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.role === 'USER' ? 'user' : 'bot',
      timestamp: msg.createdAt,
    })),
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  };
} 