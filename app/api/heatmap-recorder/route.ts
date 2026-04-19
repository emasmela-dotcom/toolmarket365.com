import { NextRequest, NextResponse } from 'next/server'
import { buildHeatmapRecorderPlan } from '@/lib/heatmapRecorder'

function parseGridSize(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string') return undefined
  const n = Number.parseInt(value.trim(), 10)
  return Number.isFinite(n) ? n : undefined
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = buildHeatmapRecorderPlan({
    samplesText: typeof body.samplesText === 'string' ? body.samplesText : '',
    gridSize: parseGridSize(body.gridSize),
  })
  return NextResponse.json(result)
}
