'use client'

import { useState } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'

const formats = ['How-To', 'Listicle', 'Comparison', 'Story', 'News-jack', 'Carousel']
const angles = ['Pain-point', 'Myth-bust', 'Beginner', 'Expert', 'Case-study', 'Trend']
const difficulties = ['Easy', 'Medium', 'Hard']

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

interface Idea {
  title: string
  kw: string
  angle: string
  format: string
  diff: string
  altKW: string
}

function ContentIdeaGeneratorContent() {
  const [niche, setNiche] = useState('')
  const [count, setCount] = useState(30)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [showExport, setShowExport] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')

  const makeTitle = (niche: string, fmt: string, ang: string): string => {
    const templates = [
      `How to ${niche} like a pro (even if you're a beginner)`,
      `7 proven ${niche} hacks you haven't tried`,
      `${niche} vs traditional method: which wins?`,
      `I tried ${niche} for 30 days—here's what happened`,
      `Breaking: new ${niche} trend taking over TikTok`,
      `Swipe → 6 slides that'll change your ${niche} game`
    ]
    return rand(templates).replace(new RegExp(niche, 'gi'), niche)
  }

  const makeKW = (niche: string): string[] => {
    return [`${niche} tutorial`, `${niche} guide`, `best ${niche} tips`]
  }

  const makeIdea = (niche: string): Idea => {
    const fmt = rand(formats)
    const ang = rand(angles)
    const diff = rand(difficulties)
    const kwList = makeKW(niche)
    
    return {
      title: makeTitle(niche, fmt, ang),
      kw: kwList[0],
      angle: ang,
      format: fmt,
      diff: diff,
      altKW: kwList.slice(1).join(', ')
    }
  }

  const handleGenerate = () => {
    const trimmedNiche = niche.trim()
    if (!trimmedNiche) {
      alert('Enter a niche first')
      return
    }

    const generated: Idea[] = []
    for (let i = 0; i < count; i++) {
      generated.push(makeIdea(trimmedNiche))
    }

    setIdeas(generated)
    setShowExport(true)
  }

  const generateMarkdown = (): string => {
    const md = ideas.map(idea => {
      return `### ${idea.title}\n- KW: \`${idea.kw}\`  \n- Meta: ${idea.angle} / ${idea.format} / ${idea.diff}\n`
    }).join('\n')
    return `# Content Ideas\n\n${md}`
  }

  const generateCSV = (): string => {
    const lines = ['Title,Primary KW,Angle,Format,Difficulty']
    ideas.forEach(idea => {
      lines.push(`"${idea.title}","${idea.kw}","${idea.angle}","${idea.format}","${idea.diff}"`)
    })
    return lines.join('\n')
  }

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown())
    setCopyStatus('markdown')
    setTimeout(() => setCopyStatus(''), 1200)
  }

  const handleCopyCSV = () => {
    navigator.clipboard.writeText(generateCSV())
    setCopyStatus('csv')
    setTimeout(() => setCopyStatus(''), 1200)
  }

  const handleDownloadCSV = () => {
    const csv = generateCSV()
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ideas.csv'
    a.click()
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 p-4 max-w-5xl mx-auto">
      {/* Documentation Section */}
      <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
        <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">How to Use This Tool</h2>
        <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
          <div>
            <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
            <p>Generates content ideas based on your niche or topic. Provides creative content suggestions to help you overcome writer's block and plan your content strategy.</p>
          </div>
          <div>
            <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li><strong>Enter your niche:</strong> Type your content niche or topic (e.g., "fitness", "cooking", "marketing")</li>
              <li><strong>Click "Generate Ideas"</strong> to get content suggestions</li>
              <li><strong>Review ideas:</strong> See a list of content ideas tailored to your niche</li>
              <li><strong>Use the ideas:</strong> Copy ideas you like and use them for your content planning</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Expected Outcome</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>List of content ideas relevant to your niche</li>
              <li>Creative suggestions to inspire your content</li>
              <li>Ideas you can use immediately for posts, videos, or articles</li>
              <li>Help overcoming content creator's block</li>
            </ul>
          </div>
        </div>
      </div>

      <header className="flex gap-4 flex-wrap items-center mb-4">
        <h1 className="text-2xl font-bold m-0">Content Idea Generator</h1>
        <input
          type="text"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          placeholder="e.g. vegan baking"
          className="flex-1 px-4 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        />
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="px-4 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        >
          <option value={30}>30 ideas</option>
          <option value={60}>60 ideas</option>
        </select>
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-accent-600 text-white rounded cursor-pointer hover:opacity-90"
        >
          Generate
        </button>
      </header>

      {showExport && ideas.length > 0 && (
        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={handleCopyMarkdown}
            className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
          >
            {copyStatus === 'markdown' ? 'Copied!' : 'Copy Markdown'}
          </button>
          <button
            onClick={handleCopyCSV}
            className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
          >
            {copyStatus === 'csv' ? 'Copied!' : 'Copy CSV'}
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
          >
            Download CSV
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {ideas.map((idea, idx) => (
          <div key={idx} className="bg-mono-100 dark:bg-mono-900 rounded-lg p-4 text-sm leading-relaxed">
            <strong className="text-base text-accent-600 block mb-2">{idea.title}</strong>
            <div className="mb-2">Primary KW: <code className="bg-mono-200 dark:bg-mono-800 px-1 rounded">{idea.kw}</code></div>
            <div className="mb-2">Angle: {idea.angle} | Format: {idea.format} | Difficulty: {idea.diff}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-mono-200 dark:bg-mono-800 px-2 py-1 rounded text-xs">{idea.angle}</span>
              <span className="bg-mono-200 dark:bg-mono-800 px-2 py-1 rounded text-xs">{idea.format}</span>
              <span className="bg-mono-200 dark:bg-mono-800 px-2 py-1 rounded text-xs">{idea.diff}</span>
            </div>
            <div className="mt-2 text-xs text-mono-500">Alt KWs: {idea.altKW}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ContentIdeaGenerator() {
  const toolDescription = "Generate unlimited content ideas for your niche. Create titles, keywords, angles, formats, and difficulty levels to fuel your content calendar."
  
  const howToUse = (
    <ol className="list-decimal list-inside space-y-1 ml-2">
      <li><strong>Enter your niche:</strong> Type your content niche or topic area (e.g., "fitness", "cooking", "tech")</li>
      <li><strong>Set idea count:</strong> Choose how many content ideas to generate (default: 30)</li>
      <li><strong>Click "Generate Ideas"</strong> to create content ideas</li>
      <li><strong>Review results:</strong> Each idea includes title, keywords, angle, format, and difficulty</li>
      <li><strong>Export or copy:</strong> Export all ideas or copy individual ones to your content calendar</li>
    </ol>
  )

  return (
    <ToolAccessGate
      toolSlug="content-idea-generator"
      toolName="Content Idea Generator"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <ContentIdeaGeneratorContent />
    </ToolAccessGate>
  )
}


