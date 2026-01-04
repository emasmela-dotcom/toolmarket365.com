'use client'

import React, { useState } from 'react'

export default function VideoTranscriptGenerator() {
  const [url, setUrl] = useState('')
  const [transcript, setTranscript] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

    try {
      // Note: This requires a CORS proxy or backend service
      // For production, you would need to implement a backend endpoint
      // that fetches the transcript from YouTube's API or a transcript service
      
      // Example using a transcript service (requires backend implementation)
      const response = await fetch(`/api/transcript?id=${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch transcript')
      }

      const data = await response.json()
      setTranscript(data.transcript || 'Transcript not available for this video')
    } catch (e) {
      // Fallback: Show instructions for manual transcript
      setError(
        'Transcript fetching requires a backend service. For now, you can:\n\n' +
        '1. Use YouTube\'s built-in transcript feature (click the "..." menu on a video)\n' +
        '2. Use a service like YouTube Transcript API\n' +
        '3. Implement a backend endpoint that fetches transcripts\n\n' +
        'Video ID extracted: ' + id
      )
      setTranscript('')
    } finally {
      setIsLoading(false)
    }
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
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transcript-${extractVideoId(url) || 'video'}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
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
              onKeyPress={(e) => {
                if (e.key === 'Enter') fetchTranscript()
              }}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Paste a YouTube video URL to extract its transcript
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
              <strong>Note:</strong> This tool requires a backend service to fetch transcripts from
              YouTube. For production use, implement an API endpoint that uses YouTube's transcript
              API or a third-party service.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}


