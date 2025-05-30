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
  const llmCall = await prisma.llmCall.create({
    data: {
      userId,
      provider: 'internal',
      model: 'chatbot-v1',
      operationType: 'chatbot_support',
      status: 'COMPLETED',
      messages: {
        create: {
          role: 'user',
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
    id: llmCall.id,
    title: title,
    messages: llmCall.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.role === 'user' ? 'user' : 'bot',
      timestamp: msg.createdAt,
    })),
    createdAt: llmCall.createdAt,
    updatedAt: llmCall.completedAt || llmCall.createdAt,
  };
}

export async function addMessageToConversation(
  conversationId: string,
  content: string,
  role: 'user' | 'assistant'
): Promise<ChatbotMessage> {
  // Get the current message count to determine the next index
  const messageCount = await prisma.llmMessage.count({
    where: { llmCallId: conversationId }
  });

  const message = await prisma.llmMessage.create({
    data: {
      llmCallId: conversationId,
      role,
      content,
      messageIndex: messageCount,
    }
  });

  // Update LLM call timestamp
  await prisma.llmCall.update({
    where: { id: conversationId },
    data: { completedAt: new Date() }
  });

  return {
    id: message.id,
    content: message.content,
    sender: role === 'user' ? 'user' : 'bot',
    timestamp: message.createdAt,
  };
}

export async function getChatbotConversations(
  userId: string | null
): Promise<ChatbotConversation[]> {
  const llmCalls = await prisma.llmCall.findMany({
    where: {
      userId,
      operationType: 'chatbot_support',
    },
    include: {
      messages: {
        orderBy: { messageIndex: 'asc' }
      }
    },
    orderBy: { completedAt: 'desc' }
  });

  return llmCalls.map(call => ({
    id: call.id,
    title: 'Chatbot Conversation',
    messages: call.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.role === 'user' ? 'user' : 'bot',
      timestamp: msg.createdAt,
    })),
    createdAt: call.createdAt,
    updatedAt: call.completedAt || call.createdAt,
  }));
}

export async function getChatbotConversation(
  conversationId: string,
  userId: string | null
): Promise<ChatbotConversation | null> {
  const llmCall = await prisma.llmCall.findFirst({
    where: {
      id: conversationId,
      userId,
      operationType: 'chatbot_support',
    },
    include: {
      messages: {
        orderBy: { messageIndex: 'asc' }
      }
    }
  });

  if (!llmCall) return null;

  return {
    id: llmCall.id,
    title: 'Chatbot Conversation',
    messages: llmCall.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.role === 'user' ? 'user' : 'bot',
      timestamp: msg.createdAt,
    })),
    createdAt: llmCall.createdAt,
    updatedAt: llmCall.completedAt || llmCall.createdAt,
  };
} 