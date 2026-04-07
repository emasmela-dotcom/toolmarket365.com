import { NextRequest, NextResponse } from 'next/server'
import {
  insertStoreMetadata,
  getAllStoreMetadata,
  getStoreMetadataById,
  updateStoreMetadata,
  deleteStoreMetadata,
  getStorageUsed,
  getStoreMetadataByType,
  searchStoreMetadataByTitle,
  searchStoreMetadataByTag
} from '@/lib/store-metadata'

export const runtime = 'nodejs'

// GET all metadata or filter by type/search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')
    const searchTitle = searchParams.get('search_title')
    const searchTag = searchParams.get('search_tag')
    const userId = searchParams.get('user_id')
    const getStorage = searchParams.get('storage')

    // Get metadata by ID
    if (id) {
      const metadata = await getStoreMetadataById(id)
      if (!metadata) {
        return NextResponse.json({ error: 'Metadata not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: metadata })
    }

    // Get storage used
    if (getStorage === 'true') {
      const storage = await getStorageUsed(userId || undefined)
      return NextResponse.json({ success: true, data: { storage_used_bytes: storage } })
    }

    // Search by title
    if (searchTitle) {
      const metadata = await searchStoreMetadataByTitle(searchTitle, userId || undefined)
      return NextResponse.json({ success: true, data: metadata })
    }

    // Search by tag
    if (searchTag) {
      const metadata = await searchStoreMetadataByTag(searchTag, userId || undefined)
      return NextResponse.json({ success: true, data: metadata })
    }

    // Filter by type
    if (type) {
      const metadata = await getStoreMetadataByType(type, userId || undefined)
      return NextResponse.json({ success: true, data: metadata })
    }

    // Get all metadata
    const metadata = await getAllStoreMetadata(userId || undefined)
    return NextResponse.json({ success: true, data: metadata })
  } catch (error) {
    console.error('Error in GET /api/store/metadata:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST insert new metadata
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || !body.type) {
      return NextResponse.json(
        { error: 'title and type are required' },
        { status: 400 }
      )
    }

    const metadata = await insertStoreMetadata({
      user_id: body.user_id,
      title: body.title,
      tags: body.tags || [],
      type: body.type,
      cloudinary_public_id: body.cloudinary_public_id,
      cloudinary_url: body.cloudinary_url,
      file_size: body.file_size,
      format: body.format,
      width: body.width,
      height: body.height,
      duration: body.duration,
      description: body.description
    })

    if (!metadata) {
      return NextResponse.json(
        { error: 'Failed to insert metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: metadata,
      message: 'Metadata inserted successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/store/metadata:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update metadata
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    const metadata = await updateStoreMetadata(id, body)

    if (!metadata) {
      return NextResponse.json(
        { error: 'Failed to update metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: metadata,
      message: 'Metadata updated successfully'
    })
  } catch (error) {
    console.error('Error in PUT /api/store/metadata:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE metadata
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      )
    }

    const success = await deleteStoreMetadata(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Metadata deleted successfully'
    })
  } catch (error) {
    console.error('Error in DELETE /api/store/metadata:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
