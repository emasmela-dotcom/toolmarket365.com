import { NextRequest, NextResponse } from 'next/server'
import { CompetitorWatchBotService } from '@/lib/services/competitor-watch-bot-service'
import { getUserIdFromRequest } from '@/lib/subscription'

const competitorService = new CompetitorWatchBotService()

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const competitors = await competitorService.getUserCompetitors(userId)

    return NextResponse.json({ 
      success: true, 
      competitors,
      count: competitors.length 
    })

  } catch (error) {
    console.error('Error fetching competitors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitors' },
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
    const { name, websiteUrl, industry, companySize, monitoringFrequency } = body

    if (!name || !websiteUrl) {
      return NextResponse.json(
        { error: 'Name and website URL are required' },
        { status: 400 }
      )
    }

    const competitor = await competitorService.addCompetitor(
      userId,
      name,
      websiteUrl,
      industry,
      companySize,
      monitoringFrequency || 'weekly'
    )

    return NextResponse.json({ 
      success: true, 
      competitor 
    })

  } catch (error) {
    console.error('Error adding competitor:', error)
    return NextResponse.json(
      { error: 'Failed to add competitor' },
      { status: 500 }
    )
  }
}
