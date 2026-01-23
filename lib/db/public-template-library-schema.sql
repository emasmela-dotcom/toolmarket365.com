-- Enhance content_templates table for public template library
ALTER TABLE content_templates 
ADD COLUMN IF NOT EXISTS niche VARCHAR(50) NOT NULL DEFAULT 'general',
ADD COLUMN IF NOT EXISTS platform VARCHAR(50) NOT NULL DEFAULT 'universal',
ADD COLUMN IF NOT EXISTS voice VARCHAR(50) NOT NULL DEFAULT 'professional',
ADD COLUMN IF NOT EXISTS template_type VARCHAR(50) NOT NULL DEFAULT 'caption',
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS difficulty_level VARCHAR(20) DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS estimated_time_minutes INTEGER DEFAULT 15;

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_templates_niche ON content_templates(niche);
CREATE INDEX IF NOT EXISTS idx_templates_platform ON content_templates(platform);
CREATE INDEX IF NOT EXISTS idx_templates_voice ON content_templates(voice);
CREATE INDEX IF NOT EXISTS idx_templates_template_type ON content_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_templates_public ON content_templates(is_public) WHERE is_public = true;

-- Create template categories reference
CREATE TABLE IF NOT EXISTS template_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default template categories
INSERT INTO template_categories (name, display_name, description, icon, color, sort_order) VALUES
('fitness', 'Fitness & Health', 'Templates for fitness, wellness, and health content', '💪', '#EF4444', 1),
('tech', 'Technology', 'Templates for tech, software, and digital content', '💻', '#3B82F6', 2),
('cooking', 'Cooking & Food', 'Templates for recipes, food blogs, and culinary content', '🍳', '#F59E0B', 3),
('fashion', 'Fashion & Beauty', 'Templates for fashion, beauty, and lifestyle content', '👗', '#EC4899', 4),
('business', 'Business & Finance', 'Templates for business, finance, and professional content', '💼', '#6366F1', 5),
('travel', 'Travel & Adventure', 'Templates for travel, tourism, and adventure content', '✈️', '#10B981', 6),
('education', 'Education & Learning', 'Templates for educational and learning content', '📚', '#8B5CF6', 7),
('entertainment', 'Entertainment', 'Templates for entertainment and pop culture content', '🎬', '#F97316', 8),
('general', 'General', 'Universal templates that work across niches', '🌟', '#6B7280', 9)
ON CONFLICT (name) DO NOTHING;

-- Create platforms reference
CREATE TABLE IF NOT EXISTS template_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    max_length INTEGER,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default platforms
INSERT INTO template_platforms (name, display_name, icon, color, max_length, sort_order) VALUES
('instagram', 'Instagram', '📸', '#E4405F', 2200, 1),
('tiktok', 'TikTok', '🎵', '#FF0050', 150, 2),
('youtube', 'YouTube', '📺', '#FF0000', 5000, 3),
('twitter', 'Twitter', '🐦', '#1DA1F2', 280, 4),
('facebook', 'Facebook', '📘', '#1877F2', 63206, 5),
('linkedin', 'LinkedIn', '💼', '#0A66C2', 3000, 6),
('universal', 'Universal', '🌐', '#6B7280', NULL, 7)
ON CONFLICT (name) DO NOTHING;

-- Create voices reference
CREATE TABLE IF NOT EXISTS template_voices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default voices
INSERT INTO template_voices (name, display_name, description, icon, color, sort_order) VALUES
('professional', 'Professional', 'Formal, business-appropriate tone', '👔', '#374151', 1),
('casual', 'Casual', 'Relaxed, conversational tone', '😊', '#10B981', 2),
('humorous', 'Humorous', 'Funny, entertaining tone', '😄', '#F59E0B', 3),
('educational', 'Educational', 'Informative, teaching tone', '🎓', '#3B82F6', 4),
('inspirational', 'Inspirational', 'Motivational, uplifting tone', '✨', '#8B5CF6', 5),
('enthusiastic', 'Enthusiastic', 'Energetic, excited tone', '🚀', '#EF4444', 6)
ON CONFLICT (name) DO NOTHING;

-- Create template types reference
CREATE TABLE IF NOT EXISTS template_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default template types
INSERT INTO template_types (name, display_name, description, icon, color, sort_order) VALUES
('caption', 'Caption', 'Social media captions and post text', '📝', '#3B82F6', 1),
('content_idea', 'Content Idea', 'Content topic and concept ideas', '💡', '#F59E0B', 2),
('hashtag', 'Hashtag', 'Hashtag sets and trending tags', '#️⃣', '#8B5CF6', 3),
('blog_outline', 'Blog Outline', 'Blog post structure and outlines', '📄', '#10B981', 4),
('script', 'Script', 'Video and audio scripts', '🎬', '#EF4444', 5),
('headline', 'Headline', 'Catchy titles and headlines', '📰', '#EC4899', 6),
('description', 'Description', 'Product and service descriptions', '🏷️', '#6366F1', 7),
('bio', 'Bio', 'Profile and bio text', '👤', '#14B8A6', 8)
ON CONFLICT (name) DO NOTHING;

-- Sample data for testing
INSERT INTO content_templates (
    id, user_id, name, description, template_data, category, 
    niche, platform, voice, template_type, is_public, tags, difficulty_level, estimated_time_minutes
) VALUES
(
    gen_random_uuid(), 
    '00000000-0000-0000-0000-000000000000',
    'Fitness Motivation Post',
    'High-energy fitness motivation caption for Instagram',
    '{"caption": "💪 Your only limit is you. Push harder than yesterday! \\n\\nRemember: Every rep counts, every drop of sweat matters, and every day you show up is a win. Don''t wait for motivation - create it through action!\\n\\n#FitnessMotivation #NoExcuses #GymLife", "call_to_action": "Save this post for your next workout!", "best_posting_time": "6-8 AM or 6-8 PM"}'::jsonb,
    'social_media',
    'fitness',
    'instagram',
    'inspirational',
    'caption',
    true,
    ARRAY['fitness', 'motivation', 'gym', 'workout'],
    'beginner',
    5
),
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'Tech Product Launch',
    'Professional tech product announcement',
    '{"headline": "Introducing [Product Name] - The Future is Here", "body": "We''re excited to unveil our latest innovation that will revolutionize how you [solve problem]. Built with cutting-edge technology and designed with you in mind.", "features": ["Feature 1", "Feature 2", "Feature 3"], "call_to_action": "Learn more at [website]"}'::jsonb,
    'content_creation',
    'tech',
    'linkedin',
    'professional',
    'caption',
    true,
    ARRAY['tech', 'product', 'innovation', 'launch'],
    'intermediate',
    15
),
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'Recipe Blog Structure',
    'Complete blog post outline for recipe content',
    '{"title": "[Recipe Name]: A [Adjective] [Meal Type] That Will [Benefit]", "introduction": "Hook + personal story + what makes this special", "ingredients_section": "List with measurements and alternatives", "instructions_section": "Step-by-step with photos", "tips_section": "Pro tips and variations", "conclusion": "Call to action + social sharing"}'::jsonb,
    'content_creation',
    'cooking',
    'universal',
    'casual',
    'blog_outline',
    true,
    ARRAY['cooking', 'recipe', 'food', 'blog'],
    'intermediate',
    30
),
(
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'Fashion Hashtag Set',
    'Trending hashtags for fashion content',
    '{"hashtags": ["#OOTD", "#FashionStyle", "#StyleInspo", "#TrendAlert", "#FashionBlogger", "#StreetStyle", "#LookBook", "#FashionDaily"], "niche_tags": ["#SustainableFashion", "#VintageStyle", "#MinimalistFashion"], "engagement_tags": ["#LikeForLike", "#FollowForFollow", "#InstaFashion"]}'::jsonb,
    'social_media',
    'fashion',
    'instagram',
    'casual',
    'hashtag',
    true,
    ARRAY['fashion', 'hashtags', 'style', 'trending'],
    'beginner',
    2
)
ON CONFLICT DO NOTHING;
