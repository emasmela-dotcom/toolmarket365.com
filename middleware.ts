import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME } from '@/lib/auth'

export function middleware(request: NextRequest) {
  // Allow all routes - no authentication required
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/tools/:path*',
    '/dashboard/:path*',
    '/content-library/:path*'
  ]
}
