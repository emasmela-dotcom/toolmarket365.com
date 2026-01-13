'use client'

import React, { useState } from 'react'

export default function VideoTranscriptGenerator() {
  const [mode, setMode] = useState<'fetch' | 'paste'>('fetch')
  const [url, setUrl] = useState('')
  const [transcript, setTranscript] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [rawTranscript, setRawTranscript] = useState('')
  const [sourceLabel, setSourceLabel] = useState<string | null>(null)
  const [removeBracketed, setRemoveBracketed] = useState(true)

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1].split(/[?&]/)[0]
      }
    }

    return null
  }

  const fetchTranscript = async () => {
    const u = url.trim()
    
    if (!u.includes('youtu')) {
      setError('Please enter a valid YouTube URL')
      return
    }

    const id = extractVideoId(u)
    if (!id) {
      setError('Could not extract video ID from URL')
      return
    }

    setIsLoading(true)
    setError(null)
    setTranscript('')
    setVideoId(id)

    try {
      const response = await fetch(`/api/transcript?id=${encodeURIComponent(id)}`)
      
      if (!response.ok) {
        const maybe = await response.json().catch(() => null)
        const msg = maybe?.error || 'Failed to fetch transcript'
        throw new Error(msg)
      }

      const data = await response.json()
      setTranscript(data.transcript)
    } catch (e) {
      setError((e as Error)?.message || 'Failed to fetch transcript')
      setTranscript('')
    } finally {
      setIsLoading(false)
    }
  }

  const cleanTranscript = (input: string): string => {
    const lines = input
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((l) => l.trim())

    const out: string[] = []

    const isTimestampLine = (l: string) =>
      /-->\s*\d{1,2}:\d{2}/.test(l) || /^\d{1,2}:\d{2}:\d{2}[,\.]\d{1,3}\s*-->/.test(l)

    const stripTags = (l: string) =>
      l
        .replace(/<[^>]*>/g, '')
        .replace(/\{\\an\d+\}/g, '')
        .trim()

    const isIndexLine = (l: string) => /^\d+$/.test(l)

    const isWebVttHeader = (l: string) => /^WEBVTT/i.test(l)

    const isSrtTimestampLine = (l: string) =>
      /^\d{1,2}:\d{2}:\d{2}[,\.]\d{1,3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[,\.]\d{1,3}/.test(l)

    const isNote = (l: string) => /^NOTE\b/i.test(l)

    let inNoteBlock = false
    for (const lRaw of lines) {
      const l0 = lRaw
      if (!l0) {
        inNoteBlock = false
        continue
      }

      if (isWebVttHeader(l0)) continue
      if (isNote(l0)) {
        inNoteBlock = true
        continue
      }
      if (inNoteBlock) continue

      if (isIndexLine(l0)) continue
      if (isTimestampLine(l0) || isSrtTimestampLine(l0)) continue

      let l = stripTags(l0)
      if (!l) continue

      // Remove common formatting prefixes in VTT like "align:start position:0%"
      if (/^(align|position|line|size):/i.test(l)) continue

      if (removeBracketed) {
        l = l
          .replace(/\[[^\]]+\]/g, '')
          .replace(/\([^\)]+\)/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        if (!l) continue
      }

      out.push(l)
    }

    // De-dupe consecutive repeats and collapse whitespace
    const deduped: string[] = []
    for (const l of out) {
      const prev = deduped[deduped.length - 1]
      if (prev && prev.toLowerCase() === l.toLowerCase()) continue
      deduped.push(l)
    }

    return deduped.join(' ').replace(/\s+/g, ' ').trim()
  }

  const handlePasteConvert = () => {
    setError(null)
    setTranscript('')
    const cleaned = cleanTranscript(rawTranscript)
    if (!cleaned) {
      setError('No transcript text found. If you uploaded a .vtt/.srt, make sure it contains caption lines.')
      return
    }
    setTranscript(cleaned)
  }

  const handleFile = async (file: File) => {
    setError(null)
    setTranscript('')
    setSourceLabel(file.name)
    const text = await file.text()
    setRawTranscript(text)
  }

  const copyTranscript = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript)
      alert('Transcript copied to clipboard!')
    }
  }

  const downloadTranscript = () => {
    if (transcript) {
      const blob = new Blob([transcript], { type: 'text/plain' })
      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      const base =
        mode === 'fetch'
          ? videoId || extractVideoId(url) || 'video'
          : (sourceLabel || 'transcript').replace(/\.[a-z0-9]+$/i, '') || 'transcript'
      a.download = `transcript-${base}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Documentation Section */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">What It Does</h3>
              <p>Extract transcripts from YouTube videos automatically. Get the full text content of any YouTube video for use in content creation, accessibility, SEO, or content repurposing.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter YouTube URL:</strong> Paste a YouTube video URL (supports youtu.be, youtube.com/watch, or youtube.com/embed formats)</li>
                <li><strong>Click "Get Transcript"</strong> button to extract the video ID and fetch the transcript</li>
                <li><strong>Use Transcript:</strong> View the full transcript, click "Copy" to copy to clipboard, click "Download" to save as text file, see word count for reference</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Full transcript of the YouTube video</li>
                <li>Clean, readable text format</li>
                <li>Word count displayed</li>
                <li>Easy copy and download functionality</li>
                <li>Video ID extraction confirmation</li>
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Video Transcript Generator
        </h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setMode('fetch')
              setError(null)
            }}
            className={`px-4 py-2 rounded-md text-sm border ${
              mode === 'fetch'
                ? 'bg-blue-600 border-blue-700 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Fetch from YouTube (may fail)
          </button>
          <button
            onClick={() => {
              setMode('paste')
              setError(null)
            }}
            className={`px-4 py-2 rounded-md text-sm border ${
              mode === 'paste'
                ? 'bg-blue-600 border-blue-700 text-white'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            Paste / Upload transcript
          </button>
        </div>

        {mode === 'fetch' ? (
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                YouTube URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtu.be/xxxxxx or https://www.youtube.com/watch?v=xxxxxx"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') fetchTranscript()
                }}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Note: YouTube often blocks automated transcript fetching even when CC exists. Use “Paste / Upload” if this fails.
              </p>
            </div>

            <button
              onClick={fetchTranscript}
              disabled={isLoading || !url.trim()}
              className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              {isLoading ? 'Fetching Transcript...' : 'Get Transcript'}
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Upload (.vtt / .srt / .txt)
                </label>
                <input
                  type="file"
                  accept=".vtt,.srt,.txt,text/plain"
                  className="w-full text-sm text-gray-700 dark:text-gray-200"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) void handleFile(f)
                  }}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tip: You can copy YouTube’s transcript and paste it below, or upload caption files.
                </p>
              </div>

              <div className="flex items-end gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={removeBracketed}
                    onChange={(e) => setRemoveBracketed(e.target.checked)}
                  />
                  Remove bracketed cues (e.g. [Music])
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Paste transcript / captions
              </label>
              <textarea
                value={rawTranscript}
                onChange={(e) => setRawTranscript(e.target.value)}
                rows={10}
                placeholder="Paste raw transcript text, or caption file contents (VTT/SRT)..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-vertical"
              />
              {sourceLabel && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Loaded: {sourceLabel}</p>
              )}
            </div>

            <button
              onClick={handlePasteConvert}
              disabled={!rawTranscript.trim()}
              className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
            >
              Clean &amp; Format Transcript
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200 whitespace-pre-line">
              {error}
            </p>
          </div>
        )}

        {transcript && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Transcript
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyTranscript}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={downloadTranscript}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
            <textarea
              id="out"
              value={transcript}
              readOnly
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-vertical"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {transcript.split(/\s+/).length} words
            </p>
          </div>
        )}

        {!transcript && !error && (
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
              How it works:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
              <li>Paste a YouTube video URL</li>
              <li>Click "Get Transcript" to extract the transcript</li>
              <li>Copy or download the transcript for your use</li>
            </ul>
            <p className="mt-4 text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Some videos do not provide transcripts, and YouTube may rate-limit requests.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


