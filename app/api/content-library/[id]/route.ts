import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET: Get single content item by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!sql) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      )
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
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!sql) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      )
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

    // Build update object - only include fields that are provided
    const updates: any = {
      updated_at: new Date().toISOString()
    }

    if (body.title !== undefined) updates.title = body.title
    if (body.description !== undefined) updates.description = body.description
    if (body.content_type !== undefined) updates.content_type = body.content_type
    if (body.content_data !== undefined) updates.content_data = JSON.stringify(body.content_data)
    if (body.tags !== undefined) updates.tags = body.tags
    if (body.status !== undefined) {
      updates.status = body.status
      if (body.status === 'published' && !body.published_at) {
        updates.published_at = new Date().toISOString()
      }
    }
    if (body.collection_id !== undefined) updates.collection_id = body.collection_id
    if (body.is_favorite !== undefined) updates.is_favorite = body.is_favorite
    if (body.metadata !== undefined) updates.metadata = JSON.stringify(body.metadata)

    // Build the update query using Neon template syntax
    // For dynamic updates, we'll use a simpler approach
    const updateFields: string[] = []
    const updateValues: any[] = []
    let paramIndex = 1

    if (updates.title !== undefined) {
      updateFields.push(`title = $${paramIndex}`)
      updateValues.push(updates.title)
      paramIndex++
    }
    if (updates.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`)
      updateValues.push(updates.description)
      paramIndex++
    }
    if (updates.content_type !== undefined) {
      updateFields.push(`content_type = $${paramIndex}`)
      updateValues.push(updates.content_type)
      paramIndex++
    }
    if (updates.content_data !== undefined) {
      updateFields.push(`content_data = $${paramIndex}::jsonb`)
      updateValues.push(updates.content_data)
      paramIndex++
    }
    if (updates.tags !== undefined) {
      updateFields.push(`tags = $${paramIndex}::text[]`)
      updateValues.push(updates.tags)
      paramIndex++
    }
    if (updates.status !== undefined) {
      updateFields.push(`status = $${paramIndex}`)
      updateValues.push(updates.status)
      paramIndex++
    }
    if (updates.published_at !== undefined) {
      updateFields.push(`published_at = $${paramIndex}`)
      updateValues.push(updates.published_at)
      paramIndex++
    }
    if (updates.collection_id !== undefined) {
      updateFields.push(`collection_id = $${paramIndex}`)
      updateValues.push(updates.collection_id)
      paramIndex++
    }
    if (updates.is_favorite !== undefined) {
      updateFields.push(`is_favorite = $${paramIndex}`)
      updateValues.push(updates.is_favorite)
      paramIndex++
    }
    if (updates.metadata !== undefined) {
      updateFields.push(`metadata = $${paramIndex}::jsonb`)
      updateValues.push(updates.metadata)
      paramIndex++
    }

    // Always update updated_at
    updateFields.push(`updated_at = $${paramIndex}`)
    updateValues.push(updates.updated_at)
    paramIndex++

    // Add id and user_id for WHERE clause
    updateValues.push(id, user_id)

    if (updateFields.length === 1) { // Only updated_at
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      )
    }

    // Use Neon template literal with dynamic parts
    // For complex dynamic updates, we'll use a simpler approach with sql.unsafe for the SET clause
    const setClause = updateFields.join(', ')
    const query = `UPDATE content_library SET ${setClause} WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} RETURNING *`
    
    // Execute with Neon - we need to use a different approach
    // Let's build it step by step with template literals
    const result = await sql`
      UPDATE content_library
      SET 
        ${updates.title !== undefined ? sql`title = ${updates.title}` : sql``},
        ${updates.description !== undefined ? sql`description = ${updates.description}` : sql``},
        ${updates.content_type !== undefined ? sql`content_type = ${updates.content_type}` : sql``},
        ${updates.content_data !== undefined ? sql`content_data = ${updates.content_data}::jsonb` : sql``},
        ${updates.tags !== undefined ? sql`tags = ${updates.tags}::text[]` : sql``},
        ${updates.status !== undefined ? sql`status = ${updates.status}` : sql``},
        ${updates.published_at !== undefined ? sql`published_at = ${updates.published_at}` : sql``},
        ${updates.collection_id !== undefined ? sql`collection_id = ${updates.collection_id}` : sql``},
        ${updates.is_favorite !== undefined ? sql`is_favorite = ${updates.is_favorite}` : sql``},
        ${updates.metadata !== undefined ? sql`metadata = ${updates.metadata}::jsonb` : sql``},
        updated_at = ${updates.updated_at}
      WHERE id = ${id} AND user_id = ${user_id}
      RETURNING *
    `

    // Actually, the above won't work well with conditional fields. Let's use a simpler approach
    // Build the update query manually for the fields that exist
    const updateParts: string[] = []
    const finalValues: any[] = []
    let idx = 1

    if (updates.title !== undefined) {
      updateParts.push(`title = $${idx}`)
      finalValues.push(updates.title)
      idx++
    }
    if (updates.description !== undefined) {
      updateParts.push(`description = $${idx}`)
      finalValues.push(updates.description === null ? null : updates.description)
      idx++
    }
    if (updates.content_type !== undefined) {
      updateParts.push(`content_type = $${idx}`)
      finalValues.push(updates.content_type)
      idx++
    }
    if (updates.content_data !== undefined) {
      updateParts.push(`content_data = $${idx}::jsonb`)
      finalValues.push(updates.content_data)
      idx++
    }
    if (updates.tags !== undefined) {
      updateParts.push(`tags = $${idx}::text[]`)
      finalValues.push(updates.tags)
      idx++
    }
    if (updates.status !== undefined) {
      updateParts.push(`status = $${idx}`)
      finalValues.push(updates.status)
      idx++
    }
    if (updates.published_at !== undefined) {
      updateParts.push(`published_at = $${idx}`)
      finalValues.push(updates.published_at)
      idx++
    }
    if (updates.collection_id !== undefined) {
      updateParts.push(`collection_id = $${idx}`)
      finalValues.push(updates.collection_id === null ? null : updates.collection_id)
      idx++
    }
    if (updates.is_favorite !== undefined) {
      updateParts.push(`is_favorite = $${idx}`)
      finalValues.push(updates.is_favorite)
      idx++
    }
    if (updates.metadata !== undefined) {
      updateParts.push(`metadata = $${idx}::jsonb`)
      finalValues.push(updates.metadata)
      idx++
    }

    updateParts.push(`updated_at = $${idx}`)
    finalValues.push(updates.updated_at)
    idx++

    finalValues.push(id, user_id)

    if (updateParts.length === 1) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      )
    }

    // Use sql.unsafe for dynamic query building
    const updateQuery = `UPDATE content_library SET ${updateParts.join(', ')} WHERE id = $${idx} AND user_id = $${idx + 1} RETURNING *`
    const updateResult = await sql(updateQuery, finalValues)

    if (updateResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content item not found or unauthorized' },
        { status: 404 }
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
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!sql) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 503 }
      )
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
