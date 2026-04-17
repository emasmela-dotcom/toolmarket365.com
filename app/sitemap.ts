import type { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://creatorflow365.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/contact',
    '/pricing',
    '/home',
    '/templates',
    '/categories',
    '/login',
    '/signup',
    '/privacy',
    '/terms',
    '/credits',
    '/growth-suite',
    '/integrations',
    '/compare',
    '/onboarding',
  ]
  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' || path === '/pricing' ? 'weekly' as const : 'monthly' as const,
    priority: path === '' ? 1 : path === '/home' || path === '/pricing' ? 0.9 : 0.7,
  }))
}
