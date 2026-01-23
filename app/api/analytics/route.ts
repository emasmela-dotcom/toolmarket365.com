import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

// POST analytics entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { page, referrer, device, site, user_agent } = body

    if (!page || !device) {
      return NextResponse.json(
        { error: 'Page and device are required' },
        { status: 400 }
      )
    }

    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    await sql`
      INSERT INTO analytics (page, referrer, device, site, user_agent)
      VALUES (${page}, ${referrer || null}, ${device}, ${site || null}, ${user_agent || null})
    `

    return NextResponse.json({ message: 'Analytics recorded' }, { status: 201 })
  } catch (error) {
    console.error('Error recording analytics:', error)
    return NextResponse.json(
      { error: 'Failed to record analytics' },
      { status: 500 }
    )
  }
}

// GET analytics summary
export async function GET(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '7')

    const stats = await sql`
      SELECT 
        COUNT(*) as total_views,
        COUNT(DISTINCT page) as unique_pages,
        COUNT(DISTINCT device) as unique_devices
      FROM analytics
      WHERE timestamp > NOW() - INTERVAL '${days} days'
    `

    const topPages = await sql`
      SELECT page, COUNT(*) as views
      FROM analytics
      WHERE timestamp > NOW() - INTERVAL '${days} days'
      GROUP BY page
      ORDER BY views DESC
      LIMIT 10
    `

    return NextResponse.json({
      stats: stats[0],
      topPages,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}


