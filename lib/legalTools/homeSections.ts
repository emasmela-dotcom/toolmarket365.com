import { LEGAL_TOOLS } from './metadata'

export function legalToolSectionsForHome(): {
  category: string
  tag: string
  tools: { id: string; title: string }[]
}[] {
  return [
    {
      category: 'Legal Plain-Language',
      tag: '(LEGAL)',
      tools: LEGAL_TOOLS.map((t) => ({ id: t.id, title: t.title })),
    },
  ]
}
