import type { Metadata } from 'next'
import Script from 'next/script'
import HomeMarketing from '@/components/HomeMarketing'
import { getLifepack365Url, getSiteUrl, SITE_DESCRIPTION, SITE_NAME, SITE_WINDOW_TITLE } from '@/lib/siteConfig'

export const dynamic = 'force-dynamic'

const base = getSiteUrl()

export const metadata: Metadata = {
  title: SITE_WINDOW_TITLE,
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: `${base}/`,
  },
  openGraph: {
    url: `${base}/`,
    title: `${SITE_NAME} — creator & business tools`,
    description: SITE_DESCRIPTION,
  },
}

export default function RootPage() {
  const lifepack = getLifepack365Url()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: base,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: 'en-US',
        publisher: { '@id': `${base}/#org` },
        ...(lifepack
          ? {
              mentions: {
                '@type': 'WebSite',
                name: 'LifePack365',
                url: lifepack,
              },
            }
          : {}),
      },
      {
        '@type': 'Organization',
        '@id': `${base}/#org`,
        name: SITE_NAME,
        url: base,
        description: SITE_DESCRIPTION,
        logo: `${base}/favicon.svg`,
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${base}/#app`,
        name: SITE_NAME,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: base,
        description: SITE_DESCRIPTION,
        offers: {
          '@type': 'Offer',
          price: '0.99',
          priceCurrency: 'USD',
          url: `${base}/pricing`,
        },
        publisher: { '@id': `${base}/#org` },
      },
    ],
  }

  return (
    <>
      <Script
        id="tm365-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeMarketing />
    </>
  )
}
