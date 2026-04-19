export type NotionPdfInput = {
  title?: string
  body: string
}

export type NotionPdfResult = {
  printTitle: string
  checklist: string[]
  printableHtml: string
}

/** Build a print-friendly HTML fragment and export checklist (browser Print → PDF). */
export function buildNotionPdfExport(input: NotionPdfInput): NotionPdfResult {
  const title = (input.title || 'Notion export').trim() || 'Notion export'
  const lines = input.body
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  const escaped = lines
    .map((line) => {
      const safe = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      if (/^#{1,6}\s/.test(line)) {
        const hashes = line.match(/^#+/)?.[0].length ?? 1
        const level = Math.min(6, hashes + 1)
        const text = safe.replace(/^#{1,6}\s*/, '')
        return `<h${level}>${text}</h${level}>`
      }
      if (/^[-*]\s+/.test(line)) {
        return `<li>${safe.replace(/^[-*]\s+/, '')}</li>`
      }
      return `<p>${safe}</p>`
    })
    .join('\n')

  const safeTitle = title
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const printableHtml = `
<article class="notion-pdf-export">
  <h1>${safeTitle}</h1>
  ${escaped}
</article>`.trim()

  const checklist = [
    'In Notion: open the page → ⋮ menu → Export → Markdown & CSV (or PDF if available).',
    'Or paste your content here, then use your browser File → Print → Save as PDF.',
    'Turn on “Background graphics” in print settings if you use colored callouts.',
    'Use A4 or Letter, margins ~1in, and a readable font (e.g. 11–12pt).',
    'Proofread the PDF: headings, bullets, and links (links may be plain text in export).',
  ]

  return { printTitle: title, checklist, printableHtml }
}
