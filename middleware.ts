import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME } from '@/lib/auth'

// Simple in-memory rate limiter
// For production with 200+ users, consider upgrading to Redis (Upstash)
const rateLimitMap = new Map<string, number[]>()

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const path = request.nextUrl.pathname
  return `${ip}:${path}`
}

function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const requests = rateLimitMap.get(key) || []
  
  // Remove old requests outside the window
  const recentRequests = requests.filter((time: number) => now - time < windowMs)
  
  if (recentRequests.length >= maxRequests) {
    return false // Rate limit exceeded
  }
  
  // Add current request
  recentRequests.push(now)
  rateLimitMap.set(key, recentRequests)
  
  // Clean up old entries periodically (prevent memory leak)
  if (Math.random() < 0.01) { // 1% chance to clean up
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.length === 0 || v.every((time: number) => now - time > windowMs * 2)) {
        rateLimitMap.delete(k)
      }
    }
  }
  
  return true // Within rate limit
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Rate limit API routes to prevent abuse
  if (path.startsWith('/api/')) {
    const key = getRateLimitKey(request)
    
    // Different limits for different endpoint types
    let maxRequests = 60 // Default: 60 requests per minute
    let windowMs = 60000 // 1 minute
    
    // Stricter limits for auth endpoints (prevent brute force)
    if (path.startsWith('/api/auth/')) {
      maxRequests = 10 // 10 login attempts per minute
      windowMs = 60000
    }
    
    // Stricter limits for upload endpoints (prevent abuse)
    if (path.startsWith('/api/upload')) {
      maxRequests = 20 // 20 uploads per minute
      windowMs = 60000
    }
    
    // Check rate limit
    if (!checkRateLimit(key, maxRequests, windowMs)) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          message: `Rate limit exceeded. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '60'
          }
        }
      )
    }
  }
  
  // Allow all routes - no authentication required
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/tools/:path*',
    '/dashboard/:path*',
    '/content-library/:path*'
  ]
}
