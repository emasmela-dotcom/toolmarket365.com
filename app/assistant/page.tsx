'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquare, Send, Loader2 } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function AssistantPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsKey, setNeedsKey] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)
    setError(null)
    setNeedsKey(false)

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: text }].map((m) => ({ role: m.role, content: m.content }))
        })
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/login?redirect=/assistant')
          return
        }
        if (data.needsKey) setNeedsKey(true)
        setError(data.error || 'Something went wrong.')
        setMessages((prev) => prev.slice(0, -1))
        setInput(text)
        return
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || '' }])
    } catch {
      setError('Network error. Try again.')
      setMessages((prev) => prev.slice(0, -1))
      setInput(text)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-8 w-8 text-accent-600 dark:text-accent-400" />
          <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">CreatorFlow Assistant</h1>
        </div>
        <p className="text-mono-600 dark:text-mono-400 mb-2 text-sm">
          Ask about CreatorFlow365 (plans, credits, tools) or general creator advice. I can&apos;t post, schedule, or connect to external APIs—I&apos;ll point you to the right tool.
        </p>
        <p className="text-mono-500 dark:text-mono-500 mb-6 text-sm">
          <strong>An account is required to use the Assistant.</strong> Sign in or sign up to get started.
        </p>

        <div className="border border-mono-200 dark:border-mono-700 rounded-lg bg-white dark:bg-mono-900 min-h-[320px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !loading && (
              <p className="text-mono-500 dark:text-mono-400 text-sm">Ask a question to get started.</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === 'user' ? 'text-right' : 'text-left'}
              >
                <span
                  className={
                    m.role === 'user'
                      ? 'inline-block px-3 py-2 rounded-lg bg-accent-100 dark:bg-accent-900/40 text-accent-900 dark:text-accent-100 text-sm'
                      : 'inline-block px-3 py-2 rounded-lg bg-mono-100 dark:bg-mono-800 text-mono-900 dark:text-mono-100 text-sm'
                  }
                >
                  {m.content}
                </span>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-mono-500 dark:text-mono-400 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking…</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {error && (
            <div className="px-4 pb-2 text-sm text-red-600 dark:text-red-400">
              {error}
              {needsKey && (
                <span>
                  {' '}
                  Add your OpenAI key in <a href="/dashboard" className="underline">Dashboard</a> (e.g. Caption Bot or API Keys), or set OPENAI_API_KEY in env.
                </span>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 border-t border-mono-200 dark:border-mono-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about CreatorFlow365 or creator tips..."
                className="flex-1 px-3 py-2 rounded-lg border border-mono-200 dark:border-mono-700 bg-white dark:bg-mono-950 text-mono-900 dark:text-mono-100 text-sm placeholder:text-mono-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2 rounded-lg bg-accent-600 text-white hover:bg-accent-700 disabled:opacity-50 flex items-center gap-1"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
