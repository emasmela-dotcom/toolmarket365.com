import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Fallback: serve full HTML homepage when RSC fails (blank-page workaround)
const HOME_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>CreatorFlow365 — The Micro-SaaS Marketplace for Content Creators</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,-apple-system,sans-serif;background:#fafafa;color:#171717;line-height:1.5;min-height:100vh;display:flex;flex-direction:column}
    .nav{border-bottom:1px solid #e5e5e5;background:rgba(250,250,250,.95);padding:.5rem 1rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem}
    .nav a{color:#525252;text-decoration:none;font-size:.875rem;font-weight:500}
    .nav a:hover{color:#2563eb}
    .logo{font-size:1.25rem;font-weight:700;color:#0a0a0a}
    .logo span{color:#2563eb}
    .links{display:flex;gap:1rem;flex-wrap:wrap}
    .main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;text-align:center}
    .main h1{font-size:2.25rem;font-weight:700;margin-bottom:.5rem}
    .main h1 span{color:#2563eb}
    .main p{color:#525252;margin-bottom:1.5rem;max-width:32rem}
    .btn{display:inline-block;padding:.75rem 1.5rem;background:#2563eb;color:#fff;font-weight:500;text-decoration:none;border-radius:.5rem}
    .btn:hover{background:#1d4ed8}
    .footer{border-top:1px solid #e5e5e5;background:#f5f5f5;padding:2rem 1rem;text-align:center;font-size:.875rem;color:#525252}
    .footer a{color:#2563eb;text-decoration:none}
  </style>
</head>
<body>
  <nav class="nav">
    <a href="/" class="logo">CreatorFlow<span>365</span></a>
    <div class="links">
      <a href="/">Home</a>
      <a href="/tools">Tools</a>
      <a href="/pricing">Pricing</a>
      <a href="/login">Sign In</a>
      <a href="/signup">Sign Up</a>
    </div>
  </nav>
  <main class="main">
    <h1>CreatorFlow<span>365</span></h1>
    <p>The Micro-SaaS Marketplace for Content Creators</p>
    <a href="/tools" class="btn">Browse Tools</a>
  </main>
  <footer class="footer">
    <a href="/">CreatorFlow365</a> · <a href="/tools">Tools</a> · <a href="/pricing">Pricing</a> · <a href="/contact">Contact</a>
  </footer>
</body>
</html>`

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
