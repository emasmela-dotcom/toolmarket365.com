import { NextRequest, NextResponse } from 'next/server'
import { WeeklyPerformanceReportBotService } from '@/lib/services/weekly-performance-report-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

export const dynamic = 'force-dynamic'
const reportService = new WeeklyPerformanceReportBotService()

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
    const { weekNumber, year } = body

    const report = await reportService.generateWeeklyReport(
      userId,
      weekNumber,
      year
    )

    // Save to database
    await reportService.saveWeeklyReport(report)

    return NextResponse.json({ 
      success: true, 
      report
    })

  } catch (error) {
    console.error('Error generating weekly performance report:', error)
    return NextResponse.json(
      { error: 'Failed to generate weekly performance report' },
      { status: 500 }
    )
  }
}
