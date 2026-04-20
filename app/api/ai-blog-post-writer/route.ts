import { NextRequest, NextResponse } from 'next/server'
import { draftSeoBlogPost } from '@/lib/aiBlogPostWriter'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const tone = body.tone === 'friendly' || body.tone === 'technical' ? body.tone : 'professional'
  return NextResponse.json(
    draftSeoBlogPost({
      topic: String(body.topic || ''),
      audience: String(body.audience || ''),
      keywords: String(body.keywords || ''),
      tone,
    })
  )
}
