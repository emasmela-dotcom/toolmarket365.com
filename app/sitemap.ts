import type { MetadataRoute } from 'next'
import { discoverToolRoutes } from '@/lib/discoverToolRoutes'
import { allLifeToolIds } from '@/lib/lifeTools/metadata'
import { getSiteUrl } from '@/lib/siteConfig'

const baseUrl = getSiteUrl()

function priorityFor(path: string): number {
  if (path === '') return 1
  if (path === '/home' || path === '/pricing' || path === '/categories') return 0.9
  if (path.startsWith('/tools')) return 0.65
  return 0.75
}

function changeFreq(path: string): 'weekly' | 'monthly' | 'daily' {
  if (path === '' || path === '/pricing' || path === '/home') return 'weekly'
  if (path.startsWith('/tools')) return 'weekly'
  return 'monthly'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/contact',
    '/pricing',
    '/home',
    '/assistant',
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

  let toolPaths: string[] = []
  try {
    toolPaths = discoverToolRoutes()
  } catch {
    toolPaths = []
  }

  let lifePaths: string[] = []
  try {
    lifePaths = allLifeToolIds().map((id) => `/tools/life/${id}`)
  } catch {
    lifePaths = []
  }

  const all = [...new Set([...routes, ...toolPaths, ...lifePaths])].sort((a, b) => {
    if (a === '') return -1
    if (b === '') return 1
    return a.localeCompare(b)
  })

  return all.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq(path),
    priority: priorityFor(path),
  }))
}
