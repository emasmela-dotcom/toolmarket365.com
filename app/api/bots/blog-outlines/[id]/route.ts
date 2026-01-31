import { NextRequest, NextResponse } from 'next/server'
import { BlogOutlineBotService } from '@/lib/services/blog-outline-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const outlineService = new BlogOutlineBotService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const outline = await outlineService.getBlogOutlineById(params.id)

    if (!outline) {
      return NextResponse.json(
        { error: 'Outline not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      outline 
    })

  } catch (error) {
    console.error('Error fetching outline:', error)
    return NextResponse.json(
      { error: 'Failed to fetch outline' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    await sql`
      DELETE FROM bot_blog_outlines
      WHERE id = ${params.id} AND user_id = ${userId}
    `

    return NextResponse.json({ 
      success: true,
      message: 'Outline deleted' 
    })

  } catch (error) {
    console.error('Error deleting outline:', error)
    return NextResponse.json(
      { error: 'Failed to delete outline' },
      { status: 500 }
    )
  }
}
