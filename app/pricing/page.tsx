'use client'

import Link from 'next/link'
import { Check, Sparkles, Zap, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    description: 'Perfect for new creators just getting started',
    popular: false,
    toolCount: '8 essential tools',
    tools: [
      'AI Caption Generator',
      'Content Idea Generator',
      'Hashtag Research',
      'Content Calendar',
      'Best Time to Post',
      'Readability Checker',
      'Bio Generator',
      'Content Library (100 items)',
    ],
    features: [
      '8 essential tools',
      'Content library (100 items)',
      'Basic analytics',
      'Email support',
      'Local storage',
    ],
    cta: 'Start Free Trial',
    ctaLink: '/signup',
  },
  {
    name: 'Essential',
    price: '$19',
    period: '/month',
    description: 'For creators building their workflow',
    popular: false,
    toolCount: '18 tools',
    tools: [
      'Everything in Starter',
      'Post Scheduler',
      'Analytics Dashboard',
      'SEO Optimizer',
      'Content Repurposer',
      'Video Script Generator',
      'Blog Outline Generator',
      'Engagement Calculator',
      'Hashtag Analyzer',
      'Social Media Report Generator',
      'Content Library (500 items)',
    ],
    features: [
      '18 professional tools',
      'Content library (500 items)',
      'Cloud storage',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Start Free Trial',
    ctaLink: '/signup',
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    description: 'For serious creators who want everything',
    popular: true,
    toolCount: '35+ tools',
    tools: [
      'Everything in Essential',
      'Viral Content Predictor ⭐',
      'All Content Creation tools (9)',
      'All Brand & Design tools (6)',
      'Advanced Analytics (8 tools)',
      'Competitor Analyzer',
      'Trend Tracker',
      'Content Gap Analyzer',
      'All AI-powered tools (7+)',
      'Content Library (2,000 items)',
      'Integrated workflow',
    ],
    features: [
      '35+ professional tools',
      'Viral Content Predictor ⭐',
      'Content library (2,000 items)',
      'Cloud storage & sync',
      'Integrated workflow',
      'Cross-platform analytics',
      '7+ AI-powered tools',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    ctaLink: '/signup',
    savings: 'Save $159/month vs buying separately',
  },
  {
    name: 'Creator',
    price: '$79',
    period: '/month',
    description: 'Complete toolkit for professional creators',
    popular: false,
    toolCount: 'All 43+ tools',
    tools: [
      'Everything in Professional',
      'All Business & Monetization tools',
      'All Engagement & Growth tools',
      'All remaining Analytics tools',
      'Unlimited content library',
      'Advanced features',
    ],
    features: [
      'All 43+ tools (unlimited uses)',
      'Viral Content Predictor ⭐',
      'Unlimited content library',
      'Cloud storage & sync',
      'Integrated workflow',
      'Advanced analytics',
      'All AI-powered tools',
      'Priority support',
      'Advanced features',
    ],
    cta: 'Start Free Trial',
    ctaLink: '/signup',
  },
  {
    name: 'Business',
    price: '$149',
    period: '/month',
    description: 'For teams and agencies',
    popular: false,
    toolCount: 'All 43+ tools',
    tools: [
      'Everything in Creator',
      'Team collaboration (5 users)',
      'API access',
      'White-label options',
      'Custom integrations',
    ],
    features: [
      'All 43+ tools',
      'Team collaboration (5 users)',
      'Unlimited content library',
      'API access',
      'White-label options',
      'Custom integrations',
      'Dedicated support',
      'Advanced security',
    ],
    cta: 'Start Free Trial',
    ctaLink: '/signup',
  },
]

const toolDistribution = {
  starter: [
    'AI Caption Generator',
    'Content Idea Generator',
    'Hashtag Research',
    'Content Calendar',
    'Best Time to Post',
    'Readability Checker',
    'Bio Generator',
    'Content Library',
  ],
  essential: [
    'Everything in Starter',
    'Post Scheduler',
    'Analytics Dashboard',
    'SEO Optimizer',
    'Content Repurposer',
    'Video Script Generator',
    'Blog Outline Generator',
    'Engagement Calculator',
    'Hashtag Analyzer',
    'Social Media Report Generator',
  ],
  professional: [
    'Everything in Essential',
    'Viral Content Predictor ⭐',
    'All Content Creation tools (Video Script, Transcript, Thumbnail, Quote Card, Image Alt Text, Podcast Notes)',
    'All Brand & Design tools (Brand Kit, Color Palette, Font Pairing, Style Guide, Profile Optimizer)',
    'Advanced Analytics (Competitor Analyzer, Trend Tracker, Content Gap Analyzer, Brand Mention Tracker, Sentiment Analyzer, Follower Growth Tracker, Cross-Platform Analytics)',
    'All AI-powered tools',
  ],
  creator: [
    'Everything in Professional',
    'Business & Monetization (Rate Calculator, Revenue Tracker)',
    'Engagement & Growth (Poll Generator, Giveaway Manager, Influencer Outreach, Collaboration Manager, Link in Bio tools)',
    'All remaining tools',
    'Unlimited everything',
  ],
  business: [
    'Everything in Creator',
    'Team features',
    'API access',
    'White-label',
    'Custom integrations',
  ],
}

const faq = [
  {
    question: 'Is there a free trial?',
    answer: 'Yes! All plans include a 7-day free trial. No credit card required to start. During trial, you get full access to the plan you select. After trial: Subscribe with credit card to keep all content created during trial, or your account will be restored to pre-trial state.',
  },
  {
    question: 'Can I change plans after trial?',
    answer: 'After your free trial, you can upgrade to a higher plan anytime. However, you cannot downgrade from the plan you trialed - this ensures you keep access to features you\'ve already used. You can always upgrade for more features!',
  },
  {
    question: 'What tools are in each plan?',
    answer: 'Starter has 8 essential tools, Essential has 18 tools, Professional has 35+ tools including Viral Predictor, Creator has all 43+ tools, and Business adds team features.',
  },
  {
    question: 'Do you offer annual plans?',
    answer: 'Yes! Save 20% with annual billing. Contact us for annual pricing.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes, cancel anytime with no penalties. Your access continues until the end of your billing period.',
  },
  {
    question: 'What makes CreatorFlow365 different?',
    answer: 'We\'re the only platform with Viral Content Predictor, integrated workflow, and 43+ tools in one place. Most competitors have 3-10 tools and charge $200+/month for everything.',
  },
]

export default function PricingPage() {
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
              Start at $9/month. Grow as you need. No credit card required for trial.
            </p>
            <p className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-4">
              Everything you need to run your creator operation in one place.
            </p>
            <p className="text-lg text-mono-500 dark:text-mono-500 mb-6">
              All plans include a <span className="font-semibold text-accent-600">7-day free trial</span>
            </p>
            
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
                    <strong>During your 7-day free trial:</strong> You'll have full access to the plan you select. All content you create will be saved.
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

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative bg-white dark:bg-mono-900 rounded-lg border-2 p-6 ${
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
                    <h3 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-mono-600 dark:text-mono-400 mb-3">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-mono-950 dark:text-mono-50">
                        {plan.price}
                      </span>
                      <span className="text-mono-600 dark:text-mono-400 ml-1 text-sm">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-xs text-mono-500 dark:text-mono-500 mt-1">
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
                        <span className="text-mono-700 dark:text-mono-300 text-xs leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mb-4">
                    <Link
                      href={`/tools?plan=${plan.name.toLowerCase()}`}
                      className="text-sm text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 hover:underline font-medium flex items-center justify-center"
                    >
                      View All Tools →
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href={plan.ctaLink}
                      className={`block w-full text-center py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors ${
                        plan.popular
                          ? 'bg-accent-600 text-white hover:bg-accent-700'
                          : 'bg-mono-100 dark:bg-mono-800 text-mono-950 dark:text-mono-50 hover:bg-mono-200 dark:hover:bg-mono-700'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                    <p className="text-xs text-center text-mono-500 dark:text-mono-500">
                      No credit card for trial
                    </p>
                    <p className="text-xs text-center text-mono-600 dark:text-mono-400 font-medium">
                      Subscribe to keep your content
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tool Distribution Guide */}
      <section className="py-16 bg-white dark:bg-mono-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-8 text-center">
              What Tools Are in Each Plan?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <h3 className="font-bold text-mono-950 dark:text-mono-50 mb-3">Starter - $9/month</h3>
                <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                  {toolDistribution.starter.map((tool, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-accent-600 mr-2">•</span>
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <h3 className="font-bold text-mono-950 dark:text-mono-50 mb-3">Essential - $19/month</h3>
                <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                  {toolDistribution.essential.map((tool, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-accent-600 mr-2">•</span>
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-6 border-2 border-accent-200 dark:border-accent-800">
                <h3 className="font-bold text-mono-950 dark:text-mono-50 mb-3">Professional - $49/month ⭐</h3>
                <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                  {toolDistribution.professional.map((tool, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-accent-600 mr-2">•</span>
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <h3 className="font-bold text-mono-950 dark:text-mono-50 mb-3">Creator - $79/month</h3>
                <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                  {toolDistribution.creator.map((tool, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-accent-600 mr-2">•</span>
                      <span>{tool}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-mono-50 dark:bg-mono-800 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <h3 className="font-bold text-mono-950 dark:text-mono-50 mb-3">Business - $149/month</h3>
                <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
                  {toolDistribution.business.map((tool, idx) => (
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
              Why Choose CreatorFlow365?
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
                    Start at $9/month
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
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Once you know your rates, you'll need a way to get paid. Many creators use{' '}
                <a 
                  href="https://stripe.com/payments" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-300 underline hover:text-blue-800 dark:hover:text-blue-200 font-semibold"
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
