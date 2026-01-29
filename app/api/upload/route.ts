import { NextRequest, NextResponse } from 'next/server'
import { uploadFromBuffer, deleteAsset } from '@/lib/upload-utils'
import { uploadPresets } from '@/lib/cloudinary'

export const runtime = 'nodejs'

// Handle POST request for file upload
export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const data = await request.formData()
    const file = data.get('file') as File
    const preset = data.get('preset') as string || 'gallery'
    const customFolder = data.get('folder') as string
    const tags = data.get('tags') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760')
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Get upload preset configuration
    const presetConfig = uploadPresets[preset as keyof typeof uploadPresets] || uploadPresets.gallery

    // Build upload options
    const uploadOptions = {
      ...presetConfig,
      folder: customFolder || presetConfig.folder,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      timestamp: Math.floor(Date.now() / 1000),
    }

    // Upload to Cloudinary
    const result = await uploadFromBuffer(buffer, uploadOptions)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: 500 }
      )
    }

    // Log successful upload
    console.log(`File uploaded successfully: ${result.data?.public_id}`)

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle DELETE request for file deletion
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('public_id')
    const resourceType = searchParams.get('resource_type') || 'image'

    if (!publicId) {
      return NextResponse.json(
        { error: 'public_id is required' },
        { status: 400 }
      )
    }

    // Delete from Cloudinary
    const result = await deleteAsset(publicId, resourceType)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Delete failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
