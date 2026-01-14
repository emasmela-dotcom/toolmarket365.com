import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

type Status = 'draft' | 'scheduled' | 'published' | 'canceled'

function isStatus(v: unknown): v is Status {
  return v === 'draft' || v === 'scheduled' || v === 'published' || v === 'canceled'
}

function toIsoOrNull(v: unknown): string | null {
  if (v === null || v === undefined || v === '') return null
  if (typeof v !== 'string') return null
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

function newId(): string {
  // Works for both UUID and legacy TEXT ids.
  // Node 18+ provides crypto.randomUUID().
  try {
    // eslint-disable-next-line no-undef
    return crypto.randomUUID()
  } catch {
    return `${Date.now()}-${Math.random()}`
  }
}

export async function GET(req: NextRequest) {
  if (!sql) {
    return NextResponse.json({ error: 'DATABASE_URL is not set' }, { status: 503 })
  }

  const { searchParams } = new URL(req.url)
  const statusParam = (searchParams.get('status') || '').trim()
  const limitParam = searchParams.get('limit')
  const limit = Math.min(Math.max(Number(limitParam || 100) || 100, 1), 200)

  try {
    const rows =
      statusParam && isStatus(statusParam)
        ? await sql`
            SELECT id, created_at, updated_at, status, platform, scheduled_for, title, body, media_urls
            FROM scheduled_posts
            WHERE status = ${statusParam}
            ORDER BY COALESCE(scheduled_for, created_at) DESC
            LIMIT ${limit}
          `
        : await sql`
            SELECT id, created_at, updated_at, status, platform, scheduled_for, title, body, media_urls
            FROM scheduled_posts
            ORDER BY COALESCE(scheduled_for, created_at) DESC
            LIMIT ${limit}
          `

    return NextResponse.json({ posts: rows })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (/column .* does not exist/i.test(message)) {
      return NextResponse.json(
        {
          error:
            'Your Neon `scheduled_posts` table is missing required columns (schema is out of date). Run the latest scheduled_posts migration SQL in Neon (ALTER TABLE … ADD COLUMN IF NOT EXISTS …) and retry.',
          detail: message,
        },
        { status: 500 }
      )
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!sql) {
    return NextResponse.json({ error: 'DATABASE_URL is not set' }, { status: 503 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const platform = typeof body.platform === 'string' && body.platform.trim() ? body.platform.trim() : 'Other'
  const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim().slice(0, 200) : null
  const postBody = typeof body.body === 'string' ? body.body.trim() : ''
  const status: Status = isStatus(body.status) ? body.status : 'draft'
  const scheduledFor = toIsoOrNull(body.scheduled_for ?? body.scheduledFor)

  const mediaUrls =
    Array.isArray(body.media_urls ?? body.mediaUrls) &&
    (body.media_urls ?? body.mediaUrls).every((x: unknown) => typeof x === 'string')
      ? ((body.media_urls ?? body.mediaUrls) as string[]).map((s) => s.trim()).filter(Boolean)
      : null

  if (!postBody) {
    return NextResponse.json({ error: 'Body is required' }, { status: 400 })
  }

  try {
    const id = newId()
    const rows = await sql`
      INSERT INTO scheduled_posts (id, status, platform, scheduled_for, title, body, media_urls)
      VALUES (${id}, ${status}, ${platform}, ${scheduledFor}, ${title}, ${postBody}, ${mediaUrls})
      RETURNING id, created_at, updated_at, status, platform, scheduled_for, title, body, media_urls
    `
    return NextResponse.json({ post: rows[0] }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (/column .* does not exist/i.test(message)) {
      return NextResponse.json(
        {
          error:
            'Your Neon `scheduled_posts` table is missing required columns (schema is out of date). Run the latest scheduled_posts migration SQL in Neon (ALTER TABLE … ADD COLUMN IF NOT EXISTS …) and retry.',
          detail: message,
        },
        { status: 500 }
      )
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

