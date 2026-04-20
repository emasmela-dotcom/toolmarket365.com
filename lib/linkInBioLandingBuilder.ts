export type BioLink = { label: string; url: string }

export type LinkInBioLandingInput = {
  headline: string
  links: BioLink[]
  accentColor?: string
}

export type LinkInBioLandingResult = {
  htmlFragment: string
  markdown: string
}

export function buildLinkInBioLanding(input: LinkInBioLandingInput): LinkInBioLandingResult {
  const h = input.headline.trim() || 'Links'
  const color = input.accentColor?.trim() || '#3b82f6'
  const links = input.links.filter((l) => l.label && l.url)

  const buttons = links
    .map((l) => {
      const safe = l.url.replace(/"/g, '')
      return `<a class="bio-btn" href="${safe}">${l.label.replace(/</g, '')}</a>`
    })
    .join('\n')

  const htmlFragment = `<section style="max-width:28rem;margin:0 auto;text-align:center;font-family:system-ui,sans-serif;">
  <h1 style="font-size:1.25rem;margin-bottom:1rem;">${h.replace(/</g, '')}</h1>
  <div style="display:flex;flex-direction:column;gap:0.6rem;">${buttons}</div>
  <style>.bio-btn{display:block;padding:0.75rem 1rem;border-radius:0.5rem;background:${color};color:#fff;text-decoration:none;font-weight:600;}</style>
</section>`

  const md = `# ${h}\n\n${links.map((l) => `- [${l.label}](${l.url})`).join('\n')}\n`
  return { htmlFragment, markdown: md.trim() }
}
