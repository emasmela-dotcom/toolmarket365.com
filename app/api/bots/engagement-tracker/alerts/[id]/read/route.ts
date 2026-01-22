import { NextRequest, NextResponse } from 'next/server'
import { EngagementTrackerBotService } from '@/lib/services/engagement-tracker-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

const engagementService = new EngagementTrackerBotService()

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

    await engagementService.markAlertAsRead(params.id, userId)

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
