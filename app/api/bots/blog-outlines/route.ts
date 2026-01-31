import { NextRequest, NextResponse } from 'next/server'
import { BlogOutlineBotService } from '@/lib/services/blog-outline-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

const outlineService = new BlogOutlineBotService()

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    const outlines = await outlineService.getUserOutlines(userId, limit)

    return NextResponse.json({ 
      success: true, 
      outlines,
      count: outlines.length 
    })

  } catch (error) {
    console.error('Error fetching blog outlines:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog outlines' },
      { status: 500 }
    )
  }
}
