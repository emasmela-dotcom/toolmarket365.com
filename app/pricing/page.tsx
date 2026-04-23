'use client'

import Link from 'next/link'
import { Check, Sparkles, Zap, ArrowRight, Info } from 'lucide-react';
import { GUMROAD_LINKS } from '@/lib/gumroad-config'

const plans = [
  {
    name: 'Basic',
    /** DB / Gumroad tier key — matches `plans.name` and `/api/plans`. */
    planDbName: 'essential' as const,
    price: '$19',
    period: '/month',
    description: 'Everyday tools + foundational creator tools for consistent execution.',
    popular: false,
    toolCount: 'Core creator toolkit',
    tools: [
      'Foundational creator workflow tools',
      'Built for consistent creation and planning',
      'Clean starting point with real utility',
    ],
    features: [
      'Everyday operations toolkit included',
      'Core creator workflow tools included',
      'Strong starting stack without overwhelm',
      'Email support',
    ],
    cta: 'Subscribe Now',
    ctaLink: GUMROAD_LINKS.subscriptions.essential,
    gumroad: true,
  },
  {
    name: 'Full Creator',
    planDbName: 'professional' as const,
    price: '$49',
    period: '/month',
    description: 'Everything in Basic plus advanced creator and higher AI tools.',
    popular: true,
    toolCount: 'Full creator experience',
    tools: [
      'Everything in Creator',
      'Full creator workflow access',
      'For creators running this as their core stack',
    ],
    features: [
      'Everything in Basic',
      'Advanced creator tools unlocked',
      'Higher AI toolset for scaling output',
      'Priority support',
    ],
    cta: 'Subscribe Now',
    ctaLink: GUMROAD_LINKS.subscriptions.professional,
    gumroad: true,
    savings: 'Full creator tier',
  },
]

const toolDistribution = {
  basic: [
    'Everyday tools for daily operations',
    'Core creator tools for consistency',
    'Built for getting results without complexity',
  ],
  fullCreator: [
    'Everything in Basic',
    'Advanced creator + higher AI tools',
    'Best for creators running this as their core stack',
  ],
}

const aiPowerPack = {
  name: 'AI Power Pack',
  price: '$15',
  period: '/month add-on',
  description:
    'Selective higher AI tools for Basic users who need more output, without moving to Full Creator.',
  features: [
    'Curated higher AI tools (not the full premium AI suite)',
    'Adds targeted power to your current plan',
    'Ideal bridge between Basic and Full Creator',
  ],
}

const faq = [
  {
    question: 'Is there a free trial?',
    answer: 'Start your 7-day trial to test workflows before committing. No credit card needed to start.',
  },
  {
    question: 'Do you use credits?',
    answer: 'No. Plans are structured by included tool sets, and the AI Power Pack is a separate add-on package.',
  },
  {
    question: 'What tools are in each plan?',
    answer: 'Basic includes everyday + core creator tools. Full Creator includes everything in Basic plus advanced creator and higher AI tools.',
  },
  {
    question: 'What is AI Power Pack?',
    answer: 'AI Power Pack is an optional add-on that unlocks a curated subset of higher AI tools for users who want more power without moving to Full Creator.',
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

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-mono-50 text-mono-900 dark:bg-mono-950 dark:text-mono-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent-50 to-white dark:from-mono-900 dark:to-mono-950 py-16 border-b border-mono-200 dark:border-mono-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-mono-950 dark:text-mono-50 mb-6">
              Simple, Affordable Pricing
            </h1>
            <p className="text-xl text-mono-600 dark:text-mono-400 mb-3">
              Start with Basic. Scale into Full Creator when you need more power.
            </p>
            <p className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-4">
              Everything you need to run your creator operation in one place.
            </p>
            
            <p className="text-lg text-mono-600 dark:text-mono-400 mb-6">
              Two core tiers, plus an optional AI Power Pack add-on.
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

            {/* Important Notice — always dark ink on light amber (no light-on-light in dark mode) */}
            <div className="rounded-lg border-2 border-amber-400 bg-amber-50 p-6 text-amber-950 max-w-3xl mx-auto dark:border-amber-600 dark:bg-amber-100 dark:text-amber-950">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-amber-800 dark:text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="mb-2 font-bold text-amber-950 dark:text-amber-950">
                    Important: Your Content During Trial
                  </h3>
                  <p className="mb-2 text-sm text-amber-950/95 dark:text-amber-950">
                    <strong>After signup:</strong> Pick the plan that matches your stage, then expand only when you need more capability.
                  </p>
                  <p className="mb-2 text-sm text-amber-950/95 dark:text-amber-950">
                    <strong>After trial ends:</strong>
                  </p>
                  <ul className="ml-4 list-disc space-y-1 text-sm text-amber-950/95 dark:text-amber-950">
                    <li><strong className="text-green-800 dark:text-green-900">Subscribe with credit card:</strong> Keep all content created during trial</li>
                    <li><strong className="text-red-800 dark:text-red-900">Don't subscribe:</strong> Your account will be restored to pre-trial state (content created during trial will be removed)</li>
                  </ul>
                  <p className="mt-3 text-sm text-amber-950/95 dark:text-amber-950">
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
                    Tool Access Built for Clear Progression
                  </h2>
                  <p className="text-base text-mono-700 dark:text-mono-300 mb-4 leading-relaxed">
                    Every package is <strong className="text-blue-700 dark:text-blue-100">intentionally scoped</strong>: Basic for essential execution, Full Creator for advanced capability, and AI Power Pack for selective higher AI access.
                  </p>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-mono-950 dark:text-mono-50">Basic = Everyday + core creator tools</p>
                        <p className="text-sm text-mono-600 dark:text-mono-400">For creators building consistency and workflow foundations.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-mono-950 dark:text-mono-50">Full Creator = Everything in Basic + advanced/higher AI tools</p>
                        <p className="text-sm text-mono-600 dark:text-mono-400">For creators running their operation as a core business stack.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-mono-950 dark:text-mono-50">AI Power Pack = selective higher AI tools</p>
                        <p className="text-sm text-mono-600 dark:text-mono-400">For users who want targeted AI power without moving to Full Creator.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-100 font-medium mb-3">
                      💡 <strong>Why this matters:</strong> You get tools that match your experience level—no confusion, no overwhelm, just the right features for where you are right now.
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-100">
                      🔌 <strong>API Access:</strong> Available to <strong>all plans</strong>. Connect external services and run your stack your way.
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
            <div className="rounded-lg border border-blue-200 bg-white p-6 text-mono-950 dark:border-blue-300 dark:bg-white dark:text-mono-950">
              <div className="flex items-start space-x-3">
                <Info className="h-6 w-6 flex-shrink-0 text-blue-700 dark:text-blue-700 mt-0.5" />
                <div className="flex-1">
                  <h3 className="mb-2 font-semibold text-blue-950 dark:text-blue-950">
                    Transparency Notice
                  </h3>
                  <p className="text-sm text-blue-900 dark:text-blue-900">
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
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-2">
                Choose 1 of 2 pricing tiers
              </h2>
              <p className="text-mono-700 dark:text-mono-300">
                Tier 1: Basic ($19/month) or Tier 2: Full Creator ($49/month).
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-lg border-2 bg-white p-6 text-mono-950 shadow-sm dark:bg-white dark:text-mono-950 dark:shadow-md ${
                    plan.popular
                      ? 'border-accent-500 shadow-lg lg:scale-105'
                      : 'border-mono-200 dark:border-mono-600'
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
                    <h3 className="mb-1 text-xl font-bold text-mono-950 dark:text-mono-950">
                      {plan.name}
                    </h3>
                    <p className="mb-3 text-xs text-mono-700 dark:text-mono-700">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-mono-950 dark:text-mono-950">
                        {plan.price}
                      </span>
                      <span className="ml-1 text-sm text-mono-700 dark:text-mono-700">
                        {plan.period}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-mono-700 dark:text-mono-700">
                      {plan.toolCount}
                    </p>
                    {plan.savings && (
                      <p className="mt-2 text-xs font-medium text-green-700 dark:text-green-800">
                        {plan.savings}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6 min-h-[200px]">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-xs leading-relaxed text-mono-800 dark:text-mono-800">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-4">
                    <Link
                      href={`/plan-tools?plan=${plan.planDbName}`}
                      className="flex items-center justify-center text-sm font-medium text-accent-700 underline-offset-2 hover:text-accent-800 hover:underline dark:text-accent-700 dark:hover:text-accent-800"
                    >
                      Tools in this plan →
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href={`/select-plan?plan=${plan.planDbName}`}
                      className={`block w-full text-center py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors ${
                        plan.popular
                          ? 'bg-accent-600 text-white hover:bg-accent-700'
                          : 'bg-mono-100 text-mono-950 hover:bg-mono-200 dark:bg-mono-800 dark:text-mono-50 dark:hover:bg-mono-700'
                      }`}
                    >
                      Choose this plan
                    </Link>
                    <p className="text-center text-xs text-mono-700 dark:text-mono-700">
                      You’ll see Subscribe now or Start trial, plus terms for content during trial
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Plan Clarity Disclaimer */}
            <div className="mx-auto mt-8 max-w-4xl rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-600 dark:bg-amber-100 dark:text-amber-950">
              <p className="font-semibold mb-1">Plan Clarity (Please Read):</p>
              <p>
                Your subscription only includes the tools listed under the plan you choose.
                If you need selective higher AI capability without full upgrade, add AI Power Pack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Power Pack Add-on */}
      <section className="py-16 bg-gradient-to-b from-mono-50 to-white dark:from-mono-900 dark:to-mono-950 border-b border-mono-200 dark:border-mono-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-4">
                Optional Add-on: AI Power Pack
              </h2>
              <p className="text-lg text-mono-600 dark:text-mono-400 mb-2">
                Add targeted higher AI capability without moving to Full Creator.
              </p>
            </div>

            <div className="rounded-lg border-2 border-accent-500 bg-white p-6 text-mono-950 shadow-lg dark:bg-white dark:text-mono-950">
              <div className="text-center mb-4">
                <h3 className="mb-2 text-2xl font-bold text-mono-950">{aiPowerPack.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-mono-950">{aiPowerPack.price}</span>
                  <span className="ml-1 text-sm text-mono-700">{aiPowerPack.period}</span>
                </div>
                <p className="mt-2 text-sm text-mono-700">{aiPowerPack.description}</p>
              </div>
              <ul className="space-y-2 text-sm text-mono-800">
                {aiPowerPack.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={GUMROAD_LINKS.credits.bundle100}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block w-full rounded-lg bg-accent-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-700"
              >
                Add AI Power Pack (Preview Offer)
              </a>
            </div>
            <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-300 dark:bg-blue-100">
              <div className="flex items-start space-x-3">
                <Zap className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-800 dark:text-blue-900" />
                <div>
                  <h3 className="mb-2 font-semibold text-blue-950 dark:text-blue-950">
                    How AI Power Pack Works
                  </h3>
                  <ul className="space-y-1 text-sm text-blue-950 dark:text-blue-950">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Add-on model:</strong> Keep your current plan and unlock selective higher AI tools.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Not full premium AI:</strong> Full Creator still holds the complete higher AI stack.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span><strong>Upgrade path:</strong> Move to Full Creator when you need full advanced capability.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Distribution Guide */}
      <section className="bg-white py-16 text-mono-950 dark:bg-white dark:text-mono-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="mb-4 text-center text-3xl font-bold text-mono-950 dark:text-mono-950">
              What Tools Are in Each Plan?
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-center text-mono-700 dark:text-mono-700">
              Each plan includes tools specifically curated for creators at that level. Beginner tools for beginners, advanced tools for advanced creators—no overwhelm, just the right tools for your stage.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-lg border border-mono-200 bg-mono-50 p-6 dark:border-mono-300 dark:bg-mono-100">
                <h3 className="mb-3 font-bold text-mono-950 dark:text-mono-950">Basic</h3>
                <ul className="space-y-2 text-sm text-mono-800 dark:text-mono-800">
                  {toolDistribution.basic.map((tool, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-accent-600 mr-2">•</span>
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-mono-200 bg-mono-50 p-6 dark:border-mono-300 dark:bg-mono-100">
                <h3 className="mb-3 font-bold text-mono-950 dark:text-mono-950">Full Creator ⭐</h3>
                <ul className="space-y-2 text-sm text-mono-800 dark:text-mono-800">
                  {toolDistribution.fullCreator.map((tool, idx) => (
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
      <section className="bg-mono-100 py-16 text-mono-950 dark:bg-mono-950 dark:text-mono-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-8 text-center text-3xl font-bold text-mono-950 dark:text-mono-50">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faq.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-mono-200 bg-white p-6 text-mono-950 dark:border-mono-600 dark:bg-white dark:text-mono-950"
                >
                  <h3 className="mb-2 font-semibold text-mono-950 dark:text-mono-950">
                    {item.question}
                  </h3>
                  <p className="text-sm text-mono-700 dark:text-mono-700">
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
