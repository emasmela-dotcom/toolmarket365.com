// API Route: /app/api/dashboard/activity/route.ts
// Purpose: Fetch and log user activity with Neon serverless SQL

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

// GET: Fetch user activity
export async function GET(req: NextRequest) {
  try {
    const sql = getDatabase()
    const userId = req.headers.get('x-user-id') || req.headers.get('user-id')
    
    if (!sql || !userId) {
      return NextResponse.json({
        success: true,
        data: {
          activities: [],
          pagination: { total: 0, limit: 20, offset: 0, hasMore: false }
        },
        message: 'Database not configured or user not authenticated - using local storage'
      })
    }

    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const activityType = searchParams.get('type')
    const toolName = searchParams.get('tool')

    // Build WHERE conditions
    const conditions: string[] = ['user_id = $1']
    const values: any[] = [userId]
    let paramCount = 1

    if (activityType) {
      paramCount++
      conditions.push(`activity_type = $${paramCount}`)
      values.push(activityType)
    }

    if (toolName) {
      paramCount++
      conditions.push(`tool_name = $${paramCount}`)
      values.push(toolName)
    }

    const whereClause = conditions.join(' AND ')

    // Get activities
    const activitiesQuery = `
      SELECT id, activity_type, tool_name, tool_category, content_type, content_id, 
             activity_description, metadata, created_at
      FROM user_activity
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `
    values.push(limit, offset)
    
    const activities = await (sql as any)(activitiesQuery, values)

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM user_activity
      WHERE ${whereClause}
    `
    const countResult = await (sql as any)(countQuery, values.slice(0, paramCount))
    const total = parseInt(countResult[0]?.total || '0', 10)

    return NextResponse.json({
      success: true,
      data: {
        activities: activities.map((activity: any) => ({
          ...activity,
          created_at: activity.created_at instanceof Date
            ? activity.created_at.toISOString()
            : String(activity.created_at)
        })),
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + activities.length < total
        }
      }
    })

  } catch (error) {
    console.error('Error fetching activity:', error)
    return NextResponse.json({
      success: true,
      data: {
        activities: [],
        pagination: { total: 0, limit: 20, offset: 0, hasMore: false }
      },
      message: 'Error fetching activities - using local storage'
    }, { status: 500 })
  }
}

// POST: Log new activity
export async function POST(req: NextRequest) {
  try {
    const sql = getDatabase()
    const userId = req.headers.get('x-user-id') || req.headers.get('user-id')
    
    if (!sql || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured or user not authenticated'
      }, { status: 400 })
    }

    const body = await req.json()
    const {
      activityType,
      toolName,
      toolCategory,
      contentType,
      contentId,
      description,
      metadata
    } = body

    // Validate required fields
    if (!activityType || !description) {
      return NextResponse.json({
        success: false,
        error: 'Activity type and description are required'
      }, { status: 400 })
    }

    const activity = await (sql as any)`
      INSERT INTO user_activity (
        id, user_id, activity_type, tool_name, tool_category, 
        content_type, content_id, activity_description, metadata, created_at
      ) VALUES (
        ${nanoid()}, ${userId}, ${activityType}, ${toolName || null}, 
        ${toolCategory || null}, ${contentType || null}, ${contentId || null}, 
        ${description}, ${metadata ? JSON.stringify(metadata) : null}, NOW()
      )
      RETURNING 
        id, activity_type, tool_name, tool_category, content_type, 
        content_id, activity_description, metadata, created_at
    `

    const row = activity[0]

    return NextResponse.json({
      success: true,
      data: {
        ...row,
        created_at: row.created_at instanceof Date
          ? row.created_at.toISOString()
          : String(row.created_at)
      }
    })

  } catch (error) {
    console.error('Error logging activity:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to log activity'
    }, { status: 500 })
  }
}

// Utility function to log tool usage - uses Neon SQL
// Note: This should be moved to a separate utility file if needed elsewhere
async function logToolUsage(
  userId: string,
  toolName: string,
  toolCategory: string,
  timeSpent: number = 0
) {
  const sql = getDatabase()
  if (!sql) return

  try {
    // Update or insert tool usage
    const existing = await (sql as any)`
      SELECT id, usage_count, total_time_spent 
      FROM tool_usage 
      WHERE user_id = ${userId} AND tool_name = ${toolName}
    `

    if (existing.length > 0) {
      // Update existing usage
      await (sql as any)`
        UPDATE tool_usage 
        SET 
          usage_count = usage_count + 1,
          last_used_at = NOW(),
          total_time_spent = total_time_spent + ${timeSpent},
          updated_at = NOW()
        WHERE id = ${existing[0].id}
      `
    } else {
      // Create new usage record
      await (sql as any)`
        INSERT INTO tool_usage (
          id, user_id, tool_name, tool_category, usage_count, 
          last_used_at, first_used_at, total_time_spent, created_at, updated_at
        ) VALUES (
          ${nanoid()}, ${userId}, ${toolName}, ${toolCategory}, 1,
          NOW(), NOW(), ${timeSpent}, NOW(), NOW()
        )
      `
    }

    // Log activity
    await (sql as any)`
      INSERT INTO user_activity (
        id, user_id, activity_type, tool_name, tool_category, 
        activity_description, metadata, created_at
      ) VALUES (
        ${nanoid()}, ${userId}, 'tool_used', ${toolName}, ${toolCategory},
        ${`Used ${toolName}`}, ${JSON.stringify({ time_spent: timeSpent })}, NOW()
      )
    `

  } catch (error) {
    console.error('Error logging tool usage:', error)
  }
}

