import { redirect } from 'next/navigation'

// Map homepage ToolCategories slugs to tools page section slugs (from /tools?section=...)
const slugToSection: Record<string, string> = {
  'video-tools': 'content-creation-optimization',
  'content-planning': 'workflow-productivity',
  'seo-optimization': 'seo-optimization',
  'analytics-dashboard': 'analytics-insights',
  'social-media': 'workflow-productivity',
  'design-suite': 'brand-design',
  'writing-assistant': 'content-creation-optimization',
  'revenue-tracking': 'business-monetization',
  'collaboration': 'engagement-growth',
  'scheduling': 'workflow-productivity',
  'ai-tools': 'content-creation-optimization',
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const section = slugToSection[slug]
  const url = section ? `/tools?section=${section}` : '/tools'
  redirect(url)
}
