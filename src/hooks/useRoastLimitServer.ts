"use client"

import { useState, useEffect, useCallback } from 'react'

interface RoastLimitData {
  count: number
  maxRoasts: number
  canRoast: boolean
  remainingRoasts: number
}

export function useRoastLimitServer() {
  const [data, setData] = useState<RoastLimitData>({
    count: 0,
    maxRoasts: 3,
    canRoast: true,
    remainingRoasts: 3
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLimitData = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch('/api/roast-limit')
      
      if (!response.ok) {
        throw new Error('Failed to fetch roast limit data')
      }
      
      const limitData = await response.json()
      setData(limitData)
    } catch (err) {
      console.error('Error fetching roast limit:', err)
      setError('Failed to check roast limit')
      // Fallback to optimistic defaults
      setData({
        count: 0,
        maxRoasts: 3,
        canRoast: true,
        remainingRoasts: 3
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLimitData()
  }, [fetchLimitData])

  const incrementRoastCount = async (): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch('/api/roast-limit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit exceeded
          setData(prev => ({ ...prev, canRoast: false }))
          setError('You have reached your free roast limit. Please upgrade to continue!')
          return false
        }
        throw new Error(result.error || 'Failed to increment roast count')
      }
      
      setData(result)
      return true
    } catch (err) {
      console.error('Error incrementing roast count:', err)
      setError('Failed to process roast request')
      return false
    }
  }

  const resetCount = async () => {
    // This would typically require admin privileges or a special endpoint
    await fetchLimitData()
  }

  return {
    roastCount: data.count,
    canRoast: data.canRoast,
    isLoading,
    error,
    remainingRoasts: data.remainingRoasts,
    maxRoasts: data.maxRoasts,
    incrementRoastCount,
    resetCount,
    refetch: fetchLimitData
  }
} 