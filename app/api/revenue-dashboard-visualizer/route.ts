import { NextRequest, NextResponse } from 'next/server'
import { visualizeSubscriptionRevenue } from '@/lib/revenueDashboardVisualizer'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const proc = body.processor === 'paddle' ? 'paddle' : body.processor === 'other' ? 'other' : 'stripe'
  return NextResponse.json(
    visualizeSubscriptionRevenue({
      mrr: Number(body.mrr) || 0,
      lastMonthRevenue: Number(body.lastMonthRevenue) || 0,
      growthPercentMoM: body.growthPercentMoM !== undefined ? Number(body.growthPercentMoM) : undefined,
      churnPercent: body.churnPercent !== undefined ? Number(body.churnPercent) : undefined,
      processor: proc,
    })
  )
}
