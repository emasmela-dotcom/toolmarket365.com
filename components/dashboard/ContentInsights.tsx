'use client'

import { Lightbulb, Clock, Hash } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export function ContentInsights({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No insights data available yet.
      </div>
    )
  }

  const patternAnalysis = data.patternAnalysis || []
  const winningContent = data.winningContent || []
  const timingInsights = data.timingInsights || []
  const hashtagPerformance = data.hashtagPerformance || []

  return (
    <div className="space-y-6">
      {/* Pattern Analysis */}
      {patternAnalysis.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">🧠 Your Content Patterns</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={patternAnalysis}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="type" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Success Rate"
                    dataKey="successRate"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Winning Pattern Combinations</h3>
              {patternAnalysis.map((pattern: any, index: number) => (
                <div key={index} className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium capitalize text-gray-900 dark:text-white">{pattern.type}</span>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      pattern.successRate > 70 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {Math.round(pattern.successRate)}% success
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {pattern.description}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Used in {pattern.frequency} posts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Winning Content Formula */}
      {winningContent.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">🏆 Your Winning Content Formula</h2>
          <div className="space-y-6">
            {winningContent.map((content: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{content.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{content.description}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 ml-4">
                    {Math.round(content.performanceBoost)}% boost
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {content.metrics.engagementRate}%
                    </div>
                    <div className="text-xs text-gray-500">Engagement Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {content.metrics.viralScore}
                    </div>
                    <div className="text-xs text-gray-500">Viral Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {content.metrics.reach}
                    </div>
                    <div className="text-xs text-gray-500">Reach Multiplier</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {content.metrics.saves}
                    </div>
                    <div className="text-xs text-gray-500">Save Rate</div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Key Elements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {content.keyElements.map((element: string, elementIndex: number) => (
                      <div
                        key={elementIndex}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                      >
                        {element}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Optimal Timing */}
        {timingInsights.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Optimal Posting Times</h2>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={timingInsights}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="timeSlot" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="performance" fill="#8884d8" name="Performance Score" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {timingInsights.slice(0, 3).map((time: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white dark:bg-gray-900 rounded">
                  <span className="font-medium text-gray-900 dark:text-white">{time.timeSlot}</span>
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {Math.round(time.performance)}% performance
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hashtag Performance */}
        {hashtagPerformance.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <Hash className="w-5 h-5 mr-2" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Performing Hashtags</h2>
            </div>
            <div className="space-y-3">
              {hashtagPerformance.map((hashtag: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">#{hashtag.tag}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">{hashtag.boost}%</div>
                    <div className="text-xs text-gray-500">engagement boost</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Lightbulb className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personalized Content Recommendations</h2>
          </div>
          <div className="space-y-4">
            {data.recommendations.map((rec: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h3>
                  <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    Expected: +{rec.expectedImprovement}%
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Based on your {rec.basedOn} pattern
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm">
                    Try This
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
