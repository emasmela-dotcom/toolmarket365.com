import { NextRequest, NextResponse } from 'next/server'
import { runSeoAudit } from '@/lib/seoAuditTool'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = runSeoAudit({
    url: typeof body.url === 'string' ? body.url : '',
    hasSitemap: Boolean(body.hasSitemap),
    hasSsl: body.hasSsl !== false,
    mobileFriendly: Boolean(body.mobileFriendly),
    metaTitleLength: Number(body.metaTitleLength) || undefined,
    metaDescriptionLength: Number(body.metaDescriptionLength) || undefined,
    h1Count:
      body.h1Count !== undefined && body.h1Count !== "" && !Number.isNaN(Number(body.h1Count))
        ? Number(body.h1Count)
        : undefined,
  })
  return NextResponse.json(result)
}
