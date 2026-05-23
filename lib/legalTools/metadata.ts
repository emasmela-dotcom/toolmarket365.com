export type LegalToolId = 'demand' | 'rights' | 'classify'

export type LegalToolMeta = {
  id: LegalToolId
  title: string
  description: string
}

export const LEGAL_SUITE_TITLE = 'Legal Plain-Language Tools'

export const LEGAL_SUITE_DESCRIPTION =
  'Demand letters, employment rights primers, and employee vs. contractor guidance — plain English, not legal advice.'

export const LEGAL_TOOLS: LegalToolMeta[] = [
  {
    id: 'demand',
    title: 'Demand Letter Generator',
    description: 'Professional demand letter for deposits, unpaid wages, contracts, and more.',
  },
  {
    id: 'rights',
    title: 'Employment Rights Checker',
    description: 'Plain-language overview of rights that may apply to your situation.',
  },
  {
    id: 'classify',
    title: 'Employee vs. Contractor',
    description: 'Factor-by-factor classifier for how your work arrangement is often viewed.',
  },
]

export function legalToolHomeDescriptions(): Record<string, string> {
  const base = '/tools/legal-plain-language-tools'
  const out: Record<string, string> = {
    [base]: LEGAL_SUITE_DESCRIPTION,
  }
  for (const t of LEGAL_TOOLS) {
    out[`${base}?tab=${t.id}`] = t.description
  }
  return out
}
