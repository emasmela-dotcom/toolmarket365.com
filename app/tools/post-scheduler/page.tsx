'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Download } from 'lucide-react'
import { ToolAccessGate } from '@/components/ToolAccessGate'

interface PostData {
  title: string
  body: string
}

const STORE_KEY = 'postSched'
const BEST_TIMES = ['09:00', '11:30', '13:00', '15:30', '19:00'] // UTC for demo

function PostSchedulerContent() {
  const [db, setDb] = useState<Record<string, PostData>>({})
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
  const [editingSlot, setEditingSlot] = useState<string | null>(null)
  const [showQueueModal, setShowQueueModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({ title: '', body: '' })
  const [queueForm, setQueueForm] = useState({ title: '', body: '' })

  useEffect(() => {
    const stored = localStorage.getItem(STORE_KEY)
    if (stored) {
      setDb(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(db))
  }, [db])

  const isGoodTime = (d: Date, h: number): boolean => {
    const t = ('0' + h).slice(-2) + ':' + ('0' + (d.getMinutes() + 0)).slice(-2)
    return BEST_TIMES.includes(t)
  }

  const getMonthDays = (d: Date): Date[] => {
    const first = new Date(d.getFullYear(), d.getMonth(), 1)
    const start = new Date(first)
    start.setDate(start.getDate() - first.getDay())
    const out: Date[] = []
    for (let i = 0; i < 42; i++) {
      out.push(new Date(start.getTime() + i * 86400000))
    }
    return out
  }

  const getWeekDays = (d: Date): Date[] => {
    const start = new Date(d)
    start.setDate(d.getDate() - d.getDay())
    const out: Date[] = []
    for (let i = 0; i < 7; i++) {
      out.push(new Date(start.getTime() + i * 86400000))
    }
    return out
  }

  const openEdit = (slot: string) => {
    setEditingSlot(slot)
    setEditForm({
      title: db[slot]?.title || '',
      body: db[slot]?.body || ''
    })
    setShowEditModal(true)
  }

  const saveEdit = () => {
    if (!editingSlot) return
    const newDb = { ...db }
    if (editForm.title.trim()) {
      newDb[editingSlot] = { title: editForm.title.trim(), body: editForm.body.trim() }
    } else {
      delete newDb[editingSlot]
    }
    setDb(newDb)
    setShowEditModal(false)
    setEditingSlot(null)
  }

  const deleteEdit = () => {
    if (!editingSlot) return
    const newDb = { ...db }
    delete newDb[editingSlot]
    setDb(newDb)
    setShowEditModal(false)
    setEditingSlot(null)
  }

  const addQueue = () => {
    if (!queueForm.title.trim()) return

    const days = viewMode === 'month' ? getMonthDays(currentDate) : getWeekDays(currentDate)
    for (const d of days) {
      for (let h = 0; h < 24; h++) {
        if (!isGoodTime(d, h)) continue
        const slot = `${d.toISOString().slice(0, 10)}-${h}`
        if (!db[slot]) {
          setDb({ ...db, [slot]: { title: queueForm.title.trim(), body: queueForm.body.trim() } })
          setShowQueueModal(false)
          setQueueForm({ title: '', body: '' })
          return
        }
      }
    }
    alert('No empty good-time slot found')
  }

  const exportICS = () => {
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PostScheduler//EN']
    
    Object.entries(db).forEach(([slot, data]) => {
      const [date, hour] = slot.split('-')
      const start = new Date(date + 'T' + ('0' + hour).slice(-2) + ':00:00')
      const end = new Date(start.getTime() + 30 * 60000)
      
      ics.push('BEGIN:VEVENT')
      ics.push('UID:' + slot + '@postsched.local')
      ics.push('DTSTART:' + start.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z')
      ics.push('DTEND:' + end.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z')
      ics.push('SUMMARY:' + data.title)
      ics.push('DESCRIPTION:' + data.body)
      ics.push('END:VEVENT')
    })
    
    ics.push('END:VCALENDAR')
    
    const blob = new Blob([ics.join('\r\n')], { type: 'text/calendar' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'posts.ics'
    a.click()
  }

  const prevMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const nextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const days = viewMode === 'month' ? getMonthDays(currentDate) : getWeekDays(currentDate)
  const monthYear = new Date(currentDate.getFullYear(), currentDate.getMonth()).toLocaleString('en', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Documentation Section */}
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">What It Does</h3>
              <p>Calendar-based post scheduler with optimal posting time heat-map. Visualize best times to post, schedule content, and export to calendar format. Shows green cells for optimal posting times.</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>View calendar:</strong> Switch between Month and Week view. Navigate months with arrow buttons. Green cells = optimal posting times, Gray cells = other times.</li>
                <li><strong>Schedule a post:</strong> Click any cell to edit/add post. Enter title and body (optional), then click "Save". Post appears on calendar cell.</li>
                <li><strong>Queue posts:</strong> Click "Queue" button, enter title and body, then click "Add". Automatically finds first available optimal time slot.</li>
                <li><strong>Manage posts:</strong> Click any cell with a post to edit. Modify title/body or delete. Empty title removes post.</li>
                <li><strong>Export:</strong> Click "Export .ics" to download calendar file. Import into Google Calendar, Outlook, etc.</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Visual calendar showing all scheduled posts at a glance</li>
                <li>Optimal time heat-map with green cells showing best posting times</li>
                <li>Post scheduling for specific dates/times</li>
                <li>Queue system that auto-schedules to next available optimal slot</li>
                <li>Calendar export (.ics file) for external calendars</li>
                <li>All posts saved in browser local storage</li>
              </ul>
            </div>
          </div>
        </div>

        <header className="flex gap-4 flex-wrap items-center mb-6">
          <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50 m-0">Post Scheduler</h1>
          <button
            onClick={prevMonth}
            className="px-3 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded text-mono-700 dark:text-mono-300"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-mono-700 dark:text-mono-300 font-semibold">{monthYear}</span>
          <button
            onClick={nextMonth}
            className="px-3 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded text-mono-700 dark:text-mono-300"
          >
            <ChevronRight size={20} />
          </button>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'month' | 'week')}
            className="px-4 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
          <button
            onClick={() => setShowQueueModal(true)}
            className="px-4 py-2 bg-accent-600 text-white rounded hover:opacity-90 text-sm"
          >
            Queue
          </button>
          <button
            onClick={exportICS}
            className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded flex items-center gap-2 text-mono-700 dark:text-mono-300 text-sm"
          >
            <Download size={16} />
            Export .ics
          </button>
        </header>

        <div className="grid grid-cols-7 gap-1 mt-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-semibold text-sm text-center py-2 text-mono-700 dark:text-mono-300">
              {day}
            </div>
          ))}
          {days.map((d, idx) => {
            const slot = `${d.toISOString().slice(0, 10)}-${d.getHours()}`
            const isGood = isGoodTime(d, d.getHours())
            const hasPost = db[slot]
            
            return (
              <div
                key={idx}
                onClick={() => openEdit(slot)}
                className={`rounded p-2 text-center text-xs cursor-pointer relative ${
                  isGood
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-mono-200 dark:bg-mono-800 text-mono-700 dark:text-mono-300 hover:bg-mono-300 dark:hover:bg-mono-700'
                }`}
              >
                <div>{d.getDate()}</div>
                {hasPost && (
                  <div className="text-[10px] mt-1 opacity-90 truncate">{hasPost.title}</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Queue Modal */}
        {showQueueModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowQueueModal(false)}
          >
            <div
              className="bg-mono-50 dark:bg-mono-900 p-6 rounded-lg w-full max-w-md border border-mono-200 dark:border-mono-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">Queue new post</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={queueForm.title}
                  onChange={(e) => setQueueForm({ ...queueForm, title: e.target.value })}
                  placeholder="Title"
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
                <textarea
                  value={queueForm.body}
                  onChange={(e) => setQueueForm({ ...queueForm, body: e.target.value })}
                  rows={3}
                  placeholder="Body (optional)"
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addQueue}
                    className="flex-1 px-4 py-2 bg-accent-600 text-white rounded hover:opacity-90"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowQueueModal(false)}
                    className="px-4 py-2 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded hover:bg-mono-200 dark:hover:bg-mono-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="bg-mono-50 dark:bg-mono-900 p-6 rounded-lg w-full max-w-md border border-mono-200 dark:border-mono-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">Edit post</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Title"
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
                <textarea
                  value={editForm.body}
                  onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                  rows={3}
                  placeholder="Body"
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="flex-1 px-4 py-2 bg-accent-600 text-white rounded hover:opacity-90"
                  >
                    Save
                  </button>
                  <button
                    onClick={deleteEdit}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded hover:bg-mono-200 dark:hover:bg-mono-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PostScheduler() {
  const toolDescription = "Schedule social media posts with calendar view. Plan posts for specific dates and times, edit scheduled content, and export your schedule to calendar formats."
  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li><strong>Navigate calendar:</strong> Use arrows to move between months</li>
        <li><strong>Click date:</strong> Select a date to schedule a post</li>
        <li><strong>Enter content:</strong> Add title and body text for your post</li>
        <li><strong>Set time:</strong> Choose a posting time (best times are suggested)</li>
        <li><strong>Save:</strong> Click "Save" to schedule the post</li>
        <li><strong>Edit/Delete:</strong> Click on scheduled posts to edit or delete them</li>
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="post-scheduler"
      toolName="Post Scheduler"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <PostSchedulerContent />
    </ToolAccessGate>
  )
}
