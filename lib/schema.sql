-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  page VARCHAR(255) NOT NULL,
  referrer TEXT,
  device VARCHAR(50) NOT NULL,
  site VARCHAR(255),
  user_agent TEXT
);

-- Tool usage tracking
CREATE TABLE IF NOT EXISTS tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_slug VARCHAR(255) NOT NULL,
  usage_count INTEGER DEFAULT 1,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tool_slug)
);

-- Users (Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Sessions (cookie-based auth)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Password resets
CREATE TABLE IF NOT EXISTS password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE
);

-- Scheduled posts (Social Scheduler)
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'local',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'canceled')),
  platform VARCHAR(50) NOT NULL DEFAULT 'Other',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  title VARCHAR(200),
  body TEXT NOT NULL,
  media_urls TEXT[]
);

-- If the table already exists from an older version, ensure new columns exist
ALTER TABLE scheduled_posts ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT 'local';
ALTER TABLE scheduled_posts ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE scheduled_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE scheduled_posts ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'draft';
ALTER TABLE scheduled_posts ADD COLUMN IF NOT EXISTS platform VARCHAR(50) NOT NULL DEFAULT 'Other';
ALTER TABLE scheduled_posts ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP WITH TIME ZONE;
ALTER TABLE scheduled_posts ADD COLUMN IF NOT EXISTS title VARCHAR(200);
ALTER TABLE scheduled_posts ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE scheduled_posts ADD COLUMN IF NOT EXISTS media_urls TEXT[];

-- Viral predictions table
CREATE TABLE IF NOT EXISTS viral_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  content JSONB NOT NULL,
  analysis JSONB NOT NULL,
  prediction JSONB NOT NULL,
  performance JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_for TIMESTAMP WITH TIME ZONE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_page ON analytics(page);
CREATE INDEX IF NOT EXISTS idx_tool_usage_slug ON tool_usage(tool_slug);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_for ON scheduled_posts(scheduled_for DESC);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_created_at ON scheduled_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_user_id ON scheduled_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires_at ON password_resets(expires_at);
CREATE INDEX IF NOT EXISTS idx_viral_predictions_user_id ON viral_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_viral_predictions_created_at ON viral_predictions(created_at DESC);

-- Content performance tracking table
CREATE TABLE IF NOT EXISTS content_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  prediction_id TEXT,
  content JSONB NOT NULL,
  prediction JSONB NOT NULL,
  actual JSONB,
  accuracy JSONB,
  ab_test JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A/B tests table
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  name TEXT NOT NULL,
  hypothesis TEXT,
  content_id TEXT,
  variants JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'paused')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  winner TEXT,
  confidence NUMERIC(5,2),
  traffic_split INTEGER DEFAULT 50,
  minimum_sample_size INTEGER DEFAULT 1000,
  success_metric TEXT DEFAULT 'engagement',
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User performance metrics table
CREATE TABLE IF NOT EXISTS user_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  period TEXT NOT NULL,
  date DATE NOT NULL,
  total_predictions INTEGER DEFAULT 0,
  accurate_predictions INTEGER DEFAULT 0,
  average_accuracy NUMERIC(5,2),
  best_performing_content JSONB,
  worst_performing_content JSONB,
  content_patterns JSONB,
  roi NUMERIC(10,2),
  engagement_growth NUMERIC(5,2),
  viral_content_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, period, date)
);

-- Indexes for content performance
CREATE INDEX IF NOT EXISTS idx_content_performance_user_id ON content_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_content_performance_created_at ON content_performance(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_performance_prediction_id ON content_performance(prediction_id);

-- Indexes for A/B tests
CREATE INDEX IF NOT EXISTS idx_ab_tests_user_id ON ab_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_start_date ON ab_tests(start_date DESC);

-- Indexes for user performance metrics
CREATE INDEX IF NOT EXISTS idx_user_performance_metrics_user_id ON user_performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_performance_metrics_date ON user_performance_metrics(date DESC);

-- Enhanced Content Library tables
CREATE TABLE IF NOT EXISTS content_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'video', 'audio', 'document', 'url', 'post', 'template', 'collection')),
  content_data JSONB NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  category TEXT,
  collection_id UUID,
  template_id UUID,
  metadata JSONB,
  performance_data JSONB,
  viral_prediction_id UUID REFERENCES viral_predictions(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'scheduled')),
  is_favorite BOOLEAN DEFAULT FALSE,
  is_template BOOLEAN DEFAULT FALSE,
  version INTEGER DEFAULT 1,
  parent_id UUID REFERENCES content_library(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE
);

-- Content collections (folders/organization)
CREATE TABLE IF NOT EXISTS content_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content templates
CREATE TABLE IF NOT EXISTS content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_public BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content versions (version history)
CREATE TABLE IF NOT EXISTS content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content_library(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content_data JSONB NOT NULL,
  change_summary TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content relationships (for repurposing, linking)
CREATE TABLE IF NOT EXISTS content_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_content_id UUID NOT NULL REFERENCES content_library(id) ON DELETE CASCADE,
  target_content_id UUID NOT NULL REFERENCES content_library(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('repurposed_from', 'variant_of', 'related_to', 'part_of', 'inspired_by')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_content_id, target_content_id, relationship_type)
);

-- Indexes for content library
CREATE INDEX IF NOT EXISTS idx_content_library_user_id ON content_library(user_id);
CREATE INDEX IF NOT EXISTS idx_content_library_content_type ON content_library(content_type);
CREATE INDEX IF NOT EXISTS idx_content_library_status ON content_library(status);
CREATE INDEX IF NOT EXISTS idx_content_library_created_at ON content_library(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_library_collection_id ON content_library(collection_id);
CREATE INDEX IF NOT EXISTS idx_content_library_tags ON content_library USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_library_search ON content_library USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Indexes for collections
CREATE INDEX IF NOT EXISTS idx_content_collections_user_id ON content_collections(user_id);

-- Indexes for templates
CREATE INDEX IF NOT EXISTS idx_content_templates_user_id ON content_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_is_public ON content_templates(is_public);

-- Indexes for versions
CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON content_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_created_at ON content_versions(created_at DESC);

-- Indexes for relationships
CREATE INDEX IF NOT EXISTS idx_content_relationships_source ON content_relationships(source_content_id);
CREATE INDEX IF NOT EXISTS idx_content_relationships_target ON content_relationships(target_content_id);

-- ============================================
-- SUBSCRIPTION & TRIAL SYSTEM TABLES
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
-- DAILY CAPTION BOT TABLES
-- Template-based caption generation (zero external API usage)
-- ============================================

-- Captions table
CREATE TABLE IF NOT EXISTS bot_captions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    tone VARCHAR(50) NOT NULL CHECK (tone IN ('professional', 'casual', 'funny', 'inspirational', 'educational')),
    theme VARCHAR(100) NOT NULL,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'facebook', 'twitter', 'linkedin', 'tiktok')),
    hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    emojis TEXT[] DEFAULT ARRAY[]::TEXT[],
    category VARCHAR(50) DEFAULT 'general',
    is_generated BOOLEAN DEFAULT true,
    is_used BOOLEAN DEFAULT false,
    performance_data JSONB DEFAULT '{}'::jsonb,
    scheduled_for TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences for caption bot
CREATE TABLE IF NOT EXISTS bot_user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    content_themes TEXT[] NOT NULL DEFAULT ARRAY['business', 'motivation', 'tips', 'behind-the-scenes']::TEXT[],
    brand_tone VARCHAR(50) DEFAULT 'professional' CHECK (brand_tone IN ('professional', 'casual', 'funny', 'inspirational', 'educational')),
    target_audience TEXT DEFAULT 'small business owners',
    industry VARCHAR(100) DEFAULT 'digital marketing',
    preferred_platforms TEXT[] DEFAULT ARRAY['instagram', 'facebook', 'linkedin']::TEXT[],
    posting_schedule JSONB DEFAULT '{"instagram": true, "facebook": true, "linkedin": true, "twitter": false, "tiktok": false}'::jsonb,
    custom_prompts TEXT[] DEFAULT ARRAY[]::TEXT[],
    daily_generation_enabled BOOLEAN DEFAULT true,
    generation_time TIME DEFAULT '06:00:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Caption templates (pre-defined, no external APIs)
CREATE TABLE IF NOT EXISTS bot_caption_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    template TEXT NOT NULL,
    variables TEXT[] DEFAULT ARRAY[]::TEXT[],
    platform VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    tone VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    average_engagement DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for bot tables
CREATE INDEX IF NOT EXISTS idx_bot_captions_user_id ON bot_captions(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_captions_platform ON bot_captions(platform);
CREATE INDEX IF NOT EXISTS idx_bot_captions_tone ON bot_captions(tone);
CREATE INDEX IF NOT EXISTS idx_bot_captions_created_at ON bot_captions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bot_captions_is_used ON bot_captions(is_used);
CREATE INDEX IF NOT EXISTS idx_bot_user_preferences_user_id ON bot_user_preferences(user_id);

-- Updated at triggers for bot tables (reuse existing function)
CREATE TRIGGER update_bot_captions_updated_at BEFORE UPDATE ON bot_captions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_user_preferences_updated_at BEFORE UPDATE ON bot_user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_caption_templates_updated_at BEFORE UPDATE ON bot_caption_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default caption templates (template-based, no external APIs)
INSERT INTO bot_caption_templates (name, template, platform, category, tone, variables) VALUES
('Motivational Monday', 'Start your week strong! 💪 {message} Remember: {quote} {hashtags}', 'instagram', 'motivation', 'inspirational', ARRAY['message', 'quote', 'hashtags']),
('Business Tip', '💡 Business Tip: {tip} This has helped us {benefit}. What strategies work for you? {hashtags}', 'linkedin', 'business', 'professional', ARRAY['tip', 'benefit', 'hashtags']),
('Behind the Scenes', 'Behind the scenes look at {activity} 🎬 {description} The process is just as important as the result! {hashtags}', 'instagram', 'behind-the-scenes', 'casual', ARRAY['activity', 'description', 'hashtags'])
ON CONFLICT DO NOTHING;

-- ============================================
-- USER API KEYS TABLE
-- For optional external API integration (at creator's expense)
-- ============================================

CREATE TABLE IF NOT EXISTS user_api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_name VARCHAR(50) NOT NULL CHECK (service_name IN ('openai', 'anthropic', 'google', 'custom')),
    api_key_encrypted TEXT NOT NULL, -- Encrypted API key
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_name) -- One key per service per user
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_api_keys_user_id ON user_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_service_name ON user_api_keys(service_name);
CREATE INDEX IF NOT EXISTS idx_user_api_keys_is_active ON user_api_keys(is_active);

-- Updated at trigger
CREATE TRIGGER update_user_api_keys_updated_at BEFORE UPDATE ON user_api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- WEEKLY CONTENT IDEAS BOT TABLES
-- Template-based content idea generation (zero external API usage)
-- ============================================

-- Content ideas table
CREATE TABLE IF NOT EXISTS bot_content_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('post', 'story', 'reel', 'carousel', 'video', 'live')),
    platforms TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    category VARCHAR(50) NOT NULL,
    estimated_time INTEGER NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    engagement_potential INTEGER CHECK (engagement_potential >= 1 AND engagement_potential <= 10),
    trending BOOLEAN DEFAULT false,
    seasonal VARCHAR(50),
    hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    call_to_action TEXT,
    tips TEXT[] DEFAULT ARRAY[]::TEXT[],
    examples TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_used BOOLEAN DEFAULT false,
    performance_data JSONB DEFAULT '{}'::jsonb,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly content plans table
CREATE TABLE IF NOT EXISTS bot_weekly_content_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    theme VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'archived')),
    email_sent BOOLEAN DEFAULT false,
    email_delivered BOOLEAN DEFAULT false,
    user_feedback JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, week_number, year)
);

-- User content preferences table
CREATE TABLE IF NOT EXISTS bot_user_content_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    content_themes TEXT[] NOT NULL DEFAULT ARRAY['business growth', 'industry insights', 'tips and tricks']::TEXT[],
    preferred_platforms TEXT[] NOT NULL DEFAULT ARRAY['instagram', 'facebook', 'linkedin']::TEXT[],
    content_types TEXT[] NOT NULL DEFAULT ARRAY['post', 'story', 'carousel']::TEXT[],
    industry VARCHAR(100) DEFAULT 'digital marketing',
    target_audience TEXT DEFAULT 'small business owners',
    brand_tone VARCHAR(50) DEFAULT 'professional' CHECK (brand_tone IN ('professional', 'casual', 'funny', 'inspirational', 'educational')),
    posting_frequency VARCHAR(20) DEFAULT 'weekly' CHECK (posting_frequency IN ('daily', 'weekly', 'bi-weekly', 'monthly')),
    content_goals TEXT[] DEFAULT ARRAY['brand awareness', 'engagement']::TEXT[],
    avoid_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    custom_prompts TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for weekly content ideas
CREATE INDEX IF NOT EXISTS idx_bot_content_ideas_user_id ON bot_content_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_content_ideas_week_year ON bot_content_ideas(week_number, year);
CREATE INDEX IF NOT EXISTS idx_bot_content_ideas_category ON bot_content_ideas(category);
CREATE INDEX IF NOT EXISTS idx_bot_content_ideas_content_type ON bot_content_ideas(content_type);
CREATE INDEX IF NOT EXISTS idx_bot_content_ideas_is_used ON bot_content_ideas(is_used);
CREATE INDEX IF NOT EXISTS idx_bot_weekly_plans_user_id ON bot_weekly_content_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_weekly_plans_week_year ON bot_weekly_content_plans(week_number, year);
CREATE INDEX IF NOT EXISTS idx_bot_user_content_preferences_user_id ON bot_user_content_preferences(user_id);

-- Updated at triggers
CREATE TRIGGER update_bot_content_ideas_updated_at BEFORE UPDATE ON bot_content_ideas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_weekly_plans_updated_at BEFORE UPDATE ON bot_weekly_content_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_user_content_preferences_updated_at BEFORE UPDATE ON bot_user_content_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HASHTAG RESEARCH BOT TABLES
-- Template-based hashtag research (zero external API usage)
-- ============================================

-- Hashtag sets table
CREATE TABLE IF NOT EXISTS bot_hashtag_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    hashtags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    primary_hashtags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    secondary_hashtags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    niche_hashtags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    banned_hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'twitter', 'facebook', 'linkedin', 'all')),
    category VARCHAR(100) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    target_audience TEXT,
    competition_level VARCHAR(20) CHECK (competition_level IN ('low', 'medium', 'high')),
    average_posts_per_hour INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    reach_potential INTEGER DEFAULT 0,
    trending_score INTEGER CHECK (trending_score >= 0 AND trending_score <= 100),
    seasonal_relevance VARCHAR(50),
    geo_target VARCHAR(100),
    language VARCHAR(50) DEFAULT 'english',
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    performance_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly hashtag reports table
CREATE TABLE IF NOT EXISTS bot_weekly_hashtag_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    hashtag_sets JSONB NOT NULL DEFAULT '[]'::jsonb,
    trending_hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    emerging_hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    declining_hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    seasonal_hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    competitor_insights JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    industry_trends TEXT[] DEFAULT ARRAY[]::TEXT[],
    email_sent BOOLEAN DEFAULT false,
    email_delivered BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, week_number, year)
);

-- User hashtag preferences table
CREATE TABLE IF NOT EXISTS bot_user_hashtag_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    industry VARCHAR(100) DEFAULT 'digital marketing',
    niche VARCHAR(100) DEFAULT 'social media marketing',
    target_audience TEXT DEFAULT 'small business owners',
    primary_platforms TEXT[] DEFAULT ARRAY['instagram', 'facebook', 'linkedin']::TEXT[],
    content_types TEXT[] DEFAULT ARRAY['educational', 'promotional']::TEXT[],
    brand_tone VARCHAR(50) DEFAULT 'professional' CHECK (brand_tone IN ('professional', 'casual', 'funny', 'educational', 'inspirational')),
    geo_target VARCHAR(100),
    language VARCHAR(50) DEFAULT 'english',
    avoid_hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    preferred_hashtag_count INTEGER DEFAULT 15,
    max_competition VARCHAR(20) DEFAULT 'medium' CHECK (max_competition IN ('low', 'medium', 'high')),
    focus_on VARCHAR(20) DEFAULT 'engagement' CHECK (focus_on IN ('reach', 'engagement', 'conversion')),
    custom_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
    competitor_accounts TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for hashtag research
CREATE INDEX IF NOT EXISTS idx_bot_hashtag_sets_user_id ON bot_hashtag_sets(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_hashtag_sets_platform ON bot_hashtag_sets(platform);
CREATE INDEX IF NOT EXISTS idx_bot_hashtag_sets_category ON bot_hashtag_sets(category);
CREATE INDEX IF NOT EXISTS idx_bot_hashtag_sets_industry ON bot_hashtag_sets(industry);
CREATE INDEX IF NOT EXISTS idx_bot_hashtag_sets_trending_score ON bot_hashtag_sets(trending_score DESC);
CREATE INDEX IF NOT EXISTS idx_bot_hashtag_sets_is_active ON bot_hashtag_sets(is_active);
CREATE INDEX IF NOT EXISTS idx_bot_weekly_hashtag_reports_user_id ON bot_weekly_hashtag_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_weekly_hashtag_reports_week_year ON bot_weekly_hashtag_reports(week_number, year);
CREATE INDEX IF NOT EXISTS idx_bot_user_hashtag_preferences_user_id ON bot_user_hashtag_preferences(user_id);

-- Updated at triggers
CREATE TRIGGER update_bot_hashtag_sets_updated_at BEFORE UPDATE ON bot_hashtag_sets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_weekly_hashtag_reports_updated_at BEFORE UPDATE ON bot_weekly_hashtag_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_user_hashtag_preferences_updated_at BEFORE UPDATE ON bot_user_hashtag_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- BLOG OUTLINE BOT TABLES
-- Template-based blog outline generation (zero external API usage)
-- ============================================

-- Blog outlines table
CREATE TABLE IF NOT EXISTS bot_blog_outlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(300) NOT NULL,
    topic VARCHAR(500) NOT NULL,
    target_audience TEXT NOT NULL,
    tone VARCHAR(50) NOT NULL CHECK (tone IN ('professional', 'casual', 'educational', 'persuasive', 'storytelling')),
    blog_type VARCHAR(50) NOT NULL CHECK (blog_type IN ('how-to', 'listicle', 'review', 'comparison', 'case-study', 'opinion', 'news')),
    estimated_read_time INTEGER NOT NULL,
    word_count_target INTEGER NOT NULL,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    key_points TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    keywords TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    meta_description TEXT NOT NULL,
    slug VARCHAR(300) NOT NULL,
    internal_links TEXT[] DEFAULT ARRAY[]::TEXT[],
    external_links TEXT[] DEFAULT ARRAY[]::TEXT[],
    questions_to_answer TEXT[] DEFAULT ARRAY[]::TEXT[],
    call_to_action TEXT NOT NULL,
    related_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    content_brief TEXT NOT NULL,
    research_notes TEXT,
    seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
    originality_score INTEGER CHECK (originality_score >= 0 AND originality_score <= 100),
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'completed', 'published')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User blog preferences table
CREATE TABLE IF NOT EXISTS bot_user_blog_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    industry VARCHAR(200) DEFAULT 'digital marketing',
    target_audience TEXT DEFAULT 'small business owners',
    brand_voice VARCHAR(50) DEFAULT 'educational' CHECK (brand_voice IN ('professional', 'casual', 'educational', 'persuasive', 'storytelling')),
    content_goals TEXT[] DEFAULT ARRAY['educate', 'engage']::TEXT[],
    preferred_length VARCHAR(20) DEFAULT 'medium' CHECK (preferred_length IN ('short', 'medium', 'long')),
    seo_focus BOOLEAN DEFAULT true,
    include_stats BOOLEAN DEFAULT true,
    include_examples BOOLEAN DEFAULT true,
    include_images BOOLEAN DEFAULT true,
    competitor_analysis BOOLEAN DEFAULT false,
    keyword_research BOOLEAN DEFAULT true,
    internal_linking BOOLEAN DEFAULT true,
    call_to_action_style VARCHAR(20) DEFAULT 'medium' CHECK (call_to_action_style IN ('soft', 'medium', 'hard')),
    content_types TEXT[] DEFAULT ARRAY['how-to', 'listicle']::TEXT[],
    avoid_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
    custom_guidelines TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for blog outline bot
CREATE INDEX IF NOT EXISTS idx_bot_blog_outlines_user_id ON bot_blog_outlines(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_blog_outlines_topic ON bot_blog_outlines(topic);
CREATE INDEX IF NOT EXISTS idx_bot_blog_outlines_blog_type ON bot_blog_outlines(blog_type);
CREATE INDEX IF NOT EXISTS idx_bot_blog_outlines_status ON bot_blog_outlines(status);
CREATE INDEX IF NOT EXISTS idx_bot_blog_outlines_created_at ON bot_blog_outlines(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bot_blog_outlines_seo_score ON bot_blog_outlines(seo_score DESC);
CREATE INDEX IF NOT EXISTS idx_bot_user_blog_preferences_user_id ON bot_user_blog_preferences(user_id);

-- Updated at triggers
CREATE TRIGGER update_bot_blog_outlines_updated_at BEFORE UPDATE ON bot_blog_outlines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_user_blog_preferences_updated_at BEFORE UPDATE ON bot_user_blog_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- WEEKLY PERFORMANCE REPORT BOT TABLES
-- Template-based weekly analytics reports (zero external API usage)
-- ============================================

-- Weekly performance reports table
CREATE TABLE IF NOT EXISTS bot_weekly_performance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    report_period JSONB NOT NULL,
    summary JSONB NOT NULL,
    platforms JSONB NOT NULL DEFAULT '{}'::jsonb,
    top_performing_content JSONB NOT NULL DEFAULT '[]'::jsonb,
    audience_insights JSONB NOT NULL DEFAULT '{}'::jsonb,
    growth_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    achievements JSONB NOT NULL DEFAULT '[]'::jsonb,
    challenges JSONB NOT NULL DEFAULT '[]'::jsonb,
    next_week_goals JSONB NOT NULL DEFAULT '[]'::jsonb,
    trends JSONB NOT NULL DEFAULT '[]'::jsonb,
    email_sent BOOLEAN DEFAULT false,
    email_delivered BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, week_number, year)
);

-- User report preferences table
CREATE TABLE IF NOT EXISTS bot_user_report_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    platforms TEXT[] DEFAULT ARRAY['instagram', 'facebook', 'website']::TEXT[],
    metrics TEXT[] DEFAULT ARRAY['views', 'engagement', 'reach', 'followers']::TEXT[],
    frequency VARCHAR(20) DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
    delivery_time VARCHAR(10) DEFAULT '09:00',
    email_format VARCHAR(20) DEFAULT 'detailed' CHECK (email_format IN ('summary', 'detailed', 'visual')),
    include_recommendations BOOLEAN DEFAULT true,
    include_competitors BOOLEAN DEFAULT false,
    include_benchmarks BOOLEAN DEFAULT false,
    custom_metrics TEXT[] DEFAULT ARRAY[]::TEXT[],
    alert_thresholds JSONB DEFAULT '{}'::jsonb,
    recipients TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for weekly performance report bot
CREATE INDEX IF NOT EXISTS idx_bot_weekly_reports_user_id ON bot_weekly_performance_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_weekly_reports_week_year ON bot_weekly_performance_reports(year DESC, week_number DESC);
CREATE INDEX IF NOT EXISTS idx_bot_weekly_reports_created_at ON bot_weekly_performance_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bot_user_report_preferences_user_id ON bot_user_report_preferences(user_id);

-- Updated at triggers
CREATE TRIGGER update_bot_weekly_performance_reports_updated_at BEFORE UPDATE ON bot_weekly_performance_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_user_report_preferences_updated_at BEFORE UPDATE ON bot_user_report_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMPETITOR WATCH BOT TABLES
-- Template-based competitor monitoring (zero external API usage)
-- ============================================

-- Competitors table
CREATE TABLE IF NOT EXISTS bot_competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    website_url TEXT NOT NULL,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    founded_year INTEGER,
    headquarters_location VARCHAR(255),
    description TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    monitoring_frequency VARCHAR(20) DEFAULT 'weekly' CHECK (monitoring_frequency IN ('daily', 'weekly', 'monthly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_monitoring_at TIMESTAMP WITH TIME ZONE,
    last_monitored_at TIMESTAMP WITH TIME ZONE
);

-- Competitor metrics table
CREATE TABLE IF NOT EXISTS bot_competitor_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competitor_id UUID NOT NULL REFERENCES bot_competitors(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    website_traffic INTEGER,
    organic_traffic INTEGER,
    paid_traffic INTEGER,
    bounce_rate DECIMAL(5,2),
    domain_authority INTEGER,
    backlink_count INTEGER,
    facebook_followers INTEGER,
    instagram_followers INTEGER,
    twitter_followers INTEGER,
    linkedin_followers INTEGER,
    blog_posts_count INTEGER,
    estimated_ad_spend DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitor alerts table
CREATE TABLE IF NOT EXISTS bot_competitor_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competitor_id UUID REFERENCES bot_competitors(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitor reports table
CREATE TABLE IF NOT EXISTS bot_competitor_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('weekly', 'monthly', 'custom')),
    title VARCHAR(255) NOT NULL,
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    competitors UUID[] NOT NULL,
    executive_summary TEXT,
    key_findings JSONB DEFAULT '{}'::jsonb,
    opportunities JSONB DEFAULT '[]'::jsonb,
    threats JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for competitor watch bot
CREATE INDEX IF NOT EXISTS idx_bot_competitors_user_id ON bot_competitors(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_competitors_status ON bot_competitors(status);
CREATE INDEX IF NOT EXISTS idx_bot_competitors_next_monitoring ON bot_competitors(next_monitoring_at);
CREATE INDEX IF NOT EXISTS idx_bot_competitor_metrics_competitor_id ON bot_competitor_metrics(competitor_id);
CREATE INDEX IF NOT EXISTS idx_bot_competitor_metrics_user_id ON bot_competitor_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_competitor_metrics_date ON bot_competitor_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_bot_competitor_alerts_user_id ON bot_competitor_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_competitor_alerts_competitor_id ON bot_competitor_alerts(competitor_id);
CREATE INDEX IF NOT EXISTS idx_bot_competitor_alerts_is_read ON bot_competitor_alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_bot_competitor_reports_user_id ON bot_competitor_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_competitor_reports_status ON bot_competitor_reports(status);
CREATE INDEX IF NOT EXISTS idx_bot_competitor_reports_created_at ON bot_competitor_reports(created_at DESC);

-- Updated at triggers
CREATE TRIGGER update_bot_competitors_updated_at BEFORE UPDATE ON bot_competitors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_competitor_reports_updated_at BEFORE UPDATE ON bot_competitor_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ENGAGEMENT TRACKER BOT TABLES
-- Template-based engagement tracking (zero external API usage)
-- ============================================

-- Social media accounts table
CREATE TABLE IF NOT EXISTS bot_social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('instagram', 'twitter', 'facebook', 'linkedin', 'tiktok', 'youtube')),
    account_name VARCHAR(255) NOT NULL,
    account_handle VARCHAR(100) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    avatar_url TEXT,
    follower_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_platform_handle UNIQUE(user_id, platform, account_handle)
);

-- Engagement metrics table
CREATE TABLE IF NOT EXISTS bot_engagement_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES bot_social_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL,
    metric_date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    profile_visits INTEGER DEFAULT 0,
    story_views INTEGER DEFAULT 0,
    story_reach INTEGER DEFAULT 0,
    video_views INTEGER DEFAULT 0,
    video_completion_rate DECIMAL(5,2) DEFAULT 0,
    click_through_rate DECIMAL(5,2) DEFAULT 0,
    follower_change INTEGER DEFAULT 0,
    engagement_change DECIMAL(5,2) DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    stories_count INTEGER DEFAULT 0,
    reels_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_account_date UNIQUE(account_id, metric_date)
);

-- Engagement alerts table
CREATE TABLE IF NOT EXISTS bot_engagement_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES bot_social_accounts(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('engagement_drop', 'engagement_spike', 'follower_loss', 'follower_gain', 'no_activity', 'viral_content')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    threshold_value DECIMAL(10,2),
    actual_value DECIMAL(10,2),
    comparison_period VARCHAR(20),
    is_read BOOLEAN DEFAULT false,
    is_actioned BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    actioned_at TIMESTAMP WITH TIME ZONE
);

-- Alert rules configuration table
CREATE TABLE IF NOT EXISTS bot_alert_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES bot_social_accounts(id) ON DELETE CASCADE,
    rule_name VARCHAR(255) NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    metric_name VARCHAR(50) NOT NULL,
    operator VARCHAR(10) NOT NULL CHECK (operator IN ('>', '<', '>=', '<=', '==', '!=')),
    threshold_value DECIMAL(10,2) NOT NULL,
    comparison_period VARCHAR(20) DEFAULT 'daily',
    is_active BOOLEAN DEFAULT true,
    notification_method VARCHAR(20) DEFAULT 'dashboard' CHECK (notification_method IN ('dashboard', 'email', 'sms', 'all')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily engagement summary table
CREATE TABLE IF NOT EXISTS bot_daily_engagement_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    summary_date DATE NOT NULL,
    total_accounts INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    total_reach INTEGER DEFAULT 0,
    total_engagement DECIMAL(10,2) DEFAULT 0,
    average_engagement_rate DECIMAL(5,2) DEFAULT 0,
    platform_stats JSONB DEFAULT '{}'::jsonb,
    top_posts JSONB DEFAULT '[]'::jsonb,
    follower_growth INTEGER DEFAULT 0,
    engagement_growth DECIMAL(5,2) DEFAULT 0,
    alerts_count INTEGER DEFAULT 0,
    critical_alerts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_date UNIQUE(user_id, summary_date)
);

-- Engagement reports table
CREATE TABLE IF NOT EXISTS bot_engagement_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_type VARCHAR(20) NOT NULL CHECK (report_type IN ('weekly', 'monthly', 'custom')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    accounts_analyzed INTEGER DEFAULT 0,
    total_metrics INTEGER DEFAULT 0,
    performance_summary JSONB DEFAULT '{}'::jsonb,
    growth_analysis JSONB DEFAULT '{}'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    file_url TEXT,
    file_size INTEGER,
    file_format VARCHAR(10) DEFAULT 'pdf',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for engagement tracker bot
CREATE INDEX IF NOT EXISTS idx_bot_social_accounts_user_id ON bot_social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_social_accounts_platform ON bot_social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_bot_social_accounts_active ON bot_social_accounts(is_active);
CREATE INDEX IF NOT EXISTS idx_bot_engagement_metrics_user_id ON bot_engagement_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_engagement_metrics_account_id ON bot_engagement_metrics(account_id);
CREATE INDEX IF NOT EXISTS idx_bot_engagement_metrics_platform ON bot_engagement_metrics(platform);
CREATE INDEX IF NOT EXISTS idx_bot_engagement_metrics_date ON bot_engagement_metrics(metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_bot_engagement_alerts_user_id ON bot_engagement_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_engagement_alerts_account_id ON bot_engagement_alerts(account_id);
CREATE INDEX IF NOT EXISTS idx_bot_engagement_alerts_type ON bot_engagement_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_bot_engagement_alerts_created ON bot_engagement_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bot_engagement_alerts_unread ON bot_engagement_alerts(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_bot_alert_rules_user_id ON bot_alert_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_alert_rules_active ON bot_alert_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_bot_daily_summary_user_id ON bot_daily_engagement_summary(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_daily_summary_date ON bot_daily_engagement_summary(summary_date);
CREATE INDEX IF NOT EXISTS idx_bot_engagement_reports_user_id ON bot_engagement_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_engagement_reports_type ON bot_engagement_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_bot_engagement_reports_period ON bot_engagement_reports(period_start, period_end);

-- Updated at triggers
CREATE TRIGGER update_bot_social_accounts_updated_at BEFORE UPDATE ON bot_social_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bot_alert_rules_updated_at BEFORE UPDATE ON bot_alert_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Creator Verifications Table
CREATE TABLE IF NOT EXISTS creator_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    verification_type VARCHAR(20) NOT NULL CHECK (verification_type IN ('email', 'premium')),
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for creator verifications
CREATE INDEX IF NOT EXISTS idx_creator_verifications_user_id ON creator_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_creator_verifications_status ON creator_verifications(verification_status);
CREATE INDEX IF NOT EXISTS idx_creator_verifications_type ON creator_verifications(verification_type);
CREATE INDEX IF NOT EXISTS idx_creator_verifications_created_at ON creator_verifications(created_at DESC);

-- Updated at trigger for creator verifications
CREATE TRIGGER update_creator_verifications_updated_at BEFORE UPDATE ON creator_verifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


