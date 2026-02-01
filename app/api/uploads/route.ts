import { NextRequest, NextResponse } from 'next/server'
import {
  insertUpload,
  getUserUploads,
  getUploadById,
  getUserUploadsByType,
  searchUserUploads,
  getUserUploadsByTag,
  updateUpload,
  deleteUpload,
  deleteUploadByCloudinaryId,
  getUserStorageUsed,
  getUserUploadCount,
  getUploadWithUserInfo,
  getUserUploadsWithPagination,
  addTagsToUpload,
  removeTagsFromUpload
} from '@/lib/uploads'
import { getUserIdFromRequest } from '@/lib/subscription'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET uploads for user
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const storage = searchParams.get('storage')
    const count = searchParams.get('count')

    // Get specific upload
    if (id) {
      const upload = await getUploadById(id)
      if (!upload || upload.user_id !== userId) {
        return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: upload })
    }

    // Get upload with user info
    if (searchParams.get('with_user')) {
      const upload = await getUploadWithUserInfo(id || '')
      if (!upload || upload.user_id !== userId) {
        return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: upload })
    }

    // Get storage used
    if (storage === 'true') {
      const used = await getUserStorageUsed(userId)
      return NextResponse.json({
        success: true,
        data: {
          storage_used_bytes: used,
          storage_used_mb: Math.round(used / 1024 / 1024 * 100) / 100
        }
      })
    }

    // Get upload count
    if (count === 'true') {
      const total = await getUserUploadCount(userId)
      return NextResponse.json({ success: true, data: { count: total } })
    }

    // Search by file name
    if (search) {
      const uploads = await searchUserUploads(userId, search)
      return NextResponse.json({ success: true, data: uploads })
    }

    // Filter by tag
    if (tag) {
      const uploads = await getUserUploadsByTag(userId, tag)
      return NextResponse.json({ success: true, data: uploads })
    }

    // Filter by type
    if (type) {
      const uploads = await getUserUploadsByType(userId, type)
      return NextResponse.json({ success: true, data: uploads })
    }

    // Get with pagination
    const result = await getUserUploadsWithPagination(userId, page, limit)
    return NextResponse.json({
      success: true,
      data: result.uploads,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit)
      }
    })
  } catch (error) {
    console.error('Error in GET /api/uploads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create upload
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.file_name || !body.file_url) {
      return NextResponse.json(
        { error: 'file_name and file_url are required' },
        { status: 400 }
      )
    }

    const upload = await insertUpload({
      user_id: userId,
      file_name: body.file_name,
      file_url: body.file_url,
      cloudinary_public_id: body.cloudinary_public_id,
      file_type: body.file_type,
      file_size: body.file_size,
      width: body.width,
      height: body.height,
      duration: body.duration,
      tags: body.tags || [],
      description: body.description
    })

    if (!upload) {
      return NextResponse.json(
        { error: 'Failed to create upload' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: upload,
      message: 'Upload created successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/uploads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update upload
export async function PUT(request: NextRequest) {
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

    // Verify ownership
    const upload = await getUploadById(id)
    if (!upload || upload.user_id !== userId) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
    }

    const updated = await updateUpload(id, body)

    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update upload' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Upload updated successfully'
    })
  } catch (error) {
    console.error('Error in PUT /api/uploads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE upload
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const upload = await getUploadById(id)
    if (!upload || upload.user_id !== userId) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
    }

    const success = await deleteUpload(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete upload' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Upload deleted successfully'
    })
  } catch (error) {
    console.error('Error in DELETE /api/uploads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
