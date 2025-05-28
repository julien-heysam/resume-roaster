# PDF Extraction System

Resume Roaster now supports a three-tier PDF extraction system that provides different levels of service based on user registration status and AI provider choice.

## Overview

### For Non-Registered Users
- **Basic PDF Extraction Only**: Free, fast text extraction using `pdf-parse` and `node-poppler`
- **Processing Time**: 5-10 seconds
- **Cost**: Completely free
- **Output**: Plain text extraction without formatting
- **Use Case**: Quick resume processing, simple text extraction

### For Registered Users
Registered users can choose between three extraction methods:

#### 1. Basic Extraction (Free)
- **Technology**: `pdf-parse` and `node-poppler`
- **Processing Time**: 5-10 seconds  
- **Cost**: Free (no credits used)
- **Output**: Plain text extraction
- **Best For**: Simple resumes, quick processing, preserving credits

#### 2. GPT-4 Mini AI Extraction (0.5 Credits)
- **Technology**: OpenAI GPT-4 Mini with basic PDF text extraction + AI formatting
- **Processing Time**: 10-20 seconds
- **Cost**: 0.5 credits (~$0.01-0.025)
- **Output**: AI-formatted markdown with smart structure
- **Best For**: Budget-conscious users, good formatting, faster AI processing

#### 3. Claude Sonnet 4 AI Extraction (1 Credit)
- **Technology**: Anthropic Claude Sonnet 4 with direct PDF processing
- **Processing Time**: 15-30 seconds
- **Cost**: 1 credit (~$0.02-0.05)
- **Output**: Superior formatted markdown with highest accuracy
- **Best For**: Complex resumes, highest quality, direct PDF processing

## API Endpoints

### `/api/extract-pdf-ai`
Main endpoint that handles basic and both AI extraction methods based on user status and preferences.

**Parameters:**
- `file`: PDF file to extract
- `userId`: Optional user ID for registered users
- `extractionMethod`: `'basic'`, `'ai'`, or `'auto'` (default: `'auto'`)
- `provider`: AI provider - `'anthropic'` (Claude Sonnet 4) or `'openai'` (GPT-4 Mini)

**Logic:**
- Non-registered users: Always use basic extraction
- Registered users: Respect `extractionMethod` and `provider` parameters
- Caching: Results are cached by file hash to avoid reprocessing

### `/api/extract-pdf-basic`
Dedicated endpoint for basic PDF extraction (legacy support).

## Implementation Details

### Basic Extraction Process
1. **Primary Method**: `node-poppler` - Most reliable for PDF text extraction
2. **Fallback Method**: `pdf-parse` - Simplified approach if poppler fails
3. **Final Fallback**: Meaningful placeholder with file metadata

### AI Extraction Process

#### Claude Sonnet 4 (Anthropic)
1. **Direct PDF Processing**: Send PDF directly to Claude Sonnet 4
2. **Structured Output**: JSON response with markdown, summary, and sections
3. **Fallback Parsing**: Handle cases where JSON parsing fails

#### GPT-4 Mini (OpenAI)
1. **Two-Step Process**: First extract text using basic methods, then process with GPT-4 Mini
2. **AI Enhancement**: GPT-4 Mini formats and structures the extracted text
3. **Cost Efficient**: Uses cheaper model while still providing AI formatting

### Credit System
- **Basic Extraction**: 0 credits (free)
- **GPT-4 Mini**: 0.5 credits per extraction
- **Claude Sonnet 4**: 1 credit per extraction

### File Handling
- **Temporary Files**: Created in system temp directory for basic extraction
- **Cleanup**: Automatic cleanup of temporary files
- **Security**: Files are processed locally and cleaned up immediately

## Frontend Integration

### ExtractionMethodSelector Component
- **Non-registered users**: Shows information about basic extraction and signup benefits
- **Registered users**: Interactive selection between basic and AI extraction
- **Visual feedback**: Clear indication of processing time, cost, and output quality

### Updated File Upload Flow
1. **File Selection**: User selects PDF file
2. **Method Selection**: Registered users choose extraction method (PDF files only)
3. **Processing**: Extraction occurs based on selected method
4. **Results**: Display extracted content with method indicator

## Dependencies

### New Dependencies Added
```json
{
  "pdf-parse": "^1.1.1",
  "node-poppler": "^0.2.3",
  "@types/pdf-parse": "^1.1.1"
}
```

### System Requirements
- **node-poppler**: Requires poppler-utils to be installed on the system
- **pdf-parse**: Pure JavaScript, no system dependencies

## Error Handling

### Basic Extraction Errors
- **Empty PDF**: Clear error message for PDFs with no extractable text
- **Corrupted PDF**: Graceful fallback to meaningful placeholder
- **System Errors**: Proper error logging and user feedback

### AI Extraction Errors
- **API Limits**: Rate limiting and quota exceeded handling
- **Network Issues**: Retry logic and timeout handling
- **Processing Errors**: Fallback to basic extraction if AI fails

## Performance Considerations

### Caching Strategy
- **File Hash**: SHA-256 hash of file content for cache key
- **Database Storage**: Extracted content stored in database
- **Cache Hits**: Instant response for previously processed files

### Resource Management
- **Temporary Files**: Automatic cleanup prevents disk space issues
- **Memory Usage**: Streaming file processing where possible
- **Concurrent Processing**: Proper handling of multiple simultaneous extractions

## Usage Examples

### Basic Usage (Non-registered)
```javascript
const formData = new FormData()
formData.append('file', pdfFile)

const response = await fetch('/api/extract-pdf-ai', {
  method: 'POST',
  body: formData
})
// Automatically uses basic extraction
```

### Registered User with Method Selection
```javascript
const formData = new FormData()
formData.append('file', pdfFile)
formData.append('userId', userId)
formData.append('extractionMethod', 'ai') // or 'basic'

const response = await fetch('/api/extract-pdf-ai', {
  method: 'POST',
  body: formData
})
```

## Future Enhancements

### Planned Features
- **OCR Support**: For scanned PDFs with image-based text
- **Batch Processing**: Multiple file extraction
- **Custom Templates**: User-defined extraction templates
- **Quality Metrics**: Extraction confidence scoring

### Performance Improvements
- **Parallel Processing**: Concurrent extraction for multiple files
- **Smart Caching**: Predictive caching based on usage patterns
- **Edge Processing**: CDN-based extraction for faster response times 