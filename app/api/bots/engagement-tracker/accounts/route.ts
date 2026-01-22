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

    const accounts = await engagementService.getUserAccounts(userId, true)

    return NextResponse.json({ 
      success: true, 
      accounts,
      count: accounts.length 
    })

  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
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
    const { platform, accountName, accountHandle, followerCount, avatarUrl } = body

    if (!platform || !accountName || !accountHandle) {
      return NextResponse.json(
        { error: 'Platform, account name, and handle are required' },
        { status: 400 }
      )
    }

    const account = await engagementService.addSocialAccount(
      userId,
      platform,
      accountName,
      accountHandle,
      followerCount || 0,
      avatarUrl
    )

    return NextResponse.json({ 
      success: true, 
      account 
    })

  } catch (error) {
    console.error('Error adding account:', error)
    return NextResponse.json(
      { error: 'Failed to add account' },
      { status: 500 }
    )
  }
}
