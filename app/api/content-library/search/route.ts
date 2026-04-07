import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

// POST: Advanced search with filters
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // If database not configured, return empty data (tool still works with localStorage fallback)
    if (!sql) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          total: 0,
          limit: body.limit || 50,
          offset: body.offset || 0,
          has_more: false
        },
        search_info: {
          query: body.query || '',
          filters_applied: {}
        },
        message: 'Database not configured - using local storage'
      })
    }
    
    const {
      query = '',
      tags = [],
      content_type = [],
      status = [],
      collection_id,
      date_range,
      is_favorite,
      sort_by = 'created_at',
      sort_order = 'desc',
      limit = 50,
      offset = 0
    } = body

    // For now, use anonymous user (auth will be added later)
    const user_id = 'anonymous'

    // Fetch all content for user first, then filter in JavaScript (simpler for complex searches)
    let results = await sql`
      SELECT 
        cl.id,
        cl.user_id,
        cl.title,
        cl.description,
        cl.content_type,
        cl.content_data,
        cl.tags,
        cl.status,
        cl.collection_id,
        cl.is_favorite,
        cl.metadata,
        cl.created_at,
        cl.updated_at,
        cl.published_at
      FROM content_library cl
      WHERE cl.user_id = ${user_id}
    `

    // Apply filters in JavaScript
    let filtered = results

    // Text search
    if (query) {
      const queryLower = query.toLowerCase()
      filtered = filtered.filter((item: any) => {
        const title = (item.title || '').toLowerCase()
        const description = (item.description || '').toLowerCase()
        const contentText = (item.content_data as any)?.text?.toLowerCase() || ''
        const tagsStr = (item.tags || []).join(' ').toLowerCase()
        
        return title.includes(queryLower) ||
               description.includes(queryLower) ||
               contentText.includes(queryLower) ||
               tagsStr.includes(queryLower) ||
               (item.tags || []).some((tag: string) => tag.toLowerCase().includes(queryLower))
      })
    }

    // Tag filters
    if (tags.length > 0) {
      filtered = filtered.filter((item: any) => 
        tags.some((tag: string) => item.tags?.includes(tag))
      )
    }

    // Content type filters
    if (content_type.length > 0) {
      filtered = filtered.filter((item: any) => 
        content_type.includes(item.content_type)
      )
    }

    // Status filters
    if (status.length > 0) {
      filtered = filtered.filter((item: any) => 
        status.includes(item.status)
      )
    }

    // Collection filter
    if (collection_id) {
      filtered = filtered.filter((item: any) => 
        item.collection_id === collection_id
      )
    }

    // Date range filter
    if (date_range?.start && date_range?.end) {
      const startDate = new Date(date_range.start)
      const endDate = new Date(date_range.end)
      filtered = filtered.filter((item: any) => {
        const createdDate = new Date(item.created_at)
        return createdDate >= startDate && createdDate <= endDate
      })
    }

    // Favorite filter
    if (is_favorite !== undefined) {
      filtered = filtered.filter((item: any) => 
        item.is_favorite === is_favorite
      )
    }

    // Calculate relevance score for text search
    if (query && sort_by === 'relevance') {
      const queryLower = query.toLowerCase()
      filtered = filtered.map((item: any) => {
        let relevance = 0
        const title = (item.title || '').toLowerCase()
        const description = (item.description || '').toLowerCase()
        const tagsStr = (item.tags || []).join(' ').toLowerCase()
        
        if (title.includes(queryLower)) relevance += 3
        if (tagsStr.includes(queryLower)) relevance += 2
        if (description.includes(queryLower)) relevance += 1
        
        return { ...item, relevance_score: relevance }
      })
      
      // Sort by relevance
      filtered.sort((a: any, b: any) => {
        if (b.relevance_score !== a.relevance_score) {
          return b.relevance_score - a.relevance_score
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    } else {
      // Sort by other fields
      const validSortColumns = ['created_at', 'updated_at', 'title']
      const safeSortBy = validSortColumns.includes(sort_by) ? sort_by : 'created_at'
      const safeSortOrder = sort_order.toUpperCase() === 'ASC' ? 1 : -1
      
      filtered.sort((a: any, b: any) => {
        if (safeSortBy === 'title') {
          return a.title.localeCompare(b.title) * safeSortOrder
        }
        const aDate = new Date(a[safeSortBy]).getTime()
        const bDate = new Date(b[safeSortBy]).getTime()
        return (bDate - aDate) * safeSortOrder
      })
    }

    const totalCount = filtered.length

    // Apply pagination
    const paginated = filtered.slice(offset, offset + limit)

    // Get collection names for items
    const collectionIds = [...new Set(paginated.map((item: any) => item.collection_id).filter(Boolean))]
    const collections: Record<string, string> = {}
    
    if (collectionIds.length > 0) {
      const collectionResults = await sql`
        SELECT id, name
        FROM content_collections
        WHERE id = ANY(${collectionIds}::text[])
      `
      collectionResults.forEach((row: any) => {
        collections[row.id] = row.name
      })
    }

    const searchResults = paginated.map((row: any) => ({
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
      share_count: (row.metadata as any)?.share_count || 0,
      collection_name: row.collection_id ? collections[row.collection_id] : null,
      relevance_score: row.relevance_score || 0
    }))

    return NextResponse.json({
      success: true,
      data: searchResults,
      pagination: {
        total: totalCount,
        limit,
        offset,
        has_more: offset + limit < totalCount
      },
      search_info: {
        query,
        filters_applied: {
          tags: tags.length,
          content_type: content_type.length,
          status: status.length,
          has_date_range: !!date_range,
          has_collection: !!collection_id,
          has_favorite: is_favorite !== undefined
        }
      }
    })

  } catch (error) {
    console.error('Search POST error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Search failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
