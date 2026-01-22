-- Daily Caption Bot Database Schema
-- Template-based, zero external API usage

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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bot_captions_user_id ON bot_captions(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_captions_platform ON bot_captions(platform);
CREATE INDEX IF NOT EXISTS idx_bot_captions_tone ON bot_captions(tone);
CREATE INDEX IF NOT EXISTS idx_bot_captions_created_at ON bot_captions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bot_captions_is_used ON bot_captions(is_used);
CREATE INDEX IF NOT EXISTS idx_bot_user_preferences_user_id ON bot_user_preferences(user_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_bot_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bot_captions_updated_at BEFORE UPDATE ON bot_captions
    FOR EACH ROW EXECUTE FUNCTION update_bot_updated_at_column();

CREATE TRIGGER update_bot_user_preferences_updated_at BEFORE UPDATE ON bot_user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_bot_updated_at_column();

CREATE TRIGGER update_bot_caption_templates_updated_at BEFORE UPDATE ON bot_caption_templates
    FOR EACH ROW EXECUTE FUNCTION update_bot_updated_at_column();

-- Insert default caption templates (template-based, no external APIs)
INSERT INTO bot_caption_templates (name, template, platform, category, tone, variables) VALUES
-- Motivational templates
('Motivational Monday', 'Start your week strong! 💪 {message} Remember: {quote} {hashtags}', 'instagram', 'motivation', 'inspirational', ARRAY['message', 'quote', 'hashtags']),
('Business Tip', '💡 Business Tip: {tip} This has helped us {benefit}. What strategies work for you? {hashtags}', 'linkedin', 'business', 'professional', ARRAY['tip', 'benefit', 'hashtags']),
('Behind the Scenes', 'Behind the scenes look at {activity} 🎬 {description} The process is just as important as the result! {hashtags}', 'instagram', 'behind-the-scenes', 'casual', ARRAY['activity', 'description', 'hashtags']),
('Funny Observation', 'POV: {situation} 😂 {punchline} Can you relate? {hashtags}', 'instagram', 'humor', 'funny', ARRAY['situation', 'punchline', 'hashtags']),
('Educational Insight', 'Did you know? {fact} Here''s why it matters: {explanation} {hashtags}', 'linkedin', 'education', 'educational', ARRAY['fact', 'explanation', 'hashtags']),
-- Platform-specific templates
('Instagram Story', '{hook} Swipe up for more! 👆 {hashtags}', 'instagram', 'engagement', 'casual', ARRAY['hook', 'hashtags']),
('Twitter Thread Starter', '{question} 🧵 Thread below ⬇️ {hashtags}', 'twitter', 'engagement', 'professional', ARRAY['question', 'hashtags']),
('Facebook Community', 'Good morning! {greeting} What are you working on today? Share below! 👇 {hashtags}', 'facebook', 'community', 'casual', ARRAY['greeting', 'hashtags']),
('TikTok Hook', 'POV: {scenario} Watch till the end! 👀 {hashtags}', 'tiktok', 'engagement', 'funny', ARRAY['scenario', 'hashtags']),
('LinkedIn Professional', 'Three lessons from {experience}: 1. {lesson1} 2. {lesson2} 3. {lesson3} What would you add? {hashtags}', 'linkedin', 'professional', 'professional', ARRAY['experience', 'lesson1', 'lesson2', 'lesson3', 'hashtags'])
ON CONFLICT DO NOTHING;
