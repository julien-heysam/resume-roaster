import { NextRequest, NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl()
  
  return NextResponse.json({
    baseUrl,
    environment: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'not set',
      VERCEL_URL: process.env.VERCEL_URL || 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    },
    generatedUrls: {
      success: `${baseUrl}/dashboard?success=true&tier=PLUS&session_id={CHECKOUT_SESSION_ID}`,
      cancel: `${baseUrl}/pricing?canceled=true`,
      portal: `${baseUrl}/dashboard`
    }
  })
} 