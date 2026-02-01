import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Pass all requests to Next.js; no static HTML overrides
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  // Disabled: match nothing so middleware does not run (test if middleware was causing blank page)
  matcher: ['/__middleware_test_nomatch__'],
}
