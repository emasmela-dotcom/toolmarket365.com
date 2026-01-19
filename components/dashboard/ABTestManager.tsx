'use client'

import { useState } from 'react'
import { GitCompare, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export function ABTestManager({ data }: { data: any }) {
  const [selectedTest, setSelectedTest] = useState<string | null>(null)

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No A/B test data available yet.
      </div>
    )
  }

  const activeTests = data.activeTests || []
  const completedTests = data.completedTests || []
  const testInsights = data.testInsights || []

  const currentTest = activeTests.find((test: any) => test.id === selectedTest)

  return (
    <div className="space-y-6">
      {/* Test Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{activeTests.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Tests</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{completedTests.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed Tests</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(data.averageImprovement || 0)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Improvement</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {Math.round(data.confidence || 0)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Avg Confidence</div>
        </div>
      </div>

      {/* Active Tests */}
      {activeTests.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">🧪 Active A/B Tests</h2>
          <div className="space-y-4">
            {activeTests.map((test: any) => (
              <div 
                key={test.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTest === test.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSelectedTest(test.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{test.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{test.hypothesis}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    test.status === 'running'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {test.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{test.variantA?.participants || 0}</div>
                    <div className="text-xs text-gray-500">Variant A</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{test.variantA?.conversionRate || 0}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{test.variantB?.participants || 0}</div>
                    <div className="text-xs text-gray-500">Variant B</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{test.variantB?.conversionRate || 0}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      +{test.improvement || 0}%
                    </div>
                    <div className="text-xs text-gray-500">Improvement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{test.confidence || 0}%</div>
                    <div className="text-xs text-gray-500">Confidence</div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${test.progress || 0}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {test.daysRemaining || 0} days remaining
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Test Details */}
      {currentTest && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">📊 Test Details: {currentTest.name}</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Variant A (Control)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Participants:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{currentTest.variantA?.participants || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Conversion Rate:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{currentTest.variantA?.conversionRate || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Engagement Rate:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{currentTest.variantA?.engagementRate || 0}%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Variant B (Test)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Participants:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{currentTest.variantB?.participants || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Conversion Rate:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{currentTest.variantB?.conversionRate || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Engagement Rate:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{currentTest.variantB?.engagementRate || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Tests */}
      {completedTests.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">✅ Completed Tests</h2>
          <div className="space-y-4">
            {completedTests.map((test: any, index: number) => (
              <div key={test.id || index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{test.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{test.hypothesis}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    test.winner === 'B'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    Winner: Variant {test.winner || 'A'}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        +{test.finalImprovement || 0}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">improvement</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Confidence: {test.finalConfidence || 0}%
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Duration: {test.duration || 0} days
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Recommendations */}
      {testInsights.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">💡 Recommended A/B Tests</h2>
          <div className="space-y-4">
            {testInsights.map((insight: any, index: number) => (
              <div key={index} className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{insight.recommendation}</h3>
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    Priority: {insight.priority}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{insight.reasoning}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Expected improvement: +{insight.expectedImprovement}%
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm">
                    Create Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
