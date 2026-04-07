import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/subscription'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET: Fetch messages for a deal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ messages: [] })
    }

    const dealId = params.id

    // Verify user has access to this deal
    const accessCheck = await sql`
      SELECT 1 FROM deals d
      LEFT JOIN brands b ON b.id = d.brand_id
      WHERE d.id = ${dealId}
      AND (b.user_id = ${userId} OR d.creator_id = ${userId})
      LIMIT 1
    `

    if (accessCheck.length === 0) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Fetch messages with sender information
    const messages = await sql`
      SELECT 
        m.id,
        m.deal_id,
        m.sender_id,
        m.sender_type,
        m.message,
        m.attachments,
        m.is_read,
        m.created_at,
        u.name as sender_name,
        u.avatar_url as sender_avatar
      FROM deal_messages m
      LEFT JOIN users u ON u.id = m.sender_id
      WHERE m.deal_id = ${dealId}
      ORDER BY m.created_at ASC
    `

    // Format messages and determine if they're from the current user
    const formattedMessages = messages.map((msg: any) => ({
      id: msg.id,
      deal_id: msg.deal_id,
      sender_id: msg.sender_id,
      sender_type: msg.sender_type,
      message: msg.message,
      attachments: msg.attachments,
      is_read: msg.is_read,
      created_at: msg.created_at,
      sender_name: msg.sender_name || 'Unknown',
      sender_avatar: msg.sender_avatar,
      isOwn: msg.sender_id === userId
    }))

    return NextResponse.json({ messages: formattedMessages })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages', messages: [] },
      { status: 500 }
    )
  }
}

// POST: Send a new message
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    const dealId = params.id
    const body = await request.json()
    const { message, messageType = 'text' } = body

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Verify user has access to this deal and determine their role
    const dealResult = await sql`
      SELECT d.*, 
             b.user_id as brand_user_id,
             cp.user_id as creator_user_id
      FROM deals d
      LEFT JOIN brands b ON b.id = d.brand_id
      LEFT JOIN creator_profiles cp ON cp.user_id = d.creator_id
      WHERE d.id = ${dealId}
      LIMIT 1
    `

    if (dealResult.length === 0) {
      return NextResponse.json({ error: 'Deal not found or access denied' }, { status: 403 })
    }

    const deal = dealResult[0]
    
    // Determine sender type
    let senderType: 'brand' | 'creator' = 'creator'
    if (deal.brand_user_id === userId) {
      senderType = 'brand'
    } else if (deal.creator_user_id !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Create message
    const result = await sql`
      INSERT INTO deal_messages (
        deal_id,
        sender_id,
        sender_type,
        message,
        created_at
      ) VALUES (
        ${dealId},
        ${userId},
        ${senderType},
        ${message.trim()},
        NOW()
      )
      RETURNING *
    `

    // Get sender information
    const senderInfo = await sql`
      SELECT name, avatar_url FROM users WHERE id = ${userId} LIMIT 1
    `

    const newMessage = {
      ...result[0],
      sender_name: senderInfo[0]?.name || 'Unknown',
      sender_avatar: senderInfo[0]?.avatar_url,
      isOwn: true
    }

    return NextResponse.json({ message: newMessage })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
