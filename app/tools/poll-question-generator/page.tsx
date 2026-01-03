'use client'

import React, { useState } from 'react'

const pools: Record<string, string[]> = {
  coffee: [
    'How do you drink your coffee?',
    "What's your go-to milk?",
    'Espresso or filter?',
    'Hot or iced?',
    'Favorite coffee shop?',
  ],
  general: [
    "What's your favourite season?",
    'iOS or Android?',
    'Book or movie?',
    'Morning person or night owl?',
    'Beach or mountains?',
  ],
  fitness: [
    'Gym or home workout?',
    'Cardio or weights?',
    'Favorite workout time?',
    'Pre-workout or post-workout meal?',
  ],
  food: [
    'Sweet or savory?',
    'Favorite cuisine?',
    'Cooking or ordering in?',
    'Coffee or tea?',
  ],
}

export default function PollQuestionGenerator() {
  const [topic, setTopic] = useState('')
  const [questions, setQuestions] = useState<string[]>([])

  const generate = () => {
    const topicLower = topic.trim().toLowerCase()
    const arr = pools[topicLower] || pools.general
    setQuestions(arr)
  }

  const copyQuestion = (question: string) => {
    navigator.clipboard.writeText(question)
    alert('Question copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Poll / Question Generator
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Topic
            </label>
            <input
              id="t"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Coffee, Fitness, Food, or leave blank for general"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') generate()
              }}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try: coffee, fitness, food, or leave blank for general questions
            </p>
          </div>

          <button
            onClick={generate}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Generate
          </button>
        </div>

        {questions.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Generated Questions
            </h2>
            <ul className="space-y-3">
              {questions.map((question, index) => (
                <li
                  key={index}
                  className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center"
                >
                  <span className="text-gray-900 dark:text-white">{question}</span>
                  <button
                    onClick={() => copyQuestion(question)}
                    className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                  >
                    Copy
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {questions.length === 0 && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              How it works:
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter a topic (coffee, fitness, food) or leave blank for general questions. Click
              Generate to get engagement questions perfect for polls and stories.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

