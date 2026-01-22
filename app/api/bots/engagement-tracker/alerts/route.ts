import { NextRequest, NextResponse } from 'next/server'
import { EngagementTrackerBotService } from '@/lib/services/engagement-tracker-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

const engagementService = new EngagementTrackerBotService()

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
    const accountId = searchParams.get('accountId') || undefined
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    const alerts = await engagementService.getUserAlerts(
      userId,
      accountId,
      unreadOnly,
      limit
    )

    const unreadCount = alerts.filter(a => !a.isRead).length

    return NextResponse.json({ 
      success: true, 
      alerts,
      unreadCount,
      count: alerts.length 
    })

  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}
