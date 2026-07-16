import type { Metadata } from 'next'
import {
  LEGAL_SUITE_DESCRIPTION,
  LEGAL_SUITE_TITLE,
} from '@/lib/legalTools/metadata'
import { getSiteUrl } from '@/lib/siteConfig'

const base = getSiteUrl()

export const metadata: Metadata = {
  title: LEGAL_SUITE_TITLE,
  description: LEGAL_SUITE_DESCRIPTION,
  alternates: {
    canonical: `${base}/tools/legal-plain-language-tools`,
  },
  openGraph: {
    url: `${base}/tools/legal-plain-language-tools`,
    title: `${LEGAL_SUITE_TITLE} | ToolMarket365`,
    description: LEGAL_SUITE_DESCRIPTION,
  },
}

export default function LegalToolsLayout({ children }: { children: React.ReactNode }) {
  return children
}
