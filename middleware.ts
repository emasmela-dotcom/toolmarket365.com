import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Pass all requests to Next.js; no static HTML overrides.
// Disable caching for HTML so browser never serves a stale blank page.
export function middleware(request: NextRequest) {
  const res = NextResponse.next()
  res.headers.set('Cache-Control', 'no-store, must-revalidate')
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
