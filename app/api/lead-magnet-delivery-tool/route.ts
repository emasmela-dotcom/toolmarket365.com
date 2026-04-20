import { NextRequest, NextResponse } from 'next/server'
import { buildLeadMagnetSequence } from '@/lib/leadMagnetDeliveryTool'

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json(
    buildLeadMagnetSequence({
      magnetTitle: String(body.magnetTitle || ''),
      downloadUrl: String(body.downloadUrl || ''),
      fromName: String(body.fromName || ''),
    })
  )
}
