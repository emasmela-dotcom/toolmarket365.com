import { NextRequest, NextResponse } from 'next/server'
import { generateAccessibleAltText } from '@/lib/aiImageAltGenerator'

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json(
    generateAccessibleAltText({
      context: String(body.context || ''),
      pageTopic: String(body.pageTopic || ''),
    })
  )
}
