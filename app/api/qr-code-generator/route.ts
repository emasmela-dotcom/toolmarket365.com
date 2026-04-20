import { NextRequest, NextResponse } from 'next/server'
import { buildQrDataUrl } from '@/lib/qrCodeGenerator'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    payload?: string
    dark?: string
    light?: string
    width?: number
    margin?: number
  }
  const out = await buildQrDataUrl({
    payload: typeof body.payload === 'string' ? body.payload : '',
    dark: body.dark,
    light: body.light,
    width: body.width,
    margin: body.margin,
  })
  if ('error' in out) {
    return NextResponse.json({ error: out.error }, { status: 400 })
  }
  return NextResponse.json(out)
}
