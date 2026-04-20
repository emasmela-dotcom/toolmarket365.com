import { NextRequest, NextResponse } from 'next/server'
import {
  createShortLink,
  isValidWorkspaceToken,
  listShortLinksForWorkspace,
} from '@/lib/urlShortenerStore'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    action?: string
    workspaceToken?: string
    targetUrl?: string
    slug?: string
  }
  const action = body.action === 'list' ? 'list' : 'create'
  const workspaceToken = typeof body.workspaceToken === 'string' ? body.workspaceToken : ''
  if (!isValidWorkspaceToken(workspaceToken)) {
    return NextResponse.json({ error: 'Invalid workspace token' }, { status: 400 })
  }
  if (action === 'list') {
    return NextResponse.json({ links: listShortLinksForWorkspace(workspaceToken) })
  }
  const targetUrl = typeof body.targetUrl === 'string' ? body.targetUrl : ''
  const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : ''
  if (!targetUrl.trim() || !slug) {
    return NextResponse.json({ error: 'targetUrl and slug are required' }, { status: 400 })
  }
  const created = createShortLink(workspaceToken, slug, targetUrl.trim())
  if (!created.ok) {
    return NextResponse.json({ error: created.error }, { status: 400 })
  }
  return NextResponse.json({ ok: true, slug })
}
