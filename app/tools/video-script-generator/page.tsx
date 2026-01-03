'use client'

import { useState } from 'react'
import { Video, Play, Copy, Check, Download } from 'lucide-react'

interface ScriptSection {
  type: string
  content: string
  duration?: string
}

export default function VideoScriptGenerator() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('youtube')
  const [length, setLength] = useState('medium')
  const [script, setScript] = useState<ScriptSection[]>([])
  const [copied, setCopied] = useState(false)

  const generateScript = () => {
    if (!topic.trim()) {
      setScript([])
      return
    }

    const lengthMap: Record<string, { sections: number; hookDuration: string; mainDuration: string }> = {
      short: { sections: 3, hookDuration: '0-3s', mainDuration: '10-15s' },
      medium: { sections: 5, hookDuration: '0-5s', mainDuration: '30-60s' },
      long: { sections: 8, hookDuration: '0-10s', mainDuration: '60-120s' }
    }

    const config = lengthMap[length]
    const sections: ScriptSection[] = []

    // Hook
    sections.push({
      type: 'Hook',
      content: `Did you know that ${topic}? In this video, I'm going to show you exactly how to master this.`,
      duration: config.hookDuration
    })

    // Introduction
    sections.push({
      type: 'Introduction',
      content: `Hey everyone! Welcome back to my channel. Today we're diving deep into ${topic}. Whether you're a beginner or looking to level up, this video has something for you.`,
      duration: config.mainDuration
    })

    // Main Content
    const mainPoints = [
      `First, let's talk about the fundamentals of ${topic}.`,
      `Next, I'll show you the most important techniques you need to know.`,
      `Then, we'll cover common mistakes people make with ${topic}.`,
      `Finally, I'll give you actionable tips you can use right away.`
    ]

    mainPoints.slice(0, config.sections - 3).forEach((point, idx) => {
      sections.push({
        type: `Point ${idx + 1}`,
        content: point,
        duration: config.mainDuration
      })
    })

    // Call to Action
    sections.push({
      type: 'Call to Action',
      content: `If this video helped you, make sure to like and subscribe for more content on ${topic}. Drop a comment below with your biggest takeaway!`,
      duration: '10-15s'
    })

    // Outro
    sections.push({
      type: 'Outro',
      content: `Thanks for watching! See you in the next video.`,
      duration: '5-10s'
    })

    setScript(sections)
  }

  const copyScript = () => {
    const text = script.map(s => 
      `[${s.type}${s.duration ? ` - ${s.duration}` : ''}]\n${s.content}\n`
    ).join('\n')
    
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyPlainText = () => {
    const text = script.map(s => s.content).join('\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadScript = () => {
    const content = script.map(s => 
      `[${s.type}${s.duration ? ` - ${s.duration}` : ''}]\n${s.content}\n`
    ).join('\n\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `video-script-${topic.replace(/\s+/g, '-').toLowerCase()}.txt`
    a.click()
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-accent-600 rounded-2xl">
              <Video className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-3">Video Script Generator</h1>
          <p className="text-xl text-mono-600 dark:text-mono-400">Generate scripts for YouTube, TikTok, and Reels</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
              <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-6">Script Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Video Topic / Title
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., How to cook pasta"
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="reels">Instagram Reels</option>
                    <option value="shorts">YouTube Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mono-700 dark:text-mono-300 mb-2">
                    Video Length
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-mono-200 dark:border-mono-700 rounded-lg focus:border-accent-500 focus:outline-none bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                  >
                    <option value="short">Short (30-60 seconds)</option>
                    <option value="medium">Medium (2-5 minutes)</option>
                    <option value="long">Long (5+ minutes)</option>
                  </select>
                </div>

                <button
                  onClick={generateScript}
                  disabled={!topic.trim()}
                  className="w-full px-6 py-4 bg-accent-600 text-white rounded-xl font-bold text-lg hover:bg-accent-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Play size={24} />
                  Generate Script
                </button>
              </div>
            </div>
          </div>

          {/* Script Output */}
          <div className="space-y-6">
            {script.length > 0 ? (
              <>
                <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50">Generated Script</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={copyScript}
                        className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 text-mono-700 dark:text-mono-300 text-sm"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        Copy
                      </button>
                      <button
                        onClick={copyPlainText}
                        className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 text-mono-700 dark:text-mono-300 text-sm"
                      >
                        <Copy size={16} />
                        Plain Text
                      </button>
                      <button
                        onClick={downloadScript}
                        className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 text-mono-700 dark:text-mono-300 text-sm"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {script.map((section, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-mono-100 dark:bg-mono-800 rounded-lg border-l-4 border-accent-600"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-accent-600">{section.type}</h3>
                          {section.duration && (
                            <span className="text-xs text-mono-500 bg-mono-200 dark:bg-mono-700 px-2 py-1 rounded">
                              {section.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-mono-700 dark:text-mono-300 leading-relaxed whitespace-pre-wrap">
                          {section.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-12 text-center h-full flex flex-col justify-center border border-mono-200 dark:border-mono-700">
                <Video className="mx-auto text-mono-300 dark:text-mono-700 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-mono-700 dark:text-mono-300 mb-3">Ready to Generate?</h3>
                <p className="text-mono-500">
                  Enter a video topic and click "Generate Script" to create your script
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

