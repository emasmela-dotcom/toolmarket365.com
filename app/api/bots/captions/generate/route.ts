import { NextRequest, NextResponse } from 'next/server'
import { CaptionBotService } from '@/lib/services/caption-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

export const dynamic = 'force-dynamic'
const captionService = new CaptionBotService()

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
    const { count, themes, tone, platforms, schedule } = body

    const captions = await captionService.generateCaptions(
      userId,
      count || 5,
      themes,
      tone,
      platforms
    )

    return NextResponse.json({ 
      success: true, 
      captions,
      count: captions.length 
    })

  } catch (error) {
    console.error('Error generating captions:', error)
    return NextResponse.json(
      { error: 'Failed to generate captions' },
      { status: 500 }
    )
  }
}
