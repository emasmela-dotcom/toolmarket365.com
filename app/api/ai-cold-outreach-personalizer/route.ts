import { NextRequest, NextResponse } from 'next/server'
import { personalizeColdOutreach } from '@/lib/aiColdOutreachPersonalizer'

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json(
    personalizeColdOutreach({
      company: String(body.company || ''),
      contactRole: String(body.contactRole || ''),
      valueProp: String(body.valueProp || ''),
      signal: String(body.signal || ''),
    })
  )
}
