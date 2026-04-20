import { NextRequest, NextResponse } from 'next/server'
import { buildReviewRequestCopy } from '@/lib/reviewRequestAutomator'

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json(
    buildReviewRequestCopy({
      brandName: String(body.brandName || ''),
      productName: String(body.productName || ''),
      reviewLink: String(body.reviewLink || ''),
    })
  )
}
