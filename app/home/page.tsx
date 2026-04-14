import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <main className="relative min-h-[70vh] overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_55%)]" />
      <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-start pt-14 px-6 text-center">
        <p className="mb-5 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1 text-xs font-semibold tracking-[0.18em] text-blue-300">
          BUILT TO SHIP
        </p>
        <h1 className="mb-4 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-5xl font-extrabold leading-tight text-transparent sm:text-7xl">
          ToolMarket365
        </h1>
        <p className="max-w-3xl text-base text-gray-300 sm:text-lg">
          Your entire business, one tab, built with the toolkit the internet forgot to build.
        </p>
        <div className="mt-8 flex w-full max-w-6xl flex-wrap items-start justify-center gap-6 self-center">
          <div className="inline-block w-fit rounded-lg border border-white/30 p-6 text-left">
            <div className="text-2xl font-bold sm:text-3xl">
              <p>Creator Growth Tools</p>
              <p>(HIGH DEMAND)</p>
            </div>
            <ul className="mt-5 space-y-2 text-base font-medium text-gray-200">
              <li><Link href="/tools/hook-generator" className="hover:underline">Hook Generator</Link></li>
              <li><Link href="/tools/content-idea-engine" className="hover:underline">Content Idea Engine</Link></li>
              <li><Link href="/tools/youtube-title-optimizer" className="hover:underline">YouTube Title Optimizer</Link></li>
              <li><Link href="/tools/tiktok-trend-finder" className="hover:underline">TikTok Trend Finder</Link></li>
              <li><Link href="/tools/newsletter-topic-generator" className="hover:underline">Newsletter Topic Generator</Link></li>
              <li><Link href="/tools/reddit-post-rewriter" className="hover:underline">Reddit Post Rewriter</Link></li>
              <li><Link href="/tools/cold-dm-personalizer" className="hover:underline">Cold DM Personalizer</Link></li>
            </ul>
          </div>
          <div className="inline-block w-fit rounded-lg border border-white/30 p-6 text-left">
            <div className="text-2xl font-bold sm:text-3xl">
              <p>Monetization Tools</p>
              <p>(MAKE PEOPLE MONEY)</p>
            </div>
            <ul className="mt-5 space-y-2 text-base font-medium text-gray-200">
              <li><Link href="/tools/simple-paywall-link-generator" className="hover:underline">Simple Paywall Link Generator</Link></li>
              <li><Link href="/tools/digital-product-bundle-builder" className="hover:underline">Digital Product Bundle Builder</Link></li>
              <li><Link href="/tools/pricing-calculator" className="hover:underline">Pricing Calculator</Link></li>
              <li><Link href="/tools/landing-copy" className="hover:underline">Landing Page Copy Generator</Link></li>
              <li><Link href="/tools/upsell-generator" className="hover:underline">Upsell Generator</Link></li>
              <li><Link href="/tools/checkout-page-optimizer" className="hover:underline">Checkout Page Optimizer</Link></li>
              <li><Link href="/tools/testimonial-collector-tool" className="hover:underline">Testimonial Collector Tool</Link></li>
              <li><Link href="/tools/simple-affiliate-link-manager" className="hover:underline">Simple Affiliate Link Manager</Link></li>
            </ul>
          </div>
          <div className="inline-block w-fit rounded-lg border border-white/30 p-6 text-left">
            <div className="text-2xl font-bold sm:text-3xl">
              <p>Client / CRM Tools</p>
              <p>(ALIGNED WITH "FollowThru")</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
