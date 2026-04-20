import { NextRequest, NextResponse } from 'next/server'
import { inspectWebhookPaste } from '@/lib/webhookInspect'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { rawBody?: string; headersText?: string }
  const rawBody = typeof body.rawBody === 'string' ? body.rawBody : ''
  const headersText = typeof body.headersText === 'string' ? body.headersText : ''
  const result = inspectWebhookPaste(rawBody, headersText)
  return NextResponse.json(result)
}
