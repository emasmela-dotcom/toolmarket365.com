import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET: List all content items with filters
export async function GET(request: NextRequest) {
  try {
    // If database not configured, return empty data (tool still works with localStorage fallback)
    if (!sql) {
      const { searchParams } = new URL(request.url)
      const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
      const offset = parseInt(searchParams.get('offset') || '0')
      
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          total: 0,
          limit,
          offset,
          has_more: false
        },
        message: 'Database not configured - using local storage'
      })
    }

    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const search = searchParams.get('search') || ''
    const tagsParam = searchParams.get('tags')
    const tags = tagsParam ? tagsParam.split(',').filter(Boolean) : []
    const contentTypeParam = searchParams.get('content_type')
    const content_type = contentTypeParam ? contentTypeParam.split(',').filter(Boolean) : []
    const statusParam = searchParams.get('status')
    const status = statusParam ? statusParam.split(',').filter(Boolean) : []
    const collection_id = searchParams.get('collection_id')
    const is_favorite = searchParams.get('is_favorite')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const sort_by = searchParams.get('sort_by') || 'created_at'
    const sort_order = searchParams.get('sort_order') || 'desc'

    // For now, use anonymous user (auth will be added later)
    const user_id = 'anonymous'

    // Validate sort_by to prevent SQL injection
    const validSortColumns = ['created_at', 'updated_at', 'title']
    const safeSortBy = validSortColumns.includes(sort_by) ? sort_by : 'created_at'
    const safeSortOrder = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    // Build query with all conditions - simpler approach
    // Fetch all for user first, then filter in code (simpler for now)
    let results = await sql`
      SELECT 
        id,
        user_id,
        title,
        description,
        content_type,
        content_data,
        tags,
        status,
        collection_id,
        is_favorite,
        metadata,
        created_at,
        updated_at,
        published_at
      FROM content_library
      WHERE user_id = ${user_id}
      ORDER BY ${sql.unsafe(safeSortBy)} ${sql.unsafe(safeSortOrder)}
    `

    // Apply filters in JavaScript (simpler for complex filters)
    let filtered = results

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((item: any) => 
        item.title?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
      )
    }

    if (content_type.length > 0) {
      filtered = filtered.filter((item: any) => 
        content_type.includes(item.content_type)
      )
    }

    if (status.length > 0) {
      filtered = filtered.filter((item: any) => 
        status.includes(item.status)
      )
    }

    if (collection_id) {
      filtered = filtered.filter((item: any) => 
        item.collection_id === collection_id
      )
    }

    if (is_favorite !== null && is_favorite !== '') {
      filtered = filtered.filter((item: any) => 
        item.is_favorite === (is_favorite === 'true')
      )
    }

    if (tags.length > 0) {
      filtered = filtered.filter((item: any) => 
        tags.some((tag: string) => item.tags?.includes(tag))
      )
    }

    const totalCount = filtered.length

    // Apply pagination
    const paginated = filtered.slice(offset, offset + limit)

    const contentItems = paginated.map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      description: row.description,
      content_type: row.content_type,
      content_data: row.content_data || {},
      tags: row.tags || [],
      status: row.status,
      collection_id: row.collection_id,
      is_favorite: row.is_favorite || false,
      metadata: row.metadata || {},
      created_at: row.created_at,
      updated_at: row.updated_at,
      published_at: row.published_at,
      view_count: (row.metadata as any)?.view_count || 0,
      like_count: (row.metadata as any)?.like_count || 0,
      share_count: (row.metadata as any)?.share_count || 0
    }))

    return NextResponse.json({
      success: true,
      data: contentItems,
      pagination: {
        total: totalCount,
        limit,
        offset,
        has_more: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error('Content library GET error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch content items',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST: Create new content item
export async function POST(request: NextRequest) {
  try {
    // If database not configured, return success with empty data (tool still works with localStorage fallback)
    if (!sql) {
      return NextResponse.json({
        success: true,
        data: {
          id: `local_${Date.now()}`,
          user_id: 'anonymous',
          title: body.title,
          description: body.description || null,
          content_type: body.content_type,
          content_data: body.content_data || {},
          tags: body.tags || [],
          status: body.status || 'draft',
          collection_id: body.collection_id || null,
          is_favorite: body.is_favorite || false,
          metadata: body.metadata || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published_at: body.status === 'published' ? new Date().toISOString() : null,
          view_count: 0,
          like_count: 0,
          share_count: 0
        },
        message: 'Content saved locally (database not configured)'
      })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.content_type) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Title and content_type are required' 
        },
        { status: 400 }
      )
    }

    // For now, use anonymous user (auth will be added later)
    const user_id = 'anonymous'

    // Generate UUID for new content
    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    // Create content item
    const result = await sql`
      INSERT INTO content_library (
        id,
        user_id,
        title,
        description,
        content_type,
        content_data,
        tags,
        status,
        collection_id,
        is_favorite,
        metadata,
        created_at,
        updated_at,
        published_at
      ) VALUES (
        ${id},
        ${user_id},
        ${body.title},
        ${body.description || null},
        ${body.content_type},
        ${JSON.stringify(body.content_data || {})}::jsonb,
        ${body.tags || []}::text[],
        ${body.status || 'draft'},
        ${body.collection_id || null},
        ${body.is_favorite || false},
        ${JSON.stringify({
          ...(body.metadata || {}),
          view_count: 0,
          like_count: 0,
          share_count: 0
        })}::jsonb,
        ${now},
        ${now},
        ${body.status === 'published' ? now : null}
      )
      RETURNING *
    `

    const newContent = {
      id: result[0].id,
      user_id: result[0].user_id,
      title: result[0].title,
      description: result[0].description,
      content_type: result[0].content_type,
      content_data: result[0].content_data || {},
      tags: result[0].tags || [],
      status: result[0].status,
      collection_id: result[0].collection_id,
      is_favorite: result[0].is_favorite || false,
      metadata: result[0].metadata || {},
      created_at: result[0].created_at,
      updated_at: result[0].updated_at,
      published_at: result[0].published_at,
      view_count: (result[0].metadata as any)?.view_count || 0,
      like_count: (result[0].metadata as any)?.like_count || 0,
      share_count: (result[0].metadata as any)?.share_count || 0
    }

    return NextResponse.json({
      success: true,
      data: newContent,
      message: 'Content item created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Content library POST error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create content item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
