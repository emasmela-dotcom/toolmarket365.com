import { NextRequest, NextResponse } from 'next/server'
import { appendWebhookCapture, isValidWebhookToken } from '@/lib/webhookTesterStore'

export const dynamic = 'force-dynamic'

function utf8ByteLength(s: string): number {
  return new TextEncoder().encode(s).length
}

async function capture(req: NextRequest, token: string) {
  if (!isValidWebhookToken(token)) {
    return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
  }
  const url = new URL(req.url)
  const query: Record<string, string> = {}
  url.searchParams.forEach((v, k) => {
    query[k] = v
  })
  const raw = await req.text()
  const headers: Record<string, string> = {}
  req.headers.forEach((v, k) => {
    if (!k.startsWith(':')) headers[k] = v
  })
  const max = 48_000
  const bodyPreview = raw.length > max ? `${raw.slice(0, max)}\n…[truncated]` : raw
  appendWebhookCapture(token, {
    method: req.method,
    query,
    headers,
    bodyPreview,
    bodyBytes: utf8ByteLength(raw),
  })
  return NextResponse.json({ ok: true, message: 'Captured — poll inbox in the tool UI.' })
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params
  if (!isValidWebhookToken(token)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  }
  return NextResponse.json({
    hint: 'Send POST/PUT/PATCH/DELETE with a body to record a webhook. This GET only checks the endpoint.',
    token,
  })
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  return capture(req, (await ctx.params).token)
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  return capture(req, (await ctx.params).token)
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  return capture(req, (await ctx.params).token)
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  return capture(req, (await ctx.params).token)
}
