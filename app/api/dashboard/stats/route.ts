// API Route: /app/api/dashboard/stats/route.ts
// Purpose: Fetch comprehensive dashboard statistics with Neon serverless SQL

import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

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

// GET: Fetch dashboard statistics
export async function GET(req: NextRequest) {
  const sql = getDatabase()
  const userId = req.headers.get('x-user-id') || req.headers.get('user-id')

  if (!sql || !userId) {
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalToolsUsed: 0,
          totalUsageCount: 0,
          totalTimeSpent: 0,
          favoritesCount: 0,
          recentActivityCount: 0,
          mostUsedTool: null
        },
        toolUsage: [],
        categoryStats: [],
        favorites: [],
        recentActivity: [],
        preferences: null
      },
      message: 'Database not configured - using local storage'
    })
  }

  try {
    // Get tool usage statistics
    const toolUsageStats = await sql`
      SELECT tool_name, tool_category, usage_count, last_used_at, first_used_at, total_time_spent
      FROM tool_usage
      WHERE user_id = ${userId}
      ORDER BY last_used_at DESC
      LIMIT 10
    `

    // Get total usage counts by category
    const categoryStats = await sql`
      SELECT tool_category, SUM(usage_count) as total_usage, COUNT(tool_name) as tools_used
      FROM tool_usage
      WHERE user_id = ${userId}
      GROUP BY tool_category
      ORDER BY total_usage DESC
    `

    // Get user favorites
    const favorites = await sql`
      SELECT id, tool_name, tool_category, tool_description, favorited_at, notes
      FROM user_favorites
      WHERE user_id = ${userId}
      ORDER BY favorited_at DESC
    `

    // Get recent activity (last 30 days)
    const recentActivity = await sql`
      SELECT id, activity_type, tool_name, tool_category, content_type, content_id, activity_description, metadata, created_at
      FROM user_activity
      WHERE user_id = ${userId} AND created_at >= NOW() - INTERVAL '30 days'
      ORDER BY created_at DESC
      LIMIT 20
    `

    // Get user preferences
    const preferences = await sql`
      SELECT * FROM user_preferences
      WHERE user_id = ${userId}
    `

    // Calculate summary statistics
    const totalToolUsage = await sql`
      SELECT COALESCE(SUM(usage_count), 0) as total
      FROM tool_usage
      WHERE user_id = ${userId}
    `

    const totalTimeSpent = await sql`
      SELECT COALESCE(SUM(total_time_spent), 0) as total_time
      FROM tool_usage
      WHERE user_id = ${userId}
    `

    const mostUsedTool = await sql`
      SELECT tool_name, usage_count
      FROM tool_usage
      WHERE user_id = ${userId}
      ORDER BY usage_count DESC
      LIMIT 1
    `

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalToolsUsed: (toolUsageStats as any[]).length,
          totalUsageCount: parseInt((totalToolUsage[0] as any)?.total || '0', 10),
          totalTimeSpent: parseInt((totalTimeSpent[0] as any)?.total_time || '0', 10),
          favoritesCount: (favorites as any[]).length,
          recentActivityCount: (recentActivity as any[]).length,
          mostUsedTool: (mostUsedTool as any[])[0] || null
        },
        toolUsage: toolUsageStats,
        categoryStats: (categoryStats as any[]).map(cat => ({
          category: cat.tool_category,
          totalUsage: parseInt(cat.total_usage || '0', 10),
          toolsCount: parseInt(cat.tools_used || '0', 10)
        })),
        favorites,
        recentActivity: (recentActivity as any[]).map(activity => ({
          ...activity,
          created_at: activity.created_at instanceof Date
            ? activity.created_at.toISOString()
            : String(activity.created_at)
        })),
        preferences: (preferences as any[])[0] || null
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalToolsUsed: 0,
          totalUsageCount: 0,
          totalTimeSpent: 0,
          favoritesCount: 0,
          recentActivityCount: 0,
          mostUsedTool: null
        },
        toolUsage: [],
        categoryStats: [],
        favorites: [],
        recentActivity: [],
        preferences: null
      },
      message: 'Error fetching dashboard statistics - using local storage'
    }, { status: 500 })
  }
}

