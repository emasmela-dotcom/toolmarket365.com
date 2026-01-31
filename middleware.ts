import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Serve homepage HTML from middleware to bypass RSC (blank-page workaround)
const HOME_HTML =
  '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>CreatorFlow365</title></head><body style="background:#f0f0f0;font-family:system-ui;padding:2rem;text-align:center"><div><h1>CreatorFlow365</h1><p>The Micro-SaaS Marketplace for Content Creators</p><p style="font-size:0.875rem;color:#666">(homepage served by middleware)</p><a href="/tools" style="display:inline-block;margin-top:1rem;padding:0.75rem 1.5rem;background:#2563eb;color:white;text-decoration:none;border-radius:0.5rem">Browse Tools</a></div></body></html>'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (path === '/' || path === '') {
    return new NextResponse(HOME_HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
