'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, ExternalLink, Download, QrCode } from 'lucide-react';
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Link {
  title: string
  url: string
  views: number
  clicks: number
}

const STORE_KEY = 'linkBio'

const copy = {
  en: {
    toolName: 'Link in Bio Manager',
    toolDescription:
      'Manages your link-in-bio page by organizing links, tracking clicks and views, and generating QR codes. Create a centralized hub for all your important links and monitor their performance.',
    howToUse: [
      { label: 'Set profile:', text: 'Enter your profile name and username' },
      { label: 'Add links:', text: 'Click "Add Link" to add title and URL for each link' },
      { label: 'Manage links:', text: 'Edit, delete, or reorder your links' },
      { label: 'Track performance:', text: 'View clicks and views for each link' },
      { label: 'Generate QR code:', text: 'Create a QR code for easy sharing' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Creates and manages a single landing page that holds all your important links. Perfect for Instagram, TikTok, and Twitter bios where you can only have one link. Organize multiple links, track clicks, and export as a static page.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Add links:', text: 'Click "Add link" button, enter link title (e.g., "My Website"), enter URL, click "Save"' },
      { label: 'Manage links:', text: 'Click a link to open in new tab and track clicks, click edit icon to modify, delete to remove, drag & drop to reorder' },
      { label: 'Track performance:', text: 'View views count (page loads), view clicks count (link clicks), see which links perform best' },
      { label: 'Export:', text: 'Click "Export static page" to download HTML file, deploy to your hosting or use as-is' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Single bio link - One URL to use in all your social bios',
      'Multiple links - Organize all your important links',
      'Click tracking - See which links get the most clicks',
      'View tracking - Track how many times page is viewed',
      'Drag & drop ordering - Prioritize important links',
      'Exportable - Download as static HTML page',
    ],
    defaultName: 'Your Name',
    defaultBio: 'Short bio goes here',
    avatarAlt: 'Avatar',
    viewsClicks: (views: number, clicks: number) => `${views} views · ${clicks} clicks`,
    addLink: 'Add link',
    exportStaticPage: 'Export static page',
    editLink: 'Edit link',
    titlePlaceholder: 'Title',
    save: 'Save',
    cancel: 'Cancel',
  },
  es: {
    toolName: 'Gestor de link in bio',
    toolDescription:
      'Gestiona tu página link-in-bio organizando enlaces, rastreando clics y vistas, y generando códigos QR. Crea un centro centralizado para todos tus enlaces importantes y monitorea su rendimiento.',
    howToUse: [
      { label: 'Configura el perfil:', text: 'Ingresa el nombre de tu perfil y nombre de usuario' },
      { label: 'Agrega enlaces:', text: 'Haz clic en "Agregar enlace" para añadir título y URL de cada enlace' },
      { label: 'Administra enlaces:', text: 'Edita, elimina o reordena tus enlaces' },
      { label: 'Rastrea rendimiento:', text: 'Ve clics y vistas de cada enlace' },
      { label: 'Genera código QR:', text: 'Crea un código QR para compartir fácilmente' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Crea y gestiona una landing page única con todos tus enlaces importantes. Perfecto para bios de Instagram, TikTok y Twitter donde solo puedes tener un enlace. Organiza múltiples enlaces, rastrea clics y exporta como página estática.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Agrega enlaces:', text: 'Haz clic en "Agregar enlace", ingresa título (ej. "Mi sitio web"), ingresa URL, haz clic en "Guardar"' },
      { label: 'Administra enlaces:', text: 'Haz clic en un enlace para abrir en nueva pestaña y rastrear clics, icono editar para modificar, eliminar para quitar, arrastra y suelta para reordenar' },
      { label: 'Rastrea rendimiento:', text: 'Ve conteo de vistas (cargas de página), conteo de clics (clics en enlaces), identifica qué enlaces funcionan mejor' },
      { label: 'Exportar:', text: 'Haz clic en "Exportar página estática" para descargar archivo HTML, despliega en tu hosting o úsalo tal cual' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Enlace único de bio - Una URL para usar en todas tus bios sociales',
      'Múltiples enlaces - Organiza todos tus enlaces importantes',
      'Rastreo de clics - Ve qué enlaces reciben más clics',
      'Rastreo de vistas - Rastrea cuántas veces se ve la página',
      'Ordenar arrastrando - Prioriza enlaces importantes',
      'Exportable - Descarga como página HTML estática',
    ],
    defaultName: 'Tu nombre',
    defaultBio: 'Biografía corta aquí',
    avatarAlt: 'Avatar',
    viewsClicks: (views: number, clicks: number) => `${views} vistas · ${clicks} clics`,
    addLink: 'Agregar enlace',
    exportStaticPage: 'Exportar página estática',
    editLink: 'Editar enlace',
    titlePlaceholder: 'Título',
    save: 'Guardar',
    cancel: 'Cancelar',
  },
}

function LinkInBioManagerContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [links, setLinks] = useState<Link[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ title: '', url: '' })
  const [profile, setProfile] = useState({
    name: c.defaultName,
    bio: c.defaultBio,
    avatar: 'https://i.pravatar.cc/90?u=you'
  })
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORE_KEY)
    if (stored) {
      setLinks(JSON.parse(stored))
    }
    
    // Track page view
    const storedLinks = stored ? JSON.parse(stored) : []
    const updatedLinks = storedLinks.map((l: Link) => ({
      ...l,
      views: (l.views || 0) + 1
    }))
    if (storedLinks.length > 0) {
      setLinks(updatedLinks)
      localStorage.setItem(STORE_KEY, JSON.stringify(updatedLinks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(links))
  }, [links])

  const saveLink = () => {
    const { title, url } = formData
    if (!title.trim() || !url.trim()) return

    if (editingId !== null) {
      setLinks(links.map((l, i) => 
        i === editingId ? { ...l, title: title.trim(), url: url.trim() } : l
      ))
    } else {
      setLinks([...links, {
        title: title.trim(),
        url: url.trim(),
        views: 0,
        clicks: 0
      }])
    }

    setFormData({ title: '', url: '' })
    setShowModal(false)
    setEditingId(null)
  }

  const deleteLink = () => {
    if (editingId !== null) {
      setLinks(links.filter((_, i) => i !== editingId))
      setShowModal(false)
      setEditingId(null)
    }
  }

  const openModal = (idx: number | null = null) => {
    setEditingId(idx)
    if (idx !== null) {
      setFormData({
        title: links[idx].title,
        url: links[idx].url
      })
    } else {
      setFormData({ title: '', url: '' })
    }
    setShowModal(true)
  }

  const handleLinkClick = (idx: number) => {
    const updatedLinks = links.map((l, i) => 
      i === idx ? { ...l, clicks: (l.clicks || 0) + 1 } : l
    )
    setLinks(updatedLinks)
    window.open(links[idx].url, '_blank')
  }

  const handleDragStart = (idx: number) => {
    setDraggedIndex(idx)
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, toIdx: number) => {
    e.preventDefault()
    if (draggedIndex === null) return

    const newLinks = [...links]
    const [moved] = newLinks.splice(draggedIndex, 1)
    newLinks.splice(toIdx, 0, moved)
    setLinks(newLinks)
    setDraggedIndex(null)
  }

  const exportStaticPage = () => {
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${profile.name}</title>
<style>
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial;background:#fafafa;display:flex;flex-direction:column;align-items:center;padding:2rem}
header{text-align:center;margin-bottom:1.5rem}
header img{width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid #0a66c2}
header h1{margin:.4rem 0;font-size:1.5rem}
header p{margin:0;font-size:.95rem;color:#444}
#links{width:100%;max-width:480px;display:flex;flex-direction:column;gap:.8rem}
.link{background:#fff;border:1px solid #ddd;border-radius:8px;padding:1rem;text-align:center;text-decoration:none;color:#111;font-weight:500}
.link:hover{background:#f7f7f7}
</style>
</head>
<body>
<header>
<img src="${profile.avatar}" alt="Avatar">
<h1>${profile.name}</h1>
<p>${profile.bio}</p>
</header>
<div id="links">${links.map(l => `<a class="link" href="${l.url}" target="_blank">${l.title}</a>`).join('')}</div>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'index.html'
    a.click()
  }

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Documentation Section */}
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

        <header className="text-center mb-6">
          <img
            src={profile.avatar}
            alt={c.avatarAlt}
            className="w-24 h-24 rounded-full object-cover border-4 border-accent-600 mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-1">{profile.name}</h1>
          <p className="text-mono-600 dark:text-mono-400">{profile.bio}</p>
        </header>

        <div className="space-y-3 mb-4">
          {links.map((link, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              className={`bg-mono-50 dark:bg-mono-900 rounded-lg p-4 flex items-center justify-between cursor-move border border-mono-200 dark:border-mono-700 ${
                draggedIndex === idx ? 'opacity-50' : ''
              }`}
            >
              <div className="flex-1" onClick={() => handleLinkClick(idx)}>
                <span className="text-mono-950 dark:text-mono-50 font-medium block mb-1">{link.title}</span>
                <small className="text-mono-600 dark:text-mono-400 text-sm">
                  {c.viewsClicks(link.views || 0, link.clicks || 0)}
                </small>
              </div>
              <button
                onClick={() => openModal(idx)}
                className="ml-4 p-2 text-accent-600 hover:bg-mono-100 dark:hover:bg-mono-800 rounded"
              >
                <Edit size={18} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => openModal()}
          className="w-full px-6 py-3 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 transition-colors flex items-center justify-center gap-2 mb-4"
        >
          <Plus size={20} />
          {c.addLink}
        </button>

        <div className="flex gap-2 justify-center">
          <button
            onClick={exportStaticPage}
            className="px-4 py-2 bg-mono-100 dark:bg-mono-800 hover:bg-mono-200 dark:hover:bg-mono-700 rounded-lg flex items-center gap-2 text-mono-700 dark:text-mono-300"
          >
            <Download size={18} />
            {c.exportStaticPage}
          </button>
        </div>

        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-mono-50 dark:bg-mono-900 p-6 rounded-lg w-full max-w-md border border-mono-200 dark:border-mono-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">
                {editingId !== null ? c.editLink : c.addLink}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={c.titlePlaceholder}
                  className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://…"
                  className="w-full px-4 py-3 border border-mono-300 dark:border-mono-700 rounded bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveLink}
                    className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                  >
                    {c.save}
                  </button>
                  {editingId !== null && (
                    <button
                      onClick={deleteLink}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setEditingId(null)
                    }}
                    className="px-4 py-2 bg-mono-100 dark:bg-mono-800 text-mono-700 dark:text-mono-300 rounded-lg hover:bg-mono-200 dark:hover:bg-mono-700 transition-colors"
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

export default function LinkInBioManager() {
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
      toolSlug="link-in-bio-manager"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <LinkInBioManagerContent />
    </ToolAccessGate>
  )
}
