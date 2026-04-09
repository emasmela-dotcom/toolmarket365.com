import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

// GET: Get single content item by ID
export async function GET(request: NextRequest, context: any) {
  try {
    // If database not configured, return empty data (tool still works with localStorage fallback)
    if (!sql) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Database not configured - using local storage'
      })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Content ID is required' },
        { status: 400 }
      )
    }

    // For now, use anonymous user (auth will be added later)
    const user_id = 'anonymous'

    const result = await sql`
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
      WHERE id = ${id} AND user_id = ${user_id}
    `

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content item not found' },
        { status: 404 }
      )
    }

    const row = result[0]
    const contentItem = {
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
    }

    return NextResponse.json({
      success: true,
      data: contentItem
    })

  } catch (error) {
    console.error('Content item GET error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch content item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT: Update content item
export async function PUT(request: NextRequest, context: any) {
  try {
    // If database not configured, return empty data (tool still works with localStorage fallback)
    if (!sql) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Database not configured - using local storage'
      })
    }

    const { id } = await params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Content ID is required' },
        { status: 400 }
      )
    }

    // For now, use anonymous user (auth will be added later)
    const user_id = 'anonymous'

    // Get existing content first
    const existing = await sql`
      SELECT * FROM content_library
      WHERE id = ${id} AND user_id = ${user_id}
    `

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content item not found or unauthorized' },
        { status: 404 }
      )
    }

    const current = existing[0]
    const now = new Date().toISOString()

    // Build update - merge with existing values
    const updateData = {
      title: body.title !== undefined ? body.title : current.title,
      description: body.description !== undefined ? body.description : current.description,
      content_type: body.content_type !== undefined ? body.content_type : current.content_type,
      content_data: body.content_data !== undefined ? body.content_data : current.content_data,
      tags: body.tags !== undefined ? body.tags : current.tags,
      status: body.status !== undefined ? body.status : current.status,
      collection_id: body.collection_id !== undefined ? body.collection_id : current.collection_id,
      is_favorite: body.is_favorite !== undefined ? body.is_favorite : current.is_favorite,
      metadata: body.metadata !== undefined ? body.metadata : current.metadata,
      updated_at: now,
      published_at: body.status === 'published' && current.status !== 'published' 
        ? now 
        : body.status === 'published' 
          ? (current.published_at || now)
          : current.published_at
    }

    // Update the content item
    const result = await sql`
      UPDATE content_library
      SET 
        title = ${updateData.title},
        description = ${updateData.description},
        content_type = ${updateData.content_type},
        content_data = ${JSON.stringify(updateData.content_data)}::jsonb,
        tags = ${updateData.tags}::text[],
        status = ${updateData.status},
        collection_id = ${updateData.collection_id},
        is_favorite = ${updateData.is_favorite},
        metadata = ${JSON.stringify(updateData.metadata)}::jsonb,
        updated_at = ${updateData.updated_at},
        published_at = ${updateData.published_at}
      WHERE id = ${id} AND user_id = ${user_id}
      RETURNING *
    `

    const updateResult = result

    if (updateResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to update content item' },
        { status: 500 }
      )
    }

    const row = updateResult[0]
    const updatedContent = {
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
    }

    return NextResponse.json({
      success: true,
      data: updatedContent,
      message: 'Content item updated successfully'
    })

  } catch (error) {
    console.error('Content item PUT error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update content item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE: Delete content item
export async function DELETE(request: NextRequest, context: any) {
  try {
    // If database not configured, return empty data (tool still works with localStorage fallback)
    if (!sql) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Database not configured - using local storage'
      })
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Content ID is required' },
        { status: 400 }
      )
    }

    // For now, use anonymous user (auth will be added later)
    const user_id = 'anonymous'

    // First, check if item exists
    const checkResult = await sql`
      SELECT id FROM content_library
      WHERE id = ${id} AND user_id = ${user_id}
    `

    if (checkResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content item not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete the content item
    await sql`
      DELETE FROM content_library
      WHERE id = ${id} AND user_id = ${user_id}
    `

    return NextResponse.json({
      success: true,
      message: 'Content item deleted successfully'
    })

  } catch (error) {
    console.error('Content item DELETE error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete content item',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
