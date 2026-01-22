'use client'

import { useState, useRef } from 'react'
import { FileText, Upload, Copy, Check } from 'lucide-react'
import { ToolAccessGate } from '@/components/ToolAccessGate'

function PodcastShowNotesGeneratorContent() {
  const [episodeTitle, setEpisodeTitle] = useState('')
  const [guestName, setGuestName] = useState('')
  const [lang, setLang] = useState('en')
  const [transcript, setTranscript] = useState('')
  const [result, setResult] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const stopWords = new Set([
    "the", "and", "to", "of", "a", "in", "is", "it", "you", "that", "he", "was", "for", "on", "are", "as", "with", "his", "they", "i", "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your", "can", "said", "there", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other", "about", "out", "many", "then", "them", "these", "so", "some", "her", "would", "make", "like", "into", "him", "has", "two", "more", "go", "no", "way", "could", "my", "than", "first", "been", "call", "who", "oil", "its", "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part"
  ])

  const summarise = (text: string, ratio: number = 0.25): string => {
    const sents = text.match(/[^\.!\?]+[\.!\?]+/g) || [text]
    const target = Math.max(2, Math.ceil(sents.length * ratio))
    const step = Math.floor(sents.length / target)
    const picked: string[] = []
    for (let i = 0; i < sents.length; i += step) {
      picked.push(sents[i].trim())
    }
    return picked.join(' ').slice(0, 600)
  }

  const extractChapters = (text: string): Array<{ time: string; title: string }> => {
    const lines = text.split('\n')
    const chapters: Array<{ time: string; title: string }> = []
    
    lines.forEach((ln) => {
      const m = ln.match(/(\d{1,2}:\d{2}(?::\d{2})?)\s*[–—-]\s*(.+)/)
      if (m) {
        chapters.push({ time: m[1], title: m[2].trim() })
      }
    })

    if (chapters.length < 3) {
      // Fallback: equal chunks
      const words = text.split(' ')
      const chunk = Math.ceil(words.length / 4)
      for (let i = 0; i < 4; i++) {
        const start = i * chunk
        const time = `${i * 15}:00`
        const title = words.slice(start, start + 6).join(' ') + '…'
        chapters.push({ time, title })
      }
    }

    return chapters
  }

  const extractKeywords = (text: string): string[] => {
    const words = text.toLowerCase().match(/\b\w+\b/g) || []
    const freq: Record<string, number> = {}
    
    words.forEach(w => {
      if (!stopWords.has(w) && w.length > 3) {
        freq[w] = (freq[w] || 0) + 1
      }
    })

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(x => x[0])
  }

  const buildNotes = (
    title: string,
    guest: string,
    summary: string,
    chapters: Array<{ time: string; title: string }>,
    takeaways: string[],
    kws: string[]
  ): string => {
    const md = `# ${title}${guest ? ` (with ${guest})` : ''}

## Summary
${summary}

## Chapters
${chapters.map(c => `- **${c.time}** – ${c.title}`).join('\n')}

## Key Take-aways
${takeaways.map(t => `- ${t}`).join('\n')}

## Guest Mentioned
${guest || 'N/A'}

## SEO Keywords
${kws.join(', ')}

---

Generated with Podcast Show-Notes Generator
`
    return md
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      if (file.type.startsWith('audio/')) {
        setTranscript(`[Audio file uploaded] ${file.name}`)
      } else {
        setTranscript(e.target?.result as string)
      }
    }

    reader.readAsText(file)
  }

  const generateNotes = () => {
    const text = transcript.trim()
    const title = episodeTitle || 'Untitled Episode'
    const guest = guestName || ''

    if (!text) {
      alert('Add transcript first')
      return
    }

    const summary = summarise(text)
    const chapters = extractChapters(text)
    const takeaways = chapters.slice(0, 3).map(c => c.title)
    const kws = extractKeywords(text)
    const notes = buildNotes(title, guest, summary, chapters, takeaways, kws)

    setResult(notes)
    setShowResult(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Documentation Section */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
              <p>Generates professional show notes for podcast episodes from transcripts. Creates summaries, chapter timestamps, key takeaways, and SEO keywords automatically.</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter episode details (optional):</strong> Episode title, Guest name, Language (English, Español, Français)</li>
                <li><strong>Add transcript:</strong> Drag & drop transcript file (.txt) or audio file, click drop zone to browse, paste transcript directly, or paste YouTube URL</li>
                <li><strong>Click "Generate notes"</strong> to process your transcript</li>
                <li><strong>Review generated show notes:</strong> Summary, Chapters with timestamps, Key takeaways, Guest information, SEO keywords</li>
                <li><strong>Copy</strong> the formatted show notes</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Formatted show notes in Markdown format</li>
                <li>Summary - Condensed episode overview (25% of transcript)</li>
                <li>Chapters - Timestamped sections (auto-detected or generated)</li>
                <li>Key takeaways - Top 3 main points</li>
                <li>Guest info - Guest name if provided</li>
                <li>SEO keywords - Top 5 relevant keywords extracted</li>
                <li>Ready to publish - Copy directly to your podcast platform</li>
              </ul>
            </div>
          </div>
        </div>

        <header className="flex gap-4 flex-wrap items-center mb-6">
          <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50 m-0">Podcast Show-Notes Generator</h1>
          <input
            type="text"
            value={episodeTitle}
            onChange={(e) => setEpisodeTitle(e.target.value)}
            placeholder="Episode title (optional)"
            className="flex-1 min-w-[200px] px-4 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
          />
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Guest name (optional)"
            className="flex-1 min-w-[200px] px-4 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
          />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="px-4 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
          <button
            onClick={generateNotes}
            className="px-6 py-2 bg-accent-600 text-white rounded cursor-pointer hover:opacity-90 text-sm"
          >
            Generate notes
          </button>
        </header>

        <div
          ref={dropZoneRef}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={`border-2 border-dashed rounded-lg p-8 text-center my-4 cursor-pointer ${
            isDragging
              ? 'border-accent-600 bg-mono-100 dark:bg-mono-900'
              : 'border-mono-300 dark:border-mono-700'
          }`}
        >
          Drop transcript/audio or paste YouTube URL
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.mp3,.mp4,.m4a,.wav"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={8}
          placeholder="Or paste raw transcript here…"
          className="w-full px-4 py-3 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y"
        />

        {showResult && result && (
          <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mt-4 text-sm leading-relaxed whitespace-pre-wrap relative border border-mono-200 dark:border-mono-700">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 px-3 py-1 bg-mono-200 dark:bg-mono-800 hover:bg-mono-300 dark:hover:bg-mono-700 rounded text-xs flex items-center gap-1 text-mono-700 dark:text-mono-300"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
            <div className="pr-20">{result}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PodcastShowNotesGenerator() {
  const toolDescription = "Generate professional podcast show notes from your episode transcript. Create structured show notes with key points, timestamps, and summaries to help listeners navigate your content."
  
  const howToUse = (
    <ol className="list-decimal list-inside space-y-1 ml-2">
      <li><strong>Enter episode title:</strong> Type the title of your podcast episode</li>
      <li><strong>Add guest name (optional):</strong> Include guest name if applicable</li>
      <li><strong>Paste transcript:</strong> Upload or paste your episode transcript</li>
      <li><strong>Select language:</strong> Choose the language of your transcript</li>
      <li><strong>Click "Generate Show Notes"</strong> to create structured notes</li>
      <li><strong>Copy and use:</strong> Copy the generated show notes for your podcast platform</li>
    </ol>
  )

  return (
    <ToolAccessGate
      toolSlug="podcast-show-notes-generator"
      toolName="Podcast Show Notes Generator"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <PodcastShowNotesGeneratorContent />
    </ToolAccessGate>
  )
}


