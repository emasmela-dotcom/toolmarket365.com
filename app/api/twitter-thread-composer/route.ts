import { NextRequest, NextResponse } from 'next/server'
import { composeTwitterThread } from '@/lib/twitterThreadComposer'

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json(
    composeTwitterThread({
      text: String(body.text || ''),
      maxChars: Number(body.maxChars) || undefined,
    })
  )
}
