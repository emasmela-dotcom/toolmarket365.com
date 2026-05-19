#!/usr/bin/env node
/**
 * Approved usage burn smoke test — hits local + optional production API routes.
 * Usage: node scripts/smoke-burn-checklist.mjs
 *        PRODUCTION_URL=https://your-domain.com node scripts/smoke-burn-checklist.mjs
 */

const LOCAL = process.env.LOCAL_URL || 'http://127.0.0.1:3000'
const PROD = process.env.PRODUCTION_URL || ''

const SAMPLE = {
  niche: 'fitness creators',
  audience: 'busy parents',
  painPoint: 'no time to work out',
  desire: 'quick home workouts',
  content:
    'Launching a 7-day challenge for creators who want consistent posting without burnout.',
  trend: 'short-form video hooks',
  text: 'Team agreed to ship compare page by Friday. Alex owns copy. Maria reviews pricing.',
  topic: 'micro SaaS tools for creators',
  title: 'Creator tools marketplace',
  description: 'All-in-one toolkit for content creators',
  competitors: ['Later', 'Buffer'],
}

async function post(base, path, body, label) {
  const url = `${base.replace(/\/$/, '')}${path}`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    let json
    try {
      json = JSON.parse(text)
    } catch {
      json = { raw: text.slice(0, 200) }
    }
    const ok = res.ok
    const preview =
      json.error ||
      json.explanation?.slice?.(0, 80) ||
      json.result?.slice?.(0, 80) ||
      json.hooks?.length ||
      json.ideas?.length ||
      json.captions?.length ||
      json.tags?.title ||
      json.ok
    console.log(`${ok ? '✓' : '✗'} [${label}] ${path} → ${res.status} ${preview ?? ''}`)
    return { ok, status: res.status, json }
  } catch (e) {
    console.log(`✗ [${label}] ${path} → ${e.message}`)
    return { ok: false, error: e.message }
  }
}

async function get(base, path, label) {
  const url = `${base.replace(/\/$/, '')}${path}`
  try {
    const res = await fetch(url)
    const json = await res.json().catch(() => ({}))
    console.log(`${res.ok ? '✓' : '✗'} [${label}] GET ${path} → ${res.status}`)
    return { ok: res.ok, json }
  } catch (e) {
    console.log(`✗ [${label}] GET ${path} → ${e.message}`)
    return { ok: false }
  }
}

const TEMPLATE_ROUTES = [
  ['/api/hooks', { niche: SAMPLE.niche, audience: SAMPLE.audience, painPoint: SAMPLE.painPoint, desire: SAMPLE.desire }],
  ['/api/content-ideas', { niche: SAMPLE.niche }],
  ['/api/seo-meta-tag-generator', { title: SAMPLE.title, description: SAMPLE.description, keywords: 'creator, tools', author: 'Test', url: 'https://example.com', image: '' }],
  ['/api/ai-blog-post-writer', { topic: SAMPLE.topic, audience: SAMPLE.audience, keywords: 'saas, creators', tone: 'professional' }],
  ['/api/competitor-scanner', { niche: SAMPLE.niche, competitors: SAMPLE.competitors }],
  ['/api/landing-copy', { product: 'ToolMarket365', audience: 'creators', problem: 'scattered tools', benefit: '53+ tools', tone: 'professional' }],
  ['/api/newsletter', { niche: SAMPLE.niche }],
  ['/api/google-analytics-simplifier', { sessions: 1200, users: 900, bounceRatePct: 42, conversions: 15 }],
  ['/api/viral-predictor', { content: { platform: 'instagram', text: 'Stop scrolling — 3 tips for creators' }, niche: SAMPLE.niche }],
]

const OPENAI_ROUTES = [
  ['/api/content-repurpose', { content: SAMPLE.content }],
  ['/api/trend-explainer', { trend: SAMPLE.trend }],
  ['/api/action-items', { text: SAMPLE.text }],
]

const AUTH_ROUTES = [
  ['/api/bots/captions/generate', { count: 2, tone: 'casual', platforms: ['instagram'] }],
  ['/api/assistant/chat', { messages: [{ role: 'user', content: 'What tools do you have for Instagram?' }] }],
]

async function runSuite(base, label) {
  console.log(`\n=== ${label}: ${base} ===\n`)
  await get(base, '/api/health', label)

  for (const [path, body] of TEMPLATE_ROUTES) {
    await post(base, path, body, label)
  }
  for (const [path, body] of OPENAI_ROUTES) {
    await post(base, path, body, label)
  }
  for (const [path, body] of AUTH_ROUTES) {
    await post(base, path, body, label)
  }
}

async function main() {
  console.log('Smoke burn checklist — template + OpenAI + auth-probe routes\n')
  await runSuite(LOCAL, 'local')

  if (PROD) {
    await runSuite(PROD, 'production')
  } else {
    console.log('\n(Skipping production — set PRODUCTION_URL to test live deploy)\n')
  }

  console.log('\nSkipped by design: paid ads (#7), load-test signups (#9), live OAuth (#5), real email send (#6 — app logs only).')
}

main()
