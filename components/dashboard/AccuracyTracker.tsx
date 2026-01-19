'use client'

import { Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts'

export function AccuracyTracker({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No accuracy data available yet.
      </div>
    )
  }

  const accuracyTrend = data.accuracyTrend || []
  const metricBreakdown = data.metricBreakdown || []
  const confidenceCorrelation = data.confidenceCorrelation || []

  return (
    <div className="space-y-6">
      {/* Accuracy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Overall Accuracy</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {data.overallAccuracy || 0}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {data.accuracyTrend > 0 ? (
              <span className="text-green-600 dark:text-green-400">↗ +{data.accuracyTrend}% this month</span>
            ) : (
              <span className="text-red-600 dark:text-red-400">↘ {data.accuracyTrend}% this month</span>
            )}
          </div>
          <div className="mt-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
              data.overallAccuracy > 80 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : data.overallAccuracy > 70
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {data.overallAccuracy > 80 ? 'Excellent' : data.overallAccuracy > 70 ? 'Good' : 'Needs Improvement'}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Prediction Confidence</h3>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {data.averageConfidence || 0}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Average confidence across all predictions
          </div>
          <div className="mt-4">
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 inline-block">
              {data.highConfidencePredictions || 0} high-confidence predictions
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Accuracy by Metric</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Likes</span>
              <span className="font-semibold text-gray-900 dark:text-white">{data.likesAccuracy || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Comments</span>
              <span className="font-semibold text-gray-900 dark:text-white">{data.commentsAccuracy || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Shares</span>
              <span className="font-semibold text-gray-900 dark:text-white">{data.sharesAccuracy || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Views</span>
              <span className="font-semibold text-gray-900 dark:text-white">{data.viewsAccuracy || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy Trend Chart */}
      {accuracyTrend.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">📈 Accuracy Trend Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={accuracyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis domain={[0, 100]} stroke="#6b7280" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="accuracy"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
                name="Accuracy %"
              />
              <Area
                type="monotone"
                dataKey="confidence"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
                name="Confidence %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metric Breakdown */}
        {metricBreakdown.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">📊 Metric Accuracy Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metricBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="metric" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#8884d8" name="Accuracy %" />
                <Bar dataKey="target" fill="#82ca9d" name="Target %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Confidence vs Accuracy */}
        {confidenceCorrelation.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">🎯 Confidence vs Accuracy Correlation</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={confidenceCorrelation}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="confidence" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Accuracy Insights */}
      {(data.highAccuracyFactors?.length > 0 || data.improvementAreas?.length > 0) && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">💡 Accuracy Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-green-600 dark:text-green-400">High Accuracy Factors</h3>
              <div className="space-y-2">
                {data.highAccuracyFactors?.map((factor: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-red-600 dark:text-red-400">Improvement Areas</h3>
              <div className="space-y-2">
                {data.improvementAreas?.map((area: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
