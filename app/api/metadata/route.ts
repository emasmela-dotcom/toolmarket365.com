import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/subscription'
import { nanoid } from 'nanoid'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET: Fetch metadata for content
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    const { searchParams } = new URL(request.url)
    
    const contentId = searchParams.get('contentId')
    const contentType = searchParams.get('contentType')

    if (!contentId || !contentType) {
      return NextResponse.json(
        { error: 'contentId and contentType are required' },
        { status: 400 }
      )
    }

    if (!sql) {
      return NextResponse.json({ metadata: null, tags: [], exists: false })
    }

    const metadata = userId
      ? await sql`
          SELECT * FROM content_metadata
          WHERE content_id = ${contentId} AND content_type = ${contentType} AND user_id = ${userId}
        `
      : await sql`
          SELECT * FROM content_metadata
          WHERE content_id = ${contentId} AND content_type = ${contentType}
        `

    const tags = await sql`
      SELECT t.id, t.name, t.category, t.color, ct.confidence_score, ct.is_auto_generated
      FROM content_tags ct
      JOIN tags t ON ct.tag_id = t.id
      WHERE ct.content_id = ${contentId} AND ct.content_type = ${contentType}
    `

    return NextResponse.json({ 
      metadata: metadata[0] || null,
      tags,
      exists: metadata.length > 0
    })

  } catch (error) {
    console.error('Error fetching metadata:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metadata', metadata: null, tags: [] },
      { status: 500 }
    )
  }
}

// POST: Create or update metadata
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
      contentId,
      contentType,
      title,
      description,
      author,
      language = 'en',
      readingTime,
      wordCount,
      sentiment,
      difficultyLevel,
      targetAudience,
      customFields
    } = body

    // Check if metadata already exists
    const existing = await sql`
      SELECT id FROM content_metadata 
      WHERE content_id = ${contentId}
      AND content_type = ${contentType}
      AND user_id = ${userId}
      LIMIT 1
    `

    let metadata

    if (existing.length > 0) {
      // Update existing metadata
      metadata = await sql`
        UPDATE content_metadata
        SET 
          title = ${title || null},
          description = ${description || null},
          author = ${author || null},
          language = ${language},
          reading_time = ${readingTime || null},
          word_count = ${wordCount || null},
          sentiment = ${sentiment || null},
          difficulty_level = ${difficultyLevel || null},
          target_audience = ${targetAudience || null},
          custom_fields = ${customFields ? JSON.stringify(customFields) : null},
          updated_at = NOW()
        WHERE id = ${existing[0].id}
        RETURNING *
      `
    } else {
      // Create new metadata
      metadata = await sql`
        INSERT INTO content_metadata (
          id, content_id, content_type, user_id, title, description, author, 
          language, reading_time, word_count, sentiment, difficulty_level, 
          target_audience, custom_fields, created_at, updated_at
        ) VALUES (
          ${nanoid()}, ${contentId}, ${contentType}, ${userId}, 
          ${title || null}, ${description || null}, ${author || null},
          ${language}, ${readingTime || null}, ${wordCount || null},
          ${sentiment || null}, ${difficultyLevel || null},
          ${targetAudience || null}, ${customFields ? JSON.stringify(customFields) : null},
          NOW(), NOW()
        )
        RETURNING *
      `
    }

    return NextResponse.json({ metadata: metadata[0] })

  } catch (error) {
    console.error('Error saving metadata:', error)
    return NextResponse.json(
      { error: 'Failed to save metadata' },
      { status: 500 }
    )
  }
}
