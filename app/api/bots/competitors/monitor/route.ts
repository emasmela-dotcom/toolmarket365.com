import { NextRequest, NextResponse } from 'next/server'
import { CompetitorWatchBotService } from '@/lib/services/competitor-watch-bot-service'

const competitorService = new CompetitorWatchBotService()

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

    const monitored = await competitorService.monitorActiveCompetitors()

    return NextResponse.json({ 
      success: true, 
      monitored,
      message: `Monitored ${monitored} competitors` 
    })

  } catch (error) {
    console.error('Error monitoring competitors:', error)
    return NextResponse.json(
      { error: 'Failed to monitor competitors' },
      { status: 500 }
    )
  }
}
