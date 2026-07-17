'use client'

import { HomeShareBar } from '@/components/HomeShareBar'
import { HomeToolTipLink } from '@/components/HomeToolTipLink'
import Link from 'next/link'
import { legalToolSectionsForHome, LEGAL_TOOL_I18N } from '@/lib/legalTools/homeSections'
import { lifeToolSectionsForHome } from '@/lib/lifeTools/homeSections'
import { localServiceSectionsForHome } from '@/lib/localServiceTools/homeSections'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { getLifepack365Url, LIFEPACK365_NAME } from '@/lib/siteConfig'

export default function HomeMarketing() {
  const lifepackUrl = getLifepack365Url()
  const { t } = useLanguage()

  return (
    <main className="tm-home">
      <div className="tm-home__glow" aria-hidden />
      <section className="tm-home__inner">
        <div className="tm-home__hero">
          <p className="tm-home__badge">{t('homeBadge')}</p>
          <h1 className="tm-home__title">ToolMarket365</h1>
          <p className="tm-home__tagline">
            {t('homeTagline')}
          </p>
          <div className="tm-home__auth">
            <Link href="/signup" className="tm-home__auth-primary">
              {t('navSignUp')}
            </Link>
            <Link href="/login" className="tm-home__auth-secondary">
              {t('navSignIn')}
            </Link>
            <Link href="/pricing" className="tm-home__auth-link">
              {t('navPricing')}
            </Link>
            <Link href="/forgot-password" className="tm-home__auth-link">
              {t('homeForgotPassword')}
            </Link>
          </div>
          <HomeShareBar />
          {lifepackUrl ? (
            <p className="tm-home__sister">
              <span className="tm-home__sister-label">{t('homeSisterProduct')}</span>{' '}
              <a href={lifepackUrl} className="tm-home__sister-link" target="_blank" rel="noopener noreferrer">
                {LIFEPACK365_NAME}
              </a>
            </p>
          ) : null}
        </div>
        <div className="tm-home__grid">
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeStackCategories')}</p>
              <p>{t('homeForStackCoverage')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/writing" className="tm-home__link">
                  Writing
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/coding" className="tm-home__link">
                  Coding
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/research" className="tm-home__link">
                  Research
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/images" className="tm-home__link">
                  Images
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/video" className="tm-home__link">
                  Video
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/meetings" className="tm-home__link">
                  Meetings
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/office" className="tm-home__link">
                  Office
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/automation" className="tm-home__link">
                  Automation
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeContentCreator')}</p>
              <p>{t('homeForContentCreators')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/hook-generator" className="tm-home__link">
                  Hook Generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/content-idea-engine" className="tm-home__link">
                  Content Idea Engine
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/youtube-title-optimizer" className="tm-home__link">
                  YouTube Title Optimizer
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/tiktok-trend-finder" className="tm-home__link">
                  TikTok Trend Finder
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/newsletter-topic-generator" className="tm-home__link">
                  Newsletter Topic Generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/reddit-post-rewriter" className="tm-home__link">
                  Reddit Post Rewriter
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/cold-dm-personalizer" className="tm-home__link">
                  Cold DM Personalizer
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeMonetizationTools')}</p>
              <p>{t('homeForSellingOffers')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/simple-paywall-link-generator" className="tm-home__link">
                  Simple Paywall Link Generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/digital-product-bundle-builder" className="tm-home__link">
                  Digital Product Bundle Builder
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/pricing-calculator" className="tm-home__link">
                  Pricing Calculator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/upsell-generator" className="tm-home__link">
                  Upsell Generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/testimonial-collector-tool" className="tm-home__link">
                  Testimonial Collector Tool
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/simple-affiliate-link-manager" className="tm-home__link">
                  Simple Affiliate Link Manager
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeClientCrmTools')}</p>
              <p>{t('homeForClientWorkflows')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/agreement-link-generator" className="tm-home__link">
                  Agreement Link Generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/invoice-reminder-tool" className="tm-home__link">
                  Invoice + Reminder Tool
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink
                  href="/tools/client-onboarding-checklist-generator"
                  className="tm-home__link"
                >
                  Client Onboarding Checklist Generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/scope-creep-tracker" className="tm-home__link">
                  Scope Creep Tracker
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/follow-up-reminder-ai" className="tm-home__link">
                  Follow-Up Reminder AI
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/simple-proposal-builder" className="tm-home__link">
                  Simple Proposal Builder
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/late-payment-nudger" className="tm-home__link">
                  Late Payment Nudger (auto messages)
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/meeting-summary-action-items" className="tm-home__link">
                  Meeting Summary → Action Items
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeAudienceResearchTools')}</p>
              <p>{t('homeForFindingDemand')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/find-my-audience" className="tm-home__link">
                  Find My Audience
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/niche-validator" className="tm-home__link">
                  Niche Validator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/competitor-scanner" className="tm-home__link">
                  Competitor Scanner
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/keyword-opportunity-finder" className="tm-home__link">
                  Keyword Opportunity Finder
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/trend-explainer" className="tm-home__link">
                  Trend Explainer
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/customer-pain-point-extractor" className="tm-home__link">
                  Customer Pain Point Extractor
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeWebsiteConversionTools')}</p>
              <p>{t('homeForWebsiteConversions')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/seo-meta-tag-generator" className="tm-home__link">
                  SEO Meta Tag Generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/privacy-policy-generator" className="tm-home__link">
                  Privacy Policy Generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/terms-generator" className="tm-home__link">
                  Terms Generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/simple-ab-test-tool" className="tm-home__link">
                  Simple A/B Test Tool
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/website-speed-explainer" className="tm-home__link">
                  Website Speed Explainer
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/landing-copy" className="tm-home__link">
                  Landing Page Copy Generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/landing-page-critiquer" className="tm-home__link">
                  Landing Page Critiquer
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/checkout-page-optimizer" className="tm-home__link">
                  Checkout Page Optimizer
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeAutomationTools')}</p>
              <p>{t('homeForRepeatableTasks')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/auto-follow-up-sender" className="tm-home__link">
                  Auto Follow-Up Sender
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/lead-capture-email-sequence" className="tm-home__link">
                  Lead Capture → Email Sequence Tool
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/form-google-sheet-email-workflow" className="tm-home__link">
                  Form → Google Sheet → Email Workflow
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/dm-crm-capture" className="tm-home__link">
                  DM → CRM Capture Tool
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeProductivityWorkflow')}</p>
              <p>{t('homeForFasterExecution')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/notion-to-pdf-exporter" className="tm-home__link">
                  Notion-to-PDF exporter
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/meeting-summarizer" className="tm-home__link">
                  Meeting summarizer
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/recurring-task-automator" className="tm-home__link">
                  Recurring task automator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/email-digest-builder" className="tm-home__link">
                  Email digest builder
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/focus-timer-analytics" className="tm-home__link">
                  Focus timer with analytics
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeAnalyticsReporting')}</p>
              <p>{t('homeForPerformanceTracking')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/uptime-monitor" className="tm-home__link">
                  Uptime monitor
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/seo-audit-tool" className="tm-home__link">
                  SEO audit tool
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/google-analytics-simplifier" className="tm-home__link">
                  Google Analytics simplifier
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/changelog-generator" className="tm-home__link">
                  Changelog generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/heatmap-recorder" className="tm-home__link">
                  Heatmap recorder
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeFinanceBilling')}</p>
              <p>{t('homeForCashFlowControl')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/invoice-generator" className="tm-home__link">
                  Invoice generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/expense-tracker" className="tm-home__link">
                  Expense tracker
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/subscription-tracker" className="tm-home__link">
                  Subscription tracker
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/revenue-dashboard-visualizer" className="tm-home__link">
                  Revenue dashboard
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeAiPoweredTools')}</p>
              <p>{t('homeForQuickDrafting')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/ai-blog-post-writer" className="tm-home__link">
                  AI blog post writer
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/ai-image-alt-generator" className="tm-home__link">
                  AI image alt-text generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/ai-email-reply-assistant" className="tm-home__link">
                  AI email reply assistant
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/ai-product-description-writer" className="tm-home__link">
                  AI product description writer
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/ai-cold-outreach-personalizer" className="tm-home__link">
                  AI cold outreach personalizer
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeMarketingSocial')}</p>
              <p>{t('homeForReachEngagement')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/marketing-social-scheduler" className="tm-home__link">
                  Social media scheduler
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/link-in-bio-landing-builder" className="tm-home__link">
                  Link-in-bio builder
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/review-request-automator" className="tm-home__link">
                  Review request automator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/twitter-thread-composer" className="tm-home__link">
                  Twitter/X thread composer
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/lead-magnet-delivery-tool" className="tm-home__link">
                  Lead magnet delivery tool
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeClientTeamTools')}</p>
              <p>{t('homeForClientsTeams')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/client-portal-builder" className="tm-home__link">
                  Client portal builder
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/proposal-contract-generator" className="tm-home__link">
                  Proposal/contract generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/simple-crm-lite" className="tm-home__link">
                  Simple CRM
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/feedback-widget-generator" className="tm-home__link">
                  Feedback widget
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/team-standup-bot" className="tm-home__link">
                  Team standup bot
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
          {legalToolSectionsForHome().map((sec) => (
            <article key={sec.categoryKey} className="tm-home__card">
              <div className="tm-home__card-head">
                <p>{t(sec.categoryKey)}</p>
                <p>{t(sec.tagKey)}</p>
              </div>
              <ul className="tm-home__list tm-home__list--legal">
                <li>
                  <HomeToolTipLink
                    href="/tools/legal-plain-language-tools"
                    className="tm-home__link tm-home__link--legal"
                  >
                    <span className="tm-home__link-title">{t('homeLegalSuiteTitle')}</span>
                    <span className="tm-home__link-desc">
                      {t('homeLegalSuiteDescription')}
                    </span>
                  </HomeToolTipLink>
                </li>
                {sec.tools.map((tool) => (
                  <li key={tool.id}>
                    <HomeToolTipLink
                      href={`/tools/legal-plain-language-tools?tab=${tool.id}`}
                      className="tm-home__link tm-home__link--legal"
                    >
                      <span className="tm-home__link-title">
                        {t(LEGAL_TOOL_I18N[tool.id].title)}
                      </span>
                      <span className="tm-home__link-desc">
                        {t(LEGAL_TOOL_I18N[tool.id].description)}
                      </span>
                    </HomeToolTipLink>
                  </li>
                ))}
              </ul>
            </article>
          ))}
          {localServiceSectionsForHome().map((sec) => (
            <article key={sec.category} className="tm-home__card">
              <div className="tm-home__card-head">
                <p>{sec.category}</p>
                <p>{sec.tag}</p>
              </div>
              <ul className="tm-home__list">
                {sec.tools.map((t) => (
                  <li key={t.id}>
                    <HomeToolTipLink href={`/tools/local/${t.id}`} className="tm-home__link">
                      {t.title}
                    </HomeToolTipLink>
                  </li>
                ))}
              </ul>
            </article>
          ))}
          {lifeToolSectionsForHome().map((sec) => (
            <article key={sec.category} className="tm-home__card">
              <div className="tm-home__card-head">
                <p>{sec.category}</p>
                <p>{sec.tag}</p>
              </div>
              <ul className="tm-home__list">
                {sec.tools.map((t) => (
                  <li key={t.id}>
                    <HomeToolTipLink href={`/tools/life/${t.id}`} className="tm-home__link">
                      {t.title}
                    </HomeToolTipLink>
                  </li>
                ))}
              </ul>
            </article>
          ))}
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>{t('homeIntegrationsUtilities')}</p>
              <p>{t('homeForConnectingSystems')}</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <HomeToolTipLink href="/tools/webhook-tester" className="tm-home__link">
                  Webhook tester
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/api-key-manager" className="tm-home__link">
                  API key manager
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/form-builder" className="tm-home__link">
                  Form builder
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/qr-code-generator" className="tm-home__link">
                  QR code generator
                </HomeToolTipLink>
              </li>
              <li>
                <HomeToolTipLink href="/tools/url-shortener" className="tm-home__link">
                  URL shortener with analytics
                </HomeToolTipLink>
              </li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  )
}
