import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (path === '/' || path === '') {
    const html = '<!DOCTYPE html><html><head><meta charset="utf-8"/><title>CreatorFlow365</title></head><body style="font-family:system-ui;padding:2rem;text-align:center;background:#fafafa"><h1 style="color:#0a0a0a">CreatorFlow<span style="color:#2563eb">365</span></h1><p style="color:#525252;margin:1rem 0">The Micro-SaaS Marketplace for Content Creators</p><a href="/tools" style="display:inline-block;padding:.75rem 1.5rem;background:#2563eb;color:#fff;text-decoration:none;border-radius:.5rem">Browse Tools</a></body></html>'
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
