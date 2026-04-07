import { sql } from '@/lib/db'

/**
 * Initialize Content Library tables
 * 
 * Note: This is a utility function for programmatic initialization.
 * The primary way to initialize the database is by running lib/schema.sql
 * in your Neon SQL Editor or using: npm run db:init
 * 
 * This function ensures tables exist and can be used for verification.
 */
export async function initializeContentLibraryTables() {
  if (!sql) {
    throw new Error('Database connection not available. Set DATABASE_URL in .env.local')
  }

  try {
    // Create content_library table
    await sql`
      CREATE TABLE IF NOT EXISTS content_library (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL DEFAULT 'anonymous',
        title TEXT NOT NULL,
        description TEXT,
        content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'video', 'audio', 'document', 'url', 'post', 'template', 'collection')),
        content_data JSONB NOT NULL DEFAULT '{}'::jsonb,
        tags TEXT[] DEFAULT ARRAY[]::TEXT[],
        category TEXT,
        collection_id UUID REFERENCES content_collections(id) ON DELETE SET NULL,
        template_id UUID,
        metadata JSONB DEFAULT '{}'::jsonb,
        performance_data JSONB DEFAULT '{}'::jsonb,
        viral_prediction_id UUID REFERENCES viral_predictions(id) ON DELETE SET NULL,
        status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'scheduled')),
        is_favorite BOOLEAN DEFAULT FALSE,
        is_template BOOLEAN DEFAULT FALSE,
        version INTEGER DEFAULT 1,
        parent_id UUID REFERENCES content_library(id) ON DELETE SET NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        published_at TIMESTAMP WITH TIME ZONE,
        scheduled_for TIMESTAMP WITH TIME ZONE
      )
    `

    // Create content_collections table
    await sql`
      CREATE TABLE IF NOT EXISTS content_collections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL DEFAULT 'anonymous',
        name TEXT NOT NULL,
        description TEXT,
        color TEXT,
        icon TEXT,
        is_public BOOLEAN DEFAULT FALSE,
        tags TEXT[] DEFAULT ARRAY[]::TEXT[],
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create content_templates table
    await sql`
      CREATE TABLE IF NOT EXISTS content_templates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL DEFAULT 'anonymous',
        name TEXT NOT NULL,
        description TEXT,
        template_data JSONB NOT NULL DEFAULT '{}'::jsonb,
        category TEXT,
        tags TEXT[] DEFAULT ARRAY[]::TEXT[],
        is_public BOOLEAN DEFAULT FALSE,
        usage_count INTEGER DEFAULT 0,
        rating NUMERIC(3,2) DEFAULT 0.00,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Create content_versions table
    await sql`
      CREATE TABLE IF NOT EXISTS content_versions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content_id UUID NOT NULL REFERENCES content_library(id) ON DELETE CASCADE,
        version_number INTEGER NOT NULL,
        content_data JSONB NOT NULL DEFAULT '{}'::jsonb,
        change_summary TEXT,
        created_by TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(content_id, version_number)
      )
    `

    // Create content_relationships table
    await sql`
      CREATE TABLE IF NOT EXISTS content_relationships (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        source_content_id UUID NOT NULL REFERENCES content_library(id) ON DELETE CASCADE,
        target_content_id UUID NOT NULL REFERENCES content_library(id) ON DELETE CASCADE,
        relationship_type TEXT NOT NULL CHECK (relationship_type IN ('repurposed_from', 'variant_of', 'related_to', 'part_of', 'inspired_by')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(source_content_id, target_content_id, relationship_type)
      )
    `

    // Create indexes for content_library
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_library_user_id ON content_library(user_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_library_content_type ON content_library(content_type)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_library_status ON content_library(status)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_library_created_at ON content_library(created_at DESC)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_library_collection_id ON content_library(collection_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_library_tags ON content_library USING GIN(tags)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_library_is_favorite ON content_library(is_favorite)
    `

    // Create indexes for collections
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_collections_user_id ON content_collections(user_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_collections_is_public ON content_collections(is_public)
    `

    // Create indexes for templates
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_templates_user_id ON content_templates(user_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_templates_is_public ON content_templates(is_public)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_templates_usage_count ON content_templates(usage_count DESC)
    `

    // Create indexes for versions
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON content_versions(content_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_versions_created_at ON content_versions(created_at DESC)
    `

    // Create indexes for relationships
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_relationships_source ON content_relationships(source_content_id)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_content_relationships_target ON content_relationships(target_content_id)
    `

    console.log('✅ Content library tables initialized successfully')
    return { success: true, message: 'Content library tables initialized' }
    
  } catch (error) {
    console.error('Failed to initialize content library tables:', error)
    throw error
  }
}

/**
 * Verify that content library tables exist
 */
export async function verifyContentLibraryTables() {
  if (!sql) {
    return { exists: false, error: 'Database connection not available' }
  }

  try {
    const tables = ['content_library', 'content_collections', 'content_templates', 'content_versions', 'content_relationships']
    const results: Record<string, boolean> = {}

    for (const table of tables) {
      const result = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = ${table}
        )
      `
      results[table] = result[0]?.exists || false
    }

    const allExist = Object.values(results).every(exists => exists)
    
    return {
      exists: allExist,
      tables: results,
      message: allExist 
        ? 'All content library tables exist' 
        : 'Some content library tables are missing'
    }
  } catch (error) {
    console.error('Failed to verify content library tables:', error)
    return {
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
