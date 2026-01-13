'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarClock, RefreshCw, Trash2, Save, PlusCircle } from 'lucide-react'

type Status = 'draft' | 'scheduled' | 'published' | 'canceled'

type ScheduledPost = {
  id: string
  created_at: string
  updated_at: string | null
  status: Status
  platform: string
  scheduled_for: string | null
  title: string | null
  body: string
  media_urls: string[] | null
}

function dtLocalValueFromIso(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function isoFromDtLocal(v: string): string | null {
  if (!v) return null
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

export default function SocialScheduler() {
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all')

  const [form, setForm] = useState({
    platform: 'Instagram',
    status: 'draft' as Status,
    scheduledForLocal: '',
    title: '',
    body: '',
    mediaUrls: '',
  })

  const selected = useMemo(() => posts.find((p) => p.id === selectedId) || null, [posts, selectedId])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const qs = new URLSearchParams()
      if (filterStatus !== 'all') qs.set('status', filterStatus)
      qs.set('limit', '200')
      const res = await fetch(`/api/scheduled-posts?${qs.toString()}`)
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || 'Failed to load scheduled posts')
      setPosts((data?.posts as ScheduledPost[]) || [])
    } catch (e) {
      setError((e as Error)?.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus])

  const resetForm = () => {
    setSelectedId(null)
    setForm({
      platform: 'Instagram',
      status: 'draft',
      scheduledForLocal: '',
      title: '',
      body: '',
      mediaUrls: '',
    })
  }

  const startEdit = (p: ScheduledPost) => {
    setSelectedId(p.id)
    setForm({
      platform: p.platform || 'Other',
      status: p.status,
      scheduledForLocal: dtLocalValueFromIso(p.scheduled_for),
      title: p.title || '',
      body: p.body || '',
      mediaUrls: (p.media_urls || []).join(', '),
    })
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        platform: form.platform,
        status: form.status,
        scheduled_for: isoFromDtLocal(form.scheduledForLocal),
        title: form.title.trim() ? form.title.trim() : null,
        body: form.body.trim(),
        media_urls: form.mediaUrls
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      }

      if (!payload.body) throw new Error('Body is required')

      const res = selectedId
        ? await fetch(`/api/scheduled-posts/${selectedId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/scheduled-posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || 'Failed to save')

      await load()
      if (!selectedId) resetForm()
    } catch (e) {
      setError((e as Error)?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!selectedId) return
    const ok = confirm('Delete this scheduled post?')
    if (!ok) return

    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/scheduled-posts/${selectedId}`, { method: 'DELETE' })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || 'Failed to delete')
      resetForm()
      await load()
    } catch (e) {
      setError((e as Error)?.message || 'Failed to delete')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-3">How to Use This Tool</h2>
          <div className="space-y-3 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
              <p>
                A database-backed social scheduler (Neon Postgres). Create drafts, schedule posts, and keep an always-up-to-date
                list of upcoming content that persists across devices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Create a post on the left (platform, status, optional schedule time).</li>
                <li>Click a post on the right to edit it.</li>
                <li>Use the filter to see only drafts/scheduled/published.</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Neon Requirement</h3>
              <p>
                Make sure <code className="px-1 py-0.5 bg-mono-200 dark:bg-mono-800 rounded">DATABASE_URL</code> is set in{' '}
                <code className="px-1 py-0.5 bg-mono-200 dark:bg-mono-800 rounded">.env.local</code> and you’ve run{' '}
                <code className="px-1 py-0.5 bg-mono-200 dark:bg-mono-800 rounded">lib/schema.sql</code> in Neon (it now includes{' '}
                <code className="px-1 py-0.5 bg-mono-200 dark:bg-mono-800 rounded">scheduled_posts</code>).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-accent-600 rounded-2xl">
            <CalendarClock className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50">Social Scheduler</h1>
            <p className="text-mono-600 dark:text-mono-400 text-sm">Neon-backed scheduled posts</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200 whitespace-pre-line">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50">
                {selectedId ? 'Edit Post' : 'New Post'}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={resetForm}
                  className="px-3 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded text-mono-700 dark:text-mono-300 text-sm"
                >
                  <PlusCircle size={16} className="inline mr-2" />
                  New
                </button>
                <button
                  onClick={load}
                  disabled={loading}
                  className="px-3 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded text-mono-700 dark:text-mono-300 text-sm disabled:opacity-50"
                >
                  <RefreshCw size={16} className={`inline mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Platform</label>
                <select
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                >
                  {['Instagram', 'TikTok', 'YouTube', 'X (Twitter)', 'LinkedIn', 'Facebook', 'Other'].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                >
                  {['draft', 'scheduled', 'published', 'canceled'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Scheduled for</label>
                <input
                  type="datetime-local"
                  value={form.scheduledForLocal}
                  onChange={(e) => setForm({ ...form, scheduledForLocal: e.target.value })}
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
                <p className="mt-1 text-xs text-mono-500">Leave blank for drafts.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Title (optional)</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Short internal title"
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">Body</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={6}
                placeholder="Write your post..."
                className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-mono-700 dark:text-mono-300">
                Media URLs (comma-separated, optional)
              </label>
              <input
                value={form.mediaUrls}
                onChange={(e) => setForm({ ...form, mediaUrls: e.target.value })}
                placeholder="https://... , https://..."
                className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-accent-600 text-white rounded hover:opacity-90 disabled:opacity-50"
              >
                <Save size={16} className="inline mr-2" />
                {selectedId ? 'Save Changes' : 'Create Post'}
              </button>
              <button
                onClick={remove}
                disabled={!selectedId || saving}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="bg-mono-50 dark:bg-mono-900 rounded-2xl shadow-xl p-6 border border-mono-200 dark:border-mono-700">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50">Scheduled Posts</h2>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              >
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            {loading ? (
              <p className="text-sm text-mono-600 dark:text-mono-400">Loading...</p>
            ) : posts.length === 0 ? (
              <p className="text-sm text-mono-600 dark:text-mono-400">No posts yet.</p>
            ) : (
              <div className="space-y-3">
                {posts.map((p) => {
                  const isActive = p.id === selectedId
                  const when = p.scheduled_for ? new Date(p.scheduled_for).toLocaleString() : 'Not scheduled'
                  return (
                    <button
                      key={p.id}
                      onClick={() => startEdit(p)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        isActive
                          ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
                          : 'border-mono-200 dark:border-mono-700 hover:bg-mono-100 dark:hover:bg-mono-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-mono-950 dark:text-mono-50">
                            {p.title || '(Untitled)'}
                          </div>
                          <div className="text-xs text-mono-600 dark:text-mono-400 mt-1">
                            {p.platform} • {p.status} • {when}
                          </div>
                        </div>
                        <div className="text-xs text-mono-500">{p.id.slice(0, 8)}</div>
                      </div>
                      <div className="text-sm text-mono-700 dark:text-mono-300 mt-2 line-clamp-3">
                        {p.body}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {selected && (
          <p className="mt-6 text-xs text-mono-500">
            Selected: <span className="font-mono">{selected.id}</span>
            {selected.updated_at ? ` • updated ${new Date(selected.updated_at).toLocaleString()}` : ''}
          </p>
        )}
      </div>
    </div>
  )
}

