'use client'

import React, { useState } from 'react'

interface GrowthData {
  current: number
  goal: number
  needed: number
  daily: number
  weekly: number
  percentageToGoal: number
  growthRate: number
}

export default function FollowerGrowthTracker() {
  const [currentFollowers, setCurrentFollowers] = useState('')
  const [goalFollowers, setGoalFollowers] = useState('')
  const [growthData, setGrowthData] = useState<GrowthData | null>(null)

  const track = () => {
    const n = parseFloat(currentFollowers)
    const g = parseFloat(goalFollowers)

    if (!n || !g || n < 0 || g < 0) {
      alert('Please enter valid numbers for both fields')
      return
    }

    if (g <= n) {
      alert('Goal must be greater than current followers')
      return
    }

    const needed = g - n
    const daily = Math.ceil(needed / 30)
    const weekly = Math.ceil(needed / 4.3) // ~4.3 weeks in 30 days
    const percentageToGoal = ((n / g) * 100).toFixed(1)
    const growthRate = ((needed / n) * 100).toFixed(1)

    setGrowthData({
      current: n,
      goal: g,
      needed,
      daily,
      weekly,
      percentageToGoal: parseFloat(percentageToGoal),
      growthRate: parseFloat(growthRate),
    })
  }

  const reset = () => {
    setCurrentFollowers('')
    setGoalFollowers('')
    setGrowthData(null)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Follower Growth Tracker
        </h1>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Current followers
            </label>
            <input
              id="now"
              type="number"
              value={currentFollowers}
              onChange={(e) => setCurrentFollowers(e.target.value)}
              placeholder="Enter your current follower count"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              30-day goal
            </label>
            <input
              id="goal"
              type="number"
              value={goalFollowers}
              onChange={(e) => setGoalFollowers(e.target.value)}
              placeholder="Enter your 30-day follower goal"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              min="0"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Set a realistic goal for the next 30 days
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={track}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Track
            </button>
            {growthData && (
              <button
                onClick={reset}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {growthData && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
              Growth Plan
            </h2>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress to Goal
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {growthData.percentageToGoal}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${growthData.percentageToGoal}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>{growthData.current.toLocaleString()} current</span>
                <span>{growthData.goal.toLocaleString()} goal</span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Needed
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  +{growthData.needed.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  followers in 30 days
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Growth Rate
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  +{growthData.growthRate}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  increase needed
                </div>
              </div>
            </div>

            {/* Daily/Weekly Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📅</span>
                  <div className="text-sm font-semibold text-green-800 dark:text-green-200">
                    Daily Target
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  +{growthData.daily.toLocaleString()}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  new followers per day
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📊</span>
                  <div className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                    Weekly Target
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  +{growthData.weekly.toLocaleString()}
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  new followers per week
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Summary:</strong> To reach {growthData.goal.toLocaleString()} followers in
                30 days, you need to gain approximately{' '}
                <strong>{growthData.daily.toLocaleString()}</strong> new followers per day or{' '}
                <strong>{growthData.weekly.toLocaleString()}</strong> per week.
              </p>
            </div>
          </div>
        )}

        {!growthData && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
              How it works:
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Enter your current follower count and your 30-day goal. The tracker will calculate:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>How many new followers you need</li>
              <li>Daily follower target</li>
              <li>Weekly follower target</li>
              <li>Growth rate percentage</li>
              <li>Progress visualization</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

