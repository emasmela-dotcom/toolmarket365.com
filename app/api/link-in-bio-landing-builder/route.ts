import { NextRequest, NextResponse } from 'next/server'
import { buildLinkInBioLanding } from '@/lib/linkInBioLandingBuilder'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const links = Array.isArray(body.links) ? body.links : []
  return NextResponse.json(
    buildLinkInBioLanding({
      headline: String(body.headline || ''),
      links: links.map((l: { label?: string; url?: string }) => ({
        label: String(l?.label || ''),
        url: String(l?.url || ''),
      })),
      accentColor: String(body.accentColor || ''),
    })
  )
}
