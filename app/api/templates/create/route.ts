import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

// POST: Create new template
export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.description || !body.template_data) {
      return NextResponse.json(
        { error: 'Name, description, and template_data are required' },
        { status: 400 }
      )
    }

    // For now, use anonymous user (auth will be added later)
    const userId = 'anonymous'

    // Check for duplicate template name
    const existing = await sql`
      SELECT id FROM content_templates
      WHERE user_id = ${userId} AND name = ${body.name}
    `

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'A template with this name already exists' },
        { status: 409 }
      )
    }

    // Create template
    const result = await sql`
      INSERT INTO content_templates (
        id,
        user_id,
        name,
        description,
        template_data,
        category,
        niche,
        platform,
        voice,
        template_type,
        difficulty_level,
        estimated_time_minutes,
        tags,
        is_public,
        usage_count,
        likes_count,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        ${userId},
        ${body.name},
        ${body.description || null},
        ${JSON.stringify(body.template_data)}::jsonb,
        ${body.category || 'content_creation'},
        ${body.niche || 'general'},
        ${body.platform || 'universal'},
        ${body.voice || 'professional'},
        ${body.template_type || 'caption'},
        ${body.difficulty_level || 'beginner'},
        ${body.estimated_time_minutes || 15},
        ${body.tags || []}::text[],
        ${body.is_public || false},
        0,
        0,
        NOW(),
        NOW()
      )
      RETURNING id, name, description, niche, platform, voice, template_type, is_public, created_at
    `

    if (result && result.length > 0) {
      return NextResponse.json({
        success: true,
        template: result[0],
        message: 'Template created successfully'
      })
    }

    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
