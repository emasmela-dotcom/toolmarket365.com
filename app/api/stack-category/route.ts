import { NextRequest, NextResponse } from 'next/server'
import {
  isStackCategorySlug,
  runStackCategoryTool,
} from '@/lib/stackCategoryTools'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const category =
    typeof body.category === 'string' ? body.category.trim().toLowerCase() : ''
  if (!isStackCategorySlug(category)) {
    return NextResponse.json({ error: 'Unknown category' }, { status: 400 })
  }
  const result = runStackCategoryTool({
    category,
    topic: typeof body.topic === 'string' ? body.topic : '',
    details: typeof body.details === 'string' ? body.details : '',
  })
  return NextResponse.json(result)
}
