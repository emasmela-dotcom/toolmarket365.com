import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// GET all comments
export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const comments = await sql`
      SELECT id, name, message, created_at, updated_at
      FROM comments
      ORDER BY created_at DESC
    `

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

// POST a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, message } = body

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      )
    }

    if (name.length > 50 || message.length > 500) {
      return NextResponse.json(
        { error: 'Name or message exceeds length limits' },
        { status: 400 }
      )
    }

    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const [comment] = await sql`
      INSERT INTO comments (name, message)
      VALUES (${name.trim()}, ${message.trim()})
      RETURNING id, name, message, created_at, updated_at
    `

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}

