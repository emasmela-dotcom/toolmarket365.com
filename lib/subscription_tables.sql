-- ============================================
-- SUBSCRIPTION & TRIAL SYSTEM TABLES
-- Run these commands in your database
-- ============================================

-- Plans table - defines subscription plans and their tool access
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE, -- 'starter', 'essential', 'professional', 'creator', 'business'
  display_name VARCHAR(100) NOT NULL, -- 'Starter', 'Essential', etc.
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  trial_days INTEGER DEFAULT 7,
  tool_slugs TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- Array of tool slugs included in this plan
  features JSONB DEFAULT '{}'::jsonb, -- Additional features/limits (storage, API calls, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions table - tracks trial and subscription status
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status VARCHAR(20) NOT NULL DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'expired', 'canceled')),
  trial_started_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  subscription_started_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id VARCHAR(255), -- For Stripe integration
  stripe_customer_id VARCHAR(255),
  can_downgrade BOOLEAN DEFAULT FALSE, -- Always FALSE after trial (no downgrades allowed)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id) -- One active subscription per user
);

-- Content snapshots table - stores pre-trial state for restore
CREATE TABLE IF NOT EXISTS content_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  snapshot_type VARCHAR(20) NOT NULL CHECK (snapshot_type IN ('pre_trial', 'trial_end', 'manual')),
  snapshot_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Stores all user content at snapshot time
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE -- Only one active snapshot per type per user
);

-- Tool access log (optional - for analytics and debugging)
CREATE TABLE IF NOT EXISTS tool_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_slug VARCHAR(255) NOT NULL,
  plan_id UUID REFERENCES plans(id),
  access_granted BOOLEAN NOT NULL,
  reason TEXT, -- Why access was granted/denied
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for subscription system
CREATE INDEX IF NOT EXISTS idx_plans_name ON plans(name);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_trial_ends_at ON user_subscriptions(trial_ends_at);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_subscription_ends_at ON user_subscriptions(subscription_ends_at);
CREATE INDEX IF NOT EXISTS idx_content_snapshots_user_id ON content_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_content_snapshots_type ON content_snapshots(snapshot_type);
CREATE INDEX IF NOT EXISTS idx_content_snapshots_is_active ON content_snapshots(is_active);
CREATE INDEX IF NOT EXISTS idx_tool_access_log_user_id ON tool_access_log(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_access_log_tool_slug ON tool_access_log(tool_slug);
CREATE INDEX IF NOT EXISTS idx_tool_access_log_created_at ON tool_access_log(created_at DESC);

-- ============================================
-- SEED DATA: Insert Plans with Tool Mappings
-- ============================================

-- Starter Plan ($9/month) - 8 tools
INSERT INTO plans (name, display_name, price_monthly, price_yearly, trial_days, tool_slugs, features)
VALUES (
  'starter',
  'Starter',
  9.00,
  86.40, -- 20% discount for yearly
  7,
  ARRAY[
    'ai-caption-generator',
    'content-idea-generator',
    'hashtag-research',
    'content-calendar',
    'best-time-to-post',
    'readability-checker',
    'bio-generator',
    'content-library'
  ],
  '{"content_library_limit": 100, "storage": "local"}'::jsonb
) ON CONFLICT (name) DO NOTHING;

-- Essential Plan ($19/month) - 18 tools
INSERT INTO plans (name, display_name, price_monthly, price_yearly, trial_days, tool_slugs, features)
VALUES (
  'essential',
  'Essential',
  19.00,
  182.40, -- 20% discount for yearly
  7,
  ARRAY[
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
    'multi-platform-generator'
  ],
  '{"content_library_limit": 500, "storage": "cloud"}'::jsonb
) ON CONFLICT (name) DO NOTHING;

-- Professional Plan ($49/month) - 35+ tools
INSERT INTO plans (name, display_name, price_monthly, price_yearly, trial_days, tool_slugs, features)
VALUES (
  'professional',
  'Professional',
  49.00,
  470.40, -- 20% discount for yearly
  7,
  ARRAY[
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
    'multi-platform-generator'
  ],
  '{"content_library_limit": -1, "storage": "cloud", "unlimited": true}'::jsonb
) ON CONFLICT (name) DO NOTHING;

-- Creator Plan ($79/month) - All 43+ tools
INSERT INTO plans (name, display_name, price_monthly, price_yearly, trial_days, tool_slugs, features)
VALUES (
  'creator',
  'Creator',
  79.00,
  758.40, -- 20% discount for yearly
  7,
  ARRAY[
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
    'ai-lead-follow-up-agent'
  ],
  '{"content_library_limit": -1, "storage": "cloud", "unlimited": true, "priority_support": true}'::jsonb
) ON CONFLICT (name) DO NOTHING;

-- Business Plan ($149/month) - All tools + team features
INSERT INTO plans (name, display_name, price_monthly, price_yearly, trial_days, tool_slugs, features)
VALUES (
  'business',
  'Business',
  149.00,
  1430.40, -- 20% discount for yearly
  7,
  ARRAY[
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
    'ai-lead-follow-up-agent'
  ],
  '{"content_library_limit": -1, "storage": "cloud", "unlimited": true, "priority_support": true, "team_features": true, "api_access": true, "white_label": true, "custom_integrations": true}'::jsonb
) ON CONFLICT (name) DO NOTHING;
