# AI-Powered Resume Roaster Setup

## 🚀 AI Features

This Resume Roaster now uses **AI-powered PDF extraction** and **intelligent chatbot** with:
- **Anthropic Claude 3.5 Sonnet** (Primary - Direct PDF Support)
- **OpenAI GPT-4o-mini** (Chatbot Assistant)

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with your API keys:

```bash
# AI Provider API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Get API Keys

**Anthropic Claude (Required for PDF extraction):**
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create an account and get your API key
3. Add credits to your account ($5 minimum)

**OpenAI (Required for chatbot):**
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create an account and get your API key
3. Add credits to your account ($5 minimum)

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

## ✨ How It Works

### PDF Extraction
1. **PDF Upload**: Users upload their resume PDF (up to 10MB)
2. **Direct AI Processing**: PDF is sent directly to Claude 3.5 Sonnet
3. **Advanced Extraction**: Claude reads the PDF natively with superior accuracy
4. **Markdown Formatting**: AI formats content as clean, professional markdown
5. **Beautiful Display**: Professional markdown rendering with Tailwind Typography

### Intelligent Chatbot
1. **Global Access**: Floating chatbot available on every page
2. **Resume Expertise**: Specialized in resume optimization and career advice
3. **Conversation History**: Persistent conversations with database storage
4. **Smart Responses**: GPT-4o-mini provides contextual, actionable advice
5. **Quick Actions**: Pre-built prompts for common resume questions

## 🎯 Features

- **Native PDF Support**: Claude can read PDFs directly without conversion
- **Superior Accuracy**: No image conversion means perfect text extraction
- **Smart Formatting**: Automatic section headers, bullet points, and table preservation
- **Intelligent Chatbot**: 24/7 resume and career advice assistant
- **Conversation Persistence**: All chat history saved to database
- **Error Handling**: Comprehensive error messages and retry functionality
- **File Validation**: Size limits and type checking
- **Professional UI**: Clean markdown rendering with custom typography

## 🔒 Security

- No temporary files needed (direct processing)
- No data is stored permanently for PDF extraction
- Chatbot conversations are securely stored in database
- API keys are securely handled through environment variables
- Files are processed in memory only

## 💡 Usage Tips

- **File Size**: Maximum 10MB for direct PDF processing
- **File Quality**: Works with any PDF format (text-based or image-based)
- **API Credits**: Each extraction uses approximately $0.01-0.05 in credits
- **Chatbot Cost**: Each conversation message costs approximately $0.001-0.01
- **Best Results**: Modern PDFs with clear text formatting work best 