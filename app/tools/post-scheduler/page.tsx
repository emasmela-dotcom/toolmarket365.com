'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface PostData {
  title: string
  body: string
}

const STORE_KEY = 'postSched'
const BEST_TIMES = ['09:00', '11:30', '13:00', '15:30', '19:00'] // UTC for demo

const copy = {
  en: {
    toolName: 'Post Scheduler',
    toolDescription:
      'Local calendar for planning posts and exporting .ics. Does not connect to Instagram, X, TikTok, LinkedIn, or YouTube APIs—copy content out or import the export into your own calendar or scheduler.',
    howToUseSteps: [
      { label: 'Navigate calendar:', text: 'Use arrows to move between months' },
      { label: 'Click a cell:', text: 'Add or edit a planned post (title/body) for that slot' },
      { label: 'Queue:', text: 'Optionally queue a draft into the next suggested slot' },
      { label: 'Export .ics:', text: 'Download and import into Google Calendar, Outlook, or another tool you use to post' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Calendar-based post scheduler with optimal posting time heat-map. Visualize best times to post, schedule content, and export to calendar format. Shows green cells for optimal posting times.',
    howToUseInner: 'How to Use',
    howToUseInnerSteps: [
      { label: 'View calendar:', text: 'Switch between Month and Week view. Navigate months with arrow buttons. Green cells = optimal posting times, Gray cells = other times.' },
      { label: 'Schedule a post:', text: 'Click any cell to edit/add post. Enter title and body (optional), then click "Save". Post appears on calendar cell.' },
      { label: 'Queue posts:', text: 'Click "Queue" button, enter title and body, then click "Add". Automatically finds first available optimal time slot.' },
      { label: 'Manage posts:', text: 'Click any cell with a post to edit. Modify title/body or delete. Empty title removes post.' },
      { label: 'Export:', text: 'Click "Export .ics" to download calendar file. Import into Google Calendar, Outlook, etc.' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Visual calendar showing all scheduled posts at a glance',
      'Optimal time heat-map with green cells showing best posting times',
      'Post scheduling for specific dates/times',
      'Queue system that auto-schedules to next available optimal slot',
      'Calendar export (.ics file) for external calendars',
      'All posts saved in browser local storage',
    ],
    title: 'Post Scheduler',
    month: 'Month',
    week: 'Week',
    queue: 'Queue',
    exportIcs: 'Export .ics',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    queueModalTitle: 'Queue new post',
    titlePlaceholder: 'Title',
    bodyOptionalPlaceholder: 'Body (optional)',
    bodyPlaceholder: 'Body',
    add: 'Add',
    close: 'Close',
    editPost: 'Edit post',
    save: 'Save',
    delete: 'Delete',
    cancel: 'Cancel',
    noEmptySlot: 'No empty good-time slot found',
  },
  es: {
    toolName: 'Programador de publicaciones',
    toolDescription:
      'Calendario local para planificar publicaciones y exportar .ics. No se conecta a las APIs de Instagram, X, TikTok, LinkedIn ni YouTube: copia el contenido o importa la exportación en tu propio calendario o programador.',
    howToUseSteps: [
      { label: 'Navegar el calendario:', text: 'Usa las flechas para cambiar de mes' },
      { label: 'Haz clic en una celda:', text: 'Añade o edita una publicación planificada (título/cuerpo) para esa franja' },
      { label: 'Cola:', text: 'Opcionalmente encola un borrador en la siguiente franja sugerida' },
      { label: 'Exportar .ics:', text: 'Descarga e importa en Google Calendar, Outlook u otra herramienta que uses para publicar' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Programador de publicaciones basado en calendario con mapa de calor de horarios óptimos. Visualiza los mejores momentos para publicar, programa contenido y exporta a formato de calendario. Las celdas verdes indican horarios óptimos.',
    howToUseInner: 'Cómo usarla',
    howToUseInnerSteps: [
      { label: 'Ver calendario:', text: 'Cambia entre vista Mes y Semana. Navega los meses con las flechas. Celdas verdes = horarios óptimos, celdas grises = otros horarios.' },
      { label: 'Programar una publicación:', text: 'Haz clic en cualquier celda para editar/añadir. Introduce título y cuerpo (opcional), luego haz clic en "Guardar". La publicación aparece en la celda.' },
      { label: 'Encolar publicaciones:', text: 'Haz clic en "Cola", introduce título y cuerpo, luego "Añadir". Encuentra automáticamente la primera franja óptima disponible.' },
      { label: 'Gestionar publicaciones:', text: 'Haz clic en una celda con publicación para editar. Modifica título/cuerpo o elimina. Un título vacío quita la publicación.' },
      { label: 'Exportar:', text: 'Haz clic en "Exportar .ics" para descargar el archivo. Impórtalo en Google Calendar, Outlook, etc.' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Calendario visual con todas las publicaciones programadas de un vistazo',
      'Mapa de calor de horarios óptimos con celdas verdes',
      'Programación de publicaciones para fechas/horas concretas',
      'Sistema de cola que programa automáticamente en la siguiente franja óptima',
      'Exportación de calendario (.ics) para calendarios externos',
      'Todas las publicaciones guardadas en el almacenamiento local del navegador',
    ],
    title: 'Programador de publicaciones',
    month: 'Mes',
    week: 'Semana',
    queue: 'Cola',
    exportIcs: 'Exportar .ics',
    days: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    queueModalTitle: 'Encolar nueva publicación',
    titlePlaceholder: 'Título',
    bodyOptionalPlaceholder: 'Cuerpo (opcional)',
    bodyPlaceholder: 'Cuerpo',
    add: 'Añadir',
    close: 'Cerrar',
    editPost: 'Editar publicación',
    save: 'Guardar',
    delete: 'Eliminar',
    cancel: 'Cancelar',
    noEmptySlot: 'No se encontró una franja óptima vacía',
  },
}

function PostSchedulerContent() {
  const { language } = useLanguage()
  const c = copy[language]
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
    alert(c.noEmptySlot)
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
  const monthYear = new Date(currentDate.getFullYear(), currentDate.getMonth()).toLocaleString(
    language === 'es' ? 'es' : 'en',
    {
      month: 'long',
      year: 'numeric'
    }
  )

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-mono-100 dark:bg-mono-900 rounded-lg p-6 mb-6 border border-mono-200 dark:border-mono-700">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.howToUseTitle}</h2>
          <div className="space-y-4 text-sm text-mono-700 dark:text-mono-300">
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.whatItDoes}</h3>
              <p>{c.whatItDoesBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.howToUseInner}</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {c.howToUseInnerSteps.map((step) => (
                  <li key={step.label}>
                    <strong>{step.label}</strong> {step.text}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.expectedOutcome}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {c.expectedOutcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <header className="flex gap-4 flex-wrap items-center mb-6">
          <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50 m-0">{c.title}</h1>
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
            <option value="month">{c.month}</option>
            <option value="week">{c.week}</option>
          </select>
          <button
            onClick={() => setShowQueueModal(true)}
            className="px-4 py-2 bg-accent-600 text-white rounded hover:opacity-90 text-sm"
          >
            {c.queue}
          </button>
          <button
            onClick={exportICS}
            className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded flex items-center gap-2 text-mono-700 dark:text-mono-300 text-sm"
          >
            <Download size={16} />
            {c.exportIcs}
          </button>
        </header>

        <div className="grid grid-cols-7 gap-1 mt-4">
          {c.days.map(day => (
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

        {showQueueModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowQueueModal(false)}
          >
            <div
              className="bg-mono-50 dark:bg-mono-900 p-6 rounded-lg w-full max-w-md border border-mono-200 dark:border-mono-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.queueModalTitle}</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={queueForm.title}
                  onChange={(e) => setQueueForm({ ...queueForm, title: e.target.value })}
                  placeholder={c.titlePlaceholder}
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
                <textarea
                  value={queueForm.body}
                  onChange={(e) => setQueueForm({ ...queueForm, body: e.target.value })}
                  rows={3}
                  placeholder={c.bodyOptionalPlaceholder}
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y"
                />
                <div className="flex gap-2">
                  <button
                    onClick={addQueue}
                    className="flex-1 px-4 py-2 bg-accent-600 text-white rounded hover:opacity-90"
                  >
                    {c.add}
                  </button>
                  <button
                    onClick={() => setShowQueueModal(false)}
                    className="px-4 py-2 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded hover:bg-mono-200 dark:hover:bg-mono-700"
                  >
                    {c.close}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="bg-mono-50 dark:bg-mono-900 p-6 rounded-lg w-full max-w-md border border-mono-200 dark:border-mono-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{c.editPost}</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder={c.titlePlaceholder}
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
                />
                <textarea
                  value={editForm.body}
                  onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                  rows={3}
                  placeholder={c.bodyPlaceholder}
                  className="w-full px-4 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="flex-1 px-4 py-2 bg-accent-600 text-white rounded hover:opacity-90"
                  >
                    {c.save}
                  </button>
                  <button
                    onClick={deleteEdit}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    {c.delete}
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded hover:bg-mono-200 dark:hover:bg-mono-700"
                  >
                    {c.cancel}
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
  const { language } = useLanguage()
  const c = copy[language]
  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        {c.howToUseSteps.map((step) => (
          <li key={step.label}>
            <strong>{step.label}</strong> {step.text}
          </li>
        ))}
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="post-scheduler"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <PostSchedulerContent />
    </ToolAccessGate>
  )
}
