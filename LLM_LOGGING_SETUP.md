# LLM Message Logging Implementation

## Overview

I've successfully implemented a comprehensive LLM message logging system that stores all AI conversations in your database for future analysis, debugging, and cost tracking.

## 🗃️ Database Schema

### New Tables Added

1. **`llm_conversations`** - Stores conversation metadata
   - `id` - Unique conversation ID
   - `userId` - User who initiated (nullable for anonymous)
   - `type` - Type of conversation (RESUME_ANALYSIS, JOB_EXTRACTION, etc.)
   - `title` - Optional conversation title
   - `documentId` - Related document if applicable
   - `provider` - AI provider (anthropic, openai, etc.)
   - `model` - Specific model used
   - `totalTokensUsed` - Total tokens consumed
   - `totalCost` - Total cost in USD
   - `status` - ACTIVE, COMPLETED, FAILED, CANCELLED
   - `createdAt`, `updatedAt`, `completedAt`

2. **`llm_messages`** - Stores individual messages
   - `id` - Unique message ID
   - `conversationId` - Links to conversation
   - `role` - USER, ASSISTANT, SYSTEM
   - `content` - Message content
   - `inputTokens`, `outputTokens`, `totalTokens`
   - `cost` - Cost for this specific message
   - `processingTime` - Response time in milliseconds
   - `messageIndex` - Order in conversation
   - AI metadata (finishReason, temperature, maxTokens)

## 📝 Implementation

### 1. LLM Logger Service (`src/lib/llm-logger.ts`)

Central service for all LLM logging operations:

```typescript
// Create a new conversation
const conversationId = await LLMLogger.createConversation({
  userId: session?.user?.id,
  type: ConversationType.RESUME_ANALYSIS,
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514'
})

// Log messages
await LLMLogger.logMessage({
  conversationId,
  role: MessageRole.USER,
  content: userPrompt,
  totalTokens: 1500,
  cost: 0.045
})

// Update conversation status
await LLMLogger.updateConversation({
  conversationId,
  status: ConversationStatus.COMPLETED,
  totalTokensUsed: 3500,
  totalCost: 0.125
})
```

### 2. Integrated with Resume Analysis (`src/app/api/analyze-resume/route.ts`)

- ✅ Automatically logs all resume analysis conversations
- ✅ Tracks system prompts, user inputs, and AI responses
- ✅ Calculates and stores token usage and costs
- ✅ Records processing times and metadata
- ✅ Handles errors gracefully

### 3. Analytics API (`src/app/api/llm-analytics/route.ts`)

Provides endpoints for viewing conversation data:

```bash
# Get user's conversations
GET /api/llm-analytics?action=conversations&type=RESUME_ANALYSIS&limit=50

# Get usage analytics
GET /api/llm-analytics?action=analytics&days=30

# Get specific conversation
GET /api/llm-analytics?action=conversation&id=conversation_id

# Admin analytics (system-wide)
POST /api/llm-analytics
```

## 🎯 Features

### ✅ Conversation Tracking
- Complete conversation history with all messages
- User attribution (anonymous support)
- Conversation types and categorization
- Status tracking (active, completed, failed)

### ✅ Cost & Usage Analytics
- Token usage tracking (input/output/total)
- Real-time cost calculation based on provider pricing
- Processing time measurement
- Aggregated analytics and reporting

### ✅ Error Handling
- Graceful failure handling - logging errors don't break main flow
- Error messages stored for debugging
- Failed conversation tracking

### ✅ Privacy & Security
- User-owned conversations (privacy protection)
- Anonymous conversation support
- Proper access control in analytics endpoints

## 📊 Usage Analytics Available

1. **Conversation Statistics**
   - Count by conversation type
   - Success/failure rates
   - Average processing times

2. **Token & Cost Analysis**
   - Total tokens used
   - Cost breakdown by provider/model
   - Usage trends over time

3. **User Insights**
   - Individual user usage patterns
   - System-wide analytics for admins

## 🔧 How to Use

### For Resume Analysis
Already integrated! Every resume analysis now automatically:
1. Creates a conversation record
2. Logs all prompts and responses
3. Tracks tokens and costs
4. Records metadata

### For Other AI Features
To add logging to other AI endpoints:

```typescript
import { LLMLogger, ConversationType, MessageRole } from '@/lib/llm-logger'

// 1. Create conversation
const conversationId = await LLMLogger.createConversation({
  userId: session?.user?.id,
  type: ConversationType.COVER_LETTER_GENERATION, // or other type
  provider: 'openai',
  model: 'gpt-4'
})

// 2. Log messages as you interact with AI
await LLMLogger.logMessage({
  conversationId,
  role: MessageRole.USER,
  content: userInput
})

await LLMLogger.logMessage({
  conversationId,
  role: MessageRole.ASSISTANT,
  content: aiResponse,
  totalTokens: response.usage.total_tokens,
  cost: calculateCost(response.usage)
})

// 3. Mark as completed
await LLMLogger.updateConversation({
  conversationId,
  status: ConversationStatus.COMPLETED
})
```

## 🔮 Future Enhancements

1. **Dashboard UI** - Visual analytics dashboard
2. **Export Features** - Export conversation data
3. **Advanced Analytics** - ML insights on usage patterns
4. **Cost Alerts** - Budget monitoring and alerts
5. **Conversation Search** - Full-text search through conversations
6. **Rate Limiting** - Usage-based rate limiting
7. **A/B Testing** - Track different prompt versions

## 🗄️ Database Migration

The database has been updated with the new tables. All existing data is preserved, and the new logging system runs alongside existing functionality.

## 📈 Benefits

1. **Debugging** - Complete conversation history for troubleshooting
2. **Cost Tracking** - Real-time cost monitoring and budgeting
3. **Analytics** - Understanding user behavior and system performance
4. **Compliance** - Audit trail for AI interactions
5. **Optimization** - Data for improving prompts and models
6. **Support** - Better customer support with conversation history

The system is designed to be:
- **Non-intrusive** - Doesn't affect existing functionality
- **Performant** - Async logging doesn't slow down responses
- **Scalable** - Handles high volumes of conversations
- **Privacy-focused** - User-owned data with proper access controls

Your LLM logging system is now fully operational! 🚀 