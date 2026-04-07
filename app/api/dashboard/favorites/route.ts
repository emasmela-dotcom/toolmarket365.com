// API Route: /app/api/dashboard/favorites/route.ts
// Purpose: Manage user favorites/bookmarks with Neon serverless SQL

import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { nanoid } from 'nanoid'

// Database connection helper
function getDatabase() {
  try {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) return null
    return neon(databaseUrl)
  } catch {
    return null
  }
}

// GET: Fetch user favorites
export async function GET(req: NextRequest) {
  const sql = getDatabase()
  const userId = req.headers.get('x-user-id') || req.headers.get('user-id')

  if (!sql || !userId) {
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Database not configured - using local storage'
    })
  }

  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    // Use tagged template literal syntax for Neon serverless SDK
    let favorites
    if (category) {
      favorites = await (sql as any)`
        SELECT id, tool_name, tool_category, tool_description, favorited_at, notes
        FROM user_favorites
        WHERE user_id = ${userId}
          AND tool_category = ${category}
        ORDER BY favorited_at DESC
      `
    } else {
      favorites = await (sql as any)`
        SELECT id, tool_name, tool_category, tool_description, favorited_at, notes
        FROM user_favorites
        WHERE user_id = ${userId}
        ORDER BY favorited_at DESC
      `
    }

    return NextResponse.json({
      success: true,
      data: favorites.map((fav: any) => ({
        ...fav,
        favorited_at: fav.favorited_at instanceof Date
          ? fav.favorited_at.toISOString()
          : String(fav.favorited_at)
      }))
    })

  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Error fetching favorites - using local storage'
    }, { status: 500 })
  }
}

// POST: Add new favorite
export async function POST(req: NextRequest) {
  const sql = getDatabase()
  const userId = req.headers.get('x-user-id') || req.headers.get('user-id')

  if (!sql || !userId) {
    return NextResponse.json({
      success: false,
      error: 'Database not configured or user not authenticated'
    }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { toolName, toolCategory, toolDescription, notes } = body

    // Validate required fields
    if (!toolName || !toolCategory) {
      return NextResponse.json({
        success: false,
        error: 'Tool name and category are required'
      }, { status: 400 })
    }

    // Check if already favorited
    const existing = await (sql as any)`
      SELECT id FROM user_favorites
      WHERE user_id = ${userId} AND tool_name = ${toolName}
    `

    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Tool already in favorites'
      }, { status: 409 })
    }

    // Add to favorites
    const favorite = await (sql as any)`
      INSERT INTO user_favorites (
        id, user_id, tool_name, tool_category, tool_description, notes, favorited_at
      ) VALUES (
        ${nanoid()}, ${userId}, ${toolName}, ${toolCategory}, ${toolDescription || null}, ${notes || null}, NOW()
      )
      RETURNING id, tool_name, tool_category, tool_description, favorited_at, notes
    `

    const row = favorite[0]

    // Log activity
    await (sql as any)`
      INSERT INTO user_activity (
        id, user_id, activity_type, tool_name, tool_category, activity_description, created_at
      ) VALUES (
        ${nanoid()}, ${userId}, 'favorite_added', ${toolName}, ${toolCategory}, ${`Added ${toolName} to favorites`}, NOW()
      )
    `

    return NextResponse.json({
      success: true,
      data: {
        ...row,
        favorited_at: row.favorited_at instanceof Date
          ? row.favorited_at.toISOString()
          : String(row.favorited_at)
      }
    })

  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to add favorite'
    }, { status: 500 })
  }
}

// DELETE: Remove favorite
export async function DELETE(req: NextRequest) {
  const sql = getDatabase()
  const userId = req.headers.get('x-user-id') || req.headers.get('user-id')

  if (!sql || !userId) {
    return NextResponse.json({
      success: false,
      error: 'Database not configured or user not authenticated'
    }, { status: 400 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const favoriteId = searchParams.get('id')
    const toolName = searchParams.get('toolName')

    if (!favoriteId && !toolName) {
      return NextResponse.json({
        success: false,
        error: 'Favorite ID or tool name is required'
      }, { status: 400 })
    }

    // Get favorite details before deletion for activity log
    let favoriteToDelete
    if (favoriteId) {
      favoriteToDelete = await (sql as any)`
        SELECT tool_name, tool_category
        FROM user_favorites
        WHERE id = ${favoriteId} AND user_id = ${userId}
      `
    } else {
      favoriteToDelete = await (sql as any)`
        SELECT tool_name, tool_category
        FROM user_favorites
        WHERE user_id = ${userId} AND tool_name = ${toolName}
      `
    }

    if (favoriteToDelete.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Favorite not found'
      }, { status: 404 })
    }

    // Delete favorite
    if (favoriteId) {
      await (sql as any)`
        DELETE FROM user_favorites
        WHERE id = ${favoriteId} AND user_id = ${userId}
      `
    } else {
      await (sql as any)`
        DELETE FROM user_favorites
        WHERE user_id = ${userId} AND tool_name = ${toolName}
      `
    }

    // Log activity
    await (sql as any)`
      INSERT INTO user_activity (
        id, user_id, activity_type, tool_name, tool_category, activity_description, created_at
      ) VALUES (
        ${nanoid()}, ${userId}, 'favorite_removed', ${favoriteToDelete[0].tool_name}, ${favoriteToDelete[0].tool_category}, ${`Removed ${favoriteToDelete[0].tool_name} from favorites`}, NOW()
      )
    `

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to remove favorite'
    }, { status: 500 })
  }
}


