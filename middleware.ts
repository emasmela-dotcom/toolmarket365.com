import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Protect tool routes - require authentication
  if (pathname.startsWith('/tools/') && pathname !== '/tools') {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
    
    if (!sessionToken) {
      // Redirect to account page with return URL
      const redirectUrl = new URL('/account', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  // Protect dashboard and content library
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/content-library')) {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
    
    if (!sessionToken) {
      const redirectUrl = new URL('/account', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/tools/:path*',
    '/dashboard/:path*',
    '/content-library/:path*'
  ]
}
