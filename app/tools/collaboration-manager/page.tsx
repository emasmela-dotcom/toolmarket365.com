'use client'

import React, { useState, useEffect } from 'react'
import { ToolAccessGate } from '@/components/ToolAccessGate'

interface Collaboration {
  name: string
  plat: string
  deliv: string
}

function CollaborationManagerContent() {
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
      alert('Please enter a partner name')
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
    if (confirm('Delete all collaborations?')) {
      setCollabs([])
      localStorage.removeItem('collab')
    }
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
              <p>Manages collaboration partnerships by tracking partner names, platforms, and deliverables. Keeps an organized list of all your collaborations for easy reference and management.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li><strong>Enter partner name:</strong> Type the brand name or creator name you're collaborating with</li>
                <li><strong>Select platform:</strong> Choose IG, TikTok, or YouTube</li>
                <li><strong>Enter deliverable:</strong> Type what needs to be delivered (e.g., "1 reel + 3 stories")</li>
                <li><strong>Click "Add Collab"</strong> to save the collaboration</li>
                <li><strong>Manage collaborations:</strong> View all saved collaborations, delete individual collaborations, or clear all</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Expected Outcome</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>List of all collaborations with partner name, platform, and deliverables</li>
                <li>Easy-to-read format showing collaboration details</li>
                <li>Delete button for each collaboration</li>
                <li>Clear all button to remove all collaborations</li>
                <li>Local storage - All collaborations saved in browser</li>
              </ul>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Collab Manager
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Partner name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Brand Name or Creator Name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Platform
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
              Deliverable
            </label>
            <input
              id="deliv"
              type="text"
              value={deliverable}
              onChange={(e) => setDeliverable(e.target.value)}
              placeholder="1 reel + 3 stories"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Describe what content or deliverables are expected
            </p>
          </div>

          <button
            onClick={add}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Add Collab
          </button>
        </div>

        {collabs.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Your Collaborations ({collabs.length})
              </h2>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
              >
                Clear All
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
              How it works:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Enter partner name (brand or creator)</li>
              <li>Select the platform for the collaboration</li>
              <li>Describe the deliverables (e.g., "1 reel + 3 stories")</li>
              <li>Click "Add Collab" to save</li>
              <li>Track all your collaborations in one place</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CollaborationManager() {
  const toolDescription = "Manages collaboration partnerships by tracking partner names, platforms, and deliverables. Keeps an organized list of all your collaborations for easy reference and management."
  const howToUse = (
    <div>
      <ol className="list-decimal list-inside space-y-1 ml-2">
        <li><strong>Enter partner name:</strong> Type the brand name or creator name you're collaborating with</li>
        <li><strong>Select platform:</strong> Choose IG, TikTok, or YouTube</li>
        <li><strong>Enter deliverable:</strong> Type what needs to be delivered (e.g., "1 reel + 3 stories")</li>
        <li><strong>Click "Add Collab"</strong> to save the collaboration</li>
        <li><strong>Manage collaborations:</strong> View all saved collaborations, delete individual collaborations, or clear all</li>
      </ol>
    </div>
  )

  return (
    <ToolAccessGate
      toolSlug="collaboration-manager"
      toolName="Collaboration Manager"
      toolDescription={toolDescription}
      howToUse={howToUse}
    >
      <CollaborationManagerContent />
    </ToolAccessGate>
  )
}

