export type SeoAuditInput = {
  url: string
  hasSitemap?: boolean
  hasSsl?: boolean
  mobileFriendly?: boolean
  metaTitleLength?: number
  metaDescriptionLength?: number
  h1Count?: number
}

export type SeoAuditFinding = {
  level: 'good' | 'warn' | 'bad'
  text: string
}

export type SeoAuditResult = {
  score: number
  findings: SeoAuditFinding[]
}

/** Heuristic one-page SEO health checklist (no live crawl). */
export function runSeoAudit(input: SeoAuditInput): SeoAuditResult {
  const findings: SeoAuditFinding[] = []
  let score = 55

  const urlOk = /^https:\/\//i.test(input.url.trim())
  if (!input.url.trim()) {
    findings.push({ level: 'bad', text: 'Enter a canonical URL to anchor the audit.' })
    return { score: 0, findings }
  }
  if (urlOk) {
    findings.push({ level: 'good', text: 'URL uses HTTPS — good baseline for trust and rankings.' })
    score += 10
  } else {
    findings.push({
      level: 'warn',
      text: 'Prefer https:// canonical URLs; redirect HTTP→HTTPS sitewide.',
    })
  }

  if (input.hasSsl !== false) {
    findings.push({ level: 'good', text: 'TLS enabled on the edge (confirm auto-renewal).' })
    score += 5
  }

  if (input.hasSitemap) {
    findings.push({ level: 'good', text: 'XML sitemap referenced in robots.txt helps discovery.' })
    score += 8
  } else {
    findings.push({
      level: 'warn',
      text: 'Add /sitemap.xml and reference it in robots.txt; submit in Search Console.',
    })
  }

  const titleLen = input.metaTitleLength ?? 0
  if (titleLen >= 30 && titleLen <= 60) {
    findings.push({ level: 'good', text: 'Title length sits in a healthy SERP display band.' })
    score += 7
  } else if (titleLen > 0) {
    findings.push({
      level: 'warn',
      text: 'Aim for ~30–60 characters in the title; include primary intent once.',
    })
  } else {
    findings.push({ level: 'bad', text: 'Missing measurable title length — verify unique <title> per page.' })
  }

  const descLen = input.metaDescriptionLength ?? 0
  if (descLen >= 120 && descLen <= 160) {
    findings.push({ level: 'good', text: 'Meta description length is reasonable for snippets.' })
    score += 5
  } else if (descLen > 0) {
    findings.push({
      level: 'warn',
      text: 'Target ~120–160 characters; write for humans, not keyword stuffing.',
    })
  }

  const h1 = input.h1Count ?? -1
  if (h1 === 1) {
    findings.push({ level: 'good', text: 'Exactly one H1 helps topical clarity.' })
    score += 8
  } else if (h1 >= 0) {
    findings.push({
      level: 'warn',
      text: 'Use a single descriptive H1; demote extra headings to H2/H3.',
    })
  }

  if (input.mobileFriendly) {
    findings.push({ level: 'good', text: 'Mobile-friendly layout signals pass Core UX sniff tests.' })
    score += 7
  } else {
    findings.push({
      level: 'warn',
      text: 'Validate responsive breakpoints, tap targets, and LCP on real devices.',
    })
  }

  findings.push({
    level: 'good',
    text: 'Next: run Lighthouse + Search Console “Page experience” after deploys.',
  })

  score = Math.max(0, Math.min(100, score))
  return { score, findings }
}
