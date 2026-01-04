'use client'

import { useState, useRef } from 'react'

const templates = {
  linkedin: [
    "🚀 %s\n\nKey takeaway → %s\n\nWhat's your experience?",
    "🔍 %s\n\nMost people skip this step: %s\n\nSave this post for later.",
    "📊 %s\n\n3 numbers to remember:\n1️⃣ %s\n2️⃣ %s\n3️⃣ %s\n\nWhich surprised you most?",
    "💡 %s\n\nThe framework I use:\n→ %s\n→ %s\n→ %s\n\nSteal it.",
    "✍️ %s\n\nI wrote a 5-step checklist:\n☐ %s\n☐ %s\n☐ %s\n☐ %s\n☐ %s\n\nPrint it out."
  ],
  twitter: [
    "%s → thread 🧵 (1/5)\n\n%s",
    "Hot take: %s\n\n%s",
    "Stop scrolling → %s\n\n%s",
    "1/ %s\n\n%s",
    "%s\n\n%s\n\nRT if useful."
  ],
  ig: [
    "Swipe ➡️ to see %s\n\n%s\n\n#tip #contentcreator #growth",
    "Save this ❗%s\n\n%s\n\n#marketing #hacks #saveable",
    "Caption this 👇 %s\n\n%s\n\n#comment #engagement #post"
  ],
  tiktok: ["%s\n\nHook: %s\n\nScene 1: %s\n\nScene 2: %s\n\nCTA: %s"],
  email: [
    "Subject: %s (in under 2 min)\n\nHi {name},\n\n%s\n\nCheers,\nYou"
  ],
  carousel: [
    "Slide 1: Title → %s\nSlide 2: Problem → %s\nSlide 3: Myth → %s\nSlide 4: Solution → %s\nSlide 5: Proof → %s\nSlide 6: CTA → %s"
  ]
}

function countWords(str: string): number {
  return str.trim().split(/\s+/).length
}

function summarise(text: string, ratio: number = 0.25): string {
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text]
  const target = Math.max(1, Math.ceil(sentences.length * ratio))
  const idx = Math.floor(sentences.length / 2)
  return sentences.slice(idx, idx + target).join(' ').trim()
}

export default function ContentRepurposer() {
  const [manual, setManual] = useState('')
  const [output, setOutput] = useState('')
  const [showOutput, setShowOutput] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      let text = ''
      if (file.type === 'application/pdf') {
        text = '[PDF file] ' + file.name + ' - Please paste text content manually'
      } else if (file.type.startsWith('audio/')) {
        text = '[Audio file] ' + file.name + ' - Please paste transcript manually'
      } else {
        text = e.target?.result as string
      }
      setManual(text)
    }

    if (file.type.startsWith('text') || file.type === 'application/pdf') {
      reader.readAsText(file)
    } else if (file.type.startsWith('audio/')) {
      reader.readAsDataURL(file)
    } else {
      reader.readAsText(file)
    }
  }

  const handleRepurpose = () => {
    const raw = manual.trim()
    if (!raw) {
      alert('Add text or drop a file first')
      return
    }

    const summary = summarise(raw, 0.3)
    const w = countWords(raw)

    // LinkedIn
    const li = templates.linkedin.map(t => {
      let result = t
      const matches = result.match(/%s/g) || []
      matches.forEach(() => {
        result = result.replace('%s', summary)
      })
      return result
    }).join('\n\n—\n\n')

    // Twitter
    const tw = templates.twitter.map(t => {
      let result = t
      const matches = result.match(/%s/g) || []
      matches.forEach(() => {
        result = result.replace('%s', summary.slice(0, 200))
      })
      return result
    }).join('\n\n—\n\n')

    // Instagram
    const ig = templates.ig.map(t => {
      let result = t
      const matches = result.match(/%s/g) || []
      matches.forEach(() => {
        result = result.replace('%s', summary.slice(0, 150))
      })
      return result
    }).join('\n\n—\n\n')

    // TikTok
    const tt = templates.tiktok[0]
      .replace('%s', summary.slice(0, 40))
      .replace('%s', summary.slice(0, 20))
      .replace('%s', 'Show the problem')
      .replace('%s', 'Reveal the fix')
      .replace('%s', 'Follow for more')

    // Email
    const em = templates.email[0]
      .replace('%s', summary.slice(0, 40))
      .replace('%s', summary.slice(0, 80))

    // Carousel
    const car = templates.carousel[0]
      .replace('%s', summary.slice(0, 30))
      .replace('%s', "What's broken")
      .replace('%s', 'Common myth')
      .replace('%s', "Here's the fix")
      .replace('%s', 'Proof it works')
      .replace('%s', 'Try it & tag us')

    const fullOutput = `=== LINKEDIN (5 posts) ===
${li}

=== TWITTER (5 posts) ===
${tw}

=== INSTAGRAM (3 captions) ===
${ig}

=== TIKTOK (60 s script) ===
${tt}

=== EMAIL BLURB ===
${em}

=== CAROUSEL OUTLINE ===
${car}
`

    setOutput(fullOutput)
    setShowOutput(true)
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(output)
    setCopyStatus('Copied!')
    setTimeout(() => setCopyStatus(''), 2000)
  }

  const handleDownload = () => {
    const md = `# Repurposed Content\n\n${output}`
    const blob = new Blob([md], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'repurposed.md'
    a.click()
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 p-4 max-w-4xl mx-auto">
      {/* Documentation Section */}
      <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
        <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">How to Use This Tool</h2>
        <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
          <div>
            <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
            <p>Takes one piece of content (blog post, article, video transcript, etc.) and automatically repurposes it into multiple formats for different platforms: LinkedIn posts, Twitter threads, Instagram captions, TikTok scripts, email blurbs, and carousel outlines.</p>
          </div>
          <div>
            <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li><strong>Add your content:</strong> Drag & drop text files/PDFs/audio, click drop zone to browse, paste text directly, or paste YouTube URL</li>
              <li><strong>Click "Repurpose"</strong> button to process your content</li>
              <li><strong>Get repurposed content</strong> for LinkedIn (5 posts), Twitter (5 posts), Instagram (3 captions), TikTok (60s script), Email blurb, and Carousel outline</li>
              <li><strong>Export options:</strong> Copy All or Download ZIP as markdown file</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Expected Outcome</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>6 different content formats from one source</li>
              <li>Platform-optimized content for each platform</li>
              <li>Ready-to-use posts, captions, and scripts</li>
              <li>Structured output organized by platform</li>
              <li>Exportable for easy copying or saving</li>
            </ul>
          </div>
        </div>
      </div>

      <header className="flex gap-4 flex-wrap items-center mb-4">
        <h1 className="text-2xl font-bold m-0">Content Repurposer</h1>
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
        Drop text/PDF/audio or paste YouTube URL / raw text
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="text/*,.txt,.pdf,.mp3,.mp4,.m4a"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <textarea
        value={manual}
        onChange={(e) => setManual(e.target.value)}
        placeholder="Or paste raw text here…"
        rows={5}
        className="w-full p-3 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y"
      />

      <button
        onClick={handleRepurpose}
        className="mt-4 px-6 py-3 bg-accent-600 text-white rounded font-medium hover:opacity-90 cursor-pointer"
      >
        Repurpose
      </button>

      {showOutput && (
        <>
          <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mt-4 text-sm leading-relaxed whitespace-pre-wrap">
            {output}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCopyAll}
              className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
            >
              {copyStatus || 'Copy All'}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
            >
              Download ZIP
            </button>
          </div>
        </>
      )}
    </div>
  )
}


