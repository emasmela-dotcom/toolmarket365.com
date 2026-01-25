import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/subscription'
import { nanoid } from 'nanoid'

export const runtime = 'nodejs'

// GET /api/content - Fetch content items
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const tag = searchParams.get('tag')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!sql) {
      return NextResponse.json({ 
        contents: [], 
        pagination: { total: 0, limit, offset, hasMore: false }
      })
    }

    // Build query using template literals
    let contents
    if (type && tag) {
      contents = await sql`
        SELECT id, type, title, description, content, metadata, url, 
               thumbnail_url, created_at, updated_at
        FROM content_items
        WHERE user_id = ${userId}
          AND type = ${type}
          AND metadata->'tags' ? ${tag}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (type) {
      contents = await sql`
        SELECT id, type, title, description, content, metadata, url, 
               thumbnail_url, created_at, updated_at
        FROM content_items
        WHERE user_id = ${userId}
          AND type = ${type}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else if (tag) {
      contents = await sql`
        SELECT id, type, title, description, content, metadata, url, 
               thumbnail_url, created_at, updated_at
        FROM content_items
        WHERE user_id = ${userId}
          AND metadata->'tags' ? ${tag}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      contents = await sql`
        SELECT id, type, title, description, content, metadata, url, 
               thumbnail_url, created_at, updated_at
        FROM content_items
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    // Get total count
    let countResult
    if (type && tag) {
      countResult = await sql`
        SELECT COUNT(*) as total FROM content_items 
        WHERE user_id = ${userId} AND type = ${type} AND metadata->'tags' ? ${tag}
      `
    } else if (type) {
      countResult = await sql`
        SELECT COUNT(*) as total FROM content_items 
        WHERE user_id = ${userId} AND type = ${type}
      `
    } else if (tag) {
      countResult = await sql`
        SELECT COUNT(*) as total FROM content_items 
        WHERE user_id = ${userId} AND metadata->'tags' ? ${tag}
      `
    } else {
      countResult = await sql`
        SELECT COUNT(*) as total FROM content_items 
        WHERE user_id = ${userId}
      `
    }
    const total = countResult[0]?.total || 0

    return NextResponse.json({
      contents: contents.map(c => ({
        ...c,
        metadata: c.metadata || {}
      })),
      pagination: {
        total: Number(total),
        limit,
        offset,
        hasMore: offset + contents.length < Number(total)
      }
    })

  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content', contents: [] },
      { status: 500 }
    )
  }
}

// POST /api/content - Create new content item
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const {
      type,
      title,
      content,
      description,
      metadata = {},
      url,
      thumbnail_url
    } = body

    // Validate required fields
    if (!type || !title || !content) {
      return NextResponse.json(
        { error: 'Type, title, and content are required' },
        { status: 400 }
      )
    }

    // Validate content type
    const validTypes = ['text', 'image', 'video', 'audio', 'document', 'url']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    // Create content item
    const contentItem = await sql`
      INSERT INTO content_items (
        id, user_id, type, title, description, content, 
        metadata, url, thumbnail_url, created_at, updated_at
      ) VALUES (
        ${nanoid()}, ${userId}, ${type}, ${title}, 
        ${description || null}, ${content},
        ${JSON.stringify(metadata)}, ${url || null}, 
        ${thumbnail_url || null}, NOW(), NOW()
      )
      RETURNING id, type, title, description, content, metadata, url, thumbnail_url, created_at
    `

    return NextResponse.json({ 
      content: {
        ...contentItem[0],
        metadata: contentItem[0].metadata || {}
      }
    })

  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    )
  }
}
