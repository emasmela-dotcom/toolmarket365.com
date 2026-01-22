import { NextRequest, NextResponse } from 'next/server'
import { CompetitorWatchBotService } from '@/lib/services/competitor-watch-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

const competitorService = new CompetitorWatchBotService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '30')

    const metrics = await competitorService.getCompetitorMetrics(params.id, limit)

    return NextResponse.json({ 
      success: true, 
      metrics,
      count: metrics.length 
    })

  } catch (error) {
    console.error('Error fetching competitor metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitor metrics' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { date } = body

    const metrics = await competitorService.generateCompetitorMetrics(
      userId,
      params.id,
      date ? new Date(date) : undefined
    )

    return NextResponse.json({ 
      success: true, 
      metrics 
    })

  } catch (error) {
    console.error('Error generating competitor metrics:', error)
    return NextResponse.json(
      { error: 'Failed to generate competitor metrics' },
      { status: 500 }
    )
  }
}
