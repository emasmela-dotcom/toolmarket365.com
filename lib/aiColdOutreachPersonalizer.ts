export type AiColdOutreachInput = {
  company: string
  contactRole?: string
  valueProp: string
  signal?: string
}

export type AiColdOutreachResult = {
  pairs: { subject: string; opener: string }[]
}

export function personalizeColdOutreach(input: AiColdOutreachInput): AiColdOutreachResult {
  const co = input.company.trim() || 'your team'
  const role = (input.contactRole || 'there').trim()
  const vp = input.valueProp.trim() || 'save time on ops'
  const sig = (input.signal || '').trim()

  const pairs = [
    {
      subject: `Quick idea for ${co}`,
      opener: `Hi ${role} — noticed ${sig || 'your team ships often'}. We help teams ${vp}. Open to a 15m chat?`,
    },
    {
      subject: `${co} + one workflow win`,
      opener: `Hey ${role}, I’m reaching out because ${vp}. If you’re exploring Q2 priorities, I can share how similar teams cut rollout time.`,
    },
    {
      subject: `Not a generic pitch`,
      opener: `Hi ${role} — writing because ${vp} specifically for orgs like ${co}. If this misses the mark, a one-line “not relevant” helps.`,
    },
  ]
  return { pairs }
}
