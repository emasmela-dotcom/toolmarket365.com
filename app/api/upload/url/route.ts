import { NextRequest, NextResponse } from 'next/server'
import { uploadFromUrl } from '@/lib/upload-utils'
import { uploadPresets } from '@/lib/cloudinary'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, preset = 'gallery', customFolder, tags } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Get upload preset configuration
    const presetConfig = uploadPresets[preset as keyof typeof uploadPresets] || uploadPresets.gallery

    // Build upload options
    const uploadOptions = {
      ...presetConfig,
      folder: customFolder || presetConfig.folder,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      timestamp: Math.floor(Date.now() / 1000)
    }

    // Upload from URL
    const result = await uploadFromUrl(url, uploadOptions)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'File uploaded successfully from URL'
    })

  } catch (error) {
    console.error('URL upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
