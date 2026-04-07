import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { nanoid } from 'nanoid'

export const runtime = 'nodejs'

// GET: Fetch tags with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!sql) {
      return NextResponse.json({ tags: [], personalTags: [], total: 0 })
    }

    const searchPattern = search ? `%${search}%` : null
    const tags =
      search && category
        ? await sql`
            SELECT id, name, category, color, description, usage_count, created_at FROM tags
            WHERE name ILIKE ${searchPattern} AND category = ${category}
            ORDER BY usage_count DESC, name ASC LIMIT ${limit}
          `
        : search
          ? await sql`
              SELECT id, name, category, color, description, usage_count, created_at FROM tags
              WHERE name ILIKE ${searchPattern}
              ORDER BY usage_count DESC, name ASC LIMIT ${limit}
            `
          : category
            ? await sql`
                SELECT id, name, category, color, description, usage_count, created_at FROM tags
                WHERE category = ${category}
                ORDER BY usage_count DESC, name ASC LIMIT ${limit}
              `
            : await sql`
                SELECT id, name, category, color, description, usage_count, created_at FROM tags
                ORDER BY usage_count DESC, name ASC LIMIT ${limit}
              `

    return NextResponse.json({ 
      tags,
      personalTags: [],
      total: tags.length 
    })

  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tags', tags: [], personalTags: [] },
      { status: 500 }
    )
  }
}

// POST: Create new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, category, color, description } = body

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }

    if (!sql) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    // Check if tag already exists
    const existing = await sql`
      SELECT id FROM tags WHERE LOWER(name) = LOWER(${name.trim()}) LIMIT 1
    `

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Tag already exists' },
        { status: 409 }
      )
    }

    // Create new tag
    const tag = await sql`
      INSERT INTO tags (id, name, category, color, description, created_at, updated_at)
      VALUES (${nanoid()}, ${name.trim().toLowerCase()}, ${category || 'general'}, ${color || generateTagColor(name)}, ${description || null}, NOW(), NOW())
      RETURNING id, name, category, color, description, usage_count
    `

    return NextResponse.json({ tag: tag[0] })

  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}

function generateTagColor(name: string): string {
  const colors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
    '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16'
  ]
  
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index]
}
