import { NextRequest, NextResponse } from 'next/server'
import { buildEmailDigest } from '@/lib/emailDigestBuilder'
import type { DigestCadence } from '@/lib/emailDigestBuilder'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const cadence: DigestCadence = body.cadence === 'weekly' ? 'weekly' : 'daily'
  const items = Array.isArray(body.items) ? body.items.filter((x: unknown) => typeof x === 'string') : []
  const result = buildEmailDigest({
    cadence,
    digestTitle: typeof body.digestTitle === 'string' ? body.digestTitle : '',
    items,
  })
  return NextResponse.json(result)
}
