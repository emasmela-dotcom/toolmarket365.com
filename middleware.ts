import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Serve homepage HTML from middleware to bypass RSC (blank-page workaround)
const HOME_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>CreatorFlow365</title></head><body><div><h1>CreatorFlow365</h1><p>The Micro-SaaS Marketplace for Content Creators</p><a href="/tools">Browse Tools</a></div></body></html>`

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return new NextResponse(HOME_HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
