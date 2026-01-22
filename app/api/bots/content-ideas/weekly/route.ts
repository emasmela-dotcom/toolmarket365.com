import { NextRequest, NextResponse } from 'next/server'
import { WeeklyContentIdeasService } from '@/lib/services/weekly-content-ideas-service'
import { getUserIdFromRequest } from '@/lib/subscription'

const weeklyService = new WeeklyContentIdeasService()

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

    const thisWeekPlan = await weeklyService.getWeeklyContentPlan(
      userId,
      weekNumber,
      yearNumber
    )

    return NextResponse.json({ 
      success: true, 
      plan: thisWeekPlan,
      hasPlan: !!thisWeekPlan
    })

  } catch (error) {
    console.error('Error fetching weekly plan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weekly plan' },
      { status: 500 }
    )
  }
}
