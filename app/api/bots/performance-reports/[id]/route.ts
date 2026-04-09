import { NextRequest, NextResponse } from 'next/server'
import { WeeklyPerformanceReportBotService } from '@/lib/services/weekly-performance-report-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

export const dynamic = 'force-dynamic'
const reportService = new WeeklyPerformanceReportBotService()

export async function GET(request: NextRequest, context: any) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const report = await reportService.getReportById(params.id)

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      report 
    })

  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}
