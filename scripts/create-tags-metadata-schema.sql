-- Tags and Metadata Schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(50),
    color VARCHAR(7) DEFAULT '#3B82F6',
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 1.0,
    is_auto_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_content_tag UNIQUE(content_id, content_type, tag_id, user_id)
);

CREATE TABLE IF NOT EXISTS content_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    user_id UUID NOT NULL,
    title VARCHAR(255),
    description TEXT,
    author VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    reading_time INTEGER,
    word_count INTEGER,
    sentiment VARCHAR(20),
    difficulty_level VARCHAR(20),
    target_audience VARCHAR(50),
    custom_fields JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_content_metadata UNIQUE(content_id, content_type, user_id)
);

CREATE TABLE IF NOT EXISTS tag_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_text TEXT NOT NULL,
    suggested_tags TEXT[] NOT NULL,
    confidence_scores DECIMAL(3,2)[],
    ai_model VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);
CREATE INDEX IF NOT EXISTS idx_tags_usage_count ON tags(usage_count DESC);

CREATE INDEX IF NOT EXISTS idx_content_tags_content ON content_tags(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_content_tags_user ON content_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_tag ON content_tags(tag_id);

CREATE INDEX IF NOT EXISTS idx_content_metadata_content ON content_metadata(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_content_metadata_user ON content_metadata(user_id);
