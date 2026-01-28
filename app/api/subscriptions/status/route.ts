import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest, getUserSubscriptionStatus } from '@/lib/subscription'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const status = await getUserSubscriptionStatus(userId)

    return NextResponse.json({
      success: true,
      status
    })
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    )
  }
}
