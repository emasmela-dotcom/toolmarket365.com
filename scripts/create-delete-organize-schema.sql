-- Delete/Organize System Database Schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Content Items Table with Soft Delete
CREATE TABLE IF NOT EXISTS content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('document', 'image', 'video', 'audio', 'archive')),
    category VARCHAR(50),
    tags TEXT[] DEFAULT '{}',
    file_url TEXT,
    file_size BIGINT DEFAULT 0,
    metadata JSONB,
    is_favorite BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_active_title_per_user UNIQUE(user_id, title) WHERE deleted_at IS NULL
);

-- Bulk Operation Logs
CREATE TABLE IF NOT EXISTS bulk_operation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    operation_type VARCHAR(50) NOT NULL,
    item_ids UUID[] NOT NULL,
    options JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_operation_type CHECK (operation_type IN ('delete', 'archive', 'restore', 'move', 'tag', 'categorize'))
);

-- Deletion Requests
CREATE TABLE IF NOT EXISTS deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    item_ids UUID[] NOT NULL,
    reason TEXT NOT NULL,
    safety_measures TEXT[] NOT NULL,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    impact_assessment JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'failed')),
    approved_by UUID,
    approved_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deletion Backups
CREATE TABLE IF NOT EXISTS deletion_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    item_ids UUID[] NOT NULL,
    backup_data JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Organization Suggestions
CREATE TABLE IF NOT EXISTS organization_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    suggestion_type VARCHAR(50) NOT NULL CHECK (suggestion_type IN ('categorize', 'tag', 'archive', 'cleanup')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    item_ids UUID[] NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    estimated_impact VARCHAR(20) CHECK (estimated_impact IN ('low', 'medium', 'high')),
    auto_action BOOLEAN DEFAULT false,
    applied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7),
    icon VARCHAR(50),
    item_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_category_name_per_user UNIQUE(user_id, name)
);

-- Tags Table
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_tag_name_per_user UNIQUE(user_id, name)
);

-- Organization Stats
CREATE TABLE IF NOT EXISTS organization_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    total_items INTEGER DEFAULT 0,
    categorized_items INTEGER DEFAULT 0,
    tagged_items INTEGER DEFAULT 0,
    archived_items INTEGER DEFAULT 0,
    deleted_items INTEGER DEFAULT 0,
    duplicate_items INTEGER DEFAULT 0,
    organization_score INTEGER DEFAULT 0 CHECK (organization_score >= 0 AND organization_score <= 100),
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_stats UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_items_user_id ON content_items(user_id);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_category ON content_items(category);
CREATE INDEX IF NOT EXISTS idx_content_items_deleted_at ON content_items(deleted_at);
CREATE INDEX IF NOT EXISTS idx_content_items_created_at ON content_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_items_favorite ON content_items(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_content_items_archived ON content_items(is_archived) WHERE is_archived = true;
CREATE INDEX IF NOT EXISTS idx_content_items_tags ON content_items USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_bulk_logs_user_id ON bulk_operation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_user_id ON deletion_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_org_stats_user_id ON organization_stats(user_id);
