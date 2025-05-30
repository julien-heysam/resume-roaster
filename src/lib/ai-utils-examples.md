# AI Utilities Documentation

This document provides examples and usage patterns for the OpenAI and Anthropic utilities with function calling support.

## Overview

Both utilities provide:
- **Function Calling/Tools**: Structured output with schema validation
- **Constants**: Predefined models, context sizes, and temperatures
- **Error Handling**: Comprehensive error management with timeouts
- **Cost Calculation**: Accurate pricing based on token usage
- **Helper Functions**: Specialized functions for common use cases

## Centralized JSON Utilities (`src/lib/json-utils.ts`)

### Overview

To eliminate code duplication and provide consistent JSON parsing across the application, we've created centralized JSON utilities that handle various formats LLMs might return JSON in.

### Available Functions

```typescript
import { 
  parseJSONResponse,
  safeParseJSON,
  legacyParseJSON,
  isContentIncomplete,
  extractJSONFromMarkdown,
  extractJSONByBraces,
  cleanMarkdownFromJSON
} from '@/lib/json-utils'
```

### Main Parsing Functions

#### `parseJSONResponse<T>(content: string): T`
The primary JSON parsing function with multiple fallback methods:
1. Extract from markdown code blocks (```json ... ```)
2. Clean markdown and parse directly
3. Extract by finding balanced braces
4. Line-by-line JSON detection

```typescript
try {
  const data = parseJSONResponse<MyDataType>(llmResponse)
  console.log('Parsed successfully:', data)
} catch (error) {
  console.error('All parsing methods failed:', error)
}
```

#### `safeParseJSON<T>(content: string): JSONParseResult<T>`
Non-throwing version that returns a result object:

```typescript
const result = safeParseJSON<MyDataType>(llmResponse)
if (result.success) {
  console.log('Data:', result.data)
} else {
  console.error('Parse error:', result.error)
}
```

#### `legacyParseJSON<T>(content: string): T`
Backward-compatible parsing that matches the exact logic previously used in API routes:

```typescript
// For maintaining compatibility with existing API routes
const data = legacyParseJSON(responseText)
```

### Utility Functions

#### `isContentIncomplete(content: string): boolean`
Checks if JSON content appears incomplete (useful for continuation logic):

```typescript
if (isContentIncomplete(response)) {
  // Request continuation from LLM
}
```

#### `extractJSONFromMarkdown(content: string): string | null`
Specifically extracts JSON from markdown code blocks:

```typescript
const jsonString = extractJSONFromMarkdown(response)
if (jsonString) {
  const data = JSON.parse(jsonString)
}
```

### Migration from Duplicated Logic

**Before (duplicated in multiple files):**
```typescript
// This was repeated in 6+ files
try {
  const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonMatch && jsonMatch[1]) {
    data = JSON.parse(jsonMatch[1].trim())
  } else {
    const firstBrace = responseText.indexOf('{')
    const lastBrace = responseText.lastIndexOf('}')
    // ... more complex logic
  }
} catch (error) {
  // ... error handling
}
```

**After (centralized):**
```typescript
import { parseJSONResponse } from '@/lib/json-utils'

try {
  const data = parseJSONResponse(responseText)
} catch (error) {
  console.error('JSON parsing failed:', error)
}
```

### Files Updated

The following files were updated to use centralized JSON utilities:
- `src/lib/openai-utils.ts` - Uses `parseJSONResponse`
- `src/lib/anthropic-utils.ts` - Uses `parseJSONResponse`
- `src/app/api/analyze-resume/route.ts` - Uses `parseJSONResponse`
- `src/app/api/extract-pdf-ai/route.ts` - Uses `legacyParseJSON`
- `src/app/api/extract-resume-data/route.ts` - **Updated to use `callAnthropicResumeOptimization` with function calling**
- `src/app/api/extract-resume/route.ts` - **Updated to use `callAnthropicResumeOptimization` with function calling**

**Migration to Function Calling Complete**: The `extract-resume-data` and `extract-resume` routes now use the centralized Anthropic utility with function calling instead of direct API calls and legacy JSON parsing. This provides:
- **Schema validation** at the API level
- **Reliable structured output** without JSON parsing errors
- **Consistent error handling** through centralized utilities
- **Better performance** with optimized token usage

This eliminates over 200 lines of duplicated JSON parsing logic across the codebase and provides much more reliable structured outputs from LLMs.

## OpenAI Utility (`src/lib/openai-utils.ts`)

### Constants

```typescript
import { 
  OPENAI_MODELS, 
  CONTEXT_SIZES, 
  TEMPERATURES 
} from '@/lib/openai-utils'

// Models
OPENAI_MODELS.NANO     // 'gpt-4.1-nano'
OPENAI_MODELS.MINI     // 'gpt-4.1-mini'
OPENAI_MODELS.NORMAL   // 'gpt-4.1'
OPENAI_MODELS.LARGE    // 'o4-mini-high'

// Context Sizes
CONTEXT_SIZES.MINI     // 1000
CONTEXT_SIZES.NORMAL   // 4000
CONTEXT_SIZES.LARGE    // 8000
CONTEXT_SIZES.XLARGE   // 40000

// Temperatures
TEMPERATURES.DETERMINISTIC  // 0
TEMPERATURES.LOW           // 0.1
TEMPERATURES.NORMAL        // 0.3
TEMPERATURES.HIGH          // 0.7
TEMPERATURES.CREATIVE      // 1.0
```

### Basic Usage

```typescript
import { callOpenAI, callOpenAIJSON, callOpenAIText } from '@/lib/openai-utils'

// Text generation
const textResponse = await callOpenAIText("Write a summary", {
  model: OPENAI_MODELS.MINI,
  maxTokens: CONTEXT_SIZES.NORMAL,
  temperature: TEMPERATURES.NORMAL
})

// JSON format enforcement (legacy)
const jsonResponse = await callOpenAIJSON("Return user data as JSON", {
  model: OPENAI_MODELS.MINI,
  maxTokens: CONTEXT_SIZES.NORMAL
})

// Function calling (recommended for structured output)
const functionResponse = await callOpenAI("Optimize this resume", {
  model: OPENAI_MODELS.MINI,
  tools: [/* function definition */],
  toolChoice: { type: 'function', function: { name: 'optimize_resume' } }
})
```

### Specialized Helper Functions

```typescript
import { 
  callOpenAIResumeOptimization,
  callOpenAIJobSummary,
  callOpenAIPDFExtraction 
} from '@/lib/openai-utils'

// Resume optimization with structured schema
const resumeResponse = await callOpenAIResumeOptimization(prompt, {
  model: OPENAI_MODELS.MINI,
  maxTokens: CONTEXT_SIZES.XLARGE,
  temperature: TEMPERATURES.NORMAL
})

// Job description summarization
const jobResponse = await callOpenAIJobSummary(prompt, {
  model: OPENAI_MODELS.MINI,
  maxTokens: CONTEXT_SIZES.MINI,
  temperature: TEMPERATURES.NORMAL
})

// PDF content extraction
const pdfResponse = await callOpenAIPDFExtraction(prompt, {
  model: OPENAI_MODELS.MINI,
  maxTokens: CONTEXT_SIZES.NORMAL,
  temperature: TEMPERATURES.LOW
})
```

## Anthropic Utility (`src/lib/anthropic-utils.ts`)

### Constants

```typescript
import { 
  ANTHROPIC_MODELS, 
  ANTHROPIC_CONTEXT_SIZES, 
  ANTHROPIC_TEMPERATURES 
} from '@/lib/anthropic-utils'

// Models
ANTHROPIC_MODELS.HAIKU      // 'claude-3-haiku-20240307'
ANTHROPIC_MODELS.OPUS       // 'claude-4-opus-20240229'
ANTHROPIC_MODELS.SONNET   // 'claude-sonnet-4-20250514'

// Context Sizes
ANTHROPIC_CONTEXT_SIZES.MINI     // 1000
ANTHROPIC_CONTEXT_SIZES.NORMAL   // 4000
ANTHROPIC_CONTEXT_SIZES.LARGE    // 8000
ANTHROPIC_CONTEXT_SIZES.XLARGE   // 40000
ANTHROPIC_CONTEXT_SIZES.MAX      // 200000

// Temperatures (same as OpenAI)
ANTHROPIC_TEMPERATURES.DETERMINISTIC  // 0
ANTHROPIC_TEMPERATURES.LOW            // 0.1
ANTHROPIC_TEMPERATURES.NORMAL         // 0.3
ANTHROPIC_TEMPERATURES.HIGH           // 0.7
ANTHROPIC_TEMPERATURES.CREATIVE       // 1.0
```

### Basic Usage

```typescript
import { callAnthropic, callAnthropicText } from '@/lib/anthropic-utils'

// Text generation
const textResponse = await callAnthropicText("Write a summary", {
  model: ANTHROPIC_MODELS.SONNET,
  maxTokens: ANTHROPIC_CONTEXT_SIZES.NORMAL,
  temperature: ANTHROPIC_TEMPERATURES.NORMAL,
  systemPrompt: "You are a helpful assistant"
})

// Tool calling (recommended for structured output)
const toolResponse = await callAnthropic("Analyze this data", {
  model: ANTHROPIC_MODELS.SONNET_4,
  tools: [/* tool definition */],
  toolChoice: { type: 'tool', name: 'analyze_data' }
})
```

### Specialized Helper Functions

```typescript
import { 
  callAnthropicResumeOptimization,
  callAnthropicJobSummary,
  callAnthropicPDFExtraction 
} from '@/lib/anthropic-utils'

// Resume optimization with structured schema
const resumeResponse = await callAnthropicResumeOptimization(prompt, {
  model: ANTHROPIC_MODELS.SONNET_4,
  maxTokens: ANTHROPIC_CONTEXT_SIZES.LARGE,
  temperature: ANTHROPIC_TEMPERATURES.LOW
})

// Job description summarization
const jobResponse = await callAnthropicJobSummary(prompt, {
  model: ANTHROPIC_MODELS.SONNET,
  maxTokens: ANTHROPIC_CONTEXT_SIZES.NORMAL,
  temperature: ANTHROPIC_TEMPERATURES.NORMAL
})

// PDF content extraction
const pdfResponse = await callAnthropicPDFExtraction(prompt, {
  model: ANTHROPIC_MODELS.SONNET_4,
  maxTokens: ANTHROPIC_CONTEXT_SIZES.LARGE,
  temperature: ANTHROPIC_TEMPERATURES.LOW
})
```

## Function Calling vs Tools

### OpenAI Function Calling

```typescript
const tools = [{
  type: 'function',
  function: {
    name: 'extract_data',
    description: 'Extracts structured data',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' }
      },
      required: ['name']
    }
  }
}]

const response = await callOpenAI(prompt, {
  tools,
  toolChoice: { type: 'function', function: { name: 'extract_data' } }
})
```

### Anthropic Tools

```typescript
const tools = [{
  name: 'extract_data',
  description: 'Extracts structured data',
  input_schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' }
    },
    required: ['name']
  }
}]

const response = await callAnthropic(prompt, {
  tools,
  toolChoice: { type: 'tool', name: 'extract_data' }
})
```

## Response Format

Both utilities return a consistent response format:

```typescript
interface Response<T> {
  data: T                    // Parsed response data
  usage: {
    inputTokens: number      // Input tokens used
    outputTokens: number     // Output tokens used  
    totalTokens: number      // Total tokens used
  }
  cost: number              // Estimated cost in USD
  processingTime: number    // Processing time in ms
  stopReason: string        // Why the response ended
  usedTools?: boolean       // Whether tools were used (Anthropic)
  usedContinuation?: boolean // Whether continuation was used (OpenAI)
}
```

## Error Handling

Both utilities provide comprehensive error handling:

```typescript
try {
  const response = await callOpenAI(prompt, options)
  console.log('Success:', response.data)
} catch (error) {
  if (error.message.includes('timeout')) {
    console.error('Request timed out')
  } else if (error.message.includes('rate limit')) {
    console.error('Rate limit exceeded')
  } else {
    console.error('API error:', error.message)
  }
}
```

## Cost Optimization

### Model Selection Guidelines

**OpenAI:**
- `NANO`: Fastest, cheapest for simple tasks
- `MINI`: Good balance for most tasks
- `NORMAL`: Better quality for complex tasks
- `LARGE`: Highest quality for critical tasks

**Anthropic:**
- `HAIKU`: Fastest, cheapest for simple tasks
- `SONNET`: Good balance for most tasks
- `SONNET_4`: Latest model with best capabilities
- `OPUS`: Highest quality for critical tasks

### Token Management

```typescript
// Use appropriate context sizes
const options = {
  maxTokens: CONTEXT_SIZES.MINI,     // For short responses
  maxTokens: CONTEXT_SIZES.NORMAL,   // For medium responses
  maxTokens: CONTEXT_SIZES.LARGE,    // For long responses
  maxTokens: CONTEXT_SIZES.XLARGE,   // For very long responses
}
```

## Best Practices

1. **Use Function Calling/Tools** for structured output instead of JSON prompting
2. **Choose the right model** based on task complexity and cost requirements
3. **Set appropriate timeouts** for long-running operations
4. **Handle errors gracefully** with proper fallbacks
5. **Monitor costs** using the built-in cost calculation
6. **Use system prompts** to provide consistent context
7. **Cache results** when possible to reduce API calls

## Migration from Legacy JSON Prompting

### Before (JSON prompting)
```typescript
const response = await callOpenAIJSON(`
  Return user data as JSON:
  {
    "name": "string",
    "email": "string"
  }
`, options)
```

### After (Function calling)
```typescript
const response = await callOpenAI(prompt, {
  ...options,
  tools: [userDataTool],
  toolChoice: { type: 'function', function: { name: 'extract_user_data' } }
})
```

This approach is much more reliable and eliminates JSON parsing errors. 