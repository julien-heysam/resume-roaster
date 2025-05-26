import { NextRequest, NextResponse } from 'next/server'
import { JSDOM } from 'jsdom'

// Function to sleep for a given number of milliseconds
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Generic function to extract job description using web search as fallback
async function extractViaWebSearch(url: string): Promise<string | null> {
  try {
    console.log(`Attempting web search fallback for: ${url}`)
    
    // Create a generic search query from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    const lastPart = pathParts[pathParts.length - 1] || ''
    
    // Extract meaningful terms from URL path and clean them
    const searchTerms = lastPart
      .replace(/[^a-zA-Z0-9\-\s]/g, '') // Remove special chars except hyphens
      .split('-')
      .filter(part => part.length > 2 && !/^\d+$/.test(part)) // Remove short parts and pure numbers
      .slice(0, 6) // Take first 6 meaningful parts
      .join(' ')
    
    const searchQuery = searchTerms.length > 0 
      ? `"${searchTerms}" job description site:${urlObj.hostname}`
      : `job description site:${urlObj.hostname}`
    
    console.log(`Web search query: ${searchQuery}`)
    
    // Use Brave Search API
    const searchResponse = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(searchQuery)}`, {
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY || ''
      }
    })
    
    if (!searchResponse.ok) {
      console.log('Web search API request failed:', searchResponse.status)
      return null
    }
    
    const searchData = await searchResponse.json()
    
    // Look for results from the same domain first
    const targetResults = searchData.web?.results?.filter((result: any) => 
      result.url && result.url.includes(urlObj.hostname) && result.description
    ) || []
    
    if (targetResults.length > 0) {
      // Combine descriptions from same-domain results
      const descriptions = targetResults
        .map((result: any) => result.description)
        .filter(Boolean)
        .join(' ')
      
      if (descriptions.length > 100) {
        console.log('Found job description from same-domain search results')
        return descriptions
      }
    }
    
    // Fallback: look for any results with job-related keywords
    const jobKeywords = ['job', 'position', 'role', 'responsibilities', 'requirements', 'qualifications', 'career']
    const jobResults = searchData.web?.results?.filter((result: any) => 
      result.description && jobKeywords.some(keyword => 
        result.description.toLowerCase().includes(keyword)
      )
    ) || []
    
    if (jobResults.length > 0) {
      const descriptions = jobResults
        .slice(0, 3) // Take top 3 job-related results
        .map((result: any) => result.description)
        .filter(Boolean)
        .join(' ')
      
      if (descriptions.length > 100) {
        console.log('Found job description from job-related search results')
        return descriptions
      }
    }
    
    return null
  } catch (error) {
    console.error('Web search fallback failed:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    console.log(`Extracting job description from: ${url}`)

    // Enhanced headers to mimic a real browser more convincingly
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0'
    }

    // Add generic referer
    const urlObj = new URL(url)
    headers['Referer'] = `https://${urlObj.hostname}/`

    // Fetch the webpage with retry logic
    let response: Response | null = null
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Fetch attempt ${attempt} for: ${url}`)
        
        // Add a small random delay to avoid thundering herd
        if (attempt > 1) {
          const delay = Math.pow(2, attempt - 1) * 1000 + Math.random() * 1000 // Exponential backoff with jitter
          console.log(`Waiting ${delay}ms before retry...`)
          await sleep(delay)
        }
        
        response = await fetch(url, {
          headers,
          signal: AbortSignal.timeout(10000) // 10 second timeout
        })
        
        // If we get a rate limit, retry with backoff
        if (response.status === 429 && attempt < 3) {
          console.log(`Rate limited (429), retrying attempt ${attempt + 1}`)
          continue
        }
        
        // If we get any other error, break out of retry loop
        break
        
      } catch (error) {
        lastError = error as Error
        console.log(`Fetch attempt ${attempt} failed:`, error)
        
        if (attempt === 3) {
          throw lastError
        }
      }
    }

    // Check if we have a valid response
    if (!response) {
      return NextResponse.json(
        { error: 'Failed to fetch URL after multiple attempts. Please try again later.' },
        { status: 500 }
      )
    }

    if (!response.ok) {
      // Enhanced error handling for different HTTP status codes
      if (response.status === 403) {
        console.log('Direct scraping blocked (403), attempting web search fallback...')
        
        // Try web search fallback for any blocked site
        const webSearchResult = await extractViaWebSearch(url)
        if (webSearchResult) {
          console.log(`Successfully extracted ${webSearchResult.length} characters via web search`)
          
          // Clean up the web search result
          let cleanedText = webSearchResult
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n')
            .trim()
          
          // Limit text length
          if (cleanedText.length > 5000) {
            cleanedText = cleanedText.substring(0, 5000) + '...'
          }
          
          return NextResponse.json({
            success: true,
            text: cleanedText,
            url,
            source: 'web_search_fallback'
          })
        }
        
        // If web search also fails, return error
        return NextResponse.json(
          { 
            error: 'Access forbidden - This website blocks automated requests. Web search fallback also failed to find content.',
            status: response.status,
            suggestion: 'Try copying and pasting the job description manually.'
          },
          { status: 400 }
        )
      } else if (response.status === 429) {
        return NextResponse.json(
          { 
            error: 'Rate limited - Too many requests. Please wait a moment and try again.',
            status: response.status
          },
          { status: 429 }
        )
      } else if (response.status === 404) {
        return NextResponse.json(
          { 
            error: 'Job posting not found - The URL may be expired or incorrect.',
            status: response.status
          },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
          { status: 400 }
        )
      }
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style, nav, header, footer')
    scripts.forEach((el: Element) => el.remove())

    // Try to find job description content using common selectors
    const selectors = [
      '[class*="job-description"]',
      '[class*="job-details"]',
      '[class*="description"]',
      '[id*="job-description"]',
      '[id*="description"]',
      'main',
      '[role="main"]',
      '.content',
      '#content'
    ]

    let extractedText = ''
    
    for (const selector of selectors) {
      const element = document.querySelector(selector)
      if (element) {
        extractedText = element.textContent || ''
        if (extractedText.length > 200) { // Only use if substantial content
          break
        }
      }
    }

    // Fallback to body content if no specific selectors worked
    if (!extractedText || extractedText.length < 200) {
      extractedText = document.body.textContent || ''
    }

    // Clean up the text
    extractedText = extractedText
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .trim()

    if (!extractedText || extractedText.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract meaningful content from the URL' },
        { status: 400 }
      )
    }

    // Limit text length to prevent overwhelming the UI
    if (extractedText.length > 5000) {
      extractedText = extractedText.substring(0, 5000) + '...'
    }

    console.log(`Successfully extracted ${extractedText.length} characters`)

    return NextResponse.json({
      success: true,
      text: extractedText,
      url
    })

  } catch (error) {
    console.error('Error extracting job description:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Failed to fetch the URL. Please check if the URL is accessible.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to extract job description from URL' },
      { status: 500 }
    )
  }
} 