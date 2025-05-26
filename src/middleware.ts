import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle API routes with potential timeout issues
  if (pathname.startsWith('/api/')) {
    // Add timeout headers for long-running AI operations
    const aiRoutes = [
      '/api/analyze-resume',
      '/api/extract-pdf-ai',
      '/api/extract-job-description',
      '/api/generate-optimized-resume'
    ]

    if (aiRoutes.some(route => pathname.startsWith(route))) {
      // Add headers to help with timeout handling
      const response = NextResponse.next()
      response.headers.set('X-Timeout-Warning', 'This operation may take up to 60 seconds')
      response.headers.set('X-Content-Type-Options', 'nosniff')
      return response
    }

    // Handle authentication for protected API routes
    const protectedApiRoutes = [
      '/api/user/',
      '/api/share-analysis',
      '/api/download-report',
      '/api/admin/',
      '/api/llm-analytics'
    ]

    if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      })

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
    }
  }

  // Handle protected pages
  const protectedPages = ['/dashboard', '/resume-optimizer']
  
  if (protectedPages.some(page => pathname.startsWith(page))) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/signin'
      url.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 