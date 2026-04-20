import { NextRequest, NextResponse } from 'next/server'
import { isValidWorkspaceToken, isValidSlug, resolveAndCountClick } from '@/lib/urlShortenerStore'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, ctx: { params: Promise<{ token: string; slug: string }> }) {
  const { token, slug } = await ctx.params
  const s = slug.toLowerCase()
  if (!isValidWorkspaceToken(token) || !isValidSlug(s)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const target = resolveAndCountClick(token, s)
  if (!target) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const wantsJson = req.nextUrl.searchParams.get('format') === 'json'
  if (wantsJson) {
    return NextResponse.json({ target })
  }
  return NextResponse.redirect(target, 302)
}
