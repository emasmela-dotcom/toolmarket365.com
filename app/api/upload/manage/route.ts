import { NextRequest, NextResponse } from 'next/server'
import { getAssetInfo, createTransformationUrl } from '@/lib/upload-utils'

export const runtime = 'nodejs'

// GET asset information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('public_id')

    if (!publicId) {
      return NextResponse.json(
        { error: 'public_id is required' },
        { status: 400 }
      )
    }

    const result = await getAssetInfo(publicId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to get asset info' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error) {
    console.error('Asset info error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST create transformation URL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { public_id, transformations = [], resource_type = 'image' } = body

    if (!public_id) {
      return NextResponse.json(
        { error: 'public_id is required' },
        { status: 400 }
      )
    }

    const transformationUrl = createTransformationUrl(public_id, transformations, resource_type)

    return NextResponse.json({
      success: true,
      data: {
        transformation_url: transformationUrl,
        public_id,
        transformations
      }
    })

  } catch (error) {
    console.error('Transformation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
