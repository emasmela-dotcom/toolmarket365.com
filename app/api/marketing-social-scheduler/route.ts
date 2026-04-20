import { NextRequest, NextResponse } from 'next/server'
import { planCrossPlatformSchedule } from '@/lib/marketingSocialScheduler'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const platforms = Array.isArray(body.platforms)
    ? body.platforms.filter((x: unknown) => typeof x === 'string')
    : typeof body.platformsRaw === 'string'
      ? body.platformsRaw.split(/[,;\n]+/).map((s: string) => s.trim()).filter(Boolean)
      : []
  return NextResponse.json(
    planCrossPlatformSchedule({
      platforms,
      postsPerWeek: Number(body.postsPerWeek) || 5,
      bestTimesHint: String(body.bestTimesHint || ''),
    })
  )
}
