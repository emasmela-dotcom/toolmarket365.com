import { NextRequest, NextResponse } from 'next/server'
import { changelogFromCommits } from '@/lib/changelogGenerator'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = changelogFromCommits({
    version: typeof body.version === 'string' ? body.version : '',
    commitsText: typeof body.commitsText === 'string' ? body.commitsText : '',
  })
  return NextResponse.json(result)
}
