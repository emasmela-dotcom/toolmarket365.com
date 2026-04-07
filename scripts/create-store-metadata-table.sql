-- Create pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Store metadata table for content library
CREATE TABLE IF NOT EXISTS store_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    title TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    type TEXT NOT NULL,
    cloudinary_public_id TEXT,
    cloudinary_url TEXT,
    file_size INT,
    format TEXT,
    width INT,
    height INT,
    duration INT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_store_metadata_user_id ON store_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_store_metadata_type ON store_metadata(type);
CREATE INDEX IF NOT EXISTS idx_store_metadata_created_at ON store_metadata(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_store_metadata_tags ON store_metadata USING GIN(tags);
