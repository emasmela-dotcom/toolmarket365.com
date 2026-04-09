import { NextRequest, NextResponse } from 'next/server'
import { CompetitorWatchBotService } from '@/lib/services/competitor-watch-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const competitorService = new CompetitorWatchBotService()

export async function GET(request: NextRequest, context: any) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const competitor = await competitorService.getCompetitorById(params.id)

    if (!competitor) {
      return NextResponse.json(
        { error: 'Competitor not found' },
        { status: 404 }
      )
    }

    // Get metrics history
    const metrics = await competitorService.getCompetitorMetrics(params.id, 30)

    return NextResponse.json({ 
      success: true, 
      competitor,
      metrics
    })

  } catch (error) {
    console.error('Error fetching competitor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (!sql) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    await sql`
      UPDATE bot_competitors
      SET status = 'archived', updated_at = NOW()
      WHERE id = ${params.id} AND user_id = ${userId}
    `

    return NextResponse.json({ 
      success: true,
      message: 'Competitor archived' 
    })

  } catch (error) {
    console.error('Error archiving competitor:', error)
    return NextResponse.json(
      { error: 'Failed to archive competitor' },
      { status: 500 }
    )
  }
}
