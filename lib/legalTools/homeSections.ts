import { LEGAL_TOOLS, type LegalToolId } from './metadata'
import type { TranslationKey } from '@/lib/i18n/translations'

export const LEGAL_TOOL_I18N: Record<
  LegalToolId,
  { title: TranslationKey; description: TranslationKey }
> = {
  demand: {
    title: 'homeLegalToolDemandTitle',
    description: 'homeLegalToolDemandDescription',
  },
  rights: {
    title: 'homeLegalToolRightsTitle',
    description: 'homeLegalToolRightsDescription',
  },
  classify: {
    title: 'homeLegalToolClassifyTitle',
    description: 'homeLegalToolClassifyDescription',
  },
}

export function legalToolSectionsForHome(): {
  categoryKey: TranslationKey
  tagKey: TranslationKey
  tools: { id: LegalToolId }[]
}[] {
  return [
    {
      categoryKey: 'homeLegalCategory',
      tagKey: 'homeLegalTag',
      tools: LEGAL_TOOLS.map((t) => ({ id: t.id })),
    },
  ]
}
