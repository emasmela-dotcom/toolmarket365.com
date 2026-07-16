'use client'

import Link from 'next/link'
import { Check, X, Sparkles, Zap, Cloud, TrendingUp, Workflow, Target, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/LanguageContext';

const competitors = [
  {
    name: 'Later',
    price: '$18-40/month',
    focus: 'Scheduling only',
    tools: 3,
    hasViralPredictor: false,
    hasIntegratedWorkflow: false,
    hasCloudLibrary: false,
    hasAITools: false,
    hasCrossPlatformAnalytics: false,
  },
  {
    name: 'Buffer',
    price: '$6-12/month',
    focus: 'Scheduling only',
    tools: 3,
    hasViralPredictor: false,
    hasIntegratedWorkflow: false,
    hasCloudLibrary: false,
    hasAITools: false,
    hasCrossPlatformAnalytics: false,
  },
  {
    name: 'Hootsuite',
    price: '$99-739/month',
    focus: 'Scheduling + Analytics',
    tools: 5,
    hasViralPredictor: false,
    hasIntegratedWorkflow: false,
    hasCloudLibrary: false,
    hasAITools: false,
    hasCrossPlatformAnalytics: true,
  },
  {
    name: 'Sprout Social',
    price: '$249-499/month',
    focus: 'Enterprise Analytics',
    tools: 5,
    hasViralPredictor: false,
    hasIntegratedWorkflow: false,
    hasCloudLibrary: false,
    hasAITools: false,
    hasCrossPlatformAnalytics: true,
  },
  {
    name: 'Jasper AI',
    price: '$49-125/month',
    focus: 'AI Writing only',
    tools: 1,
    hasViralPredictor: false,
    hasIntegratedWorkflow: false,
    hasCloudLibrary: false,
    hasAITools: true,
    hasCrossPlatformAnalytics: false,
  },
  {
    name: 'Canva Pro',
    price: '$13/month',
    focus: 'Design only',
    tools: 1,
    hasViralPredictor: false,
    hasIntegratedWorkflow: false,
    hasCloudLibrary: false,
    hasAITools: false,
    hasCrossPlatformAnalytics: false,
  },
]

const differentiators = [
  {
    icon: Sparkles,
    title: 'Viral Content Predictor',
    description: 'AI-powered tool that predicts your content\'s viral potential BEFORE you post. Get a 0-100 score, engagement predictions, optimal timing, and optimization suggestions.',
    competitorStatus: '❌ None of our competitors have this',
    howItImproves: 'Post content with higher viral potential. Avoid wasting time on content that won\'t perform. Optimize before posting, not after.',
    impact: 'Increase engagement by 2-5x by posting only high-scoring content',
  },
  {
    icon: Workflow,
    title: 'Integrated Workflow',
    description:
      'All tools live in one place. Content moves from creation → optimization → planning and exports you can paste or import elsewhere—without implying native posting to every social network from ToolMarket365.',
    competitorStatus: '❌ Competitors require manual work between separate tools',
    howItImproves:
      'Save time with one workspace: draft and refine here, then copy or export to wherever you actually publish. Nothing claims a single ToolMarket365 login posts to every network for you.',
    impact: '10x faster content creation process',
  },
  {
    icon: Cloud,
    title: 'Cloud Content Library',
    description: 'Auto-saves everything from all tools. Organize by tool, category, date, tags. Search across all content. Know which tool created what.',
    competitorStatus: '❌ Competitors use generic storage (Google Drive, Dropbox) with no integration',
    howItImproves: 'Never lose your work. Find any content instantly. See what worked and what didn\'t. Build a searchable content database.',
    impact: 'Never lose content again. Build a valuable content asset library',
  },
  {
    icon: TrendingUp,
    title: 'Cross-Platform Analytics',
    description: 'View all platforms (Instagram, TikTok, YouTube, Twitter, LinkedIn) in one unified dashboard. Compare performance, identify trends, track growth.',
    competitorStatus: '⚠️ Most competitors only show one platform at a time',
    howItImproves: 'See the complete picture. Identify which platforms work best for you. Compare content performance across platforms. Make data-driven decisions.',
    impact: 'Make better content decisions with complete visibility',
  },
  {
    icon: Zap,
    title: '7+ AI-Powered Tools',
    description: 'AI Caption Generator, AI Content Ideas, AI Video Scripts, AI Bio Generator, AI Blog Outlines, AI Image Alt Text, AI Podcast Show Notes.',
    competitorStatus: '❌ Most competitors have 0-1 AI tools',
    howItImproves: 'Create better content faster. AI helps with ideation, writing, optimization. Never run out of ideas. Professional-quality output.',
    impact: 'Create 5x more content in the same time',
  },
  {
    icon: Target,
    title: '53+ Professional Tools',
    description: 'Content creation, analytics, brand management, SEO, scheduling, repurposing, monetization - everything creators need in one platform.',
    competitorStatus: '⚠️ Competitors combined offer ~18 tools across multiple subscriptions equaling $434/month',
    howItImproves: 'We offer comparable tools plus 35+ other content creator tools in one subscription. 53+ tools for $0.99/month.',
    impact: 'One platform, one price—save $355+/month vs buying separately',
  },
]

const workflowSteps = [
  {
    step: 1,
    title: 'Generate Content Ideas',
    tool: 'Content Idea Generator',
    improvement: 'AI suggests trending topics and ideas based on your niche',
    competitor: '❌ Manual research or separate tool ($49/month)',
  },
  {
    step: 2,
    title: 'Create Content',
    tool: 'AI Caption Generator / Video Script Generator',
    improvement: 'AI creates professional captions and scripts optimized for your platform',
    competitor: '❌ Manual writing or separate AI tool ($49/month)',
  },
  {
    step: 3,
    title: 'Optimize Content',
    tool: 'SEO Optimizer / Hashtag Research',
    improvement: 'Automatically optimize for search and discoverability',
    competitor: '⚠️ Basic optimization, no integration',
  },
  {
    step: 4,
    title: 'Predict Viral Potential',
    tool: 'Viral Content Predictor',
    improvement: 'Get viral score, engagement predictions, optimal timing BEFORE posting',
    competitor: '❌ NOBODY HAS THIS - You\'re guessing',
  },
  {
    step: 5,
    title: 'Repurpose Content',
    tool: 'Content Repurposer',
    improvement: 'One content → 6+ formats automatically (LinkedIn, Twitter, Instagram, TikTok, Email)',
    competitor: '❌ Manual repurposing or separate tool ($25-99/month)',
  },
  {
    step: 6,
    title: 'Plan when to post',
    tool: 'Post Scheduler / Social Scheduler',
    improvement: 'Block times, draft captions, and export or copy into your own posting flow',
    competitor: '✅ Similar, but no integration with creation tools',
  },
  {
    step: 7,
    title: 'Track Performance',
    tool: 'Analytics Dashboard',
    improvement: 'See performance across all platforms, learn what works',
    competitor: '⚠️ Platform-specific analytics only',
  },
  {
    step: 8,
    title: 'Auto-Save to Library',
    tool: 'Cloud Content Library',
    improvement: 'Everything automatically saved, organized, searchable. Build your content database.',
    competitor: '❌ Manual saving to Google Drive/Dropbox',
  },
]

export default function ComparePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent-50 to-white dark:from-mono-900 dark:to-mono-950 py-16 border-b border-mono-200 dark:border-mono-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-mono-950 dark:text-mono-50 mb-6">
              {t('compareTitle')}
            </h1>
            <p className="text-xl text-mono-600 dark:text-mono-400 mb-3">
              {t('compareSubtitle')}
            </p>
            <p className="text-lg font-semibold text-accent-600 dark:text-accent-400 mb-8">
              {t('compareHeroTagline')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
              >
                {t('compareStartFreeTrial')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-mono-800 text-mono-950 dark:text-mono-50 font-semibold rounded-lg hover:bg-mono-100 dark:hover:bg-mono-700 transition-colors border border-mono-200 dark:border-mono-700"
              >
                {t('compareViewPricing')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Comparison Table */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-8 text-center">
              {t('compareFeatureComparison')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700">
                <thead>
                  <tr className="border-b border-mono-200 dark:border-mono-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-mono-950 dark:text-mono-50">{t('compareTableFeature')}</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-mono-950 dark:text-mono-50 bg-accent-50 dark:bg-accent-900">ToolMarket365</th>
                    {competitors.map((comp) => (
                      <th key={comp.name} className="px-6 py-4 text-center text-sm font-semibold text-mono-950 dark:text-mono-50">
                        {comp.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-mono-200 dark:divide-mono-700">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-mono-950 dark:text-mono-50">{t('compareTableViralPredictor')}</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                    {competitors.map((comp) => (
                      <td key={comp.name} className="px-6 py-4 text-center">
                        {comp.hasViralPredictor ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-red-600 mx-auto" />}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-mono-950 dark:text-mono-50">{t('compareTableIntegratedWorkflow')}</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                    {competitors.map((comp) => (
                      <td key={comp.name} className="px-6 py-4 text-center">
                        {comp.hasIntegratedWorkflow ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-red-600 mx-auto" />}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-mono-950 dark:text-mono-50">{t('compareTableCloudLibrary')}</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                    {competitors.map((comp) => (
                      <td key={comp.name} className="px-6 py-4 text-center">
                        {comp.hasCloudLibrary ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-red-600 mx-auto" />}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-mono-950 dark:text-mono-50">{t('compareTableAITools')}</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                    {competitors.map((comp) => (
                      <td key={comp.name} className="px-6 py-4 text-center">
                        {comp.hasAITools ? <span className="text-sm text-mono-600">{t('compareLimited')}</span> : <X className="h-5 w-5 text-red-600 mx-auto" />}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-mono-950 dark:text-mono-50">{t('compareTableCrossPlatform')}</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                    {competitors.map((comp) => (
                      <td key={comp.name} className="px-6 py-4 text-center">
                        {comp.hasCrossPlatformAnalytics ? <Check className="h-5 w-5 text-green-600 mx-auto" /> : <X className="h-5 w-5 text-red-600 mx-auto" />}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-mono-950 dark:text-mono-50">{t('compareTableNumberOfTools')}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-accent-600">53+</td>
                    {competitors.map((comp) => (
                      <td key={comp.name} className="px-6 py-4 text-center text-sm text-mono-600">
                        {comp.tools}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-mono-50 dark:bg-mono-800">
                    <td className="px-6 py-4 text-sm font-semibold text-mono-950 dark:text-mono-50">{t('compareTableMonthlyPrice')}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-accent-600">$0.99</td>
                    {competitors.map((comp) => (
                      <td key={comp.name} className="px-6 py-4 text-center text-sm text-mono-600">
                        {comp.price}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Differentiators */}
      <section className="py-16 bg-white dark:bg-mono-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-4 text-center">
              {t('compareWhatMakesDifferent')}
            </h2>
            <p className="text-lg text-mono-600 dark:text-mono-400 mb-12 text-center">
              {t('compareDifferentiatorsSubtitle')}
            </p>
            
            <div className="space-y-8">
              {differentiators.map((diff, idx) => {
                const Icon = diff.icon
                return (
                  <div key={idx} className="bg-mono-50 dark:bg-mono-800 rounded-lg p-8 border border-mono-200 dark:border-mono-700">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-2">
                          {diff.title}
                        </h3>
                        <p className="text-mono-700 dark:text-mono-300 mb-4">
                          {diff.description}
                        </p>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                          <p className="text-sm font-semibold text-red-800 dark:text-red-400 mb-1">
                            {diff.competitorStatus}
                          </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                          <p className="text-sm font-semibold text-green-800 dark:text-green-400 mb-1">
                            {t('compareHowItImprovesLabel')}
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            {diff.howItImproves}
                          </p>
                        </div>
                        <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg p-4">
                          <p className="text-sm font-semibold text-accent-800 dark:text-accent-400">
                            {t('compareImpactLabel')} {diff.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How ToolMarket365 Influences Your Content */}
      <section className="py-16 bg-mono-50 dark:bg-mono-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-4 text-center">
              {t('compareImprovesTitle')}
            </h2>
            <p className="text-lg text-mono-600 dark:text-mono-400 mb-12 text-center">
              {t('compareWorkflowSubtitle')}
            </p>

            <div className="space-y-6">
              {workflowSteps.map((step, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-mono-900 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-mono-950 dark:text-mono-50 mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm text-accent-600 dark:text-accent-400 font-medium">
                          {step.tool}
                        </p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <p className="text-xs font-semibold text-green-800 dark:text-green-400 mb-1">
                          {t('compareWithToolMarket365')}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {step.improvement}
                        </p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-xs font-semibold text-red-800 dark:text-red-400 mb-1">
                          {step.competitor}
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {t('compareManualWork')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-gradient-to-b from-accent-50 to-white dark:from-mono-900 dark:to-mono-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-6">
              {t('compareResultTitle')}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-mono-800 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <div className="text-3xl font-bold text-accent-600 mb-2">2-5x</div>
                <p className="text-mono-700 dark:text-mono-300">{t('compareHigherEngagement')}</p>
                <p className="text-sm text-mono-500 dark:text-mono-500 mt-2">
                  {t('compareHigherEngagementDesc')}
                </p>
              </div>
              <div className="bg-white dark:bg-mono-800 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <div className="text-3xl font-bold text-accent-600 mb-2">10-15hrs</div>
                <p className="text-mono-700 dark:text-mono-300">{t('compareTimeSaved')}</p>
                <p className="text-sm text-mono-500 dark:text-mono-500 mt-2">
                  {t('compareTimeSavedDesc')}
                </p>
              </div>
              <div className="bg-white dark:bg-mono-800 rounded-lg p-6 border border-mono-200 dark:border-mono-700">
                <div className="text-3xl font-bold text-accent-600 mb-2">$159</div>
                <p className="text-mono-700 dark:text-mono-300">{t('compareSavedPerMonth')}</p>
                <p className="text-sm text-mono-500 dark:text-mono-500 mt-2">
                  {t('compareSavedPerMonthDesc')}
                </p>
              </div>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-3 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700 transition-colors"
            >
              {t('compareStartYourFreeTrial')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
