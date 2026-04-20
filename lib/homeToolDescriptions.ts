import { lifeToolHomeDescriptions } from '@/lib/lifeTools/metadata'
import { localServiceToolHomeDescriptions } from '@/lib/localServiceTools/metadata'

/** One-line descriptions for home marketing tool links (hover / focus tooltips). */
const CORE_HOME_TOOL_DESCRIPTIONS: Record<string, string> = {
  '/tools/hook-generator':
    'Generate scroll-stopping hooks for posts, ads, and videos from your topic or offer.',
  '/tools/content-idea-engine':
    'Brainstorm angles, series, and post ideas tailored to your niche and platform.',
  '/tools/youtube-title-optimizer':
    'Improve titles for CTR and clarity while keeping your topic and keywords honest.',
  '/tools/tiktok-trend-finder':
    'Spot trend angles and formats you can adapt before they cool off.',
  '/tools/newsletter-topic-generator':
    'Turn themes and subscriber goals into subject lines and issue outlines.',
  '/tools/reddit-post-rewriter':
    'Rewrite posts for tone, subreddit norms, and clarity without losing intent.',
  '/tools/cold-dm-personalizer':
    'Shorten and personalize outreach DMs from a prospect snippet and your ask.',
  '/tools/simple-paywall-link-generator':
    'Describe your offer and get copy-ready paywall / checkout link messaging.',
  '/tools/digital-product-bundle-builder':
    'Outline bundles, pricing tiers, and what to include in each package.',
  '/tools/pricing-calculator':
    'Work back from hours, costs, and margin to land on sane client or product prices.',
  '/tools/upsell-generator':
    'Suggest natural upsells and bump offers that fit the product someone already bought.',
  '/tools/testimonial-collector-tool':
    'Draft testimonial request emails and prompts clients can answer in one pass.',
  '/tools/simple-affiliate-link-manager':
    'Organize affiliate links, default parameters, and disclosure snippets in one place.',
  '/tools/agreement-link-generator':
    'Produce plain-language scope bullets and link-friendly agreement summaries.',
  '/tools/invoice-reminder-tool':
    'Polite invoice and reminder emails with dates and payment options spelled out.',
  '/tools/client-onboarding-checklist-generator':
    'Checklists for kickoff, assets, approvals, and handoff so nothing gets missed.',
  '/tools/scope-creep-tracker':
    'Log change requests, impact, and responses so scope stays visible to everyone.',
  '/tools/follow-up-reminder-ai':
    'Sequence-style follow-up lines for proposals, invoices, and stalled threads.',
  '/tools/simple-proposal-builder':
    'Structured proposals: problem, approach, timeline, and pricing blocks you can send.',
  '/tools/late-payment-nudger':
    'Escalating payment reminder messages that stay professional but firm.',
  '/tools/meeting-summary-action-items':
    'Turn rough notes into a tight recap plus owners and deadlines.',
  '/tools/find-my-audience':
    'Clarify who you serve, where they hang out, and what language resonates.',
  '/tools/niche-validator':
    'Stress-test a niche for demand, differentiation, and realistic monetization paths.',
  '/tools/competitor-scanner':
    'Compare positioning, offers, and gaps from public-facing competitor signals.',
  '/tools/keyword-opportunity-finder':
    'Prioritize keywords by intent, difficulty, and fit for your current authority.',
  '/tools/trend-explainer':
    'Explain why a trend matters and how a creator could credibly participate.',
  '/tools/customer-pain-point-extractor':
    'Mine reviews and comments for recurring pains to address in copy and product.',
  '/tools/seo-meta-tag-generator':
    'Title and meta description options that fit length limits and search intent.',
  '/tools/privacy-policy-generator':
    'Section-by-section privacy copy starters aligned to common data practices.',
  '/tools/terms-generator':
    'Draft terms-of-use sections you can have reviewed before going live.',
  '/tools/simple-ab-test-tool':
    'Define variants, success metrics, and runtime for simple landing experiments.',
  '/tools/website-speed-explainer':
    'Translate load metrics into plain English fixes for you or your developer.',
  '/tools/landing-copy':
    'Headlines, bullets, and CTAs for a landing page from offer and audience inputs.',
  '/tools/landing-page-critiquer':
    'Structured critique: clarity, proof, friction, and CTA strength.',
  '/tools/checkout-page-optimizer':
    'Reduce checkout drop-off with trust, urgency, and form-field hygiene tips.',
  '/tools/auto-follow-up-sender':
    'Templates and timing patterns for automated follow-up sequences.',
  '/tools/lead-capture-email-sequence':
    'Welcome and nurture emails after someone opts in from your lead magnet.',
  '/tools/form-google-sheet-email-workflow':
    'Connect form submissions to sheets and notification emails without glue code.',
  '/tools/dm-crm-capture':
    'Parse pasted DMs into structured lead fields you can drop into a CRM.',
  '/tools/notion-to-pdf-exporter':
    'Print-ready preview and checklist to turn Notion-style notes into a clean PDF.',
  '/tools/meeting-summarizer':
    'Paste a meeting transcript for summary bullets, decisions, and action items.',
  '/tools/recurring-task-automator':
    'Human-readable schedules and reminder lines for recurring calendar blocks.',
  '/tools/email-digest-builder':
    'Bundle newsletter lines into a Markdown digest with a ready-made subject.',
  '/tools/focus-timer-analytics':
    'Score a day of Pomodoro-style focus from counts you enter and get one next goal.',
  '/tools/uptime-monitor':
    'Build uptime checklists, email/Slack alert templates, and probe intervals — use a real monitor for pings.',
  '/tools/seo-audit-tool':
    'Score on-page SEO health from your URL plus sitemap, mobile, and meta signals (no live crawl).',
  '/tools/google-analytics-simplifier':
    'Turn GA4 headline numbers into plain-English KPI blurbs and “what to do next” for stakeholders.',
  '/tools/changelog-generator':
    'Group pasted commit lines into a Keep-a-Changelog-style Markdown draft for a release.',
  '/tools/heatmap-recorder':
    'Render an ASCII density grid from x,y samples and get privacy + SDK rollout tips (not live recording).',
  '/tools/invoice-generator':
    'Build a Markdown invoice table with tax from line items — for freelancers, not legal advice.',
  '/tools/expense-tracker':
    'Group pasted category,amount lines and export a simple CSV rollup for bookkeeping.',
  '/tools/subscription-tracker':
    'List SaaS lines with monthly/yearly prices to see monthly-equivalent and yearly burn.',
  '/tools/revenue-dashboard-visualizer':
    'Narrate MRR, churn, and Stripe/Paddle-style reporting from numbers you enter (no API).',
  '/tools/ai-blog-post-writer':
    'SEO-style sectioned draft from topic, audience, and keywords — template-based, no live LLM.',
  '/tools/ai-image-alt-generator':
    'Three accessibility-minded alt-text variants from image context and optional page topic.',
  '/tools/ai-email-reply-assistant':
    'Professional, brief, and friendly reply skeletons from pasted email context.',
  '/tools/ai-product-description-writer':
    'Short + long ecommerce copy from product name and feature bullets.',
  '/tools/ai-cold-outreach-personalizer':
    'Subject + opener pairs from company, role, value prop, and optional signal.',
  '/tools/marketing-social-scheduler':
    'Weekly cross-platform post slots and checklist — import into Buffer or native schedulers.',
  '/tools/link-in-bio-landing-builder':
    'Markdown + compact HTML button stack from headline and label,url pairs.',
  '/tools/review-request-automator':
    'Two email timings plus SMS text to ask for reviews after purchase.',
  '/tools/twitter-thread-composer':
    'Split long copy into numbered tweets under your max character length.',
  '/tools/lead-magnet-delivery-tool':
    'Three-email delivery sequence after signup with download link and follow-ups.',
  '/tools/client-portal-builder':
    'Markdown outline for client portal modules: status, files, invoices, approvals.',
  '/tools/proposal-contract-generator':
    'Proposal Markdown plus legal review checklist — not a substitute for counsel.',
  '/tools/simple-crm-lite':
    'Paste name,email,stage rows to see counts per pipeline stage.',
  '/tools/feedback-widget-generator':
    'Floating button + panel HTML/JS snippet targeting your webhook (secure server-side yourself).',
  '/tools/team-standup-bot':
    'Async Slack and email standup templates with standard three questions.',
  '/tools/webhook-tester':
    'Capture POSTs to a unique URL (in-memory) or paste a payload to inspect JSON and headers.',
  '/tools/api-key-manager':
    'Encrypt API keys in the browser with a passphrase; masked display and rotation reminders (local only).',
  '/tools/form-builder':
    'Generate embeddable HTML for forms that POST to Formspree, Netlify, or your own handler.',
  '/tools/qr-code-generator':
    'PNG QR from URL or text with custom dark/light hex colors.',
  '/tools/url-shortener':
    'Create short links on this host with in-memory click counts — demo/sandbox, not durable storage.',
}

export const HOME_TOOL_DESCRIPTIONS: Record<string, string> = {
  ...CORE_HOME_TOOL_DESCRIPTIONS,
  ...localServiceToolHomeDescriptions(),
  ...lifeToolHomeDescriptions(),
}

export function homeToolTipId(href: string): string {
  return `home-tip-${href.replace(/^\//, '').replace(/\//g, '-')}`
}
