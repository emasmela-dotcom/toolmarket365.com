import { NextRequest, NextResponse } from 'next/server'
import { CompetitorWatchBotService } from '@/lib/services/competitor-watch-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

export const dynamic = 'force-dynamic'
const competitorService = new CompetitorWatchBotService()

export async function POST(request: NextRequest, context: any) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    await competitorService.markAlertAsRead(params.id)

    return NextResponse.json({ 
      success: true,
      message: 'Alert marked as read' 
    })

  } catch (error) {
    console.error('Error marking alert as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark alert as read' },
      { status: 500 }
    )
  }
}
