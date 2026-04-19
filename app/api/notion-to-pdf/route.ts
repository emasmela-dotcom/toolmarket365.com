import { NextRequest, NextResponse } from 'next/server'
import { buildNotionPdfExport } from '@/lib/notionToPdfExporter'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = buildNotionPdfExport({
    title: typeof body.title === 'string' ? body.title : '',
    body: typeof body.body === 'string' ? body.body : '',
  })
  return NextResponse.json(result)
}
