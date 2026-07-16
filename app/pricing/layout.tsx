import type { Metadata } from 'next'
import { getSiteUrl, SITE_NAME } from '@/lib/siteConfig'

const base = getSiteUrl()

export const metadata: Metadata = {
  title: 'Pricing — $0.99/month',
  description:
    'ToolMarket365 pricing: one plan at $0.99/month. Browse 120+ tools free; unlock every tool feature with your subscription. Cancel anytime.',
  alternates: { canonical: `${base}/pricing` },
  openGraph: {
    url: `${base}/pricing`,
    title: `${SITE_NAME} Pricing — $0.99/month`,
    description:
      'One plan. Full marketplace access. Browse tools free; subscribe at $0.99/month to use features.',
  },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children
}
