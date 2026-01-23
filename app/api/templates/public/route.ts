import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

// GET: Fetch public templates with filtering
export async function GET(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({
        templates: [],
        pagination: { total: 0, limit: 20, offset: 0, hasMore: false },
        filterOptions: { niches: [], platforms: [], voices: [], templateTypes: [] }
      })
    }

    const { searchParams } = new URL(request.url)
    
    const niche = searchParams.get('niche') || 'all'
    const platform = searchParams.get('platform') || 'all'
    const voice = searchParams.get('voice') || 'all'
    const templateType = searchParams.get('template_type') || 'all'
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sort_by') || 'popular'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build base query - fetch all public templates first, then filter in JavaScript (simpler)
    let templates = await sql`
      SELECT 
        ct.id,
        ct.name,
        ct.description,
        ct.template_data,
        ct.niche,
        ct.platform,
        ct.voice,
        ct.template_type,
        ct.usage_count,
        ct.likes_count,
        ct.tags,
        ct.difficulty_level,
        ct.estimated_time_minutes,
        ct.created_at,
        tc.display_name as niche_display,
        tc.icon as niche_icon,
        tp.display_name as platform_display,
        tp.icon as platform_icon,
        tp.max_length as platform_max_length,
        tv.display_name as voice_display,
        tv.icon as voice_icon,
        tty.display_name as template_type_display,
        tty.icon as template_type_icon
      FROM content_templates ct
      INNER JOIN template_categories tc ON ct.niche = tc.name
      INNER JOIN template_platforms tp ON ct.platform = tp.name
      INNER JOIN template_voices tv ON ct.voice = tv.name
      INNER JOIN template_types tty ON ct.template_type = tty.name
      WHERE ct.is_public = true
    `

    // Filter in JavaScript
    if (niche !== 'all') {
      templates = templates.filter((t: any) => t.niche === niche)
    }
    if (platform !== 'all') {
      templates = templates.filter((t: any) => t.platform === platform)
    }
    if (voice !== 'all') {
      templates = templates.filter((t: any) => t.voice === voice)
    }
    if (templateType !== 'all') {
      templates = templates.filter((t: any) => t.template_type === templateType)
    }
    if (search && search.trim()) {
      const searchLower = search.trim().toLowerCase()
      templates = templates.filter((t: any) => 
        t.name.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower) ||
        t.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
      )
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        templates.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'most_used':
        templates.sort((a: any, b: any) => (b.usage_count || 0) - (a.usage_count || 0))
        break
      case 'most_liked':
        templates.sort((a: any, b: any) => (b.likes_count || 0) - (a.likes_count || 0))
        break
      default: // popular
        templates.sort((a: any, b: any) => {
          const aScore = (a.usage_count || 0) + (a.likes_count || 0) * 2
          const bScore = (b.usage_count || 0) + (b.likes_count || 0) * 2
          return bScore - aScore
        })
    }

    const total = templates.length
    templates = templates.slice(offset, offset + limit)

    // Get total count (for pagination)
    const totalCount = total

    // Get filter options
    const filterOptions = await getFilterOptions()

    return NextResponse.json({
      templates: templates.map((t: any) => ({
        ...t,
        created_at: t.created_at?.toISOString() || new Date().toISOString()
      })),
      pagination: {
        total: Number(total),
        limit,
        offset,
        hasMore: offset + templates.length < Number(total)
      },
      filterOptions
    })

  } catch (error) {
    console.error('Error fetching public templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// Helper function to get filter options
async function getFilterOptions() {
  try {
    if (!sql) {
      return { niches: [], platforms: [], voices: [], templateTypes: [] }
    }

    const niches = await sql`SELECT name, display_name, icon FROM template_categories WHERE is_active = true ORDER BY sort_order`
    const platforms = await sql`SELECT name, display_name, icon, max_length FROM template_platforms WHERE is_active = true ORDER BY sort_order`
    const voices = await sql`SELECT name, display_name, icon FROM template_voices WHERE is_active = true ORDER BY sort_order`
    const templateTypes = await sql`SELECT name, display_name, icon FROM template_types WHERE is_active = true ORDER BY sort_order`

    return {
      niches: niches || [],
      platforms: platforms || [],
      voices: voices || [],
      templateTypes: templateTypes || []
    }
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return {
      niches: [],
      platforms: [],
      voices: [],
      templateTypes: []
    }
  }
}

// POST: Track template usage (increment usage count)
export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ success: true, usageCount: 0 })
    }

    const { templateId } = await request.json()

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    const result = await sql`
      UPDATE content_templates
      SET usage_count = usage_count + 1,
          updated_at = NOW()
      WHERE id = ${templateId}
        AND is_public = true
      RETURNING usage_count
    `

    if (result && result.length > 0) {
      return NextResponse.json({ 
        success: true,
        usageCount: result[0].usage_count 
      })
    }

    return NextResponse.json(
      { error: 'Template not found or not public' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Error tracking template usage:', error)
    return NextResponse.json(
      { error: 'Failed to track usage' },
      { status: 500 }
    )
  }
}
