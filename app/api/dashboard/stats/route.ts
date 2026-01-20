import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { SESSION_COOKIE_NAME, sha256Hex } from '@/lib/auth'

export async function GET(req: NextRequest) {
  // If database not configured, return success with empty data (works with localStorage fallback)
  if (!sql) {
    return NextResponse.json({
      success: true,
      data: {
        totalToolsUsed: 0,
        favoriteTools: 0,
        recentActivity: [],
        toolUsage: [],
        accountInfo: {
          email: 'Guest',
          joinDate: new Date().toISOString(),
          accountType: 'Free'
        }
      },
      message: 'Database not configured - using local storage'
    })
  }

  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value || ''
    if (!token) {
      return NextResponse.json({
        success: true,
        data: {
          totalToolsUsed: 0,
          favoriteTools: 0,
          recentActivity: [],
          toolUsage: [],
          accountInfo: {
            email: 'Guest',
            joinDate: new Date().toISOString(),
            accountType: 'Free'
          }
        },
        message: 'Not authenticated - using local storage'
      })
    }

    const tokenHash = sha256Hex(token)
    const userRows = await sql`
      SELECT u.id, u.email, u.created_at
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ${tokenHash}
        AND s.expires_at > NOW()
      LIMIT 1
    `

    if (!userRows[0]) {
      return NextResponse.json({
        success: true,
        data: {
          totalToolsUsed: 0,
          favoriteTools: 0,
          recentActivity: [],
          toolUsage: [],
          accountInfo: {
            email: 'Guest',
            joinDate: new Date().toISOString(),
            accountType: 'Free'
          }
        },
        message: 'Not authenticated - using local storage'
      })
    }

    const userId = userRows[0].id

    // Get tool usage stats (if you have a tool_usage table)
    // For now, return empty arrays - can be populated later
    const toolUsage: any[] = []
    const recentActivity: any[] = []

    // Get favorite tools count (if you have a favorites table)
    // For now, return 0
    const favoriteTools = 0

    // Calculate total tools used
    const totalToolsUsed = toolUsage.length

    return NextResponse.json({
      success: true,
      data: {
        totalToolsUsed,
        favoriteTools,
        recentActivity,
        toolUsage,
        accountInfo: {
          email: userRows[0].email,
          joinDate: userRows[0].created_at || new Date().toISOString(),
          accountType: 'Free' // Can be enhanced with subscription data
        }
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard stats',
      data: {
        totalToolsUsed: 0,
        favoriteTools: 0,
        recentActivity: [],
        toolUsage: [],
        accountInfo: {
          email: 'Guest',
          joinDate: new Date().toISOString(),
          accountType: 'Free'
        }
      }
    }, { status: 500 })
  }
}
