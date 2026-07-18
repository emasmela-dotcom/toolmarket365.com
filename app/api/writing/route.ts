import { NextRequest, NextResponse } from 'next/server'
import {
  WRITING_FORMATS,
  WRITING_LENGTHS,
  WRITING_TONES,
  runWritingStudio,
  type WritingFormat,
  type WritingLength,
  type WritingTone,
} from '@/lib/writingStudio'

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = runWritingStudio({
    topic: typeof body.topic === 'string' ? body.topic : '',
    audience: typeof body.audience === 'string' ? body.audience : '',
    problem: typeof body.problem === 'string' ? body.problem : '',
    keyPoints: typeof body.keyPoints === 'string' ? body.keyPoints : '',
    cta: typeof body.cta === 'string' ? body.cta : '',
    format: pick(body.format, WRITING_FORMATS, 'blog' as WritingFormat),
    tone: pick(body.tone, WRITING_TONES, 'professional' as WritingTone),
    length: pick(body.length, WRITING_LENGTHS, 'medium' as WritingLength),
  })
  return NextResponse.json(result)
}
