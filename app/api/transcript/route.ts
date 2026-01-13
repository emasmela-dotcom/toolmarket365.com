import { NextRequest, NextResponse } from 'next/server'
import {
  YoutubeTranscript,
  YoutubeTranscriptDisabledError,
  YoutubeTranscriptNotAvailableError,
  YoutubeTranscriptTooManyRequestError,
  YoutubeTranscriptVideoUnavailableError,
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
    const items = await YoutubeTranscript.fetchTranscript(id, lang ? { lang } : undefined)
    const transcript = items.map((t) => t.text).join(' ').replace(/\s+/g, ' ').trim()

    return NextResponse.json({
      id,
      lang: lang ?? null,
      transcript,
      segments: items,
    })
  } catch (err: unknown) {
    if (err instanceof YoutubeTranscriptTooManyRequestError) {
      return NextResponse.json(
        { error: 'YouTube is rate-limiting transcript requests. Please try again shortly.' },
        { status: 429 }
      )
    }
    if (err instanceof YoutubeTranscriptVideoUnavailableError) {
      return NextResponse.json({ error: 'Video unavailable' }, { status: 404 })
    }
    if (err instanceof YoutubeTranscriptDisabledError) {
      return NextResponse.json({ error: 'Transcripts are disabled for this video' }, { status: 404 })
    }
    if (err instanceof YoutubeTranscriptNotAvailableError) {
      return NextResponse.json({ error: 'Transcript not available for this video' }, { status: 404 })
    }

    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

