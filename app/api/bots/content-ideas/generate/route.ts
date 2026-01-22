import { NextRequest, NextResponse } from 'next/server'
import { WeeklyContentIdeasService } from '@/lib/services/weekly-content-ideas-service'
import { getUserIdFromRequest } from '@/lib/subscription'

const weeklyService = new WeeklyContentIdeasService()

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
    const { count } = body

    const ideas = await weeklyService.generateWeeklyContentIdeas(
      userId,
      count || 10
    )

    // Create or update weekly plan
    const weekNumber = weeklyService.getCurrentWeekNumber()
    const year = new Date().getFullYear()
    const planId = `plan_${userId}_${weekNumber}_${year}`
    
    const plan = {
      id: planId,
      userId,
      weekNumber,
      year,
      ideas,
      status: 'draft' as const,
      emailSent: false,
      emailDelivered: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await weeklyService.saveWeeklyContentPlan(plan)

    return NextResponse.json({ 
      success: true, 
      ideas,
      plan,
      count: ideas.length 
    })

  } catch (error) {
    console.error('Error generating content ideas:', error)
    return NextResponse.json(
      { error: 'Failed to generate content ideas' },
      { status: 500 }
    )
  }
}
