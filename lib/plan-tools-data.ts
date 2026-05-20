/**
 * Tool slugs included in each public paid tier (matches `lib/subscription_tables.sql` seeds).
 * Used when DB is unavailable so /plan-tools still matches pricing tiers.
 */
export const FALLBACK_TOOL_SLUGS_BY_PLAN = {
  starter: [
    'ai-caption-generator',
    'content-idea-generator',
    'hashtag-research',
    'content-calendar',
    'best-time-to-post',
    'readability-checker',
    'bio-generator',
    'content-library',
    'post-scheduler',
    'analytics-dashboard',
    'seo-optimizer',
    'content-repurposer',
    'video-script-generator',
    'blog-outline-generator',
    'engagement-calculator',
    'hashtag-analyzer',
    'social-media-report-generator',
    'viral-content-predictor',
    'video-transcript-generator',
    'thumbnail-text-generator',
    'quote-card-generator',
    'image-alt-text-generator',
    'podcast-show-notes-generator',
    'competitor-analyzer',
    'trend-tracker',
    'content-gap-analyzer',
    'brand-mention-tracker',
    'sentiment-analyzer',
    'follower-growth-tracker',
    'cross-platform-analytics',
    'brand-kit-manager',
    'color-palette-extractor',
    'font-pairing-tool',
    'style-guide-creator',
    'profile-optimizer',
    'rate-calculator',
    'revenue-tracker',
    'poll-question-generator',
    'giveaway-manager',
    'influencer-outreach-tool',
    'collaboration-manager',
    'link-in-bio-manager',
    'link-in-bio-optimizer',
    'social-media-post-formatter',
    'social-scheduler',
    'social-graphics',
    'multi-platform-generator',
  ],
  essential: [
    'ai-caption-generator',
    'content-idea-generator',
    'hashtag-research',
    'content-calendar',
    'best-time-to-post',
    'readability-checker',
    'bio-generator',
    'content-library',
    'post-scheduler',
    'analytics-dashboard',
    'seo-optimizer',
    'content-repurposer',
    'video-script-generator',
    'blog-outline-generator',
    'engagement-calculator',
    'hashtag-analyzer',
    'social-media-report-generator',
    'social-graphics',
    'multi-platform-generator',
  ],
  professional: [
    'ai-caption-generator',
    'content-idea-generator',
    'hashtag-research',
    'content-calendar',
    'best-time-to-post',
    'readability-checker',
    'bio-generator',
    'content-library',
    'post-scheduler',
    'analytics-dashboard',
    'seo-optimizer',
    'content-repurposer',
    'video-script-generator',
    'blog-outline-generator',
    'engagement-calculator',
    'hashtag-analyzer',
    'social-media-report-generator',
    'viral-content-predictor',
    'video-transcript-generator',
    'thumbnail-text-generator',
    'quote-card-generator',
    'image-alt-text-generator',
    'podcast-show-notes-generator',
    'competitor-analyzer',
    'trend-tracker',
    'content-gap-analyzer',
    'brand-mention-tracker',
    'sentiment-analyzer',
    'follower-growth-tracker',
    'cross-platform-analytics',
    'brand-kit-manager',
    'color-palette-extractor',
    'font-pairing-tool',
    'style-guide-creator',
    'profile-optimizer',
    'rate-calculator',
    'revenue-tracker',
    'poll-question-generator',
    'giveaway-manager',
    'influencer-outreach-tool',
    'collaboration-manager',
    'link-in-bio-manager',
    'link-in-bio-optimizer',
    'social-media-post-formatter',
    'social-scheduler',
    'social-graphics',
    'multi-platform-generator',
  ],
} as const

export type PublicPlanDbName = keyof typeof FALLBACK_TOOL_SLUGS_BY_PLAN

/** Map pricing UI / URL variants to DB plan `name` used in `plans` and `/api/plans`. */
export function normalizePlanQueryParam(raw: string | string[] | undefined): PublicPlanDbName | null {
  const q = Array.isArray(raw) ? raw[0] : raw
  if (!q || typeof q !== 'string') return null
  const n = q.toLowerCase().trim().replace(/\s+/g, ' ')
  if (n === 'starter') return 'starter'
  if (n === 'essential' || n === 'creator') return 'essential'
  if (n === 'professional' || n === 'full creator' || n === 'fullcreator') return 'professional'
  return null
}

export function labelFromToolSlug(slug: string): string {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
