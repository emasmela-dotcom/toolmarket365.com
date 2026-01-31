import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Temporarily disabled: full middleware (rate limiting) moved to middleware.full.ts
// Re-enable after blank-page fix is confirmed
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [] as string[], // no routes — middleware never runs
}
