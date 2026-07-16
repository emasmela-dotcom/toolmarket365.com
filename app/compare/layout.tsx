import type { Metadata } from 'next'
import { getSiteUrl, SITE_NAME } from '@/lib/siteConfig'

const base = getSiteUrl()

export const metadata: Metadata = {
  title: 'Compare — ToolMarket365 vs scheduling tools',
  description:
    'Compare ToolMarket365 ($0.99/month, 120+ tools) with Later, Buffer, Hootsuite, and other creator tools. One low-cost marketplace instead of stacked subscriptions.',
  alternates: { canonical: `${base}/compare` },
  openGraph: {
    url: `${base}/compare`,
    title: `Compare ${SITE_NAME} — $0.99/month`,
    description:
      'See how ToolMarket365 stacks up on price and tool breadth versus typical social scheduling apps.',
  },
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children
}
