import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest, getUserSubscriptionStatus } from '@/lib/subscription'

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  
  if (!userId) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }

  const status = await getUserSubscriptionStatus(userId)
  return NextResponse.json(status)
}
