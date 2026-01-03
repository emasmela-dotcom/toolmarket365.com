'use client'

import { useState, useEffect, useRef } from 'react'

const DB_KEY = 'contentLib'

interface LibraryItem {
  id: number
  type: string
  title: string
  body: string
  tags: string[]
  fileName: string
  data: string
  star: boolean
  ts: number
}

export default function ContentLibrary() {
  const [db, setDb] = useState<LibraryItem[]>([])
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [starredOnly, setStarredOnly] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(DB_KEY)
    if (stored) {
      setDb(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  }, [db])

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const item: LibraryItem = {
          id: Date.now() + Math.random(),
          type: file.type || 'file',
          title: file.name.replace(/\.[^/.]+$/, ''),
          body: '',
          tags: [],
          fileName: file.name,
          data: e.target?.result as string,
          star: false,
          ts: Date.now()
        }
        setDb(prev => [...prev, item])
      }
      reader.readAsDataURL(file)
    })
  }

  const addURL = () => {
    const url = prompt('Paste URL (Google Doc, YouTube, etc.):')
    if (!url) return
    try {
      const hostname = new URL(url).hostname
      const item: LibraryItem = {
        id: Date.now() + Math.random(),
        type: 'url',
        title: hostname,
        body: '',
        tags: [],
        fileName: '',
        data: url,
        star: false,
        ts: Date.now()
      }
      setDb(prev => [...prev, item])
    } catch {
      alert('Invalid URL')
    }
  }

  const addText = () => {
    const title = prompt('Title:')
    if (!title) return
    const body = prompt('Body (optional):') || ''
    const tagsInput = prompt('Tags (comma separated)') || ''
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    
    const item: LibraryItem = {
      id: Date.now() + Math.random(),
      type: 'text',
      title,
      body,
      tags,
      fileName: '',
      data: '',
      star: false,
      ts: Date.now()
    }
    setDb(prev => [...prev, item])
  }

  const toggleStar = (id: number) => {
    setDb(prev => prev.map(item => 
      item.id === id ? { ...item, star: !item.star } : item
    ))
  }

  const filteredItems = db.filter(item => {
    if (starredOnly && !item.star) return false
    if (filterTag && !item.tags.includes(filterTag)) return false
    if (search) {
      const searchLower = search.toLowerCase()
      const searchable = `${item.title}${item.body}${item.tags.join(' ')}`.toLowerCase()
      if (!searchable.includes(searchLower)) return false
    }
    return true
  })

  const allTags = [...new Set(db.flatMap(i => i.tags))].sort()

  const handleExportCSV = () => {
    const rows = ['ID,Title,Body,Tags,Type,Star,Timestamp']
    db.forEach(i => {
      rows.push([
        i.id,
        i.title,
        i.body,
        i.tags.join(';'),
        i.type,
        i.star,
        i.ts
      ].map(v => `"${v}"`).join(','))
    })
    const csv = rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'library.csv'
    a.click()
  }

  const handleExportJSON = () => {
    const zip: Record<string, string> = {}
    db.forEach((item, idx) => {
      const ext = item.fileName.includes('.') ? item.fileName.split('.').pop() : 'txt'
      const key = item.title.replace(/[^a-z0-9]/gi, '_') + '_' + idx + '.' + ext
      zip[key] = item.data || item.body
    })
    const json = JSON.stringify(zip, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'content_library.json'
    a.click()
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 text-mono-950 dark:text-mono-50 p-4 max-w-6xl mx-auto">
      <header className="flex gap-4 flex-wrap items-center mb-4">
        <h1 className="text-2xl font-bold m-0">Content Library</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, tag, text…"
          className="flex-1 px-4 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        />
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="px-4 py-2 text-sm border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        >
          <option value="">All tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
        <button
          onClick={() => setStarredOnly(!starredOnly)}
          className={`px-4 py-2 rounded ${starredOnly ? 'bg-accent-600 text-white' : 'bg-mono-200 dark:bg-mono-700'} text-sm`}
        >
          ⭐ Starred
        </button>
        <button
          onClick={handleExportJSON}
          className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
        >
          Export JSON
        </button>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-mono-200 dark:bg-mono-700 rounded hover:bg-mono-300 dark:hover:bg-mono-600 text-sm"
        >
          Export CSV
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
        Drag & drop files or click to select<br />
        <small className="text-mono-500">Images, PDFs, videos, docs, URLs…</small>
        <div className="mt-4 flex gap-2 justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation()
              addURL()
            }}
            className="px-4 py-2 bg-accent-600 text-white rounded text-sm"
          >
            Add URL
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              addText()
            }}
            className="px-4 py-2 bg-accent-600 text-white rounded text-sm"
          >
            Add Text
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-mono-100 dark:bg-mono-900 rounded-lg p-4 text-sm flex flex-col gap-2">
            <div
              onClick={() => toggleStar(item.id)}
              className="cursor-pointer text-lg"
            >
              {item.star ? '⭐' : '☆'}
            </div>
            <strong className="text-base">{item.title || 'Untitled'}</strong>
            {item.body && <div>{item.body}</div>}
            {item.type.startsWith('image') && (
              <img src={item.data} alt={item.title} className="max-w-full rounded" />
            )}
            {item.type.startsWith('video') && (
              <video controls src={item.data} className="max-w-full rounded" />
            )}
            {item.type === 'url' && (
              <a href={item.data} target="_blank" rel="noopener noreferrer" className="text-accent-600">
                {item.data}
              </a>
            )}
            {(item.type === 'pdf' || item.type === 'file') && (
              <small className="text-mono-500">📄 {item.fileName}</small>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {item.tags.map((tag, idx) => (
                <span key={idx} className="bg-mono-200 dark:bg-mono-800 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-mono-500">
          No items found. Add files, URLs, or text to get started.
        </div>
      )}
    </div>
  )
}

