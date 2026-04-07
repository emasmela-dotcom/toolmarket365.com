import { NextRequest, NextResponse } from 'next/server'
import { BlogOutlineBotService } from '@/lib/services/blog-outline-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

export const dynamic = 'force-dynamic'
const outlineService = new BlogOutlineBotService()

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { topic, blogType, wordCount } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    const outline = await outlineService.generateBlogOutline(
      userId,
      topic,
      undefined,
      blogType,
      wordCount
    )

    // Save to database
    await outlineService.saveBlogOutline(outline)

    return NextResponse.json({ 
      success: true, 
      outline,
      sections: outline.sections.length 
    })

  } catch (error) {
    console.error('Error generating blog outline:', error)
    return NextResponse.json(
      { error: 'Failed to generate blog outline' },
      { status: 500 }
    )
  }
}
