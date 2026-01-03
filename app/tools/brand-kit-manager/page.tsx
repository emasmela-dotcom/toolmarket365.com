'use client'

import React, { useState, useEffect } from 'react'

interface BrandKit {
  name: string
  c1: string
  c2: string
  tag: string
}

export default function BrandKitManager() {
  const [name, setName] = useState('')
  const [c1, setC1] = useState('#0a66c2')
  const [c2, setC2] = useState('#16a34a')
  const [tag, setTag] = useState('')
  const [kit, setKit] = useState<BrandKit | null>(null)

  useEffect(() => {
    load()
  }, [])

  const save = () => {
    const brandKit: BrandKit = {
      name,
      c1,
      c2,
      tag
    }
    localStorage.setItem('brand', JSON.stringify(brandKit))
    setKit(brandKit)
  }

  const load = () => {
    const stored = localStorage.getItem('brand')
    if (stored) {
      const k: BrandKit = JSON.parse(stored)
      if (k.name) {
        setName(k.name)
        setC1(k.c1 || '#0a66c2')
        setC2(k.c2 || '#16a34a')
        setTag(k.tag || '')
        setKit(k)
      }
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Brand Kit Manager
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Brand name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter brand name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Primary colour
            </label>
            <input
              id="c1"
              type="color"
              value={c1}
              onChange={(e) => setC1(e.target.value)}
              className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Secondary colour
            </label>
            <input
              id="c2"
              type="color"
              value={c2}
              onChange={(e) => setC2(e.target.value)}
              className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Tagline
            </label>
            <input
              id="tag"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter brand tagline"
            />
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={save}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Save
          </button>
          <button
            onClick={load}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
          >
            Load
          </button>
        </div>

        {kit && (
          <div
            id="kit"
            className="mt-4 p-6 border-2 rounded-lg"
            style={{ borderColor: kit.c1 }}
          >
            <strong className="text-xl text-gray-900 dark:text-white block mb-2">
              {kit.name}
            </strong>
            <div className="mb-2">
              <span
                className="inline-block w-4 h-4 rounded mr-2"
                style={{ backgroundColor: kit.c1 }}
              />
              {kit.c1}
              {' '}
              <span
                className="inline-block w-4 h-4 rounded mr-2 ml-4"
                style={{ backgroundColor: kit.c2 }}
              />
              {kit.c2}
            </div>
            <em className="text-gray-600 dark:text-gray-400">{kit.tag}</em>
          </div>
        )}
      </div>
    </div>
  )
}

