'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles, Zap, ArrowRight, Info, Loader2 } from 'lucide-react';
import { GUMROAD_LINKS } from '@/lib/gumroad-config'
import {
  TOOL_CREDIT_COSTS,
  displayNameForCreditTool,
  getToolUseExplanation,
  TOPUP_USD_PER_CREDIT,
  usdPerUseFromCredits,
} from '@/lib/tool-credit-costs'

const creditPricedToolRows = Object.entries(TOOL_CREDIT_COSTS)
  .map(([slug, credits]) => ({
    slug,
    name: displayNameForCreditTool(slug),
    credits,
    usd: usdPerUseFromCredits(credits),
    explanation: getToolUseExplanation(slug),
  }))
  .sort((a, b) => b.credits - a.credits || a.name.localeCompare(b.name))

const plans = [
  {
    name: 'Starter',
    price: '$19',
    period: '/month',
    description: 'For individuals getting consistent with publishing and client ops.',
    popular: false,
    toolCount: '100 credits included',
    tools: [
      'Core creator, workflow, and client tools',
      'Credit-priced tools available pay-per-use',
      'Great for lighter monthly usage',
    ],
    features: [
      '100 monthly credits included',
      '5 free tool uses right after signup',
      'Use credits across premium tools',
      'Email support',
    ],
    cta: 'Subscribe Now',
    ctaLink: GUMROAD_LINKS.subscriptions.starter,
    gumroad: true,
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    description: 'Best value for active creators and operators.',
    popular: true,
    toolCount: '400 credits included',
    tools: [
      'Everything in Starter',
      'Higher monthly usage capacity',
      'Best price-per-credit for most users',
    ],
    features: [
      '400 monthly credits included',
      'Priority support',
      '5 free tool uses right after signup',
      'Top-up anytime if needed',
    ],
    cta: 'Subscribe Now',
    ctaLink: GUMROAD_LINKS.subscriptions.professional,
    gumroad: true,
    savings: 'Recommended plan for most users',
  },
  {
    name: 'Business',
    price: '$99',
    period: '/month',
    description: 'For teams, agencies, and heavy monthly usage.',
    popular: false,
    toolCount: '1,000 credits included',
    tools: [
      'Everything in Professional',
      'Higher usage ceiling for teams',
      'Operational headroom for multi-client workflows',
    ],
    features: [
      '1,000 monthly credits included',
      'Team-oriented usage capacity',
      'Priority support',
      '5 free tool uses right after signup',
    ],
    cta: 'Subscribe Now',
    ctaLink: GUMROAD_LINKS.subscriptions.business,
    gumroad: true,
  },
]

const toolDistribution = {
  starter: [
    '100 credits included',
    'Good for light monthly usage',
    '5 free tool uses after signup',
  ],
  professional: [
    '400 credits included',
    'Best value for active usage',
    'Includes 5 free tool uses after signup',
  ],
  business: [
    '1,000 credits included',
    'Best for teams and heavy usage',
    'Includes 5 free tool uses after signup',
  ],
  topups: [
    '$10 for 50 credits',
    'Credits roll over month to month',
    'Buy anytime if you run out before renewal',
  ],
  legacy: [
    'Everything in Starter',
    'Legacy keys kept to avoid runtime shape changes',
  ],
}

const faq = [
  {
    question: 'Is there a free trial?',
    answer: 'After signup, every account gets 5 free tool uses to test the product. No credit card needed to start.',
  },
  {
    question: 'How do credits work?',
    answer: 'Every tool run consumes credits based on per-use cost. Plans include monthly credits (Starter 100, Professional 400, Business 1,000).',
  },
  {
    question: 'What tools are in each plan?',
    answer: 'All plans can access the same marketplace; the difference is included monthly credits and support level.',
  },
  {
    question: 'What if I run out of credits?',
    answer: 'Buy top-up credits anytime. Top-ups are priced at $10 for 50 credits and roll over.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, cancel anytime with no penalties. Your access continues until the end of your billing period.',
  },
  {
    question: 'What makes ToolMarket365 different?',
    answer: 'We\'re the only platform with Viral Content Predictor, integrated workflow, and 53+ tools in one place. Most competitors have 3-10 tools and charge $200+/month for everything.',
  },
]

const useStripe = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

export default function PricingPage() {
  const [creditLoading, setCreditLoading] = useState<string | null>(null)

  const handleBuyCredits = async (bundleId: 'bundle50' | 'bundle100' | 'bundle250') => {
    if (useStripe) {
      setCreditLoading(bundleId)
      try {
        const res = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'credits', bundleId }),
        })
        const data = await res.json()
        if (data?.url) {
          window.location.href = data.url
          return
        }
      } catch (e) {
        console.error('Stripe checkout failed:', e)
      }
      setCreditLoading(null)
    }
    window.location.href = GUMROAD_LINKS.credits[bundleId]
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent-50 to-white dark:from-mono-900 dark:to-mono-950 py-16 border-b border-mono-200 dark:border-mono-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-mono-950 dark:text-mono-50 mb-6">
              Simple, Affordable Pricing
            </h1>
            <p className="text-xl text-mono-600 dark:text-mono-400 mb-3">
              Start at $19/month. Grow with predictable per-use credits.
            </p>
            <p className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-4">
              Everything you need to run your creator operation in one place.
            </p>
            
            {/* Competitive Savings Banner */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-400 dark:border-green-600 rounded-lg p-6 max-w-4xl mx-auto mb-6">
              <div className="text-center mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-mono-950 dark:text-mono-50 mb-2">
                  💰 Save $159+/Month vs Buying Separately
                </h3>
                <p className="text-sm sm:text-base text-mono-700 dark:text-mono-300">
                  Later ($18) + Jasper AI ($49) + Canva ($13) + Analytics ($99) = $179+/month
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700 text-mono-950 dark:text-mono-100">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">79%</div>
                  <div className="text-xs font-medium text-mono-800 dark:text-mono-200">Cheaper</div>
                </div>
                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700 text-mono-950 dark:text-mono-100">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">53+</div>
                  <div className="text-xs font-medium text-mono-800 dark:text-mono-200">Tools vs 3-10</div>
                </div>
                <div className="bg-white dark:bg-mono-900 rounded-lg p-4 border border-mono-200 dark:border-mono-700 text-mono-950 dark:text-mono-100">
                  <div className="text-lg font-bold text-accent-600 dark:text-accent-400 mb-1">⭐ Only Us</div>
                  <div className="text-xs font-medium text-mono-800 dark:text-mono-200">Viral Predictor</div>
                </div>
              </div>
              
              {/* Transparency Statement */}
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-5">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      <strong>Our Promise:</strong> ToolMarket365 is the all-in-one solution. While each competitor may be stronger in their specialty, ToolMarket365 offers everything integrated at a better price.
                    </p>
                    <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                      💡 Verify our claims: Check competitor pricing (Jasper AI, Canva, Analytics tools) and compare features yourself. We stand behind every statement—research and confirm.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-lg text-mono-600 dark:text-mono-400 mb-6">
              All new accounts include <span className="font-semibold text-accent-600 dark:text-accent-400">5 free tool uses after signup</span>
            </p>
            
            {/* Interface Setup Banner - placed near plan selection */}
            <section className="py-3 bg-mono-900 border-y border-mono-800 rounded-lg mt-4">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <p className="text-sm sm:text-base text-mono-50">
                    <span className="font-semibold">
                      To unlock the full power of ToolMarket365, complete your interface setup.
                    </span>{' '}
                    This ensures your tools can run at 100%, and gives every piece of content a dedicated place to be stored,
                    organized, and handled on your behalf.
                  </p>
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md bg-accent-600 text-white hover:bg-accent-700 transition-colors whitespace-nowrap"
                  >
                    Complete your setup
                  </Link>
                </div>
              </div>
            </section>

            {/* Important Notice */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-6 max-w-3xl mx-auto">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-yellow-900 dark:text-yellow-200 mb-2">
                    Important: Your Content During Trial
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
                    <strong>After signup:</strong> You get 5 free tool uses to test core workflows before paying.
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
                    <strong>After trial ends:</strong>
                  </p>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1 ml-4 list-disc">
                    <li><strong className="text-green-700 dark:text-green-400">Subscribe with credit card:</strong> Keep all content created during trial</li>
                    <li><strong className="text-red-700 dark:text-red-400">Don't subscribe:</strong> Your account will be restored to pre-trial state (content created during trial will be removed)</li>
                  </ul>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-3">
                    <strong>Plan Changes:</strong> You can upgrade to a higher plan anytime, but you cannot downgrade from your selected plan when trial completes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan model explanation */}
      <section className="py-12 bg-mono-100 dark:bg-mono-900 border-b border-mono-200 dark:border-mono-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-3">
                    Credit Plans Built for Usage Level
                  </h2>
                  <p className="text-base text-mono-700 dark:text-mono-300 mb-4 leading-relaxed">
                    Every tool in each plan is <strong className="text-blue-700 dark:text-blue-100">intentionally selected</strong> to match the sophistication level and needs of creators at that stage. We don't just give you random tools—we give you the <strong className="text-blue-700 dark:text-blue-100">right tools for where you are</strong> in your creator journey.
                  </p>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-mono-950 dark:text-mono-50">Starter = 100 credits / month</p>
                        <p className="text-sm text-mono-600 dark:text-mono-400">Great for lighter monthly usage and focused tool runs.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-mono-950 dark:text-mono-50">Professional = 400 credits / month</p>
                        <p className="text-sm text-mono-600 dark:text-mono-400">Best value for active creators who use tools daily.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-mono-950 dark:text-mono-50">Business = 1,000 credits / month</p>
                        <p className="text-sm text-mono-600 dark:text-mono-400">Built for teams, agencies, and heavy-volume operations.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-mono-950 dark:text-mono-50">Top-up Credits = $10 for 50</p>
                        <p className="text-sm text-mono-600 dark:text-mono-400">If you run out before renewal, buy more and keep going.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-100 font-medium mb-3">
                      💡 <strong>Why this matters:</strong> You get tools that match your experience level—no confusion, no overwhelm, just the right features for where you are right now.
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-100">
                      🔌 <strong>API Access:</strong> Available to <strong>all plans</strong>. Connect ToolMarket365 to external services and build custom integrations. You pay for your own API usage—ToolMarket365 never charges for API access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Notice */}
      <section className="py-8 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-lg border border-blue-200 bg-white p-6 text-mono-950 dark:border-blue-800 dark:bg-mono-900 dark:text-mono-100">
              <div className="flex items-start space-x-3">
                <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Transparency Notice
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-100">
                    ToolMarket365 provides everything we can offer at no extra cost beyond your subscription fee. Some advanced tools, however, need external API integrations (e.g. Instagram API, OpenAI) to run at full capacity—beyond what we provide as standard. Those services charge their own fees, which you pay directly to them; ToolMarket365 never marks up or charges for third-party API usage. We only track usage for analytics purposes. This setup gives you flexibility to choose which external services you want to use, while keeping your ToolMarket365 subscription cost predictable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-lg border-2 bg-white p-6 text-mono-950 dark:bg-mono-900 dark:text-mono-100 ${
                    plan.popular
                      ? 'border-accent-500 shadow-lg lg:scale-105'
                      : 'border-mono-200 dark:border-mono-700'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-mono-950 dark:text-mono-100 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-mono-600 dark:text-mono-300 mb-3">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-mono-950 dark:text-mono-100">
                        {plan.price}
                      </span>
                      <span className="text-mono-600 dark:text-mono-300 ml-1 text-sm">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-xs text-mono-600 dark:text-mono-300 mt-1">
                      {plan.toolCount}
                    </p>
                    {plan.savings && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                        {plan.savings}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6 min-h-[200px]">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-mono-800 dark:text-mono-200 text-xs leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-4">
                    <Link
                      href={`/home?plan=${plan.name.toLowerCase()}`}
                      className="text-sm text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 hover:underline font-medium flex items-center justify-center"
                    >
                      View All Tools →
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href={`/select-plan?plan=${plan.name.toLowerCase()}`}
                      className={`block w-full text-center py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors ${
                        plan.popular
                          ? 'bg-accent-600 text-white hover:bg-accent-700'
                          : 'bg-mono-100 text-mono-950 hover:bg-mono-200 dark:bg-mono-800 dark:text-mono-50 dark:hover:bg-mono-700'
                      }`}
                    >
                      Choose this plan
                    </Link>
                    <p className="text-xs text-center text-mono-600 dark:text-mono-300">
                      You’ll see Subscribe now or Start trial, plus terms for content during trial
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Plan Clarity Disclaimer */}
            <div className="mt-8 max-w-4xl mx-auto rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
              <p className="font-semibold mb-1">Plan Clarity (Please Read):</p>
              <p>
                Your subscription only includes the tools listed under the plan you choose.
                Tools shown with a <span className="font-semibold">credit badge</span> are <span className="font-semibold">not</span> part of that plan — you can still use them anytime by paying with credits or upgrading your plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credit-priced tools: credits + $ per use */}
      <section className="py-16 bg-mono-50 dark:bg-mono-950 border-y border-mono-200 dark:border-mono-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-2 text-center">
              Price per tool use
            </h2>
            <p className="text-center text-mono-700 dark:text-mono-300 mb-2 max-w-2xl mx-auto">
              Each run of a credit-priced tool spends the credits shown. Dollar amount is an estimate at the
              standard top-up rate: <span className="font-semibold">$10 for 50 credits</span> (
              <span className="font-semibold">${TOPUP_USD_PER_CREDIT.toFixed(2)} per credit</span>).
            </p>
            <p className="text-center text-sm text-mono-600 dark:text-mono-400 mb-8">
              Tools without a credit badge are not charged per run from your credit balance.
            </p>
            <div className="overflow-x-auto rounded-lg border-2 border-mono-200 dark:border-mono-700 bg-white dark:bg-mono-900">
              <table className="w-full text-sm text-left text-mono-950 dark:text-mono-100">
                <thead>
                  <tr className="border-b-2 border-mono-200 dark:border-mono-700 bg-mono-100 dark:bg-mono-800">
                    <th className="p-3 font-semibold">Tool</th>
                    <th className="p-3 font-semibold whitespace-nowrap">
                      Credits / use
                    </th>
                    <th className="p-3 font-semibold whitespace-nowrap">
                      About $ / use
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {creditPricedToolRows.map((row) => (
                    <tr
                      key={row.slug}
                      className="border-b border-mono-200 dark:border-mono-700 last:border-0 bg-white dark:bg-mono-900"
                    >
                      <td className="p-3 align-top">
                        <div className="font-medium">{row.name}</div>
                        <div className="text-xs text-mono-600 dark:text-mono-300 mt-1 max-w-md">
                          {row.explanation}
                        </div>
                      </td>
                      <td className="p-3 align-top font-semibold whitespace-nowrap">
                        {row.credits}
                      </td>
                      <td className="p-3 align-top font-semibold whitespace-nowrap">
                        ${row.usd}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-center text-sm text-mono-700 dark:text-mono-300">
              <Link
                href="/credits"
                className="font-semibold text-accent-600 dark:text-accent-400 underline hover:text-accent-700 dark:hover:text-accent-300"
              >
                Credit costs page →
              </Link>{' '}
              for bundles, welcome uses, and full notes.
            </p>
          </div>
        </div>
      </section>

      {/* Credit Bundles Section */}
      <section className="py-16 bg-gradient-to-b from-mono-50 to-white dark:from-mono-900 dark:to-mono-950 border-b border-mono-200 dark:border-mono-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-4">
                Need More Credits?
              </h2>
              <p className="text-lg text-mono-600 dark:text-mono-400 mb-2">
                All accounts include 5 free tool uses after signup
              </p>
              <p className="text-base text-mono-600 dark:text-mono-400 mb-2">
                <strong>Lower plans:</strong> Premium tools cost credits per use. <strong>Higher plans:</strong> Premium tools included in your plan have unlimited use (no credits needed).
              </p>
              <p className="text-base text-mono-600 dark:text-mono-400">
                Purchase additional credits to unlock more premium tool uses. Purchased credits roll over month to month.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Starter Bundle */}
              <div className="rounded-lg border-2 border-mono-200 bg-white p-6 text-mono-950 hover:shadow-lg transition-shadow dark:border-mono-700 dark:bg-mono-900 dark:text-mono-100">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-mono-950 dark:text-mono-100 mb-2">
                    Starter Bundle
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-mono-950 dark:text-mono-100">$10</span>
                  </div>
                  <p className="text-sm text-mono-700 dark:text-mono-300 mt-1">
                    50 credits
                  </p>
                  <p className="text-xs text-mono-600 dark:text-mono-400 mt-1">$0.20 per credit</p>
                </div>
                <div className="space-y-2 mb-6 min-h-[120px]">
                  <p className="text-sm text-mono-700 dark:text-mono-300 text-center">
                    Perfect for trying premium tools
                  </p>
                  <ul className="text-xs text-mono-700 dark:text-mono-300 space-y-1">
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                      <span>5 uses of Viral Predictor</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                      <span>10 uses of Brand Kit Manager</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                      <span>6 uses of Advanced Analytics</span>
                    </li>
                  </ul>
                </div>
                {useStripe ? (
                  <button
                    type="button"
                    onClick={() => handleBuyCredits('bundle50')}
                    disabled={!!creditLoading}
                    className="w-full py-2.5 px-4 bg-mono-100 dark:bg-mono-800 text-mono-950 dark:text-mono-50 rounded-lg font-semibold text-sm hover:bg-mono-200 dark:hover:bg-mono-700 transition-colors text-center block inline-flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {creditLoading === 'bundle50' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Buy credits
                  </button>
                ) : (
                  <a
                    href={GUMROAD_LINKS.credits.bundle50}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-mono-100 dark:bg-mono-800 text-mono-950 dark:text-mono-50 rounded-lg font-semibold text-sm hover:bg-mono-200 dark:hover:bg-mono-700 transition-colors text-center block"
                  >
                    Buy credits
                  </a>
                )}
              </div>

              {/* Popular Bundle */}
              <div className="relative rounded-lg border-2 border-accent-500 bg-white p-6 text-mono-950 shadow-lg hover:shadow-xl transition-shadow dark:bg-mono-900 dark:text-mono-100">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </span>
                </div>
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-mono-950 dark:text-mono-100 mb-2">Growth Bundle</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-mono-950 dark:text-mono-100">$20</span>
                  </div>
                  <p className="text-sm text-mono-700 dark:text-mono-300 mt-1">
                    100 credits
                  </p>
                  <p className="text-xs text-mono-600 dark:text-mono-400 mt-1">$0.20 per credit</p>
                </div>
                <div className="space-y-2 mb-6 min-h-[120px]">
                  <p className="text-sm text-mono-700 dark:text-mono-300 text-center">
                    Best for steady monthly usage
                  </p>
                  <ul className="text-xs text-mono-700 dark:text-mono-300 space-y-1">
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                      <span>20 uses of Viral Predictor (5 credits each)</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                      <span>20 uses of Brand Kit Manager (5 credits each)</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                      <span>12 uses of Advanced Analytics (8 credits each)</span>
                    </li>
                  </ul>
                </div>
                <a
                  href={GUMROAD_LINKS.credits.bundle100}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-accent-600 text-white rounded-lg font-semibold text-sm hover:bg-accent-700 transition-colors text-center block"
                >
                  Buy credits
                </a>
              </div>

              {/* Power Bundle */}
              <div className="rounded-lg border-2 border-mono-200 bg-white p-6 text-mono-950 hover:shadow-lg transition-shadow dark:border-mono-700 dark:bg-mono-900 dark:text-mono-100">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-mono-950 dark:text-mono-100 mb-2">
                    Power Bundle
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-mono-950 dark:text-mono-100">$45</span>
                  </div>
                  <p className="text-sm text-mono-700 dark:text-mono-300 mt-1">
                    250 credits
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-semibold">Best bulk value</p>
                  <p className="text-xs text-mono-600 dark:text-mono-400 mt-1">$0.18 per credit</p>
                </div>
                <div className="space-y-2 mb-6 min-h-[120px]">
                  <p className="text-sm text-mono-700 dark:text-mono-300 text-center">
                    Best for power users
                  </p>
                  <ul className="text-xs text-mono-700 dark:text-mono-300 space-y-1">
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                      <span>50 uses of Viral Predictor (5 credits each)</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                      <span>50 uses of Brand Kit Manager (5 credits each)</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-3 w-3 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                      <span>31 uses of Advanced Analytics (8 credits each)</span>
                    </li>
                  </ul>
                </div>
                {useStripe ? (
                  <button
                    type="button"
                    onClick={() => handleBuyCredits('bundle250')}
                    disabled={!!creditLoading}
                    className="w-full py-2.5 px-4 bg-mono-100 dark:bg-mono-800 text-mono-950 dark:text-mono-50 rounded-lg font-semibold text-sm hover:bg-mono-200 dark:hover:bg-mono-700 transition-colors text-center block inline-flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {creditLoading === 'bundle250' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Buy credits
                  </button>
                ) : (
                  <a
                    href={GUMROAD_LINKS.credits.bundle250}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-mono-100 dark:bg-mono-800 text-mono-950 dark:text-mono-50 rounded-lg font-semibold text-sm hover:bg-mono-200 dark:hover:bg-mono-700 transition-colors text-center block"
                  >
                    Buy credits
                  </a>
                )}
              </div>
            </div>

            {/* Credit Info Box */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    How Credits Work
                  </h3>
                  <ul className="text-sm text-blue-900 dark:text-blue-100 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Signup bonus:</strong> 5 free tool uses right after account creation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Purchased credits:</strong> Roll over month to month (never expire)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Per-use pricing:</strong> each tool run consumes credits based on that tool’s cost per use.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Example:</strong> Viral Predictor = 10 credits per use</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Distribution Guide */}
      <section className="py-16 bg-white text-mono-950 dark:bg-mono-900 dark:text-mono-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center">
              What Tools Are in Each Plan?
            </h2>
            <p className="text-center text-mono-700 dark:text-mono-300 mb-8 max-w-3xl mx-auto">
              Each plan includes tools specifically curated for creators at that level. Beginner tools for beginners, advanced tools for advanced creators—no overwhelm, just the right tools for your stage.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-lg border border-mono-200 bg-mono-50 p-6 dark:border-mono-700 dark:bg-mono-800">
                <h3 className="font-bold mb-3">Starter - $19/month</h3>
                <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                  {toolDistribution.starter.map((tool, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-accent-600 mr-2">•</span>
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-mono-200 bg-mono-50 p-6 dark:border-mono-700 dark:bg-mono-800">
                <h3 className="font-bold mb-3">Professional - $49/month ⭐</h3>
                <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                  {toolDistribution.professional.map((tool, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-accent-600 mr-2">•</span>
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border-2 border-accent-200 bg-accent-50 p-6 dark:border-accent-800 dark:bg-accent-900/20">
                <h3 className="font-bold mb-3">Business - $99/month</h3>
                <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                  {toolDistribution.business.map((tool: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-accent-600 mr-2">•</span>
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-mono-200 bg-mono-50 p-6 dark:border-mono-700 dark:bg-mono-800">
                <h3 className="font-bold mb-3">Top-up Credits</h3>
                <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                  {toolDistribution.topups.map((tool: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-accent-600 mr-2">•</span>
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Comparison - Prominent */}
      <section className="py-16 bg-gradient-to-b from-accent-50 to-white dark:from-mono-900 dark:to-mono-950 border-b-4 border-accent-600 dark:border-accent-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-2 text-center">
              How We Compare to Competitors
            </h2>
            <p className="text-center text-mono-600 dark:text-mono-400 mb-8">
              See why creators choose ToolMarket365 over Later, Buffer, Hootsuite, and Jasper AI
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="rounded-lg border-2 border-green-500 bg-white p-6 text-mono-950 shadow-lg dark:border-green-600 dark:bg-mono-900 dark:text-mono-100">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2 text-center">79%</div>
                <div className="text-sm font-semibold mb-2 text-center">Cheaper</div>
                <div className="text-xs text-mono-700 dark:text-mono-300 text-center">Save $159+/month vs buying separately</div>
              </div>
              <div className="rounded-lg border-2 border-blue-500 bg-white p-6 text-mono-950 shadow-lg dark:border-blue-600 dark:bg-mono-900 dark:text-mono-100">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 text-center">53+</div>
                <div className="text-sm font-semibold mb-2 text-center">Tools</div>
                <div className="text-xs text-mono-700 dark:text-mono-300 text-center">vs Later (3), Buffer (3), Hootsuite (5)</div>
              </div>
              <div className="rounded-lg border-2 border-accent-500 bg-white p-6 text-mono-950 shadow-lg dark:border-accent-600 dark:bg-mono-900 dark:text-mono-100">
                <div className="text-xl font-bold text-accent-600 dark:text-accent-400 mb-2 text-center">⭐ Only Us</div>
                <div className="text-sm font-semibold mb-2 text-center">Viral Predictor</div>
                <div className="text-xs text-mono-700 dark:text-mono-300 text-center">No competitor has this</div>
              </div>
              <div className="rounded-lg border-2 border-purple-500 bg-white p-6 text-mono-950 shadow-lg dark:border-purple-600 dark:bg-mono-900 dark:text-mono-100">
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2 text-center">🔗 Integrated</div>
                <div className="text-sm font-semibold mb-2 text-center">Workflow</div>
                <div className="text-xs text-mono-700 dark:text-mono-300 text-center">All tools work together</div>
              </div>
            </div>
            <div className="text-center">
              <Link
                href="/compare"
                className="inline-flex items-center px-6 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
              >
                See Full Comparison
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-mono-50 dark:bg-mono-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-4 text-center">
              Why Choose ToolMarket365?
            </h2>
            <p className="text-center text-lg text-mono-600 dark:text-mono-400 mb-8">
              More than a scheduler—we provide everything creators need to run their entire business: content creation, analytics, monetization, and growth.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">
                    Viral Content Predictor
                  </h3>
                  <p className="text-sm text-mono-600 dark:text-mono-400">
                    Unique feature - predict viral potential before posting. Available in Professional+ plans.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Zap className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">
                    Integrated Workflow
                  </h3>
                  <p className="text-sm text-mono-600 dark:text-mono-400">
                    All tools work together seamlessly. No switching between apps.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">
                    Start at $19/month
                  </h3>
                  <p className="text-sm text-mono-600 dark:text-mono-400">
                    Affordable entry point for new creators. Upgrade as you grow.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Check className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">
                    Save $159+/Month
                  </h3>
                  <p className="text-sm text-mono-600 dark:text-mono-400">
                    Buying tools separately costs $238+/month. We're 68% cheaper.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Monetization Help */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                💰 New to Monetization?
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-100">
                Once you know your rates, you'll need a way to get paid. Many creators use{' '}
                <a 
                  href="https://stripe.com/payments" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-100 underline hover:text-blue-800 dark:hover:text-blue-200 font-semibold"
                >
                  Stripe
                </a>
                {' '}to accept payments from brands and clients. Set up your account to start accepting payments.
              </p>
            </div>
            
            <div className="mt-8 text-center">
              <Link
                href="/compare"
                className="text-accent-600 dark:text-accent-400 hover:underline font-medium"
              >
                See how we compare to competitors →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white dark:bg-mono-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faq.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-mono-50 dark:bg-mono-800 rounded-lg p-6 border border-mono-200 dark:border-mono-700"
                >
                  <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-mono-600 dark:text-mono-400 text-sm">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-accent-50 to-white dark:from-mono-900 dark:to-mono-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-mono-600 dark:text-mono-400 mb-4">
              Start your free 7-day trial. No credit card required.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-sm text-blue-900 dark:text-blue-200 text-center">
                <strong>Remember:</strong> Subscribe before trial ends to keep all content you create. 
                If you don't subscribe, your account will be restored to pre-trial state.
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
