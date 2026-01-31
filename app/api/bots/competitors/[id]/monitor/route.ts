import { NextRequest, NextResponse } from 'next/server'
import { CompetitorWatchBotService } from '@/lib/services/competitor-watch-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

export const dynamic = 'force-dynamic'
const competitorService = new CompetitorWatchBotService()

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

    const metrics = await competitorService.generateCompetitorMetrics(userId, params.id)

    return NextResponse.json({ 
      success: true, 
      metrics 
    })

  } catch (error) {
    console.error('Error monitoring competitor:', error)
    return NextResponse.json(
      { error: 'Failed to monitor competitor' },
      { status: 500 }
    )
  }
}
