import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET: List all templates (user's + public)
export async function GET(request: NextRequest) {
  try {
    // If database not configured, return empty data (tool still works with localStorage fallback)
    if (!sql) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Database not configured - using local storage'
      })
    }

    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category') || searchParams.get('type') // Support both 'type' and 'category'
    const include_public = searchParams.get('include_public') !== 'false'
    const sort_by_usage = searchParams.get('sort_by_usage') === 'true'
    
    // For now, use anonymous user (auth will be added later)
    const user_id = 'anonymous'

    // Build query with conditions
    // Fetch all templates first, then filter in code (simpler approach)
    let query = sql`
      SELECT 
        id,
        user_id,
        name,
        description,
        template_data,
        category,
        tags,
        is_public,
        usage_count,
        created_at,
        updated_at
      FROM content_templates
      WHERE (user_id = ${user_id} OR is_public = true)
    `

    if (sort_by_usage) {
      query = sql`
        SELECT 
          id,
          user_id,
          name,
          description,
          template_data,
          category,
          tags,
          is_public,
          usage_count,
          created_at,
          updated_at
        FROM content_templates
        WHERE (user_id = ${user_id} OR is_public = true)
        ORDER BY usage_count DESC, created_at DESC
      `
    } else {
      query = sql`
        SELECT 
          id,
          user_id,
          name,
          description,
          template_data,
          category,
          tags,
          is_public,
          usage_count,
          created_at,
          updated_at
        FROM content_templates
        WHERE (user_id = ${user_id} OR is_public = true)
        ORDER BY created_at DESC
      `
    }

    let results = await query

    // Apply filters in JavaScript
    if (!include_public) {
      results = results.filter((row: any) => row.user_id === user_id)
    }

    if (category) {
      results = results.filter((row: any) => row.category === category)
    }

    const templates = results.map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      description: row.description,
      template_data: row.template_data || {},
      template_type: row.category || 'content', // Map category to template_type for compatibility
      tags: row.tags || [],
      is_public: row.is_public || false,
      usage_count: row.usage_count || 0,
      rating: 0, // Not in our schema, but keeping for compatibility
      metadata: {}, // Not in our schema, but keeping for compatibility
      created_at: row.created_at,
      updated_at: row.updated_at
    }))

    return NextResponse.json({
      success: true,
      data: templates
    })

  } catch (error) {
    console.error('Templates GET error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch templates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST: Create new template
export async function POST(request: NextRequest) {
  try {
    // If database not configured, return empty data (tool still works with localStorage fallback)
    if (!sql) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Database not configured - using local storage'
      })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.template_data) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Template name and template_data are required' 
        },
        { status: 400 }
      )
    }

    // For now, use anonymous user (auth will be added later)
    const user_id = 'anonymous'

    // Generate UUID for new template
    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    // Map template_type to category (our schema uses category)
    const category = body.template_type || body.category || 'content'

    // Create template
    const result = await sql`
      INSERT INTO content_templates (
        id,
        user_id,
        name,
        description,
        template_data,
        category,
        tags,
        is_public,
        usage_count,
        created_at,
        updated_at
      ) VALUES (
        ${id},
        ${user_id},
        ${body.name},
        ${body.description || null},
        ${JSON.stringify(body.template_data)}::jsonb,
        ${category},
        ${body.tags || []}::text[],
        ${body.is_public || false},
        0,
        ${now},
        ${now}
      )
      RETURNING *
    `

    const newTemplate = {
      id: result[0].id,
      user_id: result[0].user_id,
      name: result[0].name,
      description: result[0].description,
      template_data: result[0].template_data || {},
      template_type: result[0].category || 'content', // Map back to template_type
      tags: result[0].tags || [],
      is_public: result[0].is_public || false,
      usage_count: result[0].usage_count || 0,
      rating: 0, // Not in schema
      metadata: {}, // Not in schema
      created_at: result[0].created_at,
      updated_at: result[0].updated_at
    }

    return NextResponse.json({
      success: true,
      data: newTemplate,
      message: 'Template created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Templates POST error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create template',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
