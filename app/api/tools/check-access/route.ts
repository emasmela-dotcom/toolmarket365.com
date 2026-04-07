import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest, canUserAccessTool } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  
  if (!userId) {
    return NextResponse.json(
      { canAccess: false, reason: 'Not authenticated' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const toolSlug = searchParams.get('tool')

  if (!toolSlug) {
    return NextResponse.json(
      { error: 'Tool slug is required' },
      { status: 400 }
    )
  }

  const access = await canUserAccessTool(userId, toolSlug)
  return NextResponse.json(access)
}
