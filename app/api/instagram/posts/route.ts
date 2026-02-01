import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/subscription'
import { sql } from '@/lib/db'
import { nanoid } from 'nanoid'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ posts: [], pagination: { total: 0, limit: 50, offset: 0, hasMore: false } })
    }

    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = sql`
      SELECT 
        p.id, p.content, p.media_urls, p.media_types, p.post_type,
        p.caption, p.hashtags, p.mentions, p.location_name,
        p.scheduled_for, p.timezone, p.status, p.posted_at,
        p.instagram_post_id, p.instagram_permalink_url,
        p.engagement_data, p.created_at,
        a.username, a.account_name
      FROM instagram_posts p
      INNER JOIN instagram_accounts a ON p.account_id = a.id
      WHERE p.user_id = ${userId}
    `

    if (accountId) {
      query = sql`
        ${query}
        AND p.account_id = ${accountId}
      `
    }

    if (status) {
      query = sql`
        ${query}
        AND p.status = ${status}
      `
    }

    const posts = await sql`
      ${query}
      ORDER BY p.scheduled_for DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    // Get total count
    let countQuery = sql`
      SELECT COUNT(*) as total
      FROM instagram_posts
      WHERE user_id = ${userId}
    `

    if (accountId) {
      countQuery = sql`${countQuery} AND account_id = ${accountId}`
    }

    if (status) {
      countQuery = sql`${countQuery} AND status = ${status}`
    }

    const countResult = await countQuery
    const total = countResult[0]?.total || 0

    return NextResponse.json({
      posts,
      pagination: {
        total: Number(total),
        limit,
        offset,
        hasMore: offset + posts.length < Number(total)
      }
    })
  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const body = await request.json()
    const {
      accountId,
      content,
      mediaUrls,
      mediaTypes,
      postType = 'feed',
      caption,
      hashtags,
      mentions,
      locationId,
      locationName,
      scheduledFor,
      timezone = 'UTC'
    } = body

    if (!accountId || !content || !mediaUrls || !Array.isArray(mediaUrls) || mediaUrls.length === 0) {
      return NextResponse.json({ error: 'Account, content, and media are required' }, { status: 400 })
    }

    if (!scheduledFor) {
      return NextResponse.json({ error: 'Scheduled time is required' }, { status: 400 })
    }

    const scheduledDate = new Date(scheduledFor)
    if (scheduledDate <= new Date()) {
      return NextResponse.json({ error: 'Scheduled time must be in the future' }, { status: 400 })
    }

    // Verify account ownership
    const account = await sql`
      SELECT id, username
      FROM instagram_accounts
      WHERE user_id = ${userId}
        AND id = ${accountId}
        AND is_active = true
      LIMIT 1
    `

    if (account.length === 0) {
      return NextResponse.json({ error: 'Instagram account not found or inactive' }, { status: 404 })
    }

    // Create scheduled post
    // Neon serverless supports array parameters directly
    const post = await sql`
      INSERT INTO instagram_posts (
        id, user_id, account_id, content, media_urls, media_types,
        post_type, caption, hashtags, mentions, location_id, location_name,
        scheduled_for, timezone, status, created_at, updated_at
      ) VALUES (
        ${nanoid()}, ${userId}, ${accountId}, ${content}, ${mediaUrls},
        ${mediaTypes || ['image']}, ${postType},
        ${caption || null}, ${hashtags || null}, ${mentions || null},
        ${locationId || null}, ${locationName || null}, ${scheduledDate},
        ${timezone}, 'scheduled', NOW(), NOW()
      )
      RETURNING id, content, media_urls, post_type, caption, hashtags, scheduled_for, status, created_at
    `

    return NextResponse.json({ post: post[0] })
  } catch (error) {
    console.error('Error creating Instagram post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
