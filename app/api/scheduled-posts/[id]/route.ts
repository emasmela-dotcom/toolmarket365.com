import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

type Status = 'draft' | 'scheduled' | 'published' | 'canceled'

function isStatus(v: unknown): v is Status {
  return v === 'draft' || v === 'scheduled' || v === 'published' || v === 'canceled'
}

let cachedCols: Set<string> | null = null
type ContentCol = 'body' | 'content'
type ScheduledCol = 'scheduled_for' | 'scheduled_at' | 'scheduled_time' | null

async function getCols(): Promise<Set<string>> {
  if (!sql) return new Set()
  if (cachedCols) return cachedCols
  try {
    const rows = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'scheduled_posts'
    `
    cachedCols = new Set(rows.map((r: any) => String(r.column_name)))
    return cachedCols
  } catch {
    cachedCols = new Set()
    return cachedCols
  }
}

async function getContentCol(): Promise<ContentCol> {
  const cols = await getCols()
  // Prefer legacy `content` if present (often NOT NULL). Fall back to `body`.
  return cols.has('content') ? 'content' : 'body'
}

async function getScheduledCol(): Promise<ScheduledCol> {
  const cols = await getCols()
  if (cols.has('scheduled_for')) return 'scheduled_for'
  if (cols.has('scheduled_at')) return 'scheduled_at'
  if (cols.has('scheduled_time')) return 'scheduled_time'
  return null
}

function isSafeId(v: string): boolean {
  // Support both UUIDs and legacy short IDs (e.g. nanoid).
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)) return true
  return /^[a-zA-Z0-9_-]{6,80}$/.test(v)
}

function toIsoOrNull(v: unknown): string | null {
  if (v === null || v === undefined || v === '') return null
  if (typeof v !== 'string') return null
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  if (!sql) {
    return NextResponse.json({ error: 'DATABASE_URL is not set' }, { status: 503 })
  }

  const id = ctx.params.id
  if (!isSafeId(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  try {
    const contentCol = await getContentCol()
    const scheduledCol = await getScheduledCol()

    const rows = await (async () => {
      if (contentCol === 'body' && scheduledCol === 'scheduled_for') {
        return sql`
          SELECT id, created_at, updated_at, status, platform, scheduled_for, title, body, media_urls
          FROM scheduled_posts
          WHERE id = ${id}
          LIMIT 1
        `
      }
      if (contentCol === 'content' && scheduledCol === 'scheduled_for') {
        return sql`
          SELECT id, created_at, updated_at, status, platform, scheduled_for, title, content AS body, media_urls
          FROM scheduled_posts
          WHERE id = ${id}
          LIMIT 1
        `
      }
      if (contentCol === 'body' && scheduledCol === 'scheduled_at') {
        return sql`
          SELECT id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, body, media_urls
          FROM scheduled_posts
          WHERE id = ${id}
          LIMIT 1
        `
      }
      if (contentCol === 'content' && scheduledCol === 'scheduled_at') {
        return sql`
          SELECT id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, content AS body, media_urls
          FROM scheduled_posts
          WHERE id = ${id}
          LIMIT 1
        `
      }
      if (contentCol === 'body' && scheduledCol === 'scheduled_time') {
        return sql`
          SELECT id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, body, media_urls
          FROM scheduled_posts
          WHERE id = ${id}
          LIMIT 1
        `
      }
      if (contentCol === 'content' && scheduledCol === 'scheduled_time') {
        return sql`
          SELECT id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, content AS body, media_urls
          FROM scheduled_posts
          WHERE id = ${id}
          LIMIT 1
        `
      }
      return contentCol === 'content'
        ? sql`
            SELECT id, created_at, updated_at, status, platform, NULL::timestamptz AS scheduled_for, title, content AS body, media_urls
            FROM scheduled_posts
            WHERE id = ${id}
            LIMIT 1
          `
        : sql`
            SELECT id, created_at, updated_at, status, platform, NULL::timestamptz AS scheduled_for, title, body, media_urls
            FROM scheduled_posts
            WHERE id = ${id}
            LIMIT 1
          `
    })()

    if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ post: rows[0] })
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

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  if (!sql) {
    return NextResponse.json({ error: 'DATABASE_URL is not set' }, { status: 503 })
  }

  const id = ctx.params.id
  if (!isSafeId(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const platform = typeof body.platform === 'string' && body.platform.trim() ? body.platform.trim() : undefined
  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 200) : undefined
  const postBody =
    typeof body.body === 'string' ? body.body.trim() : typeof body.content === 'string' ? body.content.trim() : undefined
  const status: Status | undefined = isStatus(body.status) ? body.status : undefined
  const scheduledFor = body.scheduled_for !== undefined || body.scheduledFor !== undefined ? toIsoOrNull(body.scheduled_for ?? body.scheduledFor) : undefined

  const mediaUrls =
    body.media_urls !== undefined || body.mediaUrls !== undefined
      ? Array.isArray(body.media_urls ?? body.mediaUrls) &&
        (body.media_urls ?? body.mediaUrls).every((x: unknown) => typeof x === 'string')
        ? ((body.media_urls ?? body.mediaUrls) as string[]).map((s) => s.trim()).filter(Boolean)
        : null
      : undefined

  // If nothing to update:
  if (
    platform === undefined &&
    title === undefined &&
    postBody === undefined &&
    status === undefined &&
    scheduledFor === undefined &&
    mediaUrls === undefined
  ) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  // Update via COALESCE to keep existing values when undefined
  try {
    const contentCol = await getContentCol()
    const scheduledCol = await getScheduledCol()

    const rows = await (async () => {
      const setContent =
        contentCol === 'content'
          ? sql`
              UPDATE scheduled_posts
              SET
                updated_at = NOW(),
                platform = COALESCE(${platform ?? null}, platform),
                title = COALESCE(${title ?? null}, title),
                content = COALESCE(${postBody ?? null}, content),
                status = COALESCE(${status ?? null}, status),
                media_urls = COALESCE(${mediaUrls as any}, media_urls)
              WHERE id = ${id}
              RETURNING id, created_at, updated_at, status, platform, title, content AS body, media_urls
            `
          : sql`
              UPDATE scheduled_posts
              SET
                updated_at = NOW(),
                platform = COALESCE(${platform ?? null}, platform),
                title = COALESCE(${title ?? null}, title),
                body = COALESCE(${postBody ?? null}, body),
                status = COALESCE(${status ?? null}, status),
                media_urls = COALESCE(${mediaUrls as any}, media_urls)
              WHERE id = ${id}
              RETURNING id, created_at, updated_at, status, platform, title, body, media_urls
            `

      // If we have a schedule column, update it too and return it as scheduled_for.
      if (scheduledCol === 'scheduled_for') {
        return contentCol === 'content'
          ? sql`
              UPDATE scheduled_posts
              SET
                updated_at = NOW(),
                platform = COALESCE(${platform ?? null}, platform),
                title = COALESCE(${title ?? null}, title),
                content = COALESCE(${postBody ?? null}, content),
                status = COALESCE(${status ?? null}, status),
                scheduled_for = COALESCE(${scheduledFor ?? null}, scheduled_for),
                media_urls = COALESCE(${mediaUrls as any}, media_urls)
              WHERE id = ${id}
              RETURNING id, created_at, updated_at, status, platform, scheduled_for, title, content AS body, media_urls
            `
          : sql`
              UPDATE scheduled_posts
              SET
                updated_at = NOW(),
                platform = COALESCE(${platform ?? null}, platform),
                title = COALESCE(${title ?? null}, title),
                body = COALESCE(${postBody ?? null}, body),
                status = COALESCE(${status ?? null}, status),
                scheduled_for = COALESCE(${scheduledFor ?? null}, scheduled_for),
                media_urls = COALESCE(${mediaUrls as any}, media_urls)
              WHERE id = ${id}
              RETURNING id, created_at, updated_at, status, platform, scheduled_for, title, body, media_urls
            `
      }
      if (scheduledCol === 'scheduled_at') {
        return contentCol === 'content'
          ? sql`
              UPDATE scheduled_posts
              SET
                updated_at = NOW(),
                platform = COALESCE(${platform ?? null}, platform),
                title = COALESCE(${title ?? null}, title),
                content = COALESCE(${postBody ?? null}, content),
                status = COALESCE(${status ?? null}, status),
                scheduled_at = COALESCE(${scheduledFor ?? null}, scheduled_at),
                media_urls = COALESCE(${mediaUrls as any}, media_urls)
              WHERE id = ${id}
              RETURNING id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, content AS body, media_urls
            `
          : sql`
              UPDATE scheduled_posts
              SET
                updated_at = NOW(),
                platform = COALESCE(${platform ?? null}, platform),
                title = COALESCE(${title ?? null}, title),
                body = COALESCE(${postBody ?? null}, body),
                status = COALESCE(${status ?? null}, status),
                scheduled_at = COALESCE(${scheduledFor ?? null}, scheduled_at),
                media_urls = COALESCE(${mediaUrls as any}, media_urls)
              WHERE id = ${id}
              RETURNING id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, body, media_urls
            `
      }
      if (scheduledCol === 'scheduled_time') {
        return contentCol === 'content'
          ? sql`
              UPDATE scheduled_posts
              SET
                updated_at = NOW(),
                platform = COALESCE(${platform ?? null}, platform),
                title = COALESCE(${title ?? null}, title),
                content = COALESCE(${postBody ?? null}, content),
                status = COALESCE(${status ?? null}, status),
                scheduled_time = COALESCE(${scheduledFor ?? null}, scheduled_time),
                media_urls = COALESCE(${mediaUrls as any}, media_urls)
              WHERE id = ${id}
              RETURNING id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, content AS body, media_urls
            `
          : sql`
              UPDATE scheduled_posts
              SET
                updated_at = NOW(),
                platform = COALESCE(${platform ?? null}, platform),
                title = COALESCE(${title ?? null}, title),
                body = COALESCE(${postBody ?? null}, body),
                status = COALESCE(${status ?? null}, status),
                scheduled_time = COALESCE(${scheduledFor ?? null}, scheduled_time),
                media_urls = COALESCE(${mediaUrls as any}, media_urls)
              WHERE id = ${id}
              RETURNING id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, body, media_urls
            `
      }

      // No schedule column; just update content/body
      return setContent
    })()

    if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    // Ensure scheduled_for is always present for the UI
    const out = rows[0] as any
    if (out.scheduled_for === undefined) out.scheduled_for = null
    return NextResponse.json({ post: out })
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

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  if (!sql) {
    return NextResponse.json({ error: 'DATABASE_URL is not set' }, { status: 503 })
  }

  const id = ctx.params.id
  if (!isSafeId(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  try {
    const rows = await sql`
      DELETE FROM scheduled_posts
      WHERE id = ${id}
      RETURNING id
    `
    if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
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

