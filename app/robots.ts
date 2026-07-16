import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/siteConfig'

export const dynamic = 'force-static'

const site = getSiteUrl()

/**
 * Crawl rules for Google + AI search crawlers.
 * Sitemap URL always matches NEXT_PUBLIC_SITE_URL / getSiteUrl().
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/account/', '/dashboard/', '/admin/', '/checkout/'],
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/account/', '/dashboard/', '/admin/', '/checkout/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/api/', '/account/', '/dashboard/', '/admin/', '/checkout/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/account/', '/dashboard/', '/admin/', '/checkout/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: ['/api/', '/account/', '/dashboard/', '/admin/', '/checkout/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/', '/account/', '/dashboard/', '/admin/', '/checkout/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/api/', '/account/', '/dashboard/', '/admin/', '/checkout/'],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
  }
}
