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

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const reports = await reportService.getUserReports(userId, limit)

    return NextResponse.json({ 
      success: true, 
      reports,
      count: reports.length 
    })

  } catch (error) {
    console.error('Error fetching weekly performance reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weekly performance reports' },
      { status: 500 }
    )
  }
}
