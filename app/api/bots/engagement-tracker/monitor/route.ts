import { NextRequest, NextResponse } from 'next/server'
import { EngagementTrackerBotService } from '@/lib/services/engagement-tracker-bot-service'

export const dynamic = 'force-dynamic'
const engagementService = new EngagementTrackerBotService()

export async function GET(request: NextRequest) {
  try {
    // Check for cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const monitored = await engagementService.monitorActiveAccounts()

    return NextResponse.json({ 
      success: true, 
      monitored,
      message: `Monitored ${monitored} accounts` 
    })

  } catch (error) {
    console.error('Error monitoring accounts:', error)
    return NextResponse.json(
      { error: 'Failed to monitor accounts' },
      { status: 500 }
    )
  }
}
