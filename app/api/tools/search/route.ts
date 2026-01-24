import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/subscription'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    // Extract filter parameters
    const search = searchParams.get('search') || ''
    const types = searchParams.get('types')?.split(',').filter(Boolean) || []
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    const category = searchParams.get('category') || ''
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!sql) {
      return NextResponse.json({ 
        tools: [], 
        pagination: { total: 0, limit, offset, hasMore: false },
        filters: { search, types, tags, category, sortBy, sortOrder }
      })
    }

    // Build base query
    let whereConditions = ['user_id = $1', 'is_active = true']
    let params: any[] = [userId]
    let paramCount = 2

    // Search functionality
    if (search) {
      whereConditions.push(`(name ILIKE $${paramCount} OR description ILIKE $${paramCount} OR tags::text ILIKE $${paramCount})`)
      params.push(`%${search}%`)
      paramCount++
    }

    // Type filtering
    if (types.length > 0) {
      const placeholders = types.map((_, i) => `$${paramCount + i}`).join(',')
      whereConditions.push(`type IN (${placeholders})`)
      params.push(...types)
      paramCount += types.length
    }

    // Category filtering
    if (category) {
      whereConditions.push(`category = $${paramCount}`)
      params.push(category)
      paramCount++
    }

    // Tag filtering
    if (tags.length > 0) {
      const tagConditions = tags.map(() => `tags && $${paramCount++}`).join(' OR ')
      whereConditions.push(`(${tagConditions})`)
      tags.forEach(tag => params.push([tag]))
    }

    // Build the query string
    let query = `
      SELECT id, name, description, type, category, tags, is_active, created_at, updated_at
      FROM tools
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `

    params.push(limit, offset)

    // Execute query
    const tools = await sql.unsafe(query, params)

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM tools WHERE ${whereConditions.join(' AND ')}`
    const countParams = params.slice(0, params.length - 2)
    
    const countResult = await sql.unsafe(countQuery, countParams)
    const total = countResult[0]?.total || 0

    return NextResponse.json({
      tools,
      pagination: {
        total: Number(total),
        limit,
        offset,
        hasMore: offset + tools.length < Number(total)
      },
      filters: {
        search,
        types,
        tags,
        category,
        sortBy,
        sortOrder
      }
    })

  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tools', tools: [] },
      { status: 500 }
    )
  }
}
