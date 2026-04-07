import { NextRequest, NextResponse } from 'next/server'
import {
  YoutubeTranscript,
  YoutubeTranscriptTooManyRequestError,
} from 'youtube-transcript'

export const runtime = 'nodejs'

function isValidVideoId(id: string): boolean {
  // YouTube video IDs are typically 11 chars; allow a bit more just in case.
  return /^[a-zA-Z0-9_-]{6,20}$/.test(id)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = (searchParams.get('id') || '').trim()
  const lang = (searchParams.get('lang') || '').trim() || undefined

  if (!id) {
    return NextResponse.json({ error: 'Missing required query param: id' }, { status: 400 })
  }
  if (!isValidVideoId(id)) {
    return NextResponse.json({ error: 'Invalid YouTube video id' }, { status: 400 })
  }

  try {
    const tryFetch = async (preferredLang?: string) => {
      const items = await YoutubeTranscript.fetchTranscript(id, preferredLang ? { lang: preferredLang } : undefined)
      const transcript = items.map((t) => t.text).join(' ').replace(/\s+/g, ' ').trim()
      return { items, transcript }
    }

    // Try preferred language first, then fall back to auto.
    let items: Awaited<ReturnType<typeof YoutubeTranscript.fetchTranscript>> = []
    let transcript = ''

    if (lang) {
      try {
        ;({ items, transcript } = await tryFetch(lang))
      } catch {
        // fall through to auto
      }
    }
    if (!transcript) {
      ;({ items, transcript } = await tryFetch(undefined))
    }

    if (!transcript) {
      return NextResponse.json(
        {
          error:
            'Transcript not available for this video (it may be disabled, unavailable in your region, or blocked by YouTube).',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id,
      lang: lang ?? null,
      transcript,
      segments: items,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'

    // The library sometimes throws plain Error instances; match on message as a fallback.
    if (err instanceof YoutubeTranscriptTooManyRequestError || /too many request/i.test(message)) {
      return NextResponse.json(
        { error: 'YouTube is rate-limiting transcript requests. Please try again shortly.' },
        { status: 429 }
      )
    }
    if (/video unavailable/i.test(message)) {
      return NextResponse.json({ error: 'Video unavailable' }, { status: 404 })
    }
    if (/transcript is disabled/i.test(message)) {
      return NextResponse.json({ error: 'Transcripts are disabled for this video' }, { status: 404 })
    }
    if (/not available/i.test(message)) {
      return NextResponse.json({ error: 'Transcript not available for this video' }, { status: 404 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

