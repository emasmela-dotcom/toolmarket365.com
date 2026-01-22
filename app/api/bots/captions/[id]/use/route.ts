import { NextRequest, NextResponse } from 'next/server'
import { CaptionBotService } from '@/lib/services/caption-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

const captionService = new CaptionBotService()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    await captionService.markCaptionAsUsed(params.id)

    return NextResponse.json({ 
      success: true,
      message: 'Caption marked as used'
    })

  } catch (error) {
    console.error('Error marking caption as used:', error)
    return NextResponse.json(
      { error: 'Failed to mark caption as used' },
      { status: 500 }
    )
  }
}
