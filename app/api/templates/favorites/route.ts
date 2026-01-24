import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

// POST: Toggle favorite (add or remove)
export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { templateId, action } = body

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    if (action !== 'add' && action !== 'remove') {
      return NextResponse.json(
        { error: 'Invalid action. Use "add" or "remove"' },
        { status: 400 }
      )
    }

    // For now, use anonymous user (auth will be added later)
    const userId = 'anonymous'

    if (action === 'add') {
      // Check if already favorited
      const existing = await sql`
        SELECT id FROM user_template_favorites
        WHERE user_id = ${userId} AND template_id = ${templateId}
      `

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: 'Template already favorited' },
          { status: 409 }
        )
      }

      // Add favorite
      const favorite = await sql`
        INSERT INTO user_template_favorites (user_id, template_id, created_at)
        VALUES (${userId}, ${templateId}, NOW())
        RETURNING id, template_id, created_at
      `

      return NextResponse.json({
        success: true,
        favorite: favorite[0],
        isFavorited: true
      })

    } else { // remove
      const deleted = await sql`
        DELETE FROM user_template_favorites
        WHERE user_id = ${userId} AND template_id = ${templateId}
        RETURNING id
      `

      if (!deleted || deleted.length === 0) {
        return NextResponse.json(
          { error: 'Favorite not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        isFavorited: false
      })
    }

  } catch (error) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json(
      { error: 'Failed to toggle favorite' },
      { status: 500 }
    )
  }
}

// GET: Get user's favorites
export async function GET(request: NextRequest) {
  try {
    if (!sql) {
      // Return localStorage fallback structure
      return NextResponse.json({
        favorites: [],
        localStorage: true
      })
    }

    // For now, use anonymous user (auth will be added later)
    const userId = 'anonymous'

    // Get user's favorites with template data
    const favorites = await sql`
      SELECT 
        utf.id,
        utf.template_id,
        utf.created_at as favorited_at,
        ct.id as template_id,
        ct.name,
        ct.description,
        ct.niche,
        ct.platform,
        ct.voice,
        ct.template_type,
        ct.usage_count,
        ct.likes_count,
        ct.tags,
        ct.difficulty_level,
        ct.is_public
      FROM user_template_favorites utf
      INNER JOIN content_templates ct ON utf.template_id = ct.id
      WHERE utf.user_id = ${userId}
      ORDER BY utf.created_at DESC
    `

    return NextResponse.json({
      favorites: favorites || [],
      localStorage: false
    })

  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}
