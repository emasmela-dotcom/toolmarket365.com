export type AiProductDescriptionInput = {
  productName: string
  featureBullets: string
  audience?: string
}

export type AiProductDescriptionResult = {
  title: string
  short: string
  long: string
  bullets: string[]
}

export function writeEcommerceDescription(input: AiProductDescriptionInput): AiProductDescriptionResult {
  const name = input.productName.trim() || 'Product'
  const feats = input.featureBullets
    .split(/\r?\n|[•\-*]/)
    .map((s) => s.trim())
    .filter(Boolean)
  const aud = input.audience?.trim() || 'customers'

  const bullets = feats.length ? feats.slice(0, 6) : ['Premium build', 'Fast setup', 'Ships tracked']

  const short = `${name} helps ${aud} get results faster — ${bullets.slice(0, 2).join('; ')}.`

  const long = `Meet **${name}**: built for ${aud} who want less friction and more momentum.\n\n${bullets.map((b) => `• ${b}`).join('\n')}\n\nOrder with confidence — we stand behind quality and support.`

  return { title: name, short: short.slice(0, 300), long, bullets }
}
