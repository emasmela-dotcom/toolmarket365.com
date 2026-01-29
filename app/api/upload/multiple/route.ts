import { NextRequest, NextResponse } from 'next/server'
import { uploadFromBuffer } from '@/lib/upload-utils'
import { uploadPresets } from '@/lib/cloudinary'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const files = data.getAll('files') as File[]
    const preset = data.get('preset') as string || 'gallery'
    const customFolder = data.get('folder') as string
    const tags = data.get('tags') as string

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 files allowed per upload' },
        { status: 400 }
      )
    }

    // Get upload preset configuration
    const presetConfig = uploadPresets[preset as keyof typeof uploadPresets] || uploadPresets.gallery

    // Upload all files
    const uploadPromises = files.map(async (file) => {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadOptions = {
        ...presetConfig,
        folder: customFolder || presetConfig.folder,
        tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
        timestamp: Math.floor(Date.now() / 1000)
      }

      return uploadFromBuffer(buffer, uploadOptions)
    })

    const results = await Promise.allSettled(uploadPromises)

    // Process results
    const successful = results
      .filter(result => result.status === 'fulfilled' && result.value.success)
      .map(result => (result.status === 'fulfilled' ? result.value.data : null))

    const failed = results
      .filter(result => result.status === 'rejected' || (result.status === 'fulfilled' && !result.value.success))
      .map((result, index) => ({
        index,
        error: result.status === 'rejected' ? (result as any).reason : (result as any).value.error
      }))

    return NextResponse.json({
      success: true,
      data: {
        uploaded: successful.length,
        total: files.length,
        successful,
        failed
      },
      message: `Uploaded ${successful.length} of ${files.length} files`
    })

  } catch (error) {
    console.error('Multiple upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
