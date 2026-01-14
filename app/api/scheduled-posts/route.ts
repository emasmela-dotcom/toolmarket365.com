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

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
}

type UserIdKind = 'none' | 'uuid' | 'text'
let cachedUserIdKind: UserIdKind | null = null
let cachedScheduledPostsCols: Set<string> | null = null

type ContentCol = 'body' | 'content'
type ScheduledCol = 'scheduled_for' | 'scheduled_at' | 'scheduled_time' | null

async function getScheduledPostsCols(): Promise<Set<string>> {
  if (!sql) return new Set()
  if (cachedScheduledPostsCols) return cachedScheduledPostsCols

  try {
    const rows = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'scheduled_posts'
    `
    cachedScheduledPostsCols = new Set(rows.map((r: any) => String(r.column_name)))
    return cachedScheduledPostsCols
  } catch {
    cachedScheduledPostsCols = new Set()
    return cachedScheduledPostsCols
  }
}

async function getShape(): Promise<{
  contentCol: ContentCol
  scheduledCol: ScheduledCol
  hasUserId: boolean
  userIdKind: UserIdKind
}> {
  const cols = await getScheduledPostsCols()
  // Prefer legacy `content` if present (often NOT NULL). Fall back to `body`.
  const contentCol: ContentCol = cols.has('content') ? 'content' : 'body'
  const scheduledCol: ScheduledCol = cols.has('scheduled_for')
    ? 'scheduled_for'
    : cols.has('scheduled_at')
      ? 'scheduled_at'
      : cols.has('scheduled_time')
        ? 'scheduled_time'
        : null
  const userIdKind = await getUserIdKind()
  const hasUserId = cols.has('user_id') && userIdKind !== 'none'
  return { contentCol, scheduledCol, hasUserId, userIdKind }
}

let cachedScheduledNullable: Record<string, boolean> | null = null

async function isScheduledNullable(col: Exclude<ScheduledCol, null>): Promise<boolean> {
  if (!sql) return true
  cachedScheduledNullable ||= {}
  if (cachedScheduledNullable[col] !== undefined) return cachedScheduledNullable[col]

  try {
    const rows = await sql`
      SELECT is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'scheduled_posts'
        AND column_name = ${col}
      LIMIT 1
    `
    const v = String((rows[0] as any)?.is_nullable || '').toUpperCase()
    const ok = v !== 'NO'
    cachedScheduledNullable[col] = ok
    return ok
  } catch {
    cachedScheduledNullable[col] = true
    return true
  }
}

async function getUserIdKind(): Promise<UserIdKind> {
  if (!sql) return 'none'
  if (cachedUserIdKind) return cachedUserIdKind

  try {
    const rows = await sql`
      SELECT udt_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'scheduled_posts'
        AND column_name = 'user_id'
      LIMIT 1
    `

    if (!rows[0]) {
      cachedUserIdKind = 'none'
      return cachedUserIdKind
    }

    const udt = String((rows[0] as any).udt_name || '').toLowerCase()
    const dt = String((rows[0] as any).data_type || '').toLowerCase()

    cachedUserIdKind = udt === 'uuid' || dt === 'uuid' ? 'uuid' : 'text'
    return cachedUserIdKind
  } catch {
    // If introspection fails, assume no user_id and fall back to insert without it.
    cachedUserIdKind = 'none'
    return cachedUserIdKind
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
  const headerUserId = (req.headers.get('x-user-id') || '').trim()

  try {
    const shape = await getShape()
    const filter = statusParam && isStatus(statusParam) ? (statusParam as Status) : null
    const useUserFilter = shape.hasUserId && !!headerUserId

    const rows = await (async () => {
      // 2 x 4 shape variants: content(body/content) x scheduled(scheduled_for/scheduled_at/scheduled_time/null)
      if (shape.contentCol === 'body' && shape.scheduledCol === 'scheduled_for') {
        return filter
          ? sql`
              SELECT id, created_at, updated_at, status, platform, scheduled_for, title, body, media_urls
              FROM scheduled_posts
              WHERE status = ${filter}
                AND (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY COALESCE(scheduled_for, created_at) DESC
              LIMIT ${limit}
            `
          : sql`
              SELECT id, created_at, updated_at, status, platform, scheduled_for, title, body, media_urls
              FROM scheduled_posts
              WHERE (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY COALESCE(scheduled_for, created_at) DESC
              LIMIT ${limit}
            `
      }
      if (shape.contentCol === 'content' && shape.scheduledCol === 'scheduled_for') {
        return filter
          ? sql`
              SELECT id, created_at, updated_at, status, platform, scheduled_for, title, content AS body, media_urls
              FROM scheduled_posts
              WHERE status = ${filter}
                AND (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY COALESCE(scheduled_for, created_at) DESC
              LIMIT ${limit}
            `
          : sql`
              SELECT id, created_at, updated_at, status, platform, scheduled_for, title, content AS body, media_urls
              FROM scheduled_posts
              WHERE (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY COALESCE(scheduled_for, created_at) DESC
              LIMIT ${limit}
            `
      }

      if (shape.contentCol === 'body' && shape.scheduledCol === 'scheduled_at') {
        return filter
          ? sql`
              SELECT id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, body, media_urls
              FROM scheduled_posts
              WHERE status = ${filter}
                AND (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY COALESCE(scheduled_for, created_at) DESC
              LIMIT ${limit}
            `
          : sql`
              SELECT id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, body, media_urls
              FROM scheduled_posts
              WHERE (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY COALESCE(scheduled_for, created_at) DESC
              LIMIT ${limit}
            `
      }
      if (shape.contentCol === 'content' && shape.scheduledCol === 'scheduled_at') {
        return filter
          ? sql`
              SELECT id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, content AS body, media_urls
              FROM scheduled_posts
              WHERE status = ${filter}
                AND (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY COALESCE(scheduled_for, created_at) DESC
              LIMIT ${limit}
            `
          : sql`
              SELECT id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, content AS body, media_urls
              FROM scheduled_posts
              WHERE (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY COALESCE(scheduled_for, created_at) DESC
              LIMIT ${limit}
            `
      }

      if (shape.contentCol === 'body' && shape.scheduledCol === 'scheduled_time') {
        return filter
          ? sql`
              SELECT id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, body, media_urls
              FROM scheduled_posts
              WHERE status = ${filter}
                AND (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY COALESCE(scheduled_for, created_at) DESC
              LIMIT ${limit}
            `
          : sql`
              SELECT id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, body, media_urls
              FROM scheduled_posts
              WHERE (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY COALESCE(scheduled_for, created_at) DESC
              LIMIT ${limit}
            `
      }
      if (shape.contentCol === 'content' && shape.scheduledCol === 'scheduled_time') {
        return filter
          ? sql`
              SELECT id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, content AS body, media_urls
              FROM scheduled_posts
              WHERE status = ${filter}
                AND (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY COALESCE(scheduled_for, created_at) DESC
              LIMIT ${limit}
            `
          : sql`
              SELECT id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, content AS body, media_urls
              FROM scheduled_posts
              WHERE (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY COALESCE(scheduled_for, created_at) DESC
              LIMIT ${limit}
            `
      }

      // No schedule column present; return NULL scheduled_for
      return filter
        ? (shape.contentCol === 'content'
            ? sql`
                SELECT id, created_at, updated_at, status, platform, NULL::timestamptz AS scheduled_for, title, content AS body, media_urls
                FROM scheduled_posts
                WHERE status = ${filter}
                  AND (${useUserFilter} = false OR user_id = ${headerUserId})
                ORDER BY created_at DESC
                LIMIT ${limit}
              `
            : sql`
                SELECT id, created_at, updated_at, status, platform, NULL::timestamptz AS scheduled_for, title, body, media_urls
                FROM scheduled_posts
                WHERE status = ${filter}
                  AND (${useUserFilter} = false OR user_id = ${headerUserId})
                ORDER BY created_at DESC
                LIMIT ${limit}
              `)
        : shape.contentCol === 'content'
          ? sql`
              SELECT id, created_at, updated_at, status, platform, NULL::timestamptz AS scheduled_for, title, content AS body, media_urls
              FROM scheduled_posts
              WHERE (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY created_at DESC
              LIMIT ${limit}
            `
          : sql`
              SELECT id, created_at, updated_at, status, platform, NULL::timestamptz AS scheduled_for, title, body, media_urls
              FROM scheduled_posts
              WHERE (${useUserFilter} = false OR user_id = ${headerUserId})
              ORDER BY created_at DESC
              LIMIT ${limit}
            `
    })()

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
  const postBody =
    typeof body.body === 'string'
      ? body.body.trim()
      : typeof body.content === 'string'
        ? body.content.trim()
        : ''
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
    const shape = await getShape()
    const cols = await getScheduledPostsCols()

    const headerUserId = (req.headers.get('x-user-id') || '').trim()
    const bodyUserId = typeof body.user_id === 'string' ? body.user_id.trim() : ''
    const userIdText = bodyUserId || headerUserId || 'local'

    const userValue =
      shape.userIdKind === 'uuid' ? (isUuid(userIdText) ? userIdText : newId()) : userIdText

    const scheduledValue =
      shape.scheduledCol && !(await isScheduledNullable(shape.scheduledCol))
        ? scheduledFor || new Date().toISOString()
        : scheduledFor

    const rows = await (async () => {
      const hasContent = cols.has('content')
      const hasBody = cols.has('body')

      if (shape.hasUserId && shape.scheduledCol === 'scheduled_for') {
        if (hasContent && hasBody) {
          return sql`
            INSERT INTO scheduled_posts (id, user_id, status, platform, scheduled_for, title, content, body, media_urls)
            VALUES (${id}, ${userValue}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, scheduled_for, title, content AS body, media_urls
          `
        }
        if (hasContent) {
          return sql`
            INSERT INTO scheduled_posts (id, user_id, status, platform, scheduled_for, title, content, media_urls)
            VALUES (${id}, ${userValue}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, scheduled_for, title, content AS body, media_urls
          `
        }
        return sql`
          INSERT INTO scheduled_posts (id, user_id, status, platform, scheduled_for, title, body, media_urls)
          VALUES (${id}, ${userValue}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${mediaUrls})
          RETURNING id, created_at, updated_at, status, platform, scheduled_for, title, body, media_urls
        `
      }

      if (shape.hasUserId && shape.scheduledCol === 'scheduled_at') {
        if (hasContent && hasBody) {
          return sql`
            INSERT INTO scheduled_posts (id, user_id, status, platform, scheduled_at, title, content, body, media_urls)
            VALUES (${id}, ${userValue}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, content AS body, media_urls
          `
        }
        if (hasContent) {
          return sql`
            INSERT INTO scheduled_posts (id, user_id, status, platform, scheduled_at, title, content, media_urls)
            VALUES (${id}, ${userValue}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, content AS body, media_urls
          `
        }
        return sql`
          INSERT INTO scheduled_posts (id, user_id, status, platform, scheduled_at, title, body, media_urls)
          VALUES (${id}, ${userValue}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${mediaUrls})
          RETURNING id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, body, media_urls
        `
      }

      if (shape.hasUserId && shape.scheduledCol === 'scheduled_time') {
        if (hasContent && hasBody) {
          return sql`
            INSERT INTO scheduled_posts (id, user_id, status, platform, scheduled_time, title, content, body, media_urls)
            VALUES (${id}, ${userValue}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, content AS body, media_urls
          `
        }
        if (hasContent) {
          return sql`
            INSERT INTO scheduled_posts (id, user_id, status, platform, scheduled_time, title, content, media_urls)
            VALUES (${id}, ${userValue}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, content AS body, media_urls
          `
        }
        return sql`
          INSERT INTO scheduled_posts (id, user_id, status, platform, scheduled_time, title, body, media_urls)
          VALUES (${id}, ${userValue}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${mediaUrls})
          RETURNING id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, body, media_urls
        `
      }

      if (shape.hasUserId && shape.scheduledCol === null) {
        if (hasContent && hasBody) {
          return sql`
            INSERT INTO scheduled_posts (id, user_id, status, platform, title, content, body, media_urls)
            VALUES (${id}, ${userValue}, ${status}, ${platform}, ${title}, ${postBody}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, NULL::timestamptz AS scheduled_for, title, content AS body, media_urls
          `
        }
        if (hasContent) {
          return sql`
            INSERT INTO scheduled_posts (id, user_id, status, platform, title, content, media_urls)
            VALUES (${id}, ${userValue}, ${status}, ${platform}, ${title}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, NULL::timestamptz AS scheduled_for, title, content AS body, media_urls
          `
        }
        return sql`
          INSERT INTO scheduled_posts (id, user_id, status, platform, title, body, media_urls)
          VALUES (${id}, ${userValue}, ${status}, ${platform}, ${title}, ${postBody}, ${mediaUrls})
          RETURNING id, created_at, updated_at, status, platform, NULL::timestamptz AS scheduled_for, title, body, media_urls
        `
      }

      // No user_id column
      if (!shape.hasUserId && shape.scheduledCol === 'scheduled_for') {
        if (hasContent && hasBody) {
          return sql`
            INSERT INTO scheduled_posts (id, status, platform, scheduled_for, title, content, body, media_urls)
            VALUES (${id}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, scheduled_for, title, content AS body, media_urls
          `
        }
        if (hasContent) {
          return sql`
            INSERT INTO scheduled_posts (id, status, platform, scheduled_for, title, content, media_urls)
            VALUES (${id}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, scheduled_for, title, content AS body, media_urls
          `
        }
        return sql`
          INSERT INTO scheduled_posts (id, status, platform, scheduled_for, title, body, media_urls)
          VALUES (${id}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${mediaUrls})
          RETURNING id, created_at, updated_at, status, platform, scheduled_for, title, body, media_urls
        `
      }
      if (!shape.hasUserId && shape.scheduledCol === 'scheduled_at') {
        if (hasContent && hasBody) {
          return sql`
            INSERT INTO scheduled_posts (id, status, platform, scheduled_at, title, content, body, media_urls)
            VALUES (${id}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, content AS body, media_urls
          `
        }
        if (hasContent) {
          return sql`
            INSERT INTO scheduled_posts (id, status, platform, scheduled_at, title, content, media_urls)
            VALUES (${id}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, content AS body, media_urls
          `
        }
        return sql`
          INSERT INTO scheduled_posts (id, status, platform, scheduled_at, title, body, media_urls)
          VALUES (${id}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${mediaUrls})
          RETURNING id, created_at, updated_at, status, platform, scheduled_at AS scheduled_for, title, body, media_urls
        `
      }
      if (!shape.hasUserId && shape.scheduledCol === 'scheduled_time') {
        if (hasContent && hasBody) {
          return sql`
            INSERT INTO scheduled_posts (id, status, platform, scheduled_time, title, content, body, media_urls)
            VALUES (${id}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, content AS body, media_urls
          `
        }
        if (hasContent) {
          return sql`
            INSERT INTO scheduled_posts (id, status, platform, scheduled_time, title, content, media_urls)
            VALUES (${id}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${mediaUrls})
            RETURNING id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, content AS body, media_urls
          `
        }
        return sql`
          INSERT INTO scheduled_posts (id, status, platform, scheduled_time, title, body, media_urls)
          VALUES (${id}, ${status}, ${platform}, ${scheduledValue}, ${title}, ${postBody}, ${mediaUrls})
          RETURNING id, created_at, updated_at, status, platform, scheduled_time AS scheduled_for, title, body, media_urls
        `
      }

      if (hasContent && hasBody) {
        return sql`
          INSERT INTO scheduled_posts (id, status, platform, title, content, body, media_urls)
          VALUES (${id}, ${status}, ${platform}, ${title}, ${postBody}, ${postBody}, ${mediaUrls})
          RETURNING id, created_at, updated_at, status, platform, NULL::timestamptz AS scheduled_for, title, content AS body, media_urls
        `
      }
      if (hasContent) {
        return sql`
          INSERT INTO scheduled_posts (id, status, platform, title, content, media_urls)
          VALUES (${id}, ${status}, ${platform}, ${title}, ${postBody}, ${mediaUrls})
          RETURNING id, created_at, updated_at, status, platform, NULL::timestamptz AS scheduled_for, title, content AS body, media_urls
        `
      }
      return sql`
        INSERT INTO scheduled_posts (id, status, platform, title, body, media_urls)
        VALUES (${id}, ${status}, ${platform}, ${title}, ${postBody}, ${mediaUrls})
        RETURNING id, created_at, updated_at, status, platform, NULL::timestamptz AS scheduled_for, title, body, media_urls
      `
    })()

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
    if (/null value in column \"user_id\"/i.test(message)) {
      return NextResponse.json(
        {
          error:
            'Your Neon `scheduled_posts` table requires user_id. Update the API (git pull) or add a default for user_id in Neon, then retry.',
          detail: message,
        },
        { status: 500 }
      )
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

