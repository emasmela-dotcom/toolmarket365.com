import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main className="relative min-h-[70vh] overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_55%)]" />
      <section className="mx-auto flex min-h-[70vh] w-full max-w-[100rem] flex-col items-center justify-start pt-14 px-4 text-center sm:px-6">
        <p className="mb-5 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1 text-xs font-semibold tracking-[0.18em] text-blue-300">
          BUILT TO SHIP
        </p>
        <h1 className="mb-4 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-5xl font-extrabold leading-tight text-transparent sm:text-7xl">
          ToolMarket365
        </h1>
        <p className="max-w-3xl text-base text-gray-300 sm:text-lg">
          Your entire business, one tab, built with the toolkit the internet forgot to build.
        </p>
        <div className="mt-8 grid w-full max-w-[100rem] auto-rows-fr grid-cols-1 gap-4 self-start text-left sm:gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-4 xl:gap-6">
          <div className="min-w-0 rounded-lg border border-white/30 p-3 text-left sm:p-4 lg:p-3.5 xl:p-4">
            <div className="text-base font-bold leading-snug sm:text-lg lg:text-base xl:text-xl">
              <p>Creator Growth Tools</p>
              <p>(HIGH DEMAND)</p>
            </div>
            <ul className="mt-3.5 space-y-1 text-xs font-medium text-gray-200 sm:mt-4 sm:space-y-1.5 sm:text-sm lg:text-xs xl:text-sm">
              <li><Link href="/tools/hook-generator" className="hover:underline">Hook Generator</Link></li>
              <li><Link href="/tools/content-idea-engine" className="hover:underline">Content Idea Engine</Link></li>
              <li><Link href="/tools/youtube-title-optimizer" className="hover:underline">YouTube Title Optimizer</Link></li>
              <li><Link href="/tools/tiktok-trend-finder" className="hover:underline">TikTok Trend Finder</Link></li>
              <li><Link href="/tools/newsletter-topic-generator" className="hover:underline">Newsletter Topic Generator</Link></li>
              <li><Link href="/tools/reddit-post-rewriter" className="hover:underline">Reddit Post Rewriter</Link></li>
              <li><Link href="/tools/cold-dm-personalizer" className="hover:underline">Cold DM Personalizer</Link></li>
            </ul>
          </div>
          <div className="min-w-0 rounded-lg border border-white/30 p-3 text-left sm:p-4 lg:p-3.5 xl:p-4">
            <div className="text-base font-bold leading-snug sm:text-lg lg:text-base xl:text-xl">
              <p>Monetization Tools</p>
              <p>(MAKE PEOPLE MONEY)</p>
            </div>
            <ul className="mt-3.5 space-y-1 text-xs font-medium text-gray-200 sm:mt-4 sm:space-y-1.5 sm:text-sm lg:text-xs xl:text-sm">
              <li><Link href="/tools/simple-paywall-link-generator" className="hover:underline">Simple Paywall Link Generator</Link></li>
              <li><Link href="/tools/digital-product-bundle-builder" className="hover:underline">Digital Product Bundle Builder</Link></li>
              <li><Link href="/tools/pricing-calculator" className="hover:underline">Pricing Calculator</Link></li>
              <li><Link href="/tools/upsell-generator" className="hover:underline">Upsell Generator</Link></li>
              <li><Link href="/tools/testimonial-collector-tool" className="hover:underline">Testimonial Collector Tool</Link></li>
              <li><Link href="/tools/simple-affiliate-link-manager" className="hover:underline">Simple Affiliate Link Manager</Link></li>
            </ul>
          </div>
          <div className="min-w-0 rounded-lg border border-white/30 p-3 text-left sm:p-4 lg:p-3.5 xl:p-4">
            <div className="text-base font-bold leading-snug sm:text-lg lg:text-base xl:text-xl">
              <p className="break-words">Client / CRM Tools</p>
              <p className="break-words text-balance">(ALIGNED WITH &quot;FollowThru&quot;)</p>
            </div>
            <ul className="mt-3.5 space-y-1 text-xs font-medium text-gray-200 sm:mt-4 sm:space-y-1.5 sm:text-sm lg:text-xs xl:text-sm">
              <li>
                <Link href="/tools/agreement-link-generator" className="hover:underline">
                  Agreement Link Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/invoice-reminder-tool" className="hover:underline">
                  Invoice + Reminder Tool
                </Link>
              </li>
              <li>
                <Link href="/tools/client-onboarding-checklist-generator" className="hover:underline">
                  Client Onboarding Checklist Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/scope-creep-tracker" className="hover:underline">
                  Scope Creep Tracker
                </Link>
              </li>
              <li>
                <Link href="/tools/follow-up-reminder-ai" className="hover:underline">
                  Follow-Up Reminder AI
                </Link>
              </li>
              <li>
                <Link href="/tools/simple-proposal-builder" className="hover:underline">
                  Simple Proposal Builder
                </Link>
              </li>
              <li>
                <Link href="/tools/late-payment-nudger" className="hover:underline">
                  Late Payment Nudger (auto messages)
                </Link>
              </li>
              <li>
                <Link href="/tools/meeting-summary-action-items" className="hover:underline">
                  Meeting Summary → Action Items
                </Link>
              </li>
            </ul>
          </div>
          <div className="min-w-0 rounded-lg border border-white/30 p-3 text-left sm:p-4 lg:p-3.5 xl:p-4">
            <div className="text-base font-bold leading-snug sm:text-lg lg:text-base xl:text-xl">
              <p>Audience &amp; Research Tools</p>
              <p>(VERY HOT RIGHT NOW)</p>
            </div>
            <ul className="mt-3.5 space-y-1 text-xs font-medium text-gray-200 sm:mt-4 sm:space-y-1.5 sm:text-sm lg:text-xs xl:text-sm">
              <li>
                <Link href="/tools/find-my-audience" className="hover:underline">
                  Find My Audience
                </Link>
              </li>
              <li>
                <Link href="/tools/niche-validator" className="hover:underline">
                  Niche Validator
                </Link>
              </li>
              <li>
                <Link href="/tools/competitor-scanner" className="hover:underline">
                  Competitor Scanner
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/keyword-opportunity-finder"
                  className="hover:underline"
                >
                  Keyword Opportunity Finder
                </Link>
              </li>
              <li>
                <Link href="/tools/trend-explainer" className="hover:underline">
                  Trend Explainer
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/customer-pain-point-extractor"
                  className="hover:underline"
                >
                  Customer Pain Point Extractor
                </Link>
              </li>
            </ul>
          </div>
          <div className="min-w-0 rounded-lg border border-white/30 p-3 text-left sm:p-4 lg:p-3.5 xl:p-4">
            <div className="text-base font-bold leading-snug sm:text-lg lg:text-base xl:text-xl">
              <p>Website &amp; Conversion Tools</p>
            </div>
            <ul className="mt-3.5 space-y-1 text-xs font-medium text-gray-200 sm:mt-4 sm:space-y-1.5 sm:text-sm lg:text-xs xl:text-sm">
              <li>
                <Link href="/tools/seo-meta-tag-generator" className="hover:underline">
                  SEO Meta Tag Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/privacy-policy-generator" className="hover:underline">
                  Privacy Policy Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/terms-generator" className="hover:underline">
                  Terms Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/simple-ab-test-tool" className="hover:underline">
                  Simple A/B Test Tool
                </Link>
              </li>
              <li>
                <Link href="/tools/website-speed-explainer" className="hover:underline">
                  Website Speed Explainer
                </Link>
              </li>
              <li>
                <Link href="/tools/landing-copy" className="hover:underline">
                  Landing Page Copy Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/landing-page-critiquer" className="hover:underline">
                  Landing Page Critiquer
                </Link>
              </li>
              <li>
                <Link href="/tools/checkout-page-optimizer" className="hover:underline">
                  Checkout Page Optimizer
                </Link>
              </li>
            </ul>
          </div>
          <div className="min-w-0 rounded-lg border border-white/30 p-3 text-left sm:p-4 lg:p-3.5 xl:p-4">
            <div className="text-base font-bold leading-snug sm:text-lg lg:text-base xl:text-xl">
              <p>Automation Tools</p>
              <p>(NO-CODE FEEL)</p>
            </div>
            <ul className="mt-3.5 space-y-1 text-xs font-medium text-gray-200 sm:mt-4 sm:space-y-1.5 sm:text-sm lg:text-xs xl:text-sm">
              <li>
                <Link href="/tools/auto-follow-up-sender" className="hover:underline">
                  Auto Follow-Up Sender
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/lead-capture-email-sequence"
                  className="hover:underline"
                >
                  Lead Capture → Email Sequence Tool
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/form-google-sheet-email-workflow"
                  className="hover:underline"
                >
                  Form → Google Sheet → Email Workflow
                </Link>
              </li>
              <li>
                <Link href="/tools/dm-crm-capture" className="hover:underline">
                  DM → CRM Capture Tool
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
