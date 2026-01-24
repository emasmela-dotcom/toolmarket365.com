-- Template Favorites Database Schema
CREATE TABLE IF NOT EXISTS user_template_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'anonymous',
    template_id UUID NOT NULL REFERENCES content_templates(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_user_template_favorite UNIQUE(user_id, template_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_template_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_template_id ON user_template_favorites(template_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_template_favorites(created_at DESC);
