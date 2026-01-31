import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Full static homepage so live site shows your real design (Next.js root render fails on Vercel)
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
.logo{font-size:1.25rem;font-weight:700;color:#0a0a0a;text-decoration:none;display:flex;align-items:center}
.logo span{color:#2563eb}
.nav-links{display:flex;gap:1rem;flex-wrap:wrap;align-items:center}
.nav-links a{color:#525252;text-decoration:none;font-size:.875rem;font-weight:500}
.nav-links a:hover{color:#2563eb}
.btn-pri{display:inline-block;padding:.5rem 1rem;background:#2563eb;color:#fff;font-weight:500;text-decoration:none;border-radius:.5rem;font-size:.875rem}
.btn-pri:hover{background:#1d4ed8}
.hero{background:#fafafa;border-bottom:1px solid #e5e5e5;padding:2rem 1rem 2.5rem;text-align:center}
.hero-inner{max-width:896px;margin:0 auto}
.badge-hero{display:inline-flex;align-items:center;gap:.5rem;background:#eff6ff;padding:.5rem 1rem;border-radius:.5rem;border:1px solid #bfdbfe;margin-bottom:1rem}
.badge-hero strong{color:#2563eb;font-size:1.5rem}
.badge-hero span{color:#525252;font-size:.875rem}
.hero h1{font-size:clamp(2.25rem,5vw,4.5rem);font-weight:700;margin-bottom:.75rem;color:#0a0a0a}
.hero h1 span{color:#2563eb}
.hero p{margin-bottom:.5rem;color:#525252;max-width:36rem;margin-left:auto;margin-right:auto}
.hero .lead{font-size:1.125rem;font-weight:600;color:#2563eb}
.advantages{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem;max-width:48rem;margin:2rem auto;padding:1rem;background:linear-gradient(to right,#f0fdf4,#eff6ff);border:2px solid #4ade80;border-radius:.5rem;text-align:center}
.advantages div{font-weight:700;font-size:1.25rem;color:#16a34a}
.advantages div small{display:block;font-size:.75rem;font-weight:500;color:#525252}
.advantages .blue{color:#2563eb}
.hero-btns{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center;margin-top:1.5rem}
.hero-btns a{display:inline-flex;align-items:center;padding:.625rem 1.5rem;border-radius:.5rem;font-size:.875rem;font-weight:500;text-decoration:none}
.hero-btns .btn-pri{background:#2563eb;color:#fff}
.hero-btns .btn-sec{background:#fff;color:#0a0a0a;border:1px solid #e5e5e5}
.hero-btns .btn-sec:hover{background:#f5f5f5}
.section{padding:3rem 1rem;max-width:1280px;margin:0 auto}
.section h2{font-size:1.875rem;font-weight:700;margin-bottom:1rem;color:#0a0a0a}
.section>p{margin-bottom:2rem;color:#525252;font-size:1.125rem}
.tools-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem}
.tool-card{background:#fff;border:1px solid #e5e5e5;border-radius:.5rem;padding:1.5rem;text-decoration:none;color:inherit;display:block}
.tool-card:hover{border-color:#93c5fd;box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}
.tool-card .badge{font-size:.75rem;font-weight:500;padding:.25rem .5rem;background:#dbeafe;color:#1d4ed8;border-radius:.25rem;display:inline-block;margin-bottom:.5rem}
.tool-card h3{font-size:1.25rem;font-weight:600;margin-bottom:.5rem}
.tool-card p{font-size:.875rem;color:#525252}
.cats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem}
.cat-card{background:#fff;border:1px solid #e5e5e5;border-radius:.5rem;padding:1rem}
.cat-card h3{font-size:1rem;font-weight:600;margin-bottom:.25rem}
.cat-card p{font-size:.75rem;color:#525252}
.cat-card span{color:#2563eb;font-weight:600}
.vp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem}
.vp-card{background:#fff;border:1px solid #e5e5e5;border-radius:.5rem;padding:1.5rem}
.vp-card h3{font-size:1.125rem;font-weight:600;margin-bottom:.5rem}
.vp-card p{font-size:.875rem;color:#525252}
.stats{background:#f5f5f5;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;padding:2rem 1rem}
.stats-inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;text-align:center}
.stats-inner div{font-size:1.875rem;font-weight:700;color:#0a0a0a}
.stats-inner span{display:block;font-size:.875rem;color:#525252;font-weight:400;margin-top:.25rem}
.footer{border-top:1px solid #e5e5e5;background:#f5f5f5;padding:2rem 1rem;text-align:center;font-size:.875rem;color:#525252}
.footer a{color:#2563eb;text-decoration:none}
@media(max-width:768px){.stats-inner{grid-template-columns:repeat(2,1fr)}}
</style>
</head>
<body>
<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="logo">CreatorFlow<span>365</span></a>
    <div class="nav-links">
      <a href="/">Home</a>
      <a href="/tools">Tools</a>
      <a href="/tools/content-library">Content Library</a>
      <a href="/growth-suite">Growth Suite</a>
      <a href="/dashboard">Dashboard</a>
      <a href="/categories">Categories</a>
      <a href="/pricing">Pricing</a>
      <a href="/credits">Credit Costs</a>
      <a href="/integrations">Integrations</a>
      <a href="/contact">Contact</a>
      <a href="/login">Sign In</a>
      <a href="/signup" class="btn-pri">Sign Up</a>
    </div>
  </div>
</nav>
<section class="hero">
  <div class="hero-inner">
    <div class="badge-hero"><strong>162 Million</strong><span>content creators in the U.S.</span></div>
    <p class="lead">Are you one of them?</p>
    <p class="lead">Grow with CreatorFlow365</p>
    <p style="font-size:1.25rem;font-weight:700;color:#2563eb;margin:1rem 0">Improve Your Content with CreatorFlow365!</p>
    <h1>CreatorFlow<span>365</span></h1>
    <p>The Micro-SaaS Marketplace for Content Creators</p>
    <p>Build, optimize, and monetize your content with 53+ professional tools—all in one place. Store, organize, and manage all your content in your personal cloud library.</p>
    <p class="lead">Run your entire creator business from one platform—not just schedule posts.</p>
    <div class="advantages">
      <div>Save $159+<small>per month vs buying separately</small></div>
      <div class="blue">53+ Tools<small>vs competitors' 3-10 tools</small></div>
      <div class="blue">Only We Have<small>Viral Content Predictor</small></div>
    </div>
    <div class="hero-btns">
      <a href="/tools" class="btn-pri">Browse All Tools</a>
      <a href="/categories" class="btn-sec">View Categories</a>
      <a href="/signup" class="btn-sec">Get Started Free</a>
    </div>
  </div>
</section>
<section class="section" style="background:#fafafa">
  <h2>Featured Essential Tools</h2>
  <p>Tools that outperform competitors and provide unique value.</p>
  <div class="tools-grid">
    <a href="/tools/ai-content-generator" class="tool-card"><span class="badge">Most Popular</span><h3>AI Content Generator</h3><p>Advanced AI that creates better content than competitors. Multi-format support with SEO optimization.</p></a>
    <a href="/tools/multi-platform-scheduler" class="tool-card"><span class="badge">Essential</span><h3>Multi-Platform Scheduler</h3><p>Schedule across all platforms simultaneously. Better automation than Hootsuite or Buffer.</p></a>
    <a href="/tools/performance-analytics" class="tool-card"><span class="badge">Pro Feature</span><h3>Performance Analytics</h3><p>Deep analytics competitors don't offer. Track ROI, engagement, and revenue across all channels.</p></a>
    <a href="/tools/revenue-optimizer" class="tool-card"><span class="badge">New</span><h3>Revenue Optimizer</h3><p>Maximize monetization across all revenue streams. Track and optimize earnings automatically.</p></a>
  </div>
</section>
<section class="section">
  <h2>Tool Categories</h2>
  <p>Strategic tools for content planning, SEO, analytics, and more.</p>
  <div class="cats-grid">
    <div class="cat-card"><h3>Content Planning</h3><p>Strategic content calendars</p><span>24 tools</span></div>
    <div class="cat-card"><h3>SEO Optimization</h3><p>Maximum visibility</p><span>18 tools</span></div>
    <div class="cat-card"><h3>Analytics Dashboard</h3><p>Performance tracking</p><span>22 tools</span></div>
    <div class="cat-card"><h3>Social Media</h3><p>Multi-platform management</p><span>28 tools</span></div>
    <div class="cat-card"><h3>Video Tools</h3><p>Editing and optimization</p><span>16 tools</span></div>
    <div class="cat-card"><h3>AI Tools</h3><p>AI-powered generation</p><span>15+ tools</span></div>
  </div>
</section>
<section class="section" style="background:#fafafa">
  <h2 style="text-align:center">Why Choose Micro-SaaS Marketplace</h2>
  <p style="text-align:center;max-width:42rem;margin-left:auto;margin-right:auto">We don't just match competitors. We exceed them with features creators actually need.</p>
  <div class="vp-grid">
    <div class="vp-card"><h3>Works Instantly, No Setup</h3><p>All tools work immediately using your browser storage. No database setup required—start creating right away.</p></div>
    <div class="vp-card"><h3>Superior Performance</h3><p>Tools optimized for speed and efficiency. Faster than competitors with better results.</p></div>
    <div class="vp-card"><h3>Cloud Content Library</h3><p>Store, organize, and manage all your content in one secure cloud library. Never lose your work.</p></div>
    <div class="vp-card"><h3>Enterprise Security</h3><p>Bank-level security and data protection. Your content and analytics are secure.</p></div>
    <div class="vp-card"><h3>Advanced Analytics</h3><p>Deep insights competitors don't offer. Track performance across all platforms.</p></div>
    <div class="vp-card"><h3>Creator-Focused</h3><p>Built specifically for content creators. Features designed for your workflow.</p></div>
  </div>
</section>
<section class="stats">
  <div class="stats-inner">
    <div>150+<span>Essential Tools</span></div>
    <div>50K+<span>Active Creators</span></div>
    <div>200+<span>Tools Integrated</span></div>
    <div>98%<span>Success Rate</span></div>
  </div>
</section>
<footer class="footer">
  <a href="/">CreatorFlow365</a> · <a href="/tools">Tools</a> · <a href="/pricing">Pricing</a> · <a href="/contact">Contact</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a>
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
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
