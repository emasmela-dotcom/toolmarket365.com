import { NextRequest, NextResponse } from 'next/server'
import { trackSubscriptions } from '@/lib/subscriptionTracker'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const raw = typeof body.rawLines === 'string' ? body.rawLines : ''
  const rawLines = raw.split(/\r?\n/).filter(Boolean)
  return NextResponse.json(trackSubscriptions({ rawLines }))
}
