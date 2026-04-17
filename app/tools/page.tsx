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
  CircleAlert,
  Zap,
  Table2,
  Inbox,
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
      { name: 'Upsell Generator', slug: 'upsell-generator', icon: TrendingUp },
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
      {
        name: 'Customer Pain Point Extractor',
        slug: 'customer-pain-point-extractor',
        icon: CircleAlert,
      },
    ],
  },
  {
    title: 'Website & Conversion Tools',
    description: 'Landing pages, checkout flow, and on-site conversion',
    tools: [
      { name: 'SEO Meta Tag Generator', slug: 'seo-meta-tag-generator', icon: FileText },
      { name: 'Privacy Policy Generator', slug: 'privacy-policy-generator', icon: FileText },
      { name: 'Terms Generator', slug: 'terms-generator', icon: FileText },
      { name: 'Simple A/B Test Tool', slug: 'simple-ab-test-tool', icon: FileText },
      { name: 'Website Speed Explainer', slug: 'website-speed-explainer', icon: FileText },
      { name: 'Landing Page Copy Generator', slug: 'landing-copy', icon: FileText },
      { name: 'Landing Page Critiquer', slug: 'landing-page-critiquer', icon: FileText },
      { name: 'Checkout Page Optimizer', slug: 'checkout-page-optimizer', icon: ShoppingCart },
    ],
  },
  {
    title: 'Automation Tools (NO-CODE FEEL)',
    description: 'Simple automations you can run without wiring a full backend',
    tools: [
      { name: 'Auto Follow-Up Sender', slug: 'auto-follow-up-sender', icon: Zap },
      {
        name: 'Lead Capture → Email Sequence Tool',
        slug: 'lead-capture-email-sequence',
        icon: Mail,
      },
      {
        name: 'Form → Google Sheet → Email Workflow',
        slug: 'form-google-sheet-email-workflow',
        icon: Table2,
      },
      { name: 'DM → CRM Capture Tool', slug: 'dm-crm-capture', icon: Inbox },
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
    'website-conversion-tools': 'Website & Conversion Tools',
    'automation-tools': 'Automation Tools (NO-CODE FEEL)',
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
  const isFiltered = Boolean(sectionParam && sectionSlugMap[sectionParam])

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_55%)]" />
      <div className="relative mx-auto w-full max-w-[100rem] px-4 py-14 sm:px-6">
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="mb-2 text-3xl font-extrabold text-white sm:text-4xl">
            {isFiltered ? sectionSlugMap[sectionParam!] : 'Tool categories'}
          </h1>
          <p className="text-base text-gray-300 sm:text-lg">
            {isFiltered
              ? `${toolCount} tools in this category`
              : `${toolCount} tools across all categories`}
          </p>
        </div>

        <div
          className={
            isFiltered
              ? 'mx-auto grid w-full max-w-3xl grid-cols-1 gap-4 self-start text-left sm:gap-5'
              : 'grid w-full max-w-[100rem] grid-cols-1 gap-4 self-start text-left sm:gap-5 md:grid-cols-2 lg:gap-4 xl:grid-cols-4 xl:gap-6'
          }
        >
          {displaySections.map((section, sectionIdx) => {
            const reverseSlugMap: Record<string, string> = {
              'Creator Growth Tools (HIGH DEMAND)': 'creator-growth-tools',
              'Monetization Tools (MAKE PEOPLE MONEY)': 'monetization-tools',
              'Client / CRM Tools (ALIGNED WITH "FollowThru")':
                'client-crm-tools',
              'Audience & Research Tools (VERY HOT RIGHT NOW)':
                'audience-research-tools',
              'Website & Conversion Tools': 'website-conversion-tools',
              'Automation Tools (NO-CODE FEEL)': 'automation-tools',
            }
            const sectionSlug =
              reverseSlugMap[section.title] ||
              section.title.toLowerCase().replace(/\s+/g, '-')
            const parenIdx = section.title.indexOf(' (')
            const titleMain =
              parenIdx === -1
                ? section.title
                : section.title.slice(0, parenIdx)
            const titleSub =
              parenIdx === -1 ? null : section.title.slice(parenIdx + 1)
            return (
              <div
                key={sectionIdx}
                id={sectionSlug}
                className="min-w-0 scroll-mt-8 rounded-lg border border-white/30 p-3 text-left sm:p-4 lg:p-3.5 xl:p-4"
              >
                <div className="text-base font-bold leading-snug sm:text-lg lg:text-base xl:text-xl">
                  <p className="break-words">{titleMain}</p>
                  {titleSub ? (
                    <p className="break-words text-balance">{titleSub}</p>
                  ) : null}
                </div>
                {section.description ? (
                  <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                    {section.description}
                  </p>
                ) : null}
                <ul className="mt-3.5 space-y-1 text-xs font-medium text-gray-200 sm:mt-4 sm:space-y-1.5 sm:text-sm lg:text-xs xl:text-sm">
                  {section.tools.map((tool) => {
                    const needsCredits = requiresCredits(tool.slug)
                    const creditCost = getToolCreditCost(tool.slug)
                    return (
                      <li
                        key={tool.slug}
                        className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1"
                      >
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="min-w-0 flex-1 hover:underline"
                        >
                          {tool.name}
                        </Link>
                        {needsCredits && creditCost != null && (
                          <span className="shrink-0 rounded border border-yellow-500/50 bg-yellow-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-200 sm:text-xs">
                            {creditCost} credits/use
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
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
        <div className="min-h-screen bg-black py-12 px-4 text-white">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ToolsPageContent />
    </Suspense>
  )
}
