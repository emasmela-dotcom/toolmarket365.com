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


