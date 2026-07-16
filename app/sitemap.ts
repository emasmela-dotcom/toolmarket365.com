import type { MetadataRoute } from 'next'
import { discoverToolRoutes } from '@/lib/discoverToolRoutes'
import { allLifeToolIds } from '@/lib/lifeTools/metadata'
import { allLocalServiceToolIds } from '@/lib/localServiceTools/metadata'
import { getSiteUrl } from '@/lib/siteConfig'

const baseUrl = getSiteUrl()

/** Public marketing / catalog pages (no auth-only app shells). */
const STATIC_ROUTES = [
  '',
  '/about',
  '/assistant',
  '/categories',
  '/compare',
  '/contact',
  '/credits',
  '/growth-suite',
  '/integrations',
  '/login',
  '/marketing-kit',
  '/onboarding',
  '/plan-tools',
  '/pricing',
  '/privacy',
  '/select-plan',
  '/signup',
  '/templates',
  '/terms',
  '/tools',
] as const

function priorityFor(path: string): number {
  if (path === '') return 1
  if (path === '/pricing' || path === '/compare' || path === '/categories' || path === '/tools')
    return 0.9
  if (path === '/select-plan' || path === '/marketing-kit') return 0.85
  if (path.startsWith('/tools/legal')) return 0.8
  if (path.startsWith('/tools')) return 0.7
  return 0.75
}

function changeFreq(path: string): 'weekly' | 'monthly' | 'daily' {
  if (path === '' || path === '/pricing' || path === '/compare' || path === '/tools') return 'weekly'
  if (path.startsWith('/tools')) return 'weekly'
  return 'monthly'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

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

  let localServicePaths: string[] = []
  try {
    localServicePaths = allLocalServiceToolIds().map((id) => `/tools/local/${id}`)
  } catch {
    localServicePaths = []
  }

  const all = [
    ...new Set([...STATIC_ROUTES, ...toolPaths, ...lifePaths, ...localServicePaths]),
  ].sort((a, b) => {
    if (a === '') return -1
    if (b === '') return 1
    return a.localeCompare(b)
  })

  return all.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: changeFreq(path),
    priority: priorityFor(path),
  }))
}
