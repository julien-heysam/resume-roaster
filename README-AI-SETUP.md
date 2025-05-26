# AI-Powered Resume Roaster Setup

## 🚀 AI Features

This Resume Roaster now uses **AI-powered PDF extraction** with:
- **Anthropic Claude 3.5 Sonnet** (Primary - Direct PDF Support)
- **OpenAI GPT-4o** (Coming Soon)

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with your Anthropic API key:

```bash
# AI Provider API Key (required)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 2. Get API Key

**Anthropic Claude (Required):**
1. Visit [console.anthropic.com](https://console.anthropic.com)
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

1. **PDF Upload**: Users upload their resume PDF (up to 10MB)
2. **Direct AI Processing**: PDF is sent directly to Claude 3.5 Sonnet
3. **Advanced Extraction**: Claude reads the PDF natively with superior accuracy
4. **Markdown Formatting**: AI formats content as clean, professional markdown
5. **Beautiful Display**: Professional markdown rendering with Tailwind Typography

## 🎯 Features

- **Native PDF Support**: Claude can read PDFs directly without conversion
- **Superior Accuracy**: No image conversion means perfect text extraction
- **Smart Formatting**: Automatic section headers, bullet points, and table preservation
- **Error Handling**: Comprehensive error messages and retry functionality
- **File Validation**: Size limits and type checking
- **Professional UI**: Clean markdown rendering with custom typography

## 🔒 Security

- No temporary files needed (direct processing)
- No data is stored permanently
- API keys are securely handled through environment variables
- Files are processed in memory only

## 💡 Usage Tips

- **File Size**: Maximum 10MB for direct PDF processing
- **File Quality**: Works with any PDF format (text-based or image-based)
- **API Credits**: Each extraction uses approximately $0.01-0.05 in credits
- **Best Results**: Modern PDFs with clear text formatting work best 