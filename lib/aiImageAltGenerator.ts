export type AiImageAltInput = {
  context: string
  pageTopic?: string
}

export type AiImageAltResult = { variants: string[] }

const MAX = 125

function clip(s: string) {
  const t = s.trim()
  return t.length <= MAX ? t : `${t.slice(0, MAX - 1)}…`
}

export function generateAccessibleAltText(input: AiImageAltInput): AiImageAltResult {
  const ctx = input.context.trim() || 'image'
  const page = (input.pageTopic || '').trim()
  const base = page ? `${ctx} — supporting ${page}` : ctx
  const variants = [
    clip(`${base}. Decorative elements omitted from description.`),
    clip(`Photo showing ${ctx}. Relevant to ${page || 'page content'}.`),
    clip(`Illustration: ${ctx}. Text in image summarized for screen readers.`),
  ]
  return { variants: [...new Set(variants)] }
}
