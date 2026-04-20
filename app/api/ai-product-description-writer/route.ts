import { NextRequest, NextResponse } from 'next/server'
import { writeEcommerceDescription } from '@/lib/aiProductDescriptionWriter'

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json(
    writeEcommerceDescription({
      productName: String(body.productName || ''),
      featureBullets: String(body.featureBullets || ''),
      audience: String(body.audience || ''),
    })
  )
}
