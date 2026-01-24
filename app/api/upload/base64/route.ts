import { NextRequest, NextResponse } from 'next/server'
import { uploadFromBase64 } from '@/lib/upload-utils'
import { uploadPresets } from '@/lib/cloudinary'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { base64, preset = 'gallery', customFolder, tags, filename = 'upload' } = body

    if (!base64) {
      return NextResponse.json(
        { error: 'Base64 string is required' },
        { status: 400 }
      )
    }

    // Validate base64 format
    const base64Regex = /^data:(\w+\/\w+);base64,/
    if (!base64Regex.test(base64)) {
      return NextResponse.json(
        { error: 'Invalid base64 format' },
        { status: 400 }
      )
    }

    // Get upload preset configuration
    const presetConfig = uploadPresets[preset as keyof typeof uploadPresets] || uploadPresets.gallery

    // Build upload options
    const uploadOptions = {
      ...presetConfig,
      folder: customFolder || presetConfig.folder,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      timestamp: Math.floor(Date.now() / 1000),
      public_id: filename.split('.')[0] // Remove extension if present
    }

    // Upload from base64
    const result = await uploadFromBase64(base64, uploadOptions)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'File uploaded successfully from base64'
    })

  } catch (error) {
    console.error('Base64 upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
