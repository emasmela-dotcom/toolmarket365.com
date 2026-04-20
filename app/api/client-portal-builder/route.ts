import { NextRequest, NextResponse } from 'next/server'
import { buildClientPortalOutline } from '@/lib/clientPortalBuilder'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const modules = Array.isArray(body.modules)
    ? body.modules.filter((x: unknown) => typeof x === 'string')
    : typeof body.modulesRaw === 'string'
      ? body.modulesRaw.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean)
      : []
  return NextResponse.json(
    buildClientPortalOutline({
      clientName: String(body.clientName || ''),
      modules,
    })
  )
}
