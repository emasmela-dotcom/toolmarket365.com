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
    const dateParam = searchParams.get('date')
    const targetDate = dateParam ? new Date(dateParam) : new Date()

    const captions = await captionService.getDailyCaptions(userId, targetDate)

    return NextResponse.json({ 
      success: true, 
      captions,
      count: captions.length 
    })

  } catch (error) {
    console.error('Error fetching daily captions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily captions' },
      { status: 500 }
    )
  }
}
