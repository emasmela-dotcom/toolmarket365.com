'use client'

import React, { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'
import { useLanguage } from '@/lib/i18n/LanguageContext'

interface Giveaway {
  prize: string
  rules: string
  entries: string[]
  winner: string | null
}

const copy = {
  en: {
    toolName: 'Giveaway Manager',
    toolDescription:
      'Manages giveaways and contests by tracking prizes, rules, entries, and randomly selecting winners. Organize multiple giveaways and keep track of participants and winners.',
    howToUse: [
      { label: 'Enter prize:', text: "Describe what you're giving away" },
      { label: 'Enter rules:', text: 'List the giveaway rules and requirements' },
      { label: 'Add entries:', text: 'List all participants (one per line)' },
      { label: 'Save giveaway:', text: 'Click "Save Giveaway" to store it' },
      { label: 'Pick winner:', text: 'Click "Pick Random Winner" to randomly select a winner' },
    ],
    howToUseTitle: 'How to Use This Tool',
    whatItDoes: 'What It Does',
    whatItDoesBody:
      'Manages giveaways by storing prize information, rules, and entries. Randomly selects winners from entries and keeps track of multiple giveaways.',
    howToUseInner: 'How to Use',
    howToUseSteps: [
      { label: 'Enter prize:', text: 'Type the giveaway prize description' },
      { label: 'Enter rules:', text: 'List giveaway rules/entry requirements (one per line) - these become the entry list' },
      { label: 'Click "Save Giveaway"', text: 'to store the giveaway' },
      { label: 'Pick winner:', text: 'Click "Pick Random Winner" on any saved giveaway to randomly select a winner from the entries' },
      { label: 'Manage giveaways:', text: 'Delete individual giveaways or view all saved giveaways' },
    ],
    expectedOutcome: 'Expected Outcome',
    expectedOutcomes: [
      'Saved giveaway with prize and entry list',
      'Randomly selected winner from entries',
      'List of all saved giveaways',
      'Winner announcement display',
      'Local storage - All giveaways saved in browser',
    ],
    title: 'Giveaway Manager',
    prize: 'Prize',
    prizePlaceholder: 'e.g., $100 Amazon Gift Card',
    rulesLabel: 'Rules / Entries (one per line)',
    rulesPlaceholder: 'Enter participant names or usernames, one per line\nExample:\n@user1\n@user2\n@user3',
    entriesCount: (n: number) => `${n} entries`,
    saveGiveaway: 'Save Giveaway',
    winnerSelected: '🎉 Winner Selected!',
    winner: 'Winner:',
    yourGiveaways: 'Your Giveaways',
    delete: 'Delete',
    pickRandomWinner: 'Pick Random Winner',
    howItWorks: 'How it works:',
    howItWorksSteps: [
      'Enter the prize for your giveaway',
      'List all participants/entries (one per line)',
      'Click "Save Giveaway" to store it',
      'Click "Pick Random Winner" to select a winner',
    ],
    alertEnterPrize: 'Please enter a prize',
    alertNoEntries: 'No entries to pick from',
  },
  es: {
    toolName: 'Gestor de sorteos',
    toolDescription:
      'Gestiona sorteos y concursos rastreando premios, reglas, participantes y seleccionando ganadores al azar. Organiza múltiples sorteos y lleva el control de participantes y ganadores.',
    howToUse: [
      { label: 'Ingresa el premio:', text: 'Describe lo que vas a regalar' },
      { label: 'Ingresa las reglas:', text: 'Lista las reglas y requisitos del sorteo' },
      { label: 'Agrega participantes:', text: 'Lista todos los participantes (uno por línea)' },
      { label: 'Guarda el sorteo:', text: 'Haz clic en "Guardar sorteo" para almacenarlo' },
      { label: 'Elige ganador:', text: 'Haz clic en "Elegir ganador al azar" para seleccionar un ganador' },
    ],
    howToUseTitle: 'Cómo usar esta herramienta',
    whatItDoes: 'Qué hace',
    whatItDoesBody:
      'Gestiona sorteos almacenando información del premio, reglas y participantes. Selecciona ganadores al azar y lleva el control de múltiples sorteos.',
    howToUseInner: 'Cómo usar',
    howToUseSteps: [
      { label: 'Ingresa el premio:', text: 'Escribe la descripción del premio del sorteo' },
      { label: 'Ingresa las reglas:', text: 'Lista las reglas/requisitos de participación (uno por línea); estos se convierten en la lista de participantes' },
      { label: 'Haz clic en "Guardar sorteo"', text: 'para almacenar el sorteo' },
      { label: 'Elige ganador:', text: 'Haz clic en "Elegir ganador al azar" en cualquier sorteo guardado para seleccionar un ganador' },
      { label: 'Gestiona sorteos:', text: 'Elimina sorteos individuales o ve todos los sorteos guardados' },
    ],
    expectedOutcome: 'Resultado esperado',
    expectedOutcomes: [
      'Sorteo guardado con premio y lista de participantes',
      'Ganador seleccionado al azar de los participantes',
      'Lista de todos los sorteos guardados',
      'Pantalla de anuncio del ganador',
      'Almacenamiento local: todos los sorteos guardados en el navegador',
    ],
    title: 'Gestor de sorteos',
    prize: 'Premio',
    prizePlaceholder: 'ej., Tarjeta regalo Amazon de $100',
    rulesLabel: 'Reglas / Participantes (uno por línea)',
    rulesPlaceholder: 'Ingresa nombres o usuarios de participantes, uno por línea\nEjemplo:\n@user1\n@user2\n@user3',
    entriesCount: (n: number) => `${n} participantes`,
    saveGiveaway: 'Guardar sorteo',
    winnerSelected: '🎉 ¡Ganador seleccionado!',
    winner: 'Ganador:',
    yourGiveaways: 'Tus sorteos',
    delete: 'Eliminar',
    pickRandomWinner: 'Elegir ganador al azar',
    howItWorks: 'Cómo funciona:',
    howItWorksSteps: [
      'Ingresa el premio de tu sorteo',
      'Lista todos los participantes (uno por línea)',
      'Haz clic en "Guardar sorteo" para almacenarlo',
      'Haz clic en "Elegir ganador al azar" para seleccionar un ganador',
    ],
    alertEnterPrize: 'Por favor ingresa un premio',
    alertNoEntries: 'No hay participantes para elegir',
  },
}

function GiveawayManagerContent() {
  const { language } = useLanguage()
  const c = copy[language]
  const [prize, setPrize] = useState('')
  const [rules, setRules] = useState('')
  const [entries, setEntries] = useState<string[]>([])
  const [winner, setWinner] = useState<string | null>(null)
  const [giveaways, setGiveaways] = useState<Giveaway[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('giveaways')
    if (saved) {
      setGiveaways(JSON.parse(saved))
    }
  }, [])

  const saveGiveaway = () => {
    if (!prize.trim()) {
      alert(c.alertEnterPrize)
      return
    }

    const entryList = rules
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)

    const newGiveaway: Giveaway = {
      prize,
      rules,
      entries: entryList,
      winner: null,
    }

    const updated = [...giveaways, newGiveaway]
    setGiveaways(updated)
    localStorage.setItem('giveaways', JSON.stringify(updated))
    setPrize('')
    setRules('')
    setEntries([])
  }

  const pickWinner = (index: number) => {
    const giveaway = giveaways[index]
    if (!giveaway.entries.length) {
      alert(c.alertNoEntries)
      return
    }

    const randomIndex = Math.floor(Math.random() * giveaway.entries.length)
    const selectedWinner = giveaway.entries[randomIndex]

    const updated = [...giveaways]
    updated[index].winner = selectedWinner
    setGiveaways(updated)
    localStorage.setItem('giveaways', JSON.stringify(updated))
    setWinner(selectedWinner)
  }

  const deleteGiveaway = (index: number) => {
    const updated = giveaways.filter((_, i) => i !== index)
    setGiveaways(updated)
    localStorage.setItem('giveaways', JSON.stringify(updated))
  }

  const entryCount = rules.split('\n').filter((x) => x.trim()).length

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

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{c.title}</h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.prize}
            </label>
            <input
              id="p"
              type="text"
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              placeholder={c.prizePlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              {c.rulesLabel}
            </label>
            <textarea
              id="r"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder={c.rulesPlaceholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={6}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {c.entriesCount(entryCount)}
            </p>
          </div>

          <button
            onClick={saveGiveaway}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {c.saveGiveaway}
          </button>
        </div>

        {winner && (
          <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
              {c.winnerSelected}
            </h2>
            <p className="text-lg text-green-700 dark:text-green-300">{c.winner} {winner}</p>
          </div>
        )}

        {giveaways.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {c.yourGiveaways}
            </h2>
            {giveaways.map((giveaway, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {giveaway.prize}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {c.entriesCount(giveaway.entries.length)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteGiveaway(index)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                  >
                    {c.delete}
                  </button>
                </div>

                {giveaway.winner ? (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-800 dark:text-green-200 font-semibold">
                      🎉 {c.winner} {giveaway.winner}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => pickWinner(index)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                  >
                    {c.pickRandomWinner}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {giveaways.length === 0 && !winner && (
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

export default function GiveawayManager() {
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
      toolSlug="giveaway-manager"
      toolName={c.toolName}
      toolDescription={c.toolDescription}
      howToUse={howToUse}
    >
      <GiveawayManagerContent />
    </ToolAccessGate>
  )
}
