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
        <div className="mt-8 grid w-full max-w-[100rem] grid-cols-1 gap-4 self-start text-left sm:gap-5 lg:grid-cols-3 lg:gap-4 xl:gap-6">
          <div className="min-w-0 rounded-lg border border-white/30 p-4 text-left sm:p-5 lg:p-4 xl:p-6">
            <div className="text-lg font-bold leading-snug sm:text-xl lg:text-lg xl:text-2xl">
              <p>Creator Growth Tools</p>
              <p>(HIGH DEMAND)</p>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm font-medium text-gray-200 sm:mt-5 sm:space-y-2 sm:text-base lg:text-sm xl:text-base">
              <li><Link href="/tools/hook-generator" className="hover:underline">Hook Generator</Link></li>
              <li><Link href="/tools/content-idea-engine" className="hover:underline">Content Idea Engine</Link></li>
              <li><Link href="/tools/youtube-title-optimizer" className="hover:underline">YouTube Title Optimizer</Link></li>
              <li><Link href="/tools/tiktok-trend-finder" className="hover:underline">TikTok Trend Finder</Link></li>
              <li><Link href="/tools/newsletter-topic-generator" className="hover:underline">Newsletter Topic Generator</Link></li>
              <li><Link href="/tools/reddit-post-rewriter" className="hover:underline">Reddit Post Rewriter</Link></li>
              <li><Link href="/tools/cold-dm-personalizer" className="hover:underline">Cold DM Personalizer</Link></li>
            </ul>
          </div>
          <div className="min-w-0 rounded-lg border border-white/30 p-4 text-left sm:p-5 lg:p-4 xl:p-6">
            <div className="text-lg font-bold leading-snug sm:text-xl lg:text-lg xl:text-2xl">
              <p>Monetization Tools</p>
              <p>(MAKE PEOPLE MONEY)</p>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm font-medium text-gray-200 sm:mt-5 sm:space-y-2 sm:text-base lg:text-sm xl:text-base">
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
          <div className="min-w-0 rounded-lg border border-white/30 p-4 text-left sm:p-5 lg:p-4 xl:p-6">
            <div className="text-lg font-bold leading-snug sm:text-xl lg:text-lg xl:text-2xl">
              <p className="break-words">Client / CRM Tools</p>
              <p className="break-words text-balance">(ALIGNED WITH &quot;FollowThru&quot;)</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
