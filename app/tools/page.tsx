'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Lightbulb,
  Tv,
  Flame,
  Mail,
  TextQuote,
  Send,
  Wallet,
  Package,
  Calculator,
  FileText,
  TrendingUp,
  ShoppingCart,
  MessageSquareQuote,
  Link2,
  FileSignature,
  Receipt,
  ClipboardList,
  GitBranch,
  BellRing,
  FilePenLine,
  HandCoins,
  ListTodo,
  Users,
  ScanSearch,
  Radar,
  FileSearch,
  Activity,
} from 'lucide-react'
import { getToolCreditCost, requiresCredits } from '@/lib/tool-credit-costs'

/** Only the Creator Growth tools you’ve wired with code in this repo. */
const toolSections = [
  {
    title: 'Creator Growth Tools (HIGH DEMAND)',
    description:
      'Hooks, titles, trends, newsletters, Reddit rewrites, and cold DMs',
    tools: [
      { name: 'Hook Generator', slug: 'hook-generator', icon: Sparkles },
      { name: 'Content Idea Engine', slug: 'content-idea-engine', icon: Lightbulb },
      { name: 'YouTube Title Optimizer', slug: 'youtube-title-optimizer', icon: Tv },
      { name: 'TikTok Trend Finder', slug: 'tiktok-trend-finder', icon: Flame },
      { name: 'Newsletter Topic Generator', slug: 'newsletter-topic-generator', icon: Mail },
      { name: 'Reddit Post Rewriter', slug: 'reddit-post-rewriter', icon: TextQuote },
      { name: 'Cold DM Personalizer', slug: 'cold-dm-personalizer', icon: Send },
    ],
  },
  {
    title: 'Monetization Tools (MAKE PEOPLE MONEY)',
    description: 'Tools focused on direct monetization workflows',
    tools: [
      { name: 'Simple Paywall Link Generator', slug: 'simple-paywall-link-generator', icon: Wallet },
      { name: 'Digital Product Bundle Builder', slug: 'digital-product-bundle-builder', icon: Package },
      { name: 'Pricing Calculator', slug: 'pricing-calculator', icon: Calculator },
      { name: 'Landing Page Copy Generator', slug: 'landing-copy', icon: FileText },
      { name: 'Upsell Generator', slug: 'upsell-generator', icon: TrendingUp },
      { name: 'Checkout Page Optimizer', slug: 'checkout-page-optimizer', icon: ShoppingCart },
      { name: 'Testimonial Collector Tool', slug: 'testimonial-collector-tool', icon: MessageSquareQuote },
      { name: 'Simple Affiliate Link Manager', slug: 'simple-affiliate-link-manager', icon: Link2 },
    ],
  },
  {
    title: 'Client / CRM Tools (ALIGNED WITH "FollowThru")',
    description: '',
    tools: [
      { name: 'Agreement Link Generator', slug: 'agreement-link-generator', icon: FileSignature },
      { name: 'Invoice + Reminder Tool', slug: 'invoice-reminder-tool', icon: Receipt },
      {
        name: 'Client Onboarding Checklist Generator',
        slug: 'client-onboarding-checklist-generator',
        icon: ClipboardList,
      },
      { name: 'Scope Creep Tracker', slug: 'scope-creep-tracker', icon: GitBranch },
      { name: 'Follow-Up Reminder AI', slug: 'follow-up-reminder-ai', icon: BellRing },
      { name: 'Simple Proposal Builder', slug: 'simple-proposal-builder', icon: FilePenLine },
      { name: 'Late Payment Nudger (auto messages)', slug: 'late-payment-nudger', icon: HandCoins },
      {
        name: 'Meeting Summary → Action Items',
        slug: 'meeting-summary-action-items',
        icon: ListTodo,
      },
    ],
  },
  {
    title: 'Audience & Research Tools (VERY HOT RIGHT NOW)',
    description: 'Discover who to target, pain points, channels, and messaging for your niche',
    tools: [
      { name: 'Find My Audience', slug: 'find-my-audience', icon: Users },
      { name: 'Niche Validator', slug: 'niche-validator', icon: ScanSearch },
      { name: 'Competitor Scanner', slug: 'competitor-scanner', icon: Radar },
      {
        name: 'Keyword Opportunity Finder',
        slug: 'keyword-opportunity-finder',
        icon: FileSearch,
      },
      { name: 'Trend Explainer', slug: 'trend-explainer', icon: Activity },
    ],
  },
]

function ToolsPageContent() {
  const searchParams = useSearchParams()
  const sectionParam = searchParams.get('section')

  const sectionSlugMap: Record<string, string> = {
    'creator-growth-tools': 'Creator Growth Tools (HIGH DEMAND)',
    'monetization-tools': 'Monetization Tools (MAKE PEOPLE MONEY)',
    'client-crm-tools': 'Client / CRM Tools (ALIGNED WITH "FollowThru")',
    'audience-research-tools':
      'Audience & Research Tools (VERY HOT RIGHT NOW)',
  }

  const displaySections =
    sectionParam && sectionSlugMap[sectionParam]
      ? toolSections.filter(
          (s) => s.title === sectionSlugMap[sectionParam]
        )
      : toolSections

  const allTools = new Map<string, (typeof toolSections)[0]['tools'][0]>()
  displaySections.forEach((section) => {
    section.tools.forEach((tool) => {
      if (!allTools.has(tool.slug)) allTools.set(tool.slug, tool)
    })
  })

  const toolCount = allTools.size

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-mono-950 dark:text-mono-50 mb-3">
            {sectionParam && sectionSlugMap[sectionParam]
              ? sectionSlugMap[sectionParam]
              : 'Tool categories'}
          </h1>
          <p className="text-lg text-mono-600 dark:text-mono-400">
            {toolCount} tools in this category
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {displaySections.map((section, sectionIdx) => {
            const reverseSlugMap: Record<string, string> = {
              'Creator Growth Tools (HIGH DEMAND)': 'creator-growth-tools',
              'Monetization Tools (MAKE PEOPLE MONEY)': 'monetization-tools',
              'Client / CRM Tools (ALIGNED WITH "FollowThru")':
                'client-crm-tools',
              'Audience & Research Tools (VERY HOT RIGHT NOW)':
                'audience-research-tools',
            }
            const sectionSlug =
              reverseSlugMap[section.title] ||
              section.title.toLowerCase().replace(/\s+/g, '-')
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
                  {section.description ? (
                    <p className="text-sm text-mono-600 dark:text-mono-400">
                      {section.description}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  {section.tools.map((tool) => {
                    const needsCredits = requiresCredits(tool.slug)
                    const creditCost = getToolCreditCost(tool.slug)
                    return (
                      <div
                        key={tool.slug}
                        className="flex items-center justify-between gap-2"
                      >
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 hover:underline transition-colors text-sm flex-1 text-left"
                        >
                          {tool.name}
                        </Link>
                        {needsCredits && creditCost != null && (
                          <div className="flex items-center space-x-1 ml-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded border border-yellow-300 dark:border-yellow-700 shrink-0">
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-mono-600 dark:text-mono-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ToolsPageContent />
    </Suspense>
  )
}
