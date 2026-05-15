export type FormBuilderFieldType = 'text' | 'email' | 'tel' | 'textarea'

export type FormBuilderField = {
  name: string
  label: string
  type: FormBuilderFieldType
  required?: boolean
}

export type FormBuilderInput = {
  title: string
  fields: FormBuilderField[]
  /** Where the browser POSTs (Formspree, Netlify, your API, etc.) */
  actionUrl: string
  method: 'post' | 'get'
  /** Adds netlify attribute when true */
  netlify?: boolean
}

export type FormBuilderResult = {
  html: string
  checklist: string[]
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildEmbeddableForm(input: FormBuilderInput): FormBuilderResult {
  const fields = input.fields.filter((f) => f.name.trim() && f.label.trim())
  const action = escapeHtml(input.actionUrl.trim())
  const title = escapeHtml(input.title.trim() || 'Contact')
  const method = input.method === 'get' ? 'get' : 'post'
  const netlifyAttr = input.netlify ? ' data-netlify="true"' : ''

  const rows = fields.map((f) => {
    const name = escapeHtml(f.name.trim())
    const label = escapeHtml(f.label.trim())
    const req = f.required ? ' required' : ''
    if (f.type === 'textarea') {
      return `  <label class="tm-fb-row">\n    <span>${label}</span>\n    <textarea name="${name}" rows="4"${req}></textarea>\n  </label>\n`
    }
    const t = f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : 'text'
    return `  <label class="tm-fb-row">\n    <span>${label}</span>\n    <input type="${t}" name="${name}"${req} />\n  </label>\n`
  })

  const html = `<!-- CreatorFlow365 — embeddable form (set action to your handler) -->\n<form class="tm-fb-form" action="${action}" method="${method}"${netlifyAttr}>\n  <fieldset>\n    <legend>${title}</legend>\n${rows.join('')}  </fieldset>\n  <button type="submit">Send</button>\n</form>\n<style>\n.tm-fb-form { max-width: 28rem; font-family: system-ui, sans-serif; }\n.tm-fb-row { display: block; margin-bottom: 0.75rem; }\n.tm-fb-row span { display: block; font-size: 0.875rem; margin-bottom: 0.25rem; }\n.tm-fb-row input, .tm-fb-row textarea { width: 100%; padding: 0.5rem; box-sizing: border-box; }\n</style>\n`

  const checklist = [
    'Point action to a real endpoint: Formspree (`https://formspree.io/f/...`), Netlify Forms, or your own server that sends email.',
    'If you use Netlify, deploy this HTML on Netlify and enable Forms; keep `data-netlify="true"` on the form.',
    'Never put secret API keys in the HTML — keep secrets on the server that receives the POST.',
    'Add spam protection (honeypot field, hCaptcha/Turnstile) on your production handler.',
  ]

  return { html, checklist }
}
