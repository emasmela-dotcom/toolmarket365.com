import { NextRequest, NextResponse } from 'next/server'
import { summarizeCrmPipeline } from '@/lib/simpleCrmLite'

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json(
    summarizeCrmPipeline({
      rawRows: String(body.rawRows || ''),
    })
  )
}
