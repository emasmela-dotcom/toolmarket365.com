import { NextRequest, NextResponse } from 'next/server'
import { WeeklyPerformanceReportBotService } from '@/lib/services/weekly-performance-report-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

export const dynamic = 'force-dynamic'
const reportService = new WeeklyPerformanceReportBotService()

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const report = await reportService.getCurrentWeekReport(userId)

    if (!report) {
      return NextResponse.json({ 
        success: true, 
        report: null,
        message: 'No report found for current week'
      })
    }

    return NextResponse.json({ 
      success: true, 
      report 
    })

  } catch (error) {
    console.error('Error fetching current week report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch current week report' },
      { status: 500 }
    )
  }
}
