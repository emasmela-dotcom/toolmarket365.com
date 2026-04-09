'use client'

import { useState, useRef } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { Copy, Check, Globe, Music } from 'lucide-react';

interface PlatformOutput {
  platform: string
  content: string
  characterCount: number
  copied: boolean
}

const platformLimits: Record<string, number> = {
  instagram: 2200,
  tiktok: 2200,
  youtube: 5000,
  twitter: 280,
  linkedin: 3000,
  facebook: 63206,
}

function OneInputManyOutputsContent() {
  const [input, setInput] = useState('')
  const [tone, setTone] = useState('professional')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    'instagram',
    'tiktok',
    'youtube',
    'twitter',
    'linkedin',
    'facebook',
  ])
  const [outputs, setOutputs] = useState<PlatformOutput[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return
    const file = files[0]
    const reader = new FileReader()
    reader.onload = (e) => {
      let text = ''
      if (file.type === 'application/pdf') {
        text = '[PDF] ' + file.name + ' — Paste text manually'
      } else if (file.type.startsWith('audio/')) {
        text = '[Audio] ' + file.name + ' — Paste transcript manually'
      } else {
        text = (e.target?.result as string) || ''
      }
      setInput((prev) => (prev ? prev + '\n\n' + text : text))
    }
    if (file.type.startsWith('text') || file.type === 'application/pdf') {
      reader.readAsText(file)
    } else {
      reader.readAsText(file)
    }
  }

  const extractHashtags = (text: string): string[] => {
    const words = text.split(/\s+/).filter((w) => w.length > 4)
    return words.slice(0, 10).map((w) => `#${w.replace(/[^a-z0-9]/gi, '').toLowerCase()}`)
  }

  const generatePlatformContent = (platform: string, full: string, summary: string): string => {
    const hashtags = extractHashtags(full)
    const hooks: Record<string, string[]> = {
      professional: ['💡 Key insight:', '🚀 Here\'s what works:', '📊 The data shows:'],
      casual: ['Real talk:', 'Okay but hear me out:', 'Just a thought 💭'],
      inspirational: ['Let this sink in 🌟', 'You got this 💪', 'Remember:'],
    }
    const hook = hooks[tone as keyof typeof hooks]?.[0] ?? hooks.professional[0]

    switch (platform) {
      case 'instagram':
        return `${hook}\n\n${summary.slice(0, 150)}\n\n${summary.slice(150, 300) || ''}\n\n💬 What do you think?\n\n${hashtags.slice(0, 5).join(' ')}`
      case 'tiktok':
        return `HOOK (0–3s):\n${hook} ${summary.slice(0, 50)}\n\nSCENE 1 (3–15s):\n${summary.slice(50, 150)}\n\nSCENE 2 (15–45s):\n${summary.slice(150, 300)}\n\nCTA (45–60s):\nFollow for more.\n\n${hashtags.slice(0, 3).join(' ')}`
      case 'youtube':
        return `TITLE:\n${summary.slice(0, 60)}\n\nDESCRIPTION:\n${summary}\n\n${hashtags.slice(0, 5).join(' ')}`
      case 'twitter': {
        const short = summary.slice(0, 250)
        return `${short}\n\n${hashtags.slice(0, 2).join(' ')}`
      }
      case 'linkedin':
        return `${hook}\n\n${summary}\n\nKey takeaways:\n• ${summary.split(' ').slice(0, 15).join(' ')}\n• ${summary.split(' ').slice(15, 30).join(' ')}\n\nWhat's your experience? 👇`
      case 'facebook':
        return `${summary}\n\n💬 What are your thoughts?\n\n${hashtags.slice(0, 3).join(' ')}`
      default:
        return summary
    }
  }

  const handleGenerate = () => {
    const raw = input.trim()
    if (!raw) {
      alert('Add your content first (paste text or drop a file)')
      return
    }
    if (selectedPlatforms.length === 0) {
      alert('Select at least one platform')
      return
    }

    setIsGenerating(true)
    const words = raw.split(/\s+/)
    const summary = words.slice(0, Math.ceil(words.length * 0.35)).join(' ')

    setTimeout(() => {
      const newOutputs: PlatformOutput[] = selectedPlatforms.map((platform) => {
        const content = generatePlatformContent(platform, raw, summary)
        return {
          platform,
          content,
          characterCount: content.length,
          copied: false,
        }
      })
      setOutputs(newOutputs)
      setIsGenerating(false)
    }, 800)
  }

  const handleCopy = async (platform: string) => {
    const o = outputs.find((x) => x.platform === platform)
    if (!o) return
    await navigator.clipboard.writeText(o.content)
    setOutputs((prev) => prev.map((x) => (x.platform === platform ? { ...x, copied: true } : x)))
    setTimeout(() => {
      setOutputs((prev) => prev.map((x) => (x.platform === platform ? { ...x, copied: false } : x)))
    }, 2000)
  }

  const handleCopyAll = async () => {
    const all = outputs.map((o) => `=== ${o.platform.toUpperCase()} ===\n\n${o.content}\n\n`).join('\n')
    await navigator.clipboard.writeText(all)
    alert('All content copied.')
  }

  const handleDownload = () => {
    const md = outputs.map((o) => `## ${o.platform}\n\n${o.content}`).join('\n\n---\n\n')
    const blob = new Blob([`# One Input → Many Outputs\n\n${md}`], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'one-input-many-outputs.md'
    a.click()
  }

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, typeof Copy> = {
      instagram: Instagram,
      tiktok: Music,
      youtube: Youtube,
      twitter: Twitter,
      linkedin: Linkedin,
      facebook: Facebook,
    }
    return icons[platform] ?? Copy
  }

  const getPlatformColor = (platform: string): string => {
    const colors: Record<string, string> = {
      instagram: 'bg-gradient-to-r from-pink-500 to-purple-600',
      tiktok: 'bg-mono-900',
      youtube: 'bg-red-600',
      twitter: 'bg-blue-400',
      linkedin: 'bg-blue-700',
      facebook: 'bg-blue-600',
    }
    return colors[platform] ?? 'bg-mono-500'
  }

  const platformLabels: Record<string, string> = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    twitter: 'Twitter / X',
    linkedin: 'LinkedIn',
    facebook: 'Facebook',
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 p-4 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">One Input → Many Outputs</h1>
        <p className="text-mono-600 dark:text-mono-400">
          Paste or drop one piece of content. Get platform-ready copy for every channel you choose.
        </p>
      </div>

      {/* How to use */}
      <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
        <h2 className="text-lg font-bold text-mono-950 dark:text-mono-50 mb-3">How to Use</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm text-mono-700 dark:text-mono-300">
          <li>Add your content: paste text or drag & drop a file (blog, article, transcript, etc.)</li>
          <li>Pick tone and which platforms you want</li>
          <li>Click <strong>Generate</strong> — you get one output per platform</li>
          <li>Copy per platform, copy all, or download as markdown</li>
        </ol>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full max-w-xs p-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="inspirational">Inspirational</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Your content (one input)</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              handleFiles(e.dataTransfer.files)
            }}
            className={`border-2 border-dashed rounded-lg p-4 mb-2 cursor-pointer text-center text-sm text-mono-500 dark:text-mono-400 ${
              isDragging ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20' : 'border-mono-300 dark:border-mono-700'
            }`}
          >
            Drop a file here or click to browse
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="text/*,.txt,.pdf"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your content here… (blog, article, transcript, idea…)"
            rows={8}
            className="w-full p-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-800 text-mono-950 dark:text-mono-50 resize-y"
          />
          <p className="text-xs text-mono-500 mt-1">{input.length} characters</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Platforms (select all you want)</label>
          <div className="flex flex-wrap gap-2">
            {(['instagram', 'tiktok', 'youtube', 'twitter', 'linkedin', 'facebook'] as const).map((platform) => {
              const Icon = getPlatformIcon(platform)
              const on = selectedPlatforms.includes(platform)
              return (
                <label
                  key={platform}
                  className={`flex items-center gap-2 px-3 py-2 border-2 rounded-lg cursor-pointer transition-colors ${
                    on ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20' : 'border-mono-200 dark:border-mono-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() =>
                      setSelectedPlatforms((prev) =>
                        on ? prev.filter((p) => p !== platform) : [...prev, platform]
                      )
                    }
                    className="w-4 h-4 text-accent-600 rounded"
                  />
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{platformLabels[platform]}</span>
                </label>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !input.trim() || selectedPlatforms.length === 0}
          className="w-full py-3 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating…' : `Generate for ${selectedPlatforms.length} platform${selectedPlatforms.length !== 1 ? 's' : ''}`}
        </button>
      </div>

      {/* Outputs */}
      {outputs.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Outputs</h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopyAll}
                className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-600 text-sm font-medium"
              >
                Copy all
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded-lg hover:bg-mono-300 dark:hover:bg-mono-600 text-sm font-medium"
              >
                Download .md
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outputs.map((o) => {
              const Icon = getPlatformIcon(o.platform)
              const limit = platformLimits[o.platform]
              const overLimit = o.characterCount > limit
              return (
                <div
                  key={o.platform}
                  className="bg-white dark:bg-mono-900 rounded-lg border border-mono-200 dark:border-mono-700 overflow-hidden"
                >
                  <div className={`${getPlatformColor(o.platform)} text-white p-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <span className="font-semibold">{platformLabels[o.platform]}</span>
                    </div>
                    <span className="text-xs opacity-90">
                      {o.characterCount}/{limit}
                    </span>
                  </div>
                  <div className="p-4">
                    <pre className="whitespace-pre-wrap text-sm text-mono-700 dark:text-mono-300 font-sans bg-mono-50 dark:bg-mono-800 rounded p-3 min-h-[140px] max-h-[280px] overflow-y-auto">
                      {o.content}
                    </pre>
                    <div className="flex items-center justify-between mt-2">
                      {overLimit ? (
                        <span className="text-xs text-red-600 dark:text-red-400">Over limit</span>
                      ) : (
                        <span className="text-xs text-green-600 dark:text-green-400">Within limit</span>
                      )}
                      <button
                        onClick={() => handleCopy(o.platform)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-mono-100 dark:bg-mono-800 rounded hover:bg-mono-200 dark:hover:bg-mono-700 text-sm"
                      >
                        {o.copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function OneInputManyOutputsPage() {
  const toolDescription =
    'One input → many outputs. Paste or drop one piece of content and get platform-ready copy for Instagram, TikTok, YouTube, Twitter, LinkedIn, and Facebook in one go.'
  const howToUse = (
    <ol className="list-decimal list-inside space-y-1 ml-2">
      <li>Add your content (paste or drop a file)</li>
      <li>Choose tone and platforms</li>
      <li>Click Generate to get one output per platform</li>
      <li>Copy per platform, copy all, or download as markdown</li>
    </ol>
  )

  return (
    <ToolAccessGate
      toolSlug="one-input-many-outputs"
      toolName="One Input → Many Outputs"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <OneInputManyOutputsContent />
    </ToolAccessGate>
  )
}
