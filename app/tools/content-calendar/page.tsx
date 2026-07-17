'use client'

import { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Post {
  id: string
  title: string
  text: string
  status: 'draft' | 'sched' | 'pub'
  tags: string
  date: string
  time: string
}

const copy = {
  en: {
    toolName: 'Content Calendar',
    toolDescription:
      'Plan, schedule, and manage your content across multiple platforms. Create posts, set publication dates, track status (draft, scheduled, published), and export to calendar formats.',
    howToUse: [
      { label: 'Create post:', text: 'Click on a date or use "New Post" to add content' },
      { label: 'Fill details:', text: 'Enter title, text, date, time, status, and tags' },
      { label: 'View calendar:', text: 'Switch between month and week views to see your content schedule' },
      { label: 'Edit posts:', text: 'Click on any post to edit or delete it' },
      { label: 'Export:', text: 'Export your calendar to .ics format for external calendar apps' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Manages your content calendar with posts organized by date. View content in month or week view, search for posts, and track your content schedule visually.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Select view:', text: 'Choose Month or Week view from the dropdown' },
      { label: 'Navigate dates:', text: 'Use arrow buttons to move between months/weeks' },
      { label: 'Add content:', text: 'Click on a date cell to add a new post with title, text, and tags' },
      { label: 'Search content:', text: 'Use the search box to find posts by title, text, or tags' },
      { label: 'View posts:', text: 'See all scheduled posts displayed on their respective dates' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Visual calendar showing all your content',
      'Month and week view options',
      'Posts organized by date',
      'Search functionality to find specific posts',
      'Local storage - All content saved in browser',
    ],
    title: 'Content Calendar',
    month: 'Month',
    week: 'Week',
    today: 'Today',
    searchPlaceholder: 'Search posts…',
    exportIcs: 'Export .ics',
    editPost: 'Edit Post',
    newPost: 'New Post',
    titleRequired: 'Title (required)',
    captionPlaceholder: 'Caption / notes',
    draft: 'Draft',
    scheduled: 'Scheduled',
    published: 'Published',
    tagsPlaceholder: 'Platforms: twitter, ig, linkedin…',
    save: 'Save',
    delete: 'Delete',
    cancel: 'Cancel',
    titleRequiredAlert: 'Title required',
  },
  es: {
    toolName: 'Calendario de contenido',
    toolDescription:
      'Planifica, programa y gestiona tu contenido en varias plataformas. Crea publicaciones, define fechas, controla el estado (borrador, programado, publicado) y exporta a formatos de calendario.',
    howToUse: [
      { label: 'Crear publicación:', text: 'Haz clic en una fecha o usa "Nueva publicación" para añadir contenido' },
      { label: 'Completa detalles:', text: 'Ingresa título, texto, fecha, hora, estado y etiquetas' },
      { label: 'Ver calendario:', text: 'Alterna entre vista mensual y semanal para ver tu programación' },
      { label: 'Editar publicaciones:', text: 'Haz clic en cualquier publicación para editarla o eliminarla' },
      { label: 'Exportar:', text: 'Exporta tu calendario en formato .ics para apps externas' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Gestiona tu calendario de contenido con publicaciones organizadas por fecha. Visualiza en vista mensual o semanal, busca publicaciones y sigue tu programación de forma visual.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Selecciona vista:', text: 'Elige vista Mensual o Semanal en el menú desplegable' },
      { label: 'Navega fechas:', text: 'Usa las flechas para moverte entre meses/semanas' },
      { label: 'Añade contenido:', text: 'Haz clic en una celda de fecha para añadir una publicación con título, texto y etiquetas' },
      { label: 'Busca contenido:', text: 'Usa el cuadro de búsqueda para encontrar publicaciones por título, texto o etiquetas' },
      { label: 'Ver publicaciones:', text: 'Consulta todas las publicaciones programadas en sus fechas' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Calendario visual con todo tu contenido',
      'Opciones de vista mensual y semanal',
      'Publicaciones organizadas por fecha',
      'Búsqueda para encontrar publicaciones específicas',
      'Almacenamiento local: todo el contenido se guarda en el navegador',
    ],
    title: 'Calendario de contenido',
    month: 'Mes',
    week: 'Semana',
    today: 'Hoy',
    searchPlaceholder: 'Buscar publicaciones…',
    exportIcs: 'Exportar .ics',
    editPost: 'Editar publicación',
    newPost: 'Nueva publicación',
    titleRequired: 'Título (obligatorio)',
    captionPlaceholder: 'Pie de foto / notas',
    draft: 'Borrador',
    scheduled: 'Programado',
    published: 'Publicado',
    tagsPlaceholder: 'Plataformas: twitter, ig, linkedin…',
    save: 'Guardar',
    delete: 'Eliminar',
    cancel: 'Cancelar',
    titleRequiredAlert: 'El título es obligatorio',
  },
}

type Copy = (typeof copy)[keyof typeof copy]

function ContentCalendarContent({ c }: { c: Copy }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    time: '',
    status: 'draft' as 'draft' | 'sched' | 'pub',
    tags: '',
  })
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const msDay = 24 * 60 * 60 * 1000

  useEffect(() => {
    const saved = localStorage.getItem('cc_posts')
    if (saved) {
      setPosts(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cc_posts', JSON.stringify(posts))
  }, [posts])

  const formatYMD = (dt: Date): string => dt.toISOString().slice(0, 10)

  const formatICalDate = (dt: Date): string =>
    dt.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'

  const getMonthDays = (d: Date): Date[] => {
    const y = d.getFullYear()
    const m = d.getMonth()
    const first = new Date(y, m, 1)
    const start = new Date(first)
    start.setDate(start.getDate() - first.getDay())
    const days: Date[] = []
    for (let i = 0; i < 42; i++) {
      days.push(new Date(start.getTime() + i * msDay))
    }
    return days
  }

  const getWeekDays = (d: Date): Date[] => {
    const start = new Date(d)
    start.setDate(d.getDate() - d.getDay())
    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      days.push(new Date(start.getTime() + i * msDay))
    }
    return days
  }

  const days = viewMode === 'month' ? getMonthDays(currentDate) : getWeekDays(currentDate)
  const today = formatYMD(new Date())

  const statusLabel = (status: Post['status']) => {
    if (status === 'draft') return c.draft
    if (status === 'sched') return c.scheduled
    return c.published
  }

  const openModal = (date?: string, id?: string) => {
    setEditingId(id || null)
    if (id) {
      const p = posts.find((x) => x.id === id)
      if (p) {
        setFormData({
          title: p.title,
          text: p.text || '',
          time: p.time || '',
          status: p.status,
          tags: p.tags || '',
        })
      }
    } else {
      setFormData({
        title: '',
        text: '',
        time: date ? `${date}T10:00` : '',
        status: 'draft',
        tags: '',
      })
    }
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
  }

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert(c.titleRequiredAlert)
      return
    }

    if (editingId) {
      setPosts(
        posts.map((p) =>
          p.id === editingId ? { ...p, ...formData, date: formData.time.slice(0, 10) } : p
        )
      )
    } else {
      const newPost: Post = {
        id: Date.now().toString(),
        ...formData,
        date: formData.time.slice(0, 10),
      }
      setPosts([...posts, newPost])
    }
    closeModal()
  }

  const handleDelete = () => {
    if (editingId) {
      setPosts(posts.filter((p) => p.id !== editingId))
      closeModal()
    }
  }

  const handleDragStart = (id: string) => setDraggedId(id)

  const handleDrop = (date: string) => {
    if (draggedId) {
      const post = posts.find((p) => p.id === draggedId)
      if (post) {
        const newTime = post.time ? `${date}T${post.time.slice(11)}` : `${date}T10:00`
        setPosts(posts.map((p) => (p.id === draggedId ? { ...p, date, time: newTime } : p)))
      }
      setDraggedId(null)
    }
  }

  const handleExport = () => {
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Content Calendar//EN']
    posts.filter((p) => p.time).forEach((p) => {
      ics.push('BEGIN:VEVENT')
      ics.push(`UID:${p.id}@contentcal.local`)
      ics.push(`DTSTAMP:${formatICalDate(new Date())}`)
      ics.push(`DTSTART:${formatICalDate(new Date(p.time))}`)
      ics.push(`DTEND:${formatICalDate(new Date(new Date(p.time).getTime() + msDay))}`)
      ics.push(`SUMMARY:${p.title}`)
      ics.push(`DESCRIPTION:${p.text.replace(/\n/g, '\\n')}`)
      ics.push('STATUS:CONFIRMED')
      ics.push('END:VEVENT')
    })
    ics.push('END:VCALENDAR')
    const blob = new Blob([ics.join('\r\n')], { type: 'text/calendar' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'content-calendar.ics'
    a.click()
  }

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      p.text.toLowerCase().includes(q) ||
      p.tags.toLowerCase().includes(q)
    )
  })

  const getPostsForDate = (date: string) => filteredPosts.filter((p) => p.date === date)

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 p-4">
      <div className="max-w-7xl mx-auto">
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
                {c.howToUseSteps.map((step, i) => (
                  <li key={i}>
                    <strong>{step.label}</strong> {step.text}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-mono-950 dark:text-mono-50 mb-1">{c.expectedOutcome}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {c.expectedOutcomes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <header className="flex gap-4 items-center flex-wrap mb-4">
          <h1 className="text-2xl font-bold m-0">{c.title}</h1>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'month' | 'week')}
            className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
          >
            <option value="month">{c.month}</option>
            <option value="week">{c.week}</option>
          </select>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 cursor-pointer hover:bg-mono-100 dark:hover:bg-mono-800"
          >
            {c.today}
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={c.searchPlaceholder}
            className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 flex-1 min-w-[200px]"
          />
          <button
            onClick={handleExport}
            className="px-3 py-2 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 cursor-pointer hover:bg-mono-100 dark:hover:bg-mono-800"
          >
            {c.exportIcs}
          </button>
        </header>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const dateStr = formatYMD(day)
            const isToday = dateStr === today
            const dayPosts = getPostsForDate(dateStr)
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()

            return (
              <div
                key={idx}
                className={`bg-mono-100 dark:bg-mono-900 border border-mono-300 dark:border-mono-700 min-h-[90px] p-1 relative text-sm overflow-hidden ${
                  !isCurrentMonth ? 'opacity-50' : ''
                } ${isToday ? 'border-2 border-accent-600' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(dateStr)}
                onClick={() => {
                  if (!dayPosts.length) {
                    openModal(dateStr)
                  }
                }}
              >
                <div className="font-semibold text-center py-1 text-xs">{day.getDate()}</div>
                {dayPosts.map((post) => (
                  <div
                    key={post.id}
                    draggable
                    onDragStart={() => handleDragStart(post.id)}
                    className={`mt-0.5 px-1 py-0.5 rounded text-xs text-white cursor-move ${
                      post.status === 'draft'
                        ? 'bg-yellow-500'
                        : post.status === 'sched'
                          ? 'bg-accent-600'
                          : 'bg-green-600'
                    }`}
                    title={`${post.text} | ${statusLabel(post.status)}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      openModal(undefined, post.id)
                    }}
                  >
                    {post.title}
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        {modalOpen && (
          <div
            className="fixed inset-0 bg-black/45 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-mono-50 dark:bg-mono-900 p-6 rounded-lg w-[90%] max-w-md flex flex-col gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold m-0">{editingId ? c.editPost : c.newPost}</h2>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={c.titleRequired}
                className="w-full p-2 my-1 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder={c.captionPlaceholder}
                className="w-full p-2 my-1 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 resize-y h-20"
              />
              <input
                type="datetime-local"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full p-2 my-1 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as 'draft' | 'sched' | 'pub' })
                }
                className="w-full p-2 my-1 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              >
                <option value="draft">{c.draft}</option>
                <option value="sched">{c.scheduled}</option>
                <option value="pub">{c.published}</option>
              </select>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder={c.tagsPlaceholder}
                className="w-full p-2 my-1 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded bg-accent-600 text-white cursor-pointer hover:opacity-90"
                >
                  {c.save}
                </button>
                {editingId && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded bg-red-600 text-white cursor-pointer hover:opacity-90"
                  >
                    {c.delete}
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-mono-300 dark:bg-mono-700 text-mono-950 dark:text-mono-50 cursor-pointer hover:opacity-90"
                >
                  {c.cancel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ContentCalendar() {
  const { language } = useLanguage()
  const c = copy[language]

  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        {c.howToUse.map((step, i) => (
          <li key={i}>
            <strong>{step.label}</strong> {step.text}
          </li>
        ))}
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="content-calendar"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <ContentCalendarContent c={c} />
    </ToolAccessGate>
  )
}
