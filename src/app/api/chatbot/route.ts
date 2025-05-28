import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { 
  createChatbotConversation, 
  addMessageToConversation, 
  getChatbotConversations,
  getChatbotConversation 
} from '@/lib/chatbot-db';

interface ChatMessage {
  content: string;
  sender: 'user' | 'bot';
}

const RESUME_RESPONSES = {
  greetings: [
    "Hello! I'm here to help you create an outstanding resume. What would you like to work on today?",
    "Hi there! Ready to make your resume shine? I'm here to guide you through the process.",
    "Welcome! I'm your resume optimization assistant. How can I help you land your dream job?",
  ],
  
  improvement: [
    "Great question! Here are key areas to focus on: 1) Use strong action verbs, 2) Quantify your achievements with numbers, 3) Tailor content to the job description, 4) Keep formatting clean and ATS-friendly.",
    "To improve your resume, focus on: • Highlighting measurable accomplishments • Using industry-specific keywords • Ensuring proper formatting • Keeping it concise yet comprehensive.",
    "Resume improvement tips: Start each bullet point with an action verb, include metrics wherever possible, customize for each application, and ensure your contact information is current and professional.",
  ],
  
  ats: [
    "For ATS optimization: Use standard fonts (Arial, Calibri), avoid graphics/images, include relevant keywords from job descriptions, use standard section headings, and save as both PDF and Word formats.",
    "ATS-friendly tips: • Use simple formatting • Include keywords naturally • Avoid headers/footers • Use standard section names • Test with online ATS scanners.",
    "To beat ATS systems: Match job description keywords, use standard resume sections, avoid fancy formatting, include both acronyms and full terms (e.g., 'AI' and 'Artificial Intelligence').",
  ],
  
  sections: [
    "Essential resume sections: 1) Contact Information, 2) Professional Summary, 3) Work Experience, 4) Education, 5) Skills. Optional: Projects, Certifications, Volunteer Work.",
    "Key sections to include: • Header with contact info • Compelling summary • Relevant work experience • Education details • Technical/soft skills • Additional sections as needed.",
    "Standard resume structure: Contact details at top, followed by a strong summary, detailed work experience (reverse chronological), education, skills, and any relevant additional sections.",
  ],
  
  length: [
    "Resume length guidelines: 1 page for entry-level (0-5 years), 2 pages for mid-level (5-15 years), 3+ pages only for senior executives or academic positions.",
    "Keep it concise: Most recruiters spend 6-10 seconds on initial review. One page is ideal for most professionals, two pages maximum unless you're very senior.",
    "Length matters: Quality over quantity. Better to have one strong page than two weak ones. Focus on your most relevant and impressive achievements.",
  ],
  
  keywords: [
    "Include keywords from: job descriptions, industry terminology, technical skills, soft skills, and company values. Use them naturally throughout your resume.",
    "Keyword strategy: Mirror the job posting language, include both hard and soft skills, use industry jargon appropriately, and incorporate company-specific terms.",
    "Smart keyword usage: Study job descriptions, use relevant technical terms, include both acronyms and full terms, and ensure natural integration into your content.",
  ],
  
  default: [
    "I'd be happy to help with your resume! Could you be more specific about what you'd like to improve?",
    "That's a great question about resumes! What particular aspect would you like me to focus on?",
    "I'm here to help optimize your resume. What specific area are you looking to enhance?",
  ]
};

function getResponseCategory(message: string): keyof typeof RESUME_RESPONSES {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'greetings';
  }
  
  if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('enhance')) {
    return 'improvement';
  }
  
  if (lowerMessage.includes('ats') || lowerMessage.includes('applicant tracking') || lowerMessage.includes('scan')) {
    return 'ats';
  }
  
  if (lowerMessage.includes('section') || lowerMessage.includes('structure') || lowerMessage.includes('format')) {
    return 'sections';
  }
  
  if (lowerMessage.includes('length') || lowerMessage.includes('long') || lowerMessage.includes('page')) {
    return 'length';
  }
  
  if (lowerMessage.includes('keyword') || lowerMessage.includes('seo') || lowerMessage.includes('optimize')) {
    return 'keywords';
  }
  
  return 'default';
}

function generateConversationTitle(message: string): string {
  const words = message.split(' ').slice(0, 6);
  return words.join(' ') + (message.split(' ').length > 6 ? '...' : '');
}

// POST - Send a message
export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get user session (for authenticated users)
    const session = await getServerSession();
    const userId = session?.user?.id || null;

    let currentConversationId = conversationId;

    // If no conversation ID, create a new conversation
    if (!currentConversationId) {
      const title = generateConversationTitle(message);
      const conversation = await createChatbotConversation(userId, title, message);
      currentConversationId = conversation.id;
    } else {
      // Add user message to existing conversation
      await addMessageToConversation(currentConversationId, message, 'USER');
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
    
    // Generate bot response
    const category = getResponseCategory(message);
    const responses = RESUME_RESPONSES[category];
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Add bot response to conversation
    const botMessage = await addMessageToConversation(currentConversationId, response, 'ASSISTANT');
    
    return NextResponse.json({
      response: botMessage.content,
      conversationId: currentConversationId,
      category,
      timestamp: botMessage.timestamp.toISOString(),
    });
    
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get conversations or specific conversation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    // Get user session
    const session = await getServerSession();
    const userId = session?.user?.id || null;

    if (conversationId) {
      // Get specific conversation
      const conversation = await getChatbotConversation(conversationId, userId);
      
      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ conversation });
    } else {
      // Get all conversations for user
      const conversations = await getChatbotConversations(userId);
      return NextResponse.json({ conversations });
    }
    
  } catch (error) {
    console.error('Chatbot GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 