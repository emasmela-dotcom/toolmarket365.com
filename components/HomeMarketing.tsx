import Link from 'next/link'

export default function HomeMarketing() {
  return (
    <main className="tm-home">
      <div className="tm-home__glow" aria-hidden />
      <section className="tm-home__inner">
        <p className="tm-home__badge">BUILT TO SHIP</p>
        <h1 className="tm-home__title">ToolMarket365</h1>
        <p className="tm-home__tagline">
          Your entire business, one tab, built with the toolkit the internet forgot to build.
        </p>
        <div className="tm-home__grid">
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>Creator Growth Tools</p>
              <p>(HIGH DEMAND)</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <Link href="/tools/hook-generator" className="tm-home__link">
                  Hook Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/content-idea-engine" className="tm-home__link">
                  Content Idea Engine
                </Link>
              </li>
              <li>
                <Link href="/tools/youtube-title-optimizer" className="tm-home__link">
                  YouTube Title Optimizer
                </Link>
              </li>
              <li>
                <Link href="/tools/tiktok-trend-finder" className="tm-home__link">
                  TikTok Trend Finder
                </Link>
              </li>
              <li>
                <Link href="/tools/newsletter-topic-generator" className="tm-home__link">
                  Newsletter Topic Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/reddit-post-rewriter" className="tm-home__link">
                  Reddit Post Rewriter
                </Link>
              </li>
              <li>
                <Link href="/tools/cold-dm-personalizer" className="tm-home__link">
                  Cold DM Personalizer
                </Link>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>Monetization Tools</p>
              <p>(MAKE PEOPLE MONEY)</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <Link href="/tools/simple-paywall-link-generator" className="tm-home__link">
                  Simple Paywall Link Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/digital-product-bundle-builder" className="tm-home__link">
                  Digital Product Bundle Builder
                </Link>
              </li>
              <li>
                <Link href="/tools/pricing-calculator" className="tm-home__link">
                  Pricing Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/upsell-generator" className="tm-home__link">
                  Upsell Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/testimonial-collector-tool" className="tm-home__link">
                  Testimonial Collector Tool
                </Link>
              </li>
              <li>
                <Link href="/tools/simple-affiliate-link-manager" className="tm-home__link">
                  Simple Affiliate Link Manager
                </Link>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>Client / CRM Tools</p>
              <p>(ALIGNED WITH &quot;FollowThru&quot;)</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <Link href="/tools/agreement-link-generator" className="tm-home__link">
                  Agreement Link Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/invoice-reminder-tool" className="tm-home__link">
                  Invoice + Reminder Tool
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/client-onboarding-checklist-generator"
                  className="tm-home__link"
                >
                  Client Onboarding Checklist Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/scope-creep-tracker" className="tm-home__link">
                  Scope Creep Tracker
                </Link>
              </li>
              <li>
                <Link href="/tools/follow-up-reminder-ai" className="tm-home__link">
                  Follow-Up Reminder AI
                </Link>
              </li>
              <li>
                <Link href="/tools/simple-proposal-builder" className="tm-home__link">
                  Simple Proposal Builder
                </Link>
              </li>
              <li>
                <Link href="/tools/late-payment-nudger" className="tm-home__link">
                  Late Payment Nudger (auto messages)
                </Link>
              </li>
              <li>
                <Link href="/tools/meeting-summary-action-items" className="tm-home__link">
                  Meeting Summary → Action Items
                </Link>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>Audience &amp; Research Tools</p>
              <p>(VERY HOT RIGHT NOW)</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <Link href="/tools/find-my-audience" className="tm-home__link">
                  Find My Audience
                </Link>
              </li>
              <li>
                <Link href="/tools/niche-validator" className="tm-home__link">
                  Niche Validator
                </Link>
              </li>
              <li>
                <Link href="/tools/competitor-scanner" className="tm-home__link">
                  Competitor Scanner
                </Link>
              </li>
              <li>
                <Link href="/tools/keyword-opportunity-finder" className="tm-home__link">
                  Keyword Opportunity Finder
                </Link>
              </li>
              <li>
                <Link href="/tools/trend-explainer" className="tm-home__link">
                  Trend Explainer
                </Link>
              </li>
              <li>
                <Link href="/tools/customer-pain-point-extractor" className="tm-home__link">
                  Customer Pain Point Extractor
                </Link>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>Website &amp; Conversion Tools</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <Link href="/tools/seo-meta-tag-generator" className="tm-home__link">
                  SEO Meta Tag Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/privacy-policy-generator" className="tm-home__link">
                  Privacy Policy Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/terms-generator" className="tm-home__link">
                  Terms Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/simple-ab-test-tool" className="tm-home__link">
                  Simple A/B Test Tool
                </Link>
              </li>
              <li>
                <Link href="/tools/website-speed-explainer" className="tm-home__link">
                  Website Speed Explainer
                </Link>
              </li>
              <li>
                <Link href="/tools/landing-copy" className="tm-home__link">
                  Landing Page Copy Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/landing-page-critiquer" className="tm-home__link">
                  Landing Page Critiquer
                </Link>
              </li>
              <li>
                <Link href="/tools/checkout-page-optimizer" className="tm-home__link">
                  Checkout Page Optimizer
                </Link>
              </li>
            </ul>
          </article>
          <article className="tm-home__card">
            <div className="tm-home__card-head">
              <p>Automation Tools</p>
              <p>(NO-CODE FEEL)</p>
            </div>
            <ul className="tm-home__list">
              <li>
                <Link href="/tools/auto-follow-up-sender" className="tm-home__link">
                  Auto Follow-Up Sender
                </Link>
              </li>
              <li>
                <Link href="/tools/lead-capture-email-sequence" className="tm-home__link">
                  Lead Capture → Email Sequence Tool
                </Link>
              </li>
              <li>
                <Link href="/tools/form-google-sheet-email-workflow" className="tm-home__link">
                  Form → Google Sheet → Email Workflow
                </Link>
              </li>
              <li>
                <Link href="/tools/dm-crm-capture" className="tm-home__link">
                  DM → CRM Capture Tool
                </Link>
              </li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  )
}
