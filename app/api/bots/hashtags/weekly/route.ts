import { NextRequest, NextResponse } from 'next/server'
import { HashtagResearchService } from '@/lib/services/hashtag-research-service'
import { getUserIdFromRequest } from '@/lib/subscription'

const hashtagService = new HashtagResearchService()

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
    const week = searchParams.get('week')
    const year = searchParams.get('year')

    const weekNumber = week ? parseInt(week) : undefined
    const yearNumber = year ? parseInt(year) : undefined

    const report = await hashtagService.getWeeklyHashtagReport(userId, weekNumber, yearNumber)

    return NextResponse.json({ 
      success: true, 
      report,
      hasReport: !!report
    })

  } catch (error) {
    console.error('Error fetching weekly hashtag report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weekly hashtag report' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const report = await hashtagService.generateWeeklyHashtagReport(userId)

    return NextResponse.json({ 
      success: true, 
      report
    })

  } catch (error) {
    console.error('Error generating weekly hashtag report:', error)
    return NextResponse.json(
      { error: 'Failed to generate weekly hashtag report' },
      { status: 500 }
    )
  }
}
