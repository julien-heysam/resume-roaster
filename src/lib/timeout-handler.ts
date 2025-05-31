// Timeout handler utility for long-running API requests

export interface TimeoutConfig {
  timeout?: number // milliseconds
  retries?: number
  retryDelay?: number // milliseconds
}

export class TimeoutError extends Error {
  constructor(message: string, public readonly duration: number) {
    super(message)
    this.name = 'TimeoutError'
  }
}

export class RetryError extends Error {
  constructor(message: string, public readonly attempts: number) {
    super(message)
    this.name = 'RetryError'
    this.attempts = attempts
  }
}

/**
 * Wraps a fetch request with timeout and retry logic
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  config: TimeoutConfig = {}
): Promise<Response> {
  const {
    timeout = 800000, // 800 seconds - maximum allowed on Pro plan
    retries = 1,
    retryDelay = 2000 // 2 seconds
  } = config

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // If response is successful or client error (4xx), don't retry
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response
      }

      // Server error (5xx) - might be worth retrying
      throw new Error(`Server error: ${response.status} ${response.statusText}`)

    } catch (error) {
      lastError = error as Error

      // Handle abort signal (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        lastError = new TimeoutError(
          `Request timed out after ${timeout}ms`,
          timeout
        )
      }

      // If this is the last attempt, throw the error
      if (attempt === retries) {
        if (attempt > 0) {
          throw new RetryError(
            `Failed after ${attempt + 1} attempts: ${lastError.message}`,
            attempt + 1
          )
        }
        throw lastError
      }

      // Wait before retrying (exponential backoff)
      const delay = retryDelay * Math.pow(2, attempt)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('Unknown error occurred')
}

/**
 * Creates a progress tracker for long-running operations
 */
export class ProgressTracker {
  private startTime: number
  private onProgress?: (progress: ProgressUpdate) => void

  constructor(onProgress?: (progress: ProgressUpdate) => void) {
    this.startTime = Date.now()
    this.onProgress = onProgress
  }

  update(stage: string, percentage?: number) {
    const elapsed = Date.now() - this.startTime
    const update: ProgressUpdate = {
      stage,
      percentage,
      elapsed,
      timestamp: new Date()
    }

    this.onProgress?.(update)
  }

  complete(result?: any) {
    const elapsed = Date.now() - this.startTime
    this.onProgress?.({
      stage: 'completed',
      percentage: 100,
      elapsed,
      timestamp: new Date(),
      result
    })
  }

  error(error: Error) {
    const elapsed = Date.now() - this.startTime
    this.onProgress?.({
      stage: 'error',
      percentage: 0,
      elapsed,
      timestamp: new Date(),
      error
    })
  }
}

export interface ProgressUpdate {
  stage: string
  percentage?: number
  elapsed: number
  timestamp: Date
  result?: any
  error?: Error
}

/**
 * Utility for handling AI API requests with progress tracking
 */
export async function handleAIRequest<T>(
  url: string,
  data: any,
  onProgress?: (progress: ProgressUpdate) => void
): Promise<T> {
  const tracker = new ProgressTracker(onProgress)

  try {
    tracker.update('Preparing request...', 10)

    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      {
        timeout: 780000, // 780 seconds (13 minutes) to stay under Vercel's 800s limit with buffer
        retries: 2,
        retryDelay: 3000
      }
    )

    tracker.update('Processing response...', 90)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    tracker.complete(result)
    
    return result

  } catch (error) {
    tracker.error(error as Error)
    throw error
  }
}

/**
 * Format elapsed time for display
 */
export function formatElapsedTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  }
  return `${seconds}s`
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: Error): string {
  if (error instanceof TimeoutError) {
    return `The operation timed out after ${formatElapsedTime(error.duration)}. This usually happens with large files or complex analysis. Please try again with a smaller file or simpler request.`
  }

  if (error instanceof RetryError) {
    return `The operation failed after ${error.attempts} attempts. The server might be overloaded. Please try again in a few minutes.`
  }

  if (error.message.includes('rate limit')) {
    return 'Too many requests. Please wait a moment before trying again.'
  }

  if (error.message.includes('overloaded')) {
    return 'The AI service is currently overloaded. Please try again in a few minutes.'
  }

  if (error.message.includes('quota')) {
    return 'API quota exceeded. Please try again later or contact support.'
  }

  return error.message || 'An unexpected error occurred. Please try again.'
} 