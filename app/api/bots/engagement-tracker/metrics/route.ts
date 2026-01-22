import { NextRequest, NextResponse } from 'next/server'
import { EngagementTrackerBotService } from '@/lib/services/engagement-tracker-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

const engagementService = new EngagementTrackerBotService()

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
    const accountId = searchParams.get('accountId') || undefined
    const platform = searchParams.get('platform') || undefined
    const days = parseInt(searchParams.get('days') || '30')

    const metrics = await engagementService.getEngagementMetrics(
      userId,
      accountId,
      platform,
      days
    )

    return NextResponse.json({ 
      success: true, 
      metrics,
      count: metrics.length 
    })

  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
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

    const body = await request.json()
    const { accountId, date } = body

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      )
    }

    const metrics = await engagementService.generateEngagementMetrics(
      userId,
      accountId,
      date ? new Date(date) : undefined
    )

    return NextResponse.json({ 
      success: true, 
      metrics 
    })

  } catch (error) {
    console.error('Error generating metrics:', error)
    return NextResponse.json(
      { error: 'Failed to generate metrics' },
      { status: 500 }
    )
  }
}
