/**
 * Client-side subscription debugging utilities
 * 
 * Usage in browser console:
 * import { debugSubscription } from '/src/utils/subscription-debug'
 * debugSubscription.checkStatus()
 * debugSubscription.clearCache()
 * debugSubscription.forceRefresh()
 */

export const debugSubscription = {
  /**
   * Check current subscription status from cache and API
   */
  async checkStatus() {
    console.log('🔍 Checking subscription status...')
    
    // Check cached data
    const cachedData = sessionStorage.getItem('subscription-data')
    const cachedTimestamp = sessionStorage.getItem('subscription-timestamp')
    
    console.log('📦 Cached Data:')
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData)
        const age = cachedTimestamp ? Date.now() - parseInt(cachedTimestamp) : 'unknown'
        console.log('  Data:', parsed)
        console.log('  Age:', typeof age === 'number' ? `${Math.round(age / 1000)}s` : age)
      } catch (e) {
        console.log('  Invalid cached data:', cachedData)
      }
    } else {
      console.log('  No cached data found')
    }
    
    // Check API data
    console.log('\n🌐 API Data:')
    try {
      const response = await fetch('/api/user/subscription', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('  Status:', response.status)
        console.log('  Data:', data)
        console.log('  Headers:', Object.fromEntries(response.headers.entries()))
      } else {
        console.log('  Error:', response.status, response.statusText)
        const errorData = await response.text()
        console.log('  Error details:', errorData)
      }
    } catch (error) {
      console.log('  Network error:', error)
    }
  },

  /**
   * Clear all subscription-related cache
   */
  clearCache() {
    console.log('🧹 Clearing subscription cache...')
    
    // Clear sessionStorage
    sessionStorage.removeItem('subscription-data')
    sessionStorage.removeItem('subscription-timestamp')
    
    // Clear any other related storage
    const keysToRemove = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.includes('subscription')) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => {
      sessionStorage.removeItem(key)
      console.log(`  Removed: ${key}`)
    })
    
    // Trigger custom event for subscription update
    window.dispatchEvent(new CustomEvent('subscription-updated'))
    
    console.log('✅ Cache cleared successfully')
  },

  /**
   * Force refresh subscription data
   */
  async forceRefresh() {
    console.log('🔄 Force refreshing subscription data...')
    
    this.clearCache()
    
    // Wait a moment for cache to clear
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Fetch fresh data
    await this.checkStatus()
    
    console.log('✅ Force refresh completed')
  },

  /**
   * Test subscription API with different cache headers
   */
  async testAPI() {
    console.log('🧪 Testing subscription API...')
    
    const tests: Array<{ name: string; headers: Record<string, string>; url?: string }> = [
      { name: 'Normal request', headers: {} },
      { name: 'No-cache request', headers: { 'Cache-Control': 'no-cache' } },
      { name: 'No-store request', headers: { 'Cache-Control': 'no-store' } },
      { name: 'Timestamp request', headers: {}, url: `/api/user/subscription?t=${Date.now()}` }
    ]
    
    for (const test of tests) {
      console.log(`\n📋 ${test.name}:`)
      try {
        const url = test.url || '/api/user/subscription'
        const response = await fetch(url, { headers: test.headers })
        
        console.log(`  Status: ${response.status}`)
        console.log(`  Cache headers:`, {
          'cache-control': response.headers.get('cache-control'),
          'pragma': response.headers.get('pragma'),
          'expires': response.headers.get('expires'),
          'x-subscription-timestamp': response.headers.get('x-subscription-timestamp')
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log(`  Tier: ${data.tier}`)
          console.log(`  Monthly roasts: ${data.monthlyRoasts}`)
        } else {
          console.log(`  Error: ${await response.text()}`)
        }
      } catch (error) {
        console.log(`  Network error:`, error)
      }
    }
  },

  /**
   * Check browser and environment information
   */
  checkEnvironment() {
    console.log('🌍 Environment Information:')
    console.log('  User Agent:', navigator.userAgent)
    console.log('  URL:', window.location.href)
    console.log('  Cookies enabled:', navigator.cookieEnabled)
    console.log('  Online:', navigator.onLine)
    console.log('  Storage available:', {
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof Storage !== 'undefined'
    })
    
    // Check for service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('  Service Workers:', registrations.length > 0 ? registrations : 'None')
      })
    }
    
    // Check session storage size
    let sessionStorageSize = 0
    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        sessionStorageSize += sessionStorage[key].length + key.length
      }
    }
    console.log('  Session storage size:', `${sessionStorageSize} characters`)
  },

  /**
   * Monitor subscription changes
   */
  startMonitoring() {
    console.log('👀 Starting subscription monitoring...')
    
    // Monitor storage events
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.includes('subscription')) {
        console.log('📦 Storage change detected:', {
          key: e.key,
          oldValue: e.oldValue,
          newValue: e.newValue,
          timestamp: new Date().toISOString()
        })
      }
    })
    
    // Monitor custom events
    window.addEventListener('subscription-updated', () => {
      console.log('🔔 Subscription update event detected:', new Date().toISOString())
    })
    
    // Monitor fetch requests to subscription API
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const [url] = args
      if (typeof url === 'string' && url.includes('/api/user/subscription')) {
        console.log('🌐 Subscription API request:', {
          url,
          timestamp: new Date().toISOString()
        })
      }
      return originalFetch.apply(window, args)
    }
    
    console.log('✅ Monitoring started')
  },

  /**
   * Run all diagnostic checks
   */
  async runDiagnostics() {
    console.log('🏥 Running full subscription diagnostics...\n')
    
    this.checkEnvironment()
    console.log('\n' + '='.repeat(50) + '\n')
    
    await this.checkStatus()
    console.log('\n' + '='.repeat(50) + '\n')
    
    await this.testAPI()
    console.log('\n' + '='.repeat(50) + '\n')
    
    console.log('✅ Diagnostics completed')
  }
}

// Make it available globally for easy access in console
if (typeof window !== 'undefined') {
  (window as any).debugSubscription = debugSubscription
}

export default debugSubscription 