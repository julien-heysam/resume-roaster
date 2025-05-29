/**
 * Centralized JSON parsing utilities for LLM responses
 * Handles various formats and provides fallback methods
 */

export interface JSONParseResult<T = any> {
  success: boolean
  data?: T
  error?: string
  method?: string
}

/**
 * Parse JSON response with multiple fallback methods
 * This handles various formats that LLMs might return JSON in
 */
export function parseJSONResponse<T = any>(content: string): T {
  console.log('🔍 Attempting to parse JSON content...')
  console.log('Content preview:', content.substring(0, 200) + '...')
  console.log('Content length:', content.length)
  
  // Method 1: Extract text between ```json ... ``` (most reliable for markdown)
  try {
    console.log('Trying Method 1: JSON code block extraction...')
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (jsonMatch && jsonMatch[1]) {
      const extractedJson = jsonMatch[1].trim()
      console.log('Extracted JSON preview:', extractedJson.substring(0, 200) + '...')
      return JSON.parse(extractedJson)
    }
    throw new Error('No JSON code block found')
  } catch (extractError: any) {
    console.log('Method 1 failed:', extractError.message)
  }

  // Method 2: Try parsing as direct JSON (after cleaning markdown)
  try {
    console.log('Trying Method 2: Direct JSON parsing after cleaning...')
    let cleanContent = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()
    
    console.log('Cleaned content preview:', cleanContent.substring(0, 200) + '...')
    return JSON.parse(cleanContent)
  } catch (parseError: any) {
    console.log('Method 2 failed:', parseError.message)
  }

  // Method 3: Find first { and last } and extract JSON
  try {
    console.log('Trying Method 3: Brace extraction...')
    const firstBrace = content.indexOf('{')
    const lastBrace = content.lastIndexOf('}')
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonText = content.substring(firstBrace, lastBrace + 1)
      console.log('Extracted JSON by braces preview:', jsonText.substring(0, 200) + '...')
      return JSON.parse(jsonText)
    }
    throw new Error('No valid JSON braces found')
  } catch (braceError: any) {
    console.log('Method 3 failed:', braceError.message)
  }

  // Method 4: Try to find JSON after any text (line-by-line)
  try {
    console.log('Trying Method 4: JSON after text...')
    const lines = content.split('\n')
    let jsonStart = -1
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('{')) {
        jsonStart = i
        break
      }
    }
    
    if (jsonStart !== -1) {
      const jsonLines = lines.slice(jsonStart)
      const jsonText = jsonLines.join('\n').trim()
      console.log('Found JSON starting at line', jsonStart)
      
      // Try to find a complete JSON object
      let braceCount = 0
      let endIndex = -1
      
      for (let i = 0; i < jsonText.length; i++) {
        if (jsonText[i] === '{') braceCount++
        if (jsonText[i] === '}') braceCount--
        if (braceCount === 0 && jsonText[i] === '}') {
          endIndex = i + 1
          break
        }
      }
      
      if (endIndex > 0) {
        const completeJson = jsonText.substring(0, endIndex)
        console.log('Found complete JSON object, length:', completeJson.length)
        return JSON.parse(completeJson)
      }
      
      return JSON.parse(jsonText)
    }
    throw new Error('No JSON found after text')
  } catch (lineError: any) {
    console.log('Method 4 failed:', lineError.message)
  }

  throw new Error('All JSON parsing methods failed')
}

/**
 * Safe JSON parsing that returns a result object instead of throwing
 */
export function safeParseJSON<T = any>(content: string): JSONParseResult<T> {
  try {
    const data = parseJSONResponse<T>(content)
    return {
      success: true,
      data,
      method: 'parseJSONResponse'
    }
  } catch (error: any) {
    console.error('JSON parsing failed:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Check if content appears incomplete (for continuation logic)
 */
export function isContentIncomplete(content: string): boolean {
  const trimmed = content.trim()
  
  // Check for common signs of incomplete JSON
  if (trimmed.endsWith(',') || trimmed.endsWith(':')) {
    return true
  }
  
  // Check brace/bracket balance
  const openBraces = (content.match(/{/g) || []).length
  const closeBraces = (content.match(/}/g) || []).length
  const openBrackets = (content.match(/\[/g) || []).length
  const closeBrackets = (content.match(/\]/g) || []).length
  
  if (openBraces > closeBraces || openBrackets > closeBrackets) {
    console.log('⚠️ Content appears incomplete - unmatched braces/brackets')
    return true
  }
  
  return false
}

/**
 * Extract JSON from markdown code blocks specifically
 */
export function extractJSONFromMarkdown(content: string): string | null {
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1].trim()
  }
  return null
}

/**
 * Extract JSON by finding balanced braces
 */
export function extractJSONByBraces(content: string): string | null {
  const firstBrace = content.indexOf('{')
  const lastBrace = content.lastIndexOf('}')
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return content.substring(firstBrace, lastBrace + 1)
  }
  
  return null
}

/**
 * Clean content by removing markdown formatting
 */
export function cleanMarkdownFromJSON(content: string): string {
  return content
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()
}

/**
 * Legacy parsing method for backward compatibility
 * This matches the exact logic used in the API routes
 */
export function legacyParseJSON<T = any>(content: string): T {
  // Method 1: Extract text between ```json ... ```
  try {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1].trim())
    }
    throw new Error('No JSON code block found')
  } catch (extractError) {
    // Method 2: Find first { and last } and extract JSON
    try {
      const firstBrace = content.indexOf('{')
      const lastBrace = content.lastIndexOf('}')
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonText = content.substring(firstBrace, lastBrace + 1)
        return JSON.parse(jsonText)
      }
      throw new Error('No valid JSON braces found')
    } catch (braceError) {
      // Method 3: Fallback to treating entire content as JSON
      return JSON.parse(content.trim())
    }
  }
} 