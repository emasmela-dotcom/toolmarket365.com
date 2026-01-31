import { NextRequest, NextResponse } from 'next/server'
import { HashtagResearchService } from '@/lib/services/hashtag-research-service'
import { getUserIdFromRequest } from '@/lib/subscription'

export const dynamic = 'force-dynamic'
const hashtagService = new HashtagResearchService()

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
    const { specificTopic } = body

    const hashtagSet = await hashtagService.generateHashtagSet(userId, undefined, specificTopic)

    return NextResponse.json({ 
      success: true, 
      hashtagSet
    })

  } catch (error) {
    console.error('Error researching hashtags:', error)
    return NextResponse.json(
      { error: 'Failed to research hashtags' },
      { status: 500 }
    )
  }
}
