import { Suspense } from 'react'
import { Libre_Baskerville, Source_Sans_3 } from 'next/font/google'
import { LegalPlainLanguageTools } from '@/components/legal/LegalPlainLanguageTools'
import { LEGAL_SUITE_DESCRIPTION, LEGAL_SUITE_TITLE } from '@/lib/legalTools/metadata'

const libre = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-libre-baskerville',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-source-sans',
})

export const metadata = {
  title: `${LEGAL_SUITE_TITLE} | ToolMarket365`,
  description: LEGAL_SUITE_DESCRIPTION,
}

export default function LegalPlainLanguageToolsPage() {
  return (
    <div className={`${libre.variable} ${sourceSans.variable}`}>
      <Suspense fallback={<p className="p-6 text-mono-700">Loading legal tools…</p>}>
        <LegalPlainLanguageTools />
      </Suspense>
    </div>
  )
}
