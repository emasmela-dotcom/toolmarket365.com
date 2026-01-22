import { NextRequest, NextResponse } from 'next/server'
import { CaptionBotService } from '@/lib/services/caption-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

const captionService = new CaptionBotService()

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
    const limit = parseInt(searchParams.get('limit') || '10')

    const captions = await captionService.getUnusedCaptions(userId, limit)

    return NextResponse.json({ 
      success: true, 
      captions,
      count: captions.length 
    })

  } catch (error) {
    console.error('Error fetching unused captions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch unused captions' },
      { status: 500 }
    )
  }
}
