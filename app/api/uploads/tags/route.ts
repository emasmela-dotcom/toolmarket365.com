import { NextRequest, NextResponse } from 'next/server'
import {
  getUploadById,
  addTagsToUpload,
  removeTagsFromUpload
} from '@/lib/uploads'
import { getUserIdFromRequest } from '@/lib/subscription'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// POST add tags to upload
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    if (!body.tags || !Array.isArray(body.tags)) {
      return NextResponse.json(
        { error: 'tags array is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const upload = await getUploadById(id)
    if (!upload || upload.user_id !== userId) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
    }

    const updated = await addTagsToUpload(id, body.tags)

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to add tags' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Tags added successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/uploads/tags:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE remove tags from upload
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    if (!body.tags || !Array.isArray(body.tags)) {
      return NextResponse.json(
        { error: 'tags array is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const upload = await getUploadById(id)
    if (!upload || upload.user_id !== userId) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
    }

    const updated = await removeTagsFromUpload(id, body.tags)

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to remove tags' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Tags removed successfully'
    })
  } catch (error) {
    console.error('Error in DELETE /api/uploads/tags:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
