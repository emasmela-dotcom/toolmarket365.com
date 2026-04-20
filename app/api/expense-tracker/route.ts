import { NextRequest, NextResponse } from 'next/server'
import { categorizeExpenses } from '@/lib/expenseTracker'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const raw = typeof body.rawLines === 'string' ? body.rawLines : ''
  const rawLines = raw.split(/\r?\n/).filter(Boolean)
  return NextResponse.json(categorizeExpenses({ rawLines }))
}
