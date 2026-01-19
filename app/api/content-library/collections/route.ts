import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET: List all collections for user
export async function GET(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    const include_item_count = searchParams.get('include_item_count') === 'true'
    const is_public = searchParams.get('is_public')
    
    // For now, use anonymous user (auth will be added later)
    const user_id = 'anonymous'

    let query = sql`
      SELECT 
        id,
        user_id,
        name,
        description,
        color,
        icon,
        is_public,
        created_at,
        updated_at
      FROM content_collections
      WHERE user_id = ${user_id}
    `

    if (is_public !== null && is_public !== '') {
      query = sql`
        SELECT 
          id,
          user_id,
          name,
          description,
          color,
          icon,
          is_public,
          created_at,
          updated_at
        FROM content_collections
        WHERE user_id = ${user_id}
          AND is_public = ${is_public === 'true'}
        ORDER BY created_at DESC
      `
    } else {
      query = sql`
        SELECT 
          id,
          user_id,
          name,
          description,
          color,
          icon,
          is_public,
          created_at,
          updated_at
        FROM content_collections
        WHERE user_id = ${user_id}
        ORDER BY created_at DESC
      `
    }

    const results = await query

    let collections = results.map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      name: row.name,
      description: row.description,
      cover_image_url: null, // Not in our schema, but keeping for compatibility
      is_public: row.is_public || false,
      tags: [], // Not in our schema, but keeping for compatibility
      metadata: {}, // Not in our schema, but keeping for compatibility
      created_at: row.created_at,
      updated_at: row.updated_at
    }))

    // Include item count if requested
    if (include_item_count) {
      collections = await Promise.all(
        collections.map(async (collection) => {
          const countResult = await sql`
            SELECT COUNT(*) as item_count
            FROM content_library
            WHERE collection_id = ${collection.id}
          `
          return {
            ...collection,
            item_count: parseInt(countResult[0]?.item_count || '0')
          }
        })
      )
    }

    return NextResponse.json({
      success: true,
      data: collections
    })

  } catch (error) {
    console.error('Collections GET error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch collections',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST: Create new collection
export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Collection name is required' 
        },
        { status: 400 }
      )
    }

    // For now, use anonymous user (auth will be added later)
    const user_id = 'anonymous'

    // Generate UUID for new collection
    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    // Create collection
    const result = await sql`
      INSERT INTO content_collections (
        id,
        user_id,
        name,
        description,
        color,
        icon,
        is_public,
        created_at,
        updated_at
      ) VALUES (
        ${id},
        ${user_id},
        ${body.name},
        ${body.description || null},
        ${body.color || null},
        ${body.icon || null},
        ${body.is_public || false},
        ${now},
        ${now}
      )
      RETURNING *
    `

    const newCollection = {
      id: result[0].id,
      user_id: result[0].user_id,
      name: result[0].name,
      description: result[0].description,
      cover_image_url: null, // Not in schema
      is_public: result[0].is_public || false,
      tags: [], // Not in schema
      metadata: {}, // Not in schema
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
      item_count: 0
    }

    return NextResponse.json({
      success: true,
      data: newCollection,
      message: 'Collection created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Collections POST error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create collection',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
