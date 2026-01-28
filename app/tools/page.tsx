'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Calendar, 
  Sparkles, 
  BarChart3, 
  Clock, 
  Lightbulb, 
  FolderOpen, 
  RefreshCw, 
  TrendingUp, 
  Hash, 
  Image, 
  Link as LinkIcon, 
  Mic, 
  Type, 
  Calculator, 
  DollarSign, 
  Search, 
  Video, 
  Eye,
  Palette,
  FileCheck,
  User,
  Sparkles as SparklesIcon,
  Coins
} from 'lucide-react'
import { getToolCreditCost, requiresCredits } from '@/lib/tool-credit-costs'

type SocialPlatform = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'linkedin' | 'facebook'

const allPlatforms: SocialPlatform[] = ['instagram', 'tiktok', 'youtube', 'twitter', 'linkedin', 'facebook']

const toolPlatforms: Record<string, SocialPlatform[]> = {
  // Scheduling & workflow
  'instagram-scheduler': ['instagram'],
  'social-scheduler': allPlatforms,
  'content-calendar': allPlatforms,
  'best-time-to-post': allPlatforms,

  // Visuals & graphics
  'social-graphics': allPlatforms,
  'thumbnail-text-generator': allPlatforms,
  'quote-card-generator': allPlatforms,

  // Video-focused tools
  'video-script-generator': ['instagram', 'tiktok', 'youtube'],
  'video-transcript-generator': ['instagram', 'tiktok', 'youtube'],

  // Writing & captions
  'ai-caption-generator': allPlatforms,
  'podcast-show-notes-generator': allPlatforms,
  'blog-outline-generator': allPlatforms,
  'bio-generator': allPlatforms,
  'social-media-post-formatter': allPlatforms,

  // Analytics & insights
  'engagement-calculator': allPlatforms,
  'viral-content-predictor': allPlatforms,
  'hashtag-research': allPlatforms,
  'hashtag-analyzer': allPlatforms,
  'social-media-report-generator': allPlatforms,
  'competitor-analyzer': allPlatforms,
  'trend-tracker': allPlatforms,
  'content-gap-analyzer': allPlatforms,
  'brand-mention-tracker': allPlatforms,
  'sentiment-analyzer': allPlatforms,
  'follower-growth-tracker': allPlatforms,
  'cross-platform-analytics': allPlatforms,

  // Brand & profile
  'brand-kit-manager': allPlatforms,
  'color-palette-extractor': allPlatforms,
  'font-pairing-tool': allPlatforms,
  'style-guide-creator': allPlatforms,
  'profile-optimizer': allPlatforms,

  // Business & monetization
  'rate-calculator': allPlatforms,
  'revenue-tracker': allPlatforms,

  // Growth & engagement
  'poll-question-generator': allPlatforms,
  'giveaway-manager': allPlatforms,
  'influencer-outreach-tool': allPlatforms,
  'collaboration-manager': allPlatforms,
  'link-in-bio-manager': allPlatforms,
  'link-in-bio-optimizer': allPlatforms,

  // SEO & accessibility
  'seo-optimizer': allPlatforms,
  'image-alt-text-generator': allPlatforms,
  'readability-checker': allPlatforms,

  // Library & workflow
  'content-library': allPlatforms,
  'content-repurposer': allPlatforms,
  'post-scheduler': allPlatforms,
}

const getToolPlatforms = (slug: string): SocialPlatform[] => {
  return toolPlatforms[slug] || allPlatforms
}

const toolMatchesPlatform = (slug: string, platform: SocialPlatform | null): boolean => {
  if (!platform) return true
  return getToolPlatforms(slug).includes(platform)
}

const toolSections = [
  {
    title: 'High Priority - Complete the Workflow',
    description: 'Essential tools to complete your content creation workflow',
    tools: [
      { name: 'Post Scheduler', slug: 'post-scheduler', icon: Calendar },
      { name: 'Analytics Dashboard', slug: 'analytics-dashboard', icon: BarChart3 },
      { name: 'SEO Optimizer', slug: 'seo-optimizer', icon: Search },
      { name: 'Content Repurposer', slug: 'content-repurposer', icon: RefreshCw },
      { name: 'AI Caption Generator', slug: 'ai-caption-generator', icon: Sparkles },
    ]
  },
  {
    title: 'Content Creation & Optimization',
    description: 'Tools for creating and optimizing content across formats',
    tools: [
      { name: 'Video Script Generator', slug: 'video-script-generator', icon: Video },
      { name: 'Video Transcript Generator', slug: 'video-transcript-generator', icon: Video },
      { name: 'Thumbnail Text Generator', slug: 'thumbnail-text-generator', icon: Type },
      { name: 'Quote Card Generator', slug: 'quote-card-generator', icon: Type },
      { name: 'Image Alt Text Generator', slug: 'image-alt-text-generator', icon: Image },
      { name: 'Podcast Show Notes Generator', slug: 'podcast-show-notes-generator', icon: Mic },
      { name: 'Blog Outline Generator', slug: 'blog-outline-generator', icon: Lightbulb },
      { name: 'Readability Checker', slug: 'readability-checker', icon: Eye },
      { name: 'Content Idea Generator', slug: 'content-idea-generator', icon: Lightbulb },
    ]
  },
  {
    title: 'Brand & Design',
    description: 'Create and manage your brand identity, colors, fonts, and style guides',
    tools: [
      { name: 'Social Media Graphics Tool', slug: 'social-graphics', icon: Image },
      { name: 'Brand Kit Manager', slug: 'brand-kit-manager', icon: Palette },
      { name: 'Color Palette Extractor', slug: 'color-palette-extractor', icon: Image },
      { name: 'Font Pairing Tool', slug: 'font-pairing-tool', icon: Type },
      { name: 'Style Guide Creator', slug: 'style-guide-creator', icon: FileCheck },
      { name: 'Profile Optimizer', slug: 'profile-optimizer', icon: User },
      { name: 'Bio Generator', slug: 'bio-generator', icon: SparklesIcon },
    ]
  },
  {
    title: 'Analytics & Insights',
    description: 'Track performance and gain insights into your content',
    tools: [
      { name: 'Viral Content Predictor', slug: 'viral-content-predictor', icon: Sparkles },
      { name: 'Engagement Calculator', slug: 'engagement-calculator', icon: TrendingUp },
      { name: 'Social Media Report Generator', slug: 'social-media-report-generator', icon: FileText },
      { name: 'Hashtag Analyzer', slug: 'hashtag-analyzer', icon: Hash },
      { name: 'Hashtag Research', slug: 'hashtag-research', icon: Hash },
      { name: 'Competitor Analyzer', slug: 'competitor-analyzer', icon: BarChart3 },
      { name: 'Trend Tracker', slug: 'trend-tracker', icon: TrendingUp },
      { name: 'Content Gap Analyzer', slug: 'content-gap-analyzer', icon: Lightbulb },
      { name: 'Brand Mention Tracker', slug: 'brand-mention-tracker', icon: BarChart3 },
      { name: 'Sentiment Analyzer', slug: 'sentiment-analyzer', icon: BarChart3 },
      { name: 'Follower Growth Tracker', slug: 'follower-growth-tracker', icon: TrendingUp },
      { name: 'Cross-Platform Analytics', slug: 'cross-platform-analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'Business & Monetization',
    description: 'Track revenue and calculate rates for your work',
    tools: [
      { name: 'Rate Calculator', slug: 'rate-calculator', icon: Calculator },
      { name: 'Revenue Tracker', slug: 'revenue-tracker', icon: DollarSign },
    ]
  },
  {
    title: 'Engagement & Growth',
    description: 'Tools to grow your audience and increase engagement',
    tools: [
      { name: 'AI Lead Follow-Up Agent', slug: 'ai-lead-follow-up-agent', icon: Sparkles },
      { name: 'Poll / Question Generator', slug: 'poll-question-generator', icon: Lightbulb },
      { name: 'Giveaway Manager', slug: 'giveaway-manager', icon: Calendar },
      { name: 'Influencer Outreach Tool', slug: 'influencer-outreach-tool', icon: FileText },
      { name: 'Collaboration Manager', slug: 'collaboration-manager', icon: Calendar },
      { name: 'Link in Bio Manager', slug: 'link-in-bio-manager', icon: LinkIcon },
      { name: 'Link in Bio Optimizer', slug: 'link-in-bio-optimizer', icon: LinkIcon },
    ]
  },
  {
    title: 'SEO & Optimization',
    description: 'Optimize your content for search engines and discoverability',
    tools: [
      { name: 'SEO Optimizer', slug: 'seo-optimizer', icon: Search },
      { name: 'Hashtag Research', slug: 'hashtag-research', icon: Hash },
      { name: 'Image Alt Text Generator', slug: 'image-alt-text-generator', icon: Image },
      { name: 'Readability Checker', slug: 'readability-checker', icon: Eye },
    ]
  },
  {
    title: 'Workflow & Productivity',
    description: 'Tools to organize, plan, and manage your content workflow',
    tools: [
      { name: 'Content Calendar', slug: 'content-calendar', icon: Calendar },
      { name: 'Content Library', slug: 'content-library', icon: FolderOpen },
      { name: 'Social Media Post Formatter', slug: 'social-media-post-formatter', icon: FileText },
      { name: 'Social Scheduler', slug: 'social-scheduler', icon: Calendar },
      { name: 'Instagram Scheduler', slug: 'instagram-scheduler', icon: Calendar },
      { name: 'Best Time to Post', slug: 'best-time-to-post', icon: Clock },
    ]
  },
]

function ToolsPageContent() {
  const searchParams = useSearchParams()
  const sectionParam = searchParams.get('section')
  const planParam = searchParams.get('plan')
  const platformParam = searchParams.get('platform') as SocialPlatform | null

  const validPlatforms: SocialPlatform[] = ['instagram', 'tiktok', 'youtube', 'twitter', 'linkedin', 'facebook']
  const activePlatform: SocialPlatform | null =
    platformParam && validPlatforms.includes(platformParam as SocialPlatform)
      ? (platformParam as SocialPlatform)
      : null

  // Plan to tool slugs mapping
  const planToolSlugs: { [key: string]: string[] } = {
    starter: [
      'ai-caption-generator',
      'content-idea-generator',
      'hashtag-research',
      'content-calendar',
      'best-time-to-post',
      'readability-checker',
      'bio-generator',
      'content-library',
    ],
    essential: [
      'ai-caption-generator',
      'content-idea-generator',
      'hashtag-research',
      'content-calendar',
      'best-time-to-post',
      'readability-checker',
      'bio-generator',
      'content-library',
      'post-scheduler',
      'analytics-dashboard',
      'seo-optimizer',
      'content-repurposer',
      'video-script-generator',
      'blog-outline-generator',
      'engagement-calculator',
      'hashtag-analyzer',
      'social-media-report-generator',
      'social-graphics',
    ],
    professional: [
      'ai-caption-generator',
      'content-idea-generator',
      'hashtag-research',
      'content-calendar',
      'best-time-to-post',
      'readability-checker',
      'bio-generator',
      'content-library',
      'post-scheduler',
      'analytics-dashboard',
      'seo-optimizer',
      'content-repurposer',
      'video-script-generator',
      'blog-outline-generator',
      'engagement-calculator',
      'hashtag-analyzer',
      'social-media-report-generator',
      'viral-content-predictor',
      'video-transcript-generator',
      'thumbnail-text-generator',
      'quote-card-generator',
      'image-alt-text-generator',
      'podcast-show-notes-generator',
      'competitor-analyzer',
      'trend-tracker',
      'content-gap-analyzer',
      'brand-mention-tracker',
      'sentiment-analyzer',
      'follower-growth-tracker',
      'cross-platform-analytics',
      'social-graphics',
      'brand-kit-manager',
      'color-palette-extractor',
      'font-pairing-tool',
      'style-guide-creator',
      'profile-optimizer',
      'rate-calculator',
      'revenue-tracker',
      'poll-question-generator',
      'giveaway-manager',
      'influencer-outreach-tool',
      'collaboration-manager',
      'link-in-bio-manager',
      'link-in-bio-optimizer',
      'social-media-post-formatter',
      'social-scheduler',
      'instagram-scheduler',
    ],
    creator: [], // All tools
    business: [], // All tools
  }

  // Generate slug map
  const sectionSlugMap: { [key: string]: string } = {
    'high-priority-complete-the-workflow': 'High Priority - Complete the Workflow',
    'content-creation-optimization': 'Content Creation & Optimization',
    'brand-design': 'Brand & Design',
    'analytics-insights': 'Analytics & Insights',
    'business-monetization': 'Business & Monetization',
    'engagement-growth': 'Engagement & Growth',
    'seo-optimization': 'SEO & Optimization',
    'workflow-productivity': 'Workflow & Productivity',
  }

  // Get all tools as a map
  const allToolsMap = new Map()
  toolSections.forEach(section => {
    section.tools.forEach(tool => {
      if (!allToolsMap.has(tool.slug)) {
        allToolsMap.set(tool.slug, tool)
      }
    })
  })

  // Filter by plan if plan parameter is provided
  let filteredSections = toolSections
  if (planParam && planToolSlugs[planParam]) {
    const allowedSlugs = planToolSlugs[planParam]
    // If plan has empty array (creator/business), show all tools
    if (allowedSlugs.length > 0) {
      filteredSections = toolSections
        .map(section => ({
          ...section,
          tools: section.tools.filter(tool => allowedSlugs.includes(tool.slug)),
        }))
        .filter(section => section.tools.length > 0)
    }
  }

  // Filter by social platform if platform parameter is provided
  if (activePlatform) {
    filteredSections = filteredSections
      .map(section => ({
        ...section,
        tools: section.tools.filter(tool => toolMatchesPlatform(tool.slug, activePlatform)),
      }))
      .filter(section => section.tools.length > 0)
  }

  // Filter sections if section parameter is provided
  const displaySections = sectionParam && sectionSlugMap[sectionParam]
    ? filteredSections.filter(section => section.title === sectionSlugMap[sectionParam])
    : filteredSections

  // Remove duplicates (some tools appear in multiple sections)
  const allTools = new Map()
  displaySections.forEach(section => {
    section.tools.forEach(tool => {
      if (!allTools.has(tool.slug)) {
        allTools.set(tool.slug, tool)
      }
    })
  })

  const planDisplayNames: { [key: string]: string } = {
    starter: 'Starter Plan',
    essential: 'Essential Plan',
    professional: 'Professional Plan',
    creator: 'Creator Plan',
    business: 'Business Plan',
  }

  const platformFilters: { id: 'all' | SocialPlatform; label: string }[] = [
    { id: 'all', label: 'All Platforms' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'twitter', label: 'Twitter / X' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'facebook', label: 'Facebook' },
  ]

  const buildPlatformHref = (platformId: 'all' | SocialPlatform) => {
    const params = new URLSearchParams()

    if (planParam) params.set('plan', planParam)
    if (sectionParam) params.set('section', sectionParam)
    if (platformId !== 'all') params.set('platform', platformId)

    const query = params.toString()
    return query ? `/tools?${query}` : '/tools'
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-mono-950 dark:text-mono-50 mb-4">
            {planParam 
              ? `${planDisplayNames[planParam] || planParam.charAt(0).toUpperCase() + planParam.slice(1)} Tools`
              : sectionParam 
                ? sectionSlugMap[sectionParam] || 'All Tools' 
                : 'All Tools'
            }
          </h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">
            {planParam
              ? `${Array.from(allTools.values()).length} tools included in this plan`
              : sectionParam 
                ? `${displaySections[0]?.tools.length || 0} tools in this section`
                : `${Array.from(allTools.values()).length} professional tools for content creators`
            }
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            {planParam && (
              <>
                <Link
                  href="/tools"
                  className="text-accent-600 dark:text-accent-400 hover:underline"
                >
                  View All Tools
                </Link>
                <span className="text-mono-400">|</span>
                <Link
                  href="/pricing"
                  className="text-accent-600 dark:text-accent-400 hover:underline"
                >
                  View Plans
                </Link>
              </>
            )}
            {sectionParam && !planParam && (
              <Link
                href="/tools"
                className="text-accent-600 dark:text-accent-400 hover:underline"
              >
                ← View All Sections
              </Link>
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {platformFilters.map(platform => {
              const isActive = platform.id === (activePlatform ?? 'all')
              return (
                <Link
                  key={platform.id}
                  href={buildPlatformHref(platform.id)}
                  className={[
                    'px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors',
                    isActive
                      ? 'bg-accent-600 text-white border-accent-600'
                      : 'bg-white dark:bg-mono-900 text-mono-700 dark:text-mono-200 border-mono-200 dark:border-mono-700 hover:bg-mono-100 dark:hover:bg-mono-800',
                  ].join(' ')}
                >
                  {platform.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Credit Cost Info Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
          <div className="flex items-start space-x-3">
            <Coins className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Premium Tools:</strong> Some tools require credits per use (shown with a <span className="inline-flex items-center"><Coins className="inline h-3 w-3 text-yellow-600 dark:text-yellow-400 mx-0.5" /> badge</span>). 
                All plans include 25 free credits/month. <Link href="/credits" className="underline font-semibold hover:text-blue-800 dark:hover:text-blue-100">View all credit costs →</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displaySections.map((section, sectionIdx) => {
            // Generate slug to match homepage links
            const reverseSlugMap: { [key: string]: string } = {
              'High Priority - Complete the Workflow': 'high-priority-complete-the-workflow',
              'Content Creation & Optimization': 'content-creation-optimization',
              'Brand & Design': 'brand-design',
              'Analytics & Insights': 'analytics-insights',
              'Business & Monetization': 'business-monetization',
              'Engagement & Growth': 'engagement-growth',
              'SEO & Optimization': 'seo-optimization',
              'Workflow & Productivity': 'workflow-productivity',
            }
            const sectionSlug = reverseSlugMap[section.title] || section.title.toLowerCase().replace(/\s+/g, '-')
            return (
            <div 
              key={sectionIdx} 
              id={sectionSlug}
              className="border border-mono-200 dark:border-mono-700 rounded-lg p-6 scroll-mt-8"
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">
                  {section.title}
                </h2>
                <p className="text-sm text-mono-600 dark:text-mono-400">
                  {section.description}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {section.tools.map(tool => {
                  const needsCredits = requiresCredits(tool.slug)
                  const creditCost = getToolCreditCost(tool.slug)
                  
                  return (
                    <div key={tool.slug} className="flex items-center justify-between">
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 hover:underline transition-colors text-sm flex-1"
                      >
                        {tool.name}
                      </Link>
                      {needsCredits && creditCost && (
                        <div className="flex items-center space-x-1 ml-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded border border-yellow-300 dark:border-yellow-700">
                          <Coins className="h-3 w-3 text-yellow-700 dark:text-yellow-400" />
                          <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
                            {creditCost} credits/use
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function ToolsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-mono-600 dark:text-mono-400">Loading...</p>
        </div>
      </div>
    }>
      <ToolsPageContent />
    </Suspense>
  )
}

