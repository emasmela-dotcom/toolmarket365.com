export type AiBlogPostInput = {
  topic: string
  audience: string
  keywords: string
  tone?: 'professional' | 'friendly' | 'technical'
}

export type AiBlogPostResult = {
  title: string
  metaDescription: string
  sections: { heading: string; body: string }[]
}

/** Template-based SEO draft (no external LLM). */
export function draftSeoBlogPost(input: AiBlogPostInput): AiBlogPostResult {
  const topic = input.topic.trim() || 'Your topic'
  const audience = input.audience.trim() || 'readers'
  const kw = input.keywords
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
  const tone = input.tone || 'professional'
  const k = kw.join(', ') || topic

  const title = `${topic}: what ${audience} should know in 2026`
  const metaDescription = `A practical guide to ${topic} for ${audience}. Covers setup, pitfalls, and next steps — optimized around ${k}.`.slice(
    0,
    158
  )

  const voice =
    tone === 'friendly'
      ? 'We’ll keep this light and actionable.'
      : tone === 'technical'
        ? 'Assumes you ship software or content weekly.'
        : 'Written for operators who want signal, not fluff.'

  const sections = [
    {
      heading: `Why ${topic} matters now`,
      body: `${voice} Start with the outcome your ${audience} chases — time saved, revenue protected, or risk removed. Tie ${k} to that outcome in one paragraph before diving into tactics.`,
    },
    {
      heading: 'What to do first (checklist)',
      body: `1) Baseline your current workflow. 2) Pick one metric (activation, retention, or pipeline). 3) Ship a small experiment this week. 4) Document learnings in a single page others can reuse.`,
    },
    {
      heading: 'Common mistakes',
      body: `Over-scoping v1, skipping internal links, and publishing without a CTA. For ${topic}, add one primary CTA (newsletter, demo, or download) above the fold on desktop and mobile.`,
    },
    {
      heading: 'FAQ (schema-ready)',
      body: `**Who is this for?** ${audience}. **What tools help?** Whatever you already pay for — avoid tool sprawl. **How often to update?** When metrics move or quarterly, whichever comes first.`,
    },
    {
      heading: 'Conclusion + keywords',
      body: `Recap the three moves, repeat ${k} naturally once more, and invite comments or replies. Internal link to your pillar page on the same cluster.`,
    },
  ]

  return { title, metaDescription, sections }
}
