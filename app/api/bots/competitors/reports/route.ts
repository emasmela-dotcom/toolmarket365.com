import { NextRequest, NextResponse } from 'next/server'
import { CompetitorWatchBotService } from '@/lib/services/competitor-watch-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

const competitorService = new CompetitorWatchBotService()

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

    const reports = await competitorService.getUserReports(userId, limit)

    return NextResponse.json({ 
      success: true, 
      reports,
      count: reports.length 
    })

  } catch (error) {
    console.error('Error fetching competitor reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitor reports' },
      { status: 500 }
    )
  }
}
