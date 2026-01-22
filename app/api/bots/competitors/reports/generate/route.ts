import { NextRequest, NextResponse } from 'next/server'
import { CompetitorWatchBotService } from '@/lib/services/competitor-watch-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

const competitorService = new CompetitorWatchBotService()

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
    const { competitorIds, reportType, startDate, endDate } = body

    if (!competitorIds || !Array.isArray(competitorIds) || competitorIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one competitor ID is required' },
        { status: 400 }
      )
    }

    if (!reportType || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Report type, start date, and end date are required' },
        { status: 400 }
      )
    }

    const report = await competitorService.generateCompetitorReport(
      userId,
      competitorIds,
      reportType,
      new Date(startDate),
      new Date(endDate)
    )

    return NextResponse.json({ 
      success: true, 
      report 
    })

  } catch (error) {
    console.error('Error generating competitor report:', error)
    return NextResponse.json(
      { error: 'Failed to generate competitor report' },
      { status: 500 }
    )
  }
}
