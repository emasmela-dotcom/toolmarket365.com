import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// DELETE a comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const result = await sql`
      DELETE FROM comments
      WHERE id = ${id}
    `

    return NextResponse.json({ message: 'Comment deleted' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
