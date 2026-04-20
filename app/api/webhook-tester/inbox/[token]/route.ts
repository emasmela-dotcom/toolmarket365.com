import { NextResponse } from 'next/server'
import { isValidWebhookToken, listWebhookCaptures } from '@/lib/webhookTesterStore'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params
  if (!isValidWebhookToken(token)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }
  return NextResponse.json({ events: listWebhookCaptures(token) })
}
