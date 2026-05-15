export type DigestCadence = 'daily' | 'weekly'

export type EmailDigestInput = {
  cadence: DigestCadence
  digestTitle?: string
  /** One string per newsletter/issue: title — optional URL or notes */
  items: string[]
}

export type EmailDigestResult = {
  subjectLine: string
  digestMarkdown: string
  introBlurb: string
}

export function buildEmailDigest(input: EmailDigestInput): EmailDigestResult {
  const title = (input.digestTitle || 'Your digest').trim()
  const cadence = input.cadence
  const cleaned = input.items.map((s) => s.trim()).filter(Boolean)

  const subjectLine =
    cadence === 'daily'
      ? `${title} — Daily digest (${new Date().toLocaleDateString()})`
      : `${title} — Weekly digest (week of ${new Date().toLocaleDateString()})`

  const introBlurb =
    cadence === 'daily'
      ? 'Skim in under 5 minutes. Follow up only on starred items.'
      : 'Weekly rollup: scan themes first, then dive into sources you care about.'

  const blocks = cleaned.map((line, i) => `### ${i + 1}. ${line}`).join('\n\n')

  const digestMarkdown = `# ${title}

_${introBlurb}_

${blocks || '_Add at least one newsletter line above._'}

---
*Built with CreatorFlow365 — tweak tone before sending.*
`

  return { subjectLine, digestMarkdown, introBlurb }
}
