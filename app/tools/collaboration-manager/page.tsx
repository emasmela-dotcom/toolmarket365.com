'use client'

import React, { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Collaboration {
  name: string
  plat: string
  deliv: string
}

type Copy = {
  toolName: string
  toolDescription: string
  howToUse: { label: string; text: string }[]
  howToUseTitle: string
  whatItDoes: string
  whatItDoesBody: string
  howToUseInner: string
  howToUseSteps: { label: string; text: string }[]
  expectedOutcome: string
  expectedOutcomes: string[]
  title: string
  partnerName: string
  partnerPlaceholder: string
  platform: string
  deliverable: string
  deliverablePlaceholder: string
  deliverableHint: string
  addCollab: string
  yourCollaborations: (n: number) => string
  clearAll: string
  deleteAllConfirm: string
  enterPartnerAlert: string
  howItWorks: string
  howItWorksSteps: string[]
}

const copy: Record<'en' | 'es', Copy> = {
  en: {
    toolName: 'Collaboration Manager',
    toolDescription:
      'Manages collaboration partnerships by tracking partner names, platforms, and deliverables. Keeps an organized list of all your collaborations for easy reference and management.',
    howToUse: [
      { label: 'Enter partner name:', text: "Type the brand name or creator name you're collaborating with" },
      { label: 'Select platform:', text: 'Choose IG, TikTok, or YouTube' },
      { label: 'Enter deliverable:', text: 'Type what needs to be delivered (e.g., "1 reel + 3 stories")' },
      { label: 'Click "Add Collab"', text: 'to save the collaboration' },
      { label: 'Manage collaborations:', text: 'View all saved collaborations, delete individual collaborations, or clear all' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Manages collaboration partnerships by tracking partner names, platforms, and deliverables. Keeps an organized list of all your collaborations for easy reference and management.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter partner name:', text: "Type the brand name or creator name you're collaborating with" },
      { label: 'Select platform:', text: 'Choose IG, TikTok, or YouTube' },
      { label: 'Enter deliverable:', text: 'Type what needs to be delivered (e.g., "1 reel + 3 stories")' },
      { label: 'Click "Add Collab"', text: 'to save the collaboration' },
      { label: 'Manage collaborations:', text: 'View all saved collaborations, delete individual collaborations, or clear all' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'List of all collaborations with partner name, platform, and deliverables',
      'Easy-to-read format showing collaboration details',
      'Delete button for each collaboration',
      'Clear all button to remove all collaborations',
      'Local storage - All collaborations saved in browser',
    ],
    title: 'Collab Manager',
    partnerName: 'Partner name',
    partnerPlaceholder: 'e.g., Brand Name or Creator Name',
    platform: 'Platform',
    deliverable: 'Deliverable',
    deliverablePlaceholder: '1 reel + 3 stories',
    deliverableHint: 'Describe what content or deliverables are expected',
    addCollab: 'Add Collab',
    yourCollaborations: (n) => `Your Collaborations (${n})`,
    clearAll: 'Clear All',
    deleteAllConfirm: 'Delete all collaborations?',
    enterPartnerAlert: 'Please enter a partner name',
    howItWorks: 'How it works:',
    howItWorksSteps: [
      'Enter partner name (brand or creator)',
      'Select the platform for the collaboration',
      'Describe the deliverables (e.g., "1 reel + 3 stories")',
      'Click "Add Collab" to save',
      'Track all your collaborations in one place',
    ],
  },
  es: {
    toolName: 'Gestor de colaboraciones',
    toolDescription:
      'Gestiona colaboraciones registrando nombres de socios, plataformas y entregables. Mantiene una lista organizada de todas tus colaboraciones para consulta y gestión fácil.',
    howToUse: [
      { label: 'Ingresa el nombre del socio:', text: 'Escribe el nombre de la marca o creador con quien colaboras' },
      { label: 'Selecciona la plataforma:', text: 'Elige IG, TikTok o YouTube' },
      { label: 'Ingresa el entregable:', text: 'Escribe lo que hay que entregar (ej. "1 reel + 3 stories")' },
      { label: 'Haz clic en "Agregar colab"', text: 'para guardar la colaboración' },
      { label: 'Gestiona colaboraciones:', text: 'Ver todas las guardadas, eliminar una o borrar todas' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Gestiona colaboraciones registrando nombres de socios, plataformas y entregables. Mantiene una lista organizada de todas tus colaboraciones para consulta y gestión fácil.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa el nombre del socio:', text: 'Escribe el nombre de la marca o creador con quien colaboras' },
      { label: 'Selecciona la plataforma:', text: 'Elige IG, TikTok o YouTube' },
      { label: 'Ingresa el entregable:', text: 'Escribe lo que hay que entregar (ej. "1 reel + 3 stories")' },
      { label: 'Haz clic en "Agregar colab"', text: 'para guardar la colaboración' },
      { label: 'Gestiona colaboraciones:', text: 'Ver todas las guardadas, eliminar una o borrar todas' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Lista de todas las colaboraciones con nombre, plataforma y entregables',
      'Formato fácil de leer con los detalles de cada colaboración',
      'Botón de eliminar para cada colaboración',
      'Botón para borrar todas las colaboraciones',
      'Almacenamiento local: todas las colaboraciones se guardan en el navegador',
    ],
    title: 'Gestor de colaboraciones',
    partnerName: 'Nombre del socio',
    partnerPlaceholder: 'ej. Nombre de marca o creador',
    platform: 'Plataforma',
    deliverable: 'Entregable',
    deliverablePlaceholder: '1 reel + 3 stories',
    deliverableHint: 'Describe el contenido o entregables esperados',
    addCollab: 'Agregar colab',
    yourCollaborations: (n) => `Tus colaboraciones (${n})`,
    clearAll: 'Borrar todo',
    deleteAllConfirm: '¿Eliminar todas las colaboraciones?',
    enterPartnerAlert: 'Por favor ingresa un nombre de socio',
    howItWorks: 'Cómo funciona:',
    howItWorksSteps: [
      'Ingresa el nombre del socio (marca o creador)',
      'Selecciona la plataforma de la colaboración',
      'Describe los entregables (ej. "1 reel + 3 stories")',
      'Haz clic en "Agregar colab" para guardar',
      'Rastrea todas tus colaboraciones en un solo lugar',
    ],
  },
}

function CollaborationManagerContent({ c }: { c: Copy }) {
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState('IG')
  const [deliverable, setDeliverable] = useState('')
  const [collabs, setCollabs] = useState<Collaboration[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('collab')
    if (saved) {
      setCollabs(JSON.parse(saved))
    }
  }, [])

  const add = () => {
    if (!name.trim()) {
      alert(c.enterPartnerAlert)
      return
    }

    const newCollab: Collaboration = {
      name: name.trim(),
      plat: platform,
      deliv: deliverable.trim() || 'TBD',
    }

    const updated = [...collabs, newCollab]
    setCollabs(updated)
    localStorage.setItem('collab', JSON.stringify(updated))
    setName('')
    setDeliverable('')
  }

  const deleteCollab = (index: number) => {
    const updated = collabs.filter((_, i) => i !== index)
    setCollabs(updated)
    localStorage.setItem('collab', JSON.stringify(updated))
  }

  const clearAll = () => {
    if (confirm(c.deleteAllConfirm)) {
      setCollabs([])
      localStorage.removeItem('collab')
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{c.howToUseTitle}</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.whatItDoes}</h3>
              <p>{c.whatItDoesBody}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.howToUseInner}</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                {c.howToUseSteps.map((step, i) => (
                  <li key={i}>
                    <strong>{step.label}</strong> {step.text}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{c.expectedOutcome}</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {c.expectedOutcomes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          {c.title}
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.partnerName}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={c.partnerPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.platform}
            </label>
            <select
              id="plat"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option>IG</option>
              <option>TikTok</option>
              <option>YouTube</option>
              <option>Twitter</option>
              <option>LinkedIn</option>
              <option>Multiple</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.deliverable}
            </label>
            <input
              id="deliv"
              type="text"
              value={deliverable}
              onChange={(e) => setDeliverable(e.target.value)}
              placeholder={c.deliverablePlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {c.deliverableHint}
            </p>
          </div>

          <button
            onClick={add}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {c.addCollab}
          </button>
        </div>

        {collabs.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {c.yourCollaborations(collabs.length)}
              </h2>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
              >
                {c.clearAll}
              </button>
            </div>
            <ul className="space-y-3">
              {collabs.map((collab, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {collab.name}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                      ({collab.plat})
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">–</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      {collab.deliv}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteCollab(index)}
                    className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {collabs.length === 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              {c.howItWorks}
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {c.howItWorksSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CollaborationManager() {
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
      toolSlug="collaboration-manager"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <CollaborationManagerContent c={c} />
    </ToolAccessGate>
  )
}
