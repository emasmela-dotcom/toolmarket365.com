'use client'

import React, { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'

interface Giveaway {
  prize: string
  rules: string
  entries: string[]
  winner: string | null
}

export default function GiveawayManager() {
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
      alert('Please enter a prize')
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
      alert('No entries to pick from')
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Documentation Section */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Tool</h2>
          <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">What It Does</h3>
              <p>Manages giveaways by storing prize information, rules, and entries. Randomly selects winners from entries and keeps track of multiple giveaways.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter prize:</strong> Type the giveaway prize description</li>
                <li><strong>Enter rules:</strong> List giveaway rules/entry requirements (one per line) - these become the entry list</li>
                <li><strong>Click "Save Giveaway"</strong> to store the giveaway</li>
                <li><strong>Pick winner:</strong> Click "Pick Random Winner" on any saved giveaway to randomly select a winner from the entries</li>
                <li><strong>Manage giveaways:</strong> Delete individual giveaways or view all saved giveaways</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Saved giveaway with prize and entry list</li>
                <li>Randomly selected winner from entries</li>
                <li>List of all saved giveaways</li>
                <li>Winner announcement display</li>
                <li>Local storage - All giveaways saved in browser</li>
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Giveaway Manager
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Prize
            </label>
            <input
              id="p"
              type="text"
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              placeholder="e.g., $100 Amazon Gift Card"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Rules / Entries (one per line)
            </label>
            <textarea
              id="r"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="Enter participant names or usernames, one per line&#10;Example:&#10;@user1&#10;@user2&#10;@user3"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
              rows={6}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {rules.split('\n').filter((x) => x.trim()).length} entries
            </p>
          </div>

          <button
            onClick={saveGiveaway}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Save Giveaway
          </button>
        </div>

        {winner && (
          <div className="mb-6 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
              🎉 Winner Selected!
            </h2>
            <p className="text-lg text-green-700 dark:text-green-300">Winner: {winner}</p>
          </div>
        )}

        {giveaways.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Giveaways
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
                      {giveaway.entries.length} entries
                    </p>
                  </div>
                  <button
                    onClick={() => deleteGiveaway(index)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>

                {giveaway.winner ? (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-800 dark:text-green-200 font-semibold">
                      🎉 Winner: {giveaway.winner}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => pickWinner(index)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                  >
                    Pick Random Winner
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {giveaways.length === 0 && !winner && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              How it works:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Enter the prize for your giveaway</li>
              <li>List all participants/entries (one per line)</li>
              <li>Click "Save Giveaway" to store it</li>
              <li>Click "Pick Random Winner" to select a winner</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}

export default function GiveawayManager() {
  const toolDescription = "Manages giveaways and contests by tracking prizes, rules, entries, and randomly selecting winners. Organize multiple giveaways and keep track of participants and winners."
  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li><strong>Enter prize:</strong> Describe what you're giving away</li>
        <li><strong>Enter rules:</strong> List the giveaway rules and requirements</li>
        <li><strong>Add entries:</strong> List all participants (one per line)</li>
        <li><strong>Save giveaway:</strong> Click "Save Giveaway" to store it</li>
        <li><strong>Pick winner:</strong> Click "Pick Random Winner" to randomly select a winner</li>
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="giveaway-manager"
      toolName="Giveaway Manager"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <GiveawayManagerContent />
    </ToolAccessGate>
  )
}

