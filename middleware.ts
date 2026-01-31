import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Serve full static homepage for / so site shows content (Next.js root does not complete on Vercel)
const FULL_HOME_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>CreatorFlow365 — The Micro-SaaS Marketplace for Content Creators</title>
<link rel="icon" href="/favicon.svg"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:#fafafa;color:#171717;line-height:1.5}
.nav{position:sticky;top:0;z-index:50;border-bottom:1px solid #e5e5e5;background:rgba(250,250,250,.95);backdrop-filter:blur(8px);padding:.5rem 1rem}
.nav-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem}
.logo{font-size:1.25rem;font-weight:700;color:#0a0a0a;text-decoration:none}
.logo span{color:#2563eb}
.nav-links{display:flex;gap:1rem;flex-wrap:wrap;align-items:center}
.nav-links a{color:#525252;text-decoration:none;font-size:.875rem;font-weight:500}
.nav-links a:hover{color:#1d4ed8}
.btn-pri{display:inline-block;padding:.5rem 1rem;background:#2563eb;color:#fff;font-weight:500;text-decoration:none;border-radius:.5rem;font-size:.875rem}
.btn-pri:hover{background:#1d4ed8}
.hero{background:#fafafa;border-bottom:1px solid #e5e5e5;padding:2rem 1rem 2.5rem;text-align:center}
.hero-inner{max-width:896px;margin:0 auto}
.badge-hero{display:inline-flex;align-items:center;gap:.5rem;background:#eff6ff;padding:.5rem 1rem;border-radius:.5rem;border:1px solid #bfdbfe;margin-bottom:1rem}
.badge-hero strong{color:#2563eb;font-size:1.5rem}
.badge-hero span{color:#404040}
.hero h1{font-size:clamp(2.25rem,5vw,4.5rem);font-weight:700;margin-bottom:.75rem;color:#0a0a0a}
.hero h1 span{color:#2563eb}
.hero p{margin-bottom:.5rem;color:#525252}
.hero .lead{font-size:1.125rem;font-weight:600;color:#2563eb}
.advantages{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;max-width:48rem;margin:2rem auto;padding:1rem;background:#eff6ff;border:2px solid #bfdbfe;border-radius:.5rem;text-align:center}
.advantages .save,.advantages .tools,.advantages .only{font-weight:700;font-size:1.25rem;color:#2563eb}
.advantages small{display:block;font-size:.75rem;font-weight:500;color:#404040}
.hero-btns{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center;margin-top:1.5rem}
.hero-btns a{padding:.625rem 1.5rem;border-radius:.5rem;font-size:.875rem;font-weight:500;text-decoration:none}
.hero-btns .btn-pri{background:#2563eb;color:#fff}
.hero-btns .btn-sec{background:#fff;color:#0a0a0a;border:1px solid #e5e5e5}
.hero-btns .btn-sec:hover{background:#f5f5f5}
.section{padding:3rem 1rem;max-width:1280px;margin:0 auto}
.section h2{font-size:1.875rem;font-weight:700;margin-bottom:1rem;color:#0a0a0a}
.tools-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem}
.tool-card{background:#fff;border:1px solid #e5e5e5;border-radius:.5rem;padding:1.5rem;text-decoration:none;color:inherit;display:block}
.tool-card:hover{border-color:#93c5fd}
.tool-card .badge{font-size:.75rem;padding:.25rem .5rem;background:#dbeafe;color:#1d4ed8;border-radius:.25rem;display:inline-block;margin-bottom:.5rem}
.tool-card h3{font-size:1.25rem;font-weight:600;margin-bottom:.5rem;color:#0a0a0a}
.tool-card p{font-size:.875rem;color:#525252}
.stats{background:#f5f5f5;border-top:1px solid #e5e5e5;padding:2rem 1rem}
.stats-inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;text-align:center}
.stats-inner div{font-size:1.875rem;font-weight:700;color:#0a0a0a}
.stats-inner span{display:block;font-size:.875rem;color:#525252;font-weight:400}
.footer{border-top:1px solid #e5e5e5;background:#f5f5f5;padding:2rem 1rem;text-align:center;font-size:.875rem;color:#525252}
.footer a{color:#2563eb;text-decoration:none}
.footer a:hover{color:#1d4ed8}
@media(max-width:768px){.stats-inner{grid-template-columns:repeat(2,1fr)}.advantages{grid-template-columns:1fr}}
</style>
</head>
<body>
<nav class="nav"><div class="nav-inner">
<a href="/" class="logo">CreatorFlow<span>365</span></a>
<div class="nav-links">
<a href="/">Home</a><a href="/tools">Tools</a><a href="/tools/content-library">Content Library</a><a href="/growth-suite">Growth Suite</a><a href="/dashboard">Dashboard</a>
<a href="/categories">Categories</a><a href="/pricing">Pricing</a><a href="/credits">Credit Costs</a><a href="/integrations">Integrations</a><a href="/contact">Contact</a>
<a href="/login">Sign In</a><a href="/signup" class="btn-pri">Sign Up</a>
</div></div>
</nav>
<section class="hero"><div class="hero-inner">
<div class="badge-hero"><strong>162 Million</strong><span>content creators in the U.S.</span></div>
<p class="lead">Are you one of them?</p><p class="lead">Grow with CreatorFlow365</p>
<p style="font-size:1.25rem;font-weight:700;color:#2563eb;margin:1rem 0">Improve Your Content with CreatorFlow365!</p>
<h1>CreatorFlow<span>365</span></h1>
<p>The Micro-SaaS Marketplace for Content Creators</p>
<p>Build, optimize, and monetize your content with 53+ professional tools—all in one place.</p>
<p class="lead">Run your entire creator business from one platform—not just schedule posts.</p>
<div class="advantages">
<div><span class="save">Save $159+</span><small>per month vs buying separately</small></div>
<div><span class="tools">53+ Tools</span><small>vs competitors' 3-10 tools</small></div>
<div><span class="only">Only We Have</span><small>Viral Content Predictor</small></div>
</div>
<div class="hero-btns">
<a href="/tools" class="btn-pri">Browse All Tools</a>
<a href="/categories" class="btn-sec">View Categories</a>
<a href="/signup" class="btn-sec">Get Started Free</a>
</div>
</div></section>
<section class="section" style="background:#fafafa">
<h2>Featured Essential Tools</h2>
<div class="tools-grid">
<a href="/tools/ai-content-generator" class="tool-card"><span class="badge">Most Popular</span><h3>AI Content Generator</h3><p>Advanced AI that creates better content than competitors.</p></a>
<a href="/tools/multi-platform-scheduler" class="tool-card"><span class="badge">Essential</span><h3>Multi-Platform Scheduler</h3><p>Schedule across all platforms simultaneously.</p></a>
<a href="/tools/performance-analytics" class="tool-card"><span class="badge">Pro Feature</span><h3>Performance Analytics</h3><p>Deep analytics competitors don't offer.</p></a>
<a href="/tools/revenue-optimizer" class="tool-card"><span class="badge">New</span><h3>Revenue Optimizer</h3><p>Maximize monetization across all revenue streams.</p></a>
</div>
</section>
<section class="stats"><div class="stats-inner">
<div>150+<span>Essential Tools</span></div>
<div>50K+<span>Active Creators</span></div>
<div>200+<span>Tools Integrated</span></div>
<div>98%<span>Success Rate</span></div>
</div></section>
<footer class="footer">
<a href="/">CreatorFlow365</a> · <a href="/tools">Tools</a> · <a href="/pricing">Pricing</a> · <a href="/contact">Contact</a>
</footer>
</body>
</html>`

const TOOLS_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Tools — CreatorFlow365</title>
<link rel="icon" href="/favicon.svg"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:#fafafa;color:#171717;line-height:1.5}
.nav{position:sticky;top:0;z-index:50;border-bottom:1px solid #e5e5e5;background:rgba(250,250,250,.95);backdrop-filter:blur(8px);padding:.5rem 1rem}
.nav-inner{max-width:1280px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem}
.logo{font-size:1.25rem;font-weight:700;color:#0a0a0a;text-decoration:none}.logo span{color:#2563eb}
.nav-links{display:flex;gap:1rem;flex-wrap:wrap;align-items:center}
.nav-links a{color:#525252;text-decoration:none;font-size:.875rem;font-weight:500}.nav-links a:hover{color:#1d4ed8}
.btn-pri{display:inline-block;padding:.5rem 1rem;background:#2563eb;color:#fff;font-weight:500;text-decoration:none;border-radius:.5rem;font-size:.875rem}
.section{padding:2rem 1rem;max-width:1280px;margin:0 auto}
.section h1{font-size:2rem;font-weight:700;color:#0a0a0a;margin-bottom:.5rem}
.section h1 span{color:#2563eb}
.section p{color:#525252;margin-bottom:1.5rem}
.tool-links{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.75rem}
.tool-links a{color:#2563eb;text-decoration:none;font-size:.875rem;padding:.5rem;border:1px solid #e5e5e5;border-radius:.5rem;background:#fff}
.tool-links a:hover{border-color:#93c5fd;background:#eff6ff}
.footer{border-top:1px solid #e5e5e5;background:#f5f5f5;padding:2rem 1rem;text-align:center;font-size:.875rem;color:#525252}
.footer a{color:#2563eb;text-decoration:none}
</style>
</head>
<body>
<nav class="nav"><div class="nav-inner">
<a href="/" class="logo">CreatorFlow<span>365</span></a>
<div class="nav-links">
<a href="/">Home</a><a href="/tools">Tools</a><a href="/tools/content-library">Content Library</a><a href="/growth-suite">Growth Suite</a><a href="/dashboard">Dashboard</a>
<a href="/categories">Categories</a><a href="/pricing">Pricing</a><a href="/credits">Credit Costs</a><a href="/integrations">Integrations</a><a href="/contact">Contact</a>
<a href="/login">Sign In</a><a href="/signup" class="btn-pri">Sign Up</a>
</div></div>
</nav>
<section class="section">
<h1>Tools <span>53+</span></h1>
<p>Browse and use 53+ professional tools for content planning, SEO, analytics, social media, and more.</p>
<div class="tool-links">
<a href="/tools/ai-caption-generator">AI Caption Generator</a>
<a href="/tools/content-library">Content Library</a>
<a href="/tools/content-repurposer">Content Repurposer</a>
<a href="/tools/viral-content-predictor">Viral Content Predictor</a>
<a href="/tools/hashtag-research">Hashtag Research</a>
<a href="/tools/social-graphics">Social Graphics</a>
<a href="/tools/instagram-scheduler">Instagram Scheduler</a>
<a href="/tools/analytics-dashboard">Analytics Dashboard</a>
<a href="/tools/competitor-analyzer">Competitor Analyzer</a>
<a href="/categories">All categories</a>
</div>
</section>
<footer class="footer">
<a href="/">CreatorFlow365</a> · <a href="/tools">Tools</a> · <a href="/pricing">Pricing</a> · <a href="/contact">Contact</a>
</footer>
</body>
</html>`

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (path === '/' || path === '') {
    return new NextResponse(FULL_HOME_HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    })
  }
  if (path === '/tools') {
    return new NextResponse(TOOLS_HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
