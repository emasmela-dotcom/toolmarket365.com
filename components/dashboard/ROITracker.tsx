'use client'

import { TrendingUp, DollarSign, Target } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export function ROITracker({ data }: { data: any }) {
  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No ROI data available yet.
      </div>
    )
  }

  // Mock ROI data - in production, this would come from the API
  const roiTrend = [
    { month: 'Jan', roi: 150, revenue: 5000 },
    { month: 'Feb', roi: 180, revenue: 6000 },
    { month: 'Mar', roi: 200, revenue: 7000 }
  ]

  const costBreakdown = [
    { name: 'Tool Usage', value: 500 },
    { name: 'Time Investment', value: 2000 },
    { name: 'Content Creation', value: 1500 }
  ]

  const revenueSources = [
    { source: 'Viral Content', revenue: 5000 },
    { source: 'Engagement Growth', revenue: 3000 },
    { source: 'Brand Partnerships', revenue: 2000 }
  ]

  const totalROI = 250
  const totalRevenue = 10000
  const totalCost = 4000
  const netProfit = totalRevenue - totalCost
  const efficiencyScore = 85

  return (
    <div className="space-y-6">
      {/* ROI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 mr-2 text-green-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Total ROI</h3>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {totalROI}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            <span className="text-green-600 dark:text-green-400">↗ +15% this month</span>
          </div>
          <div className="mt-4">
            <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 inline-block">
              Excellent
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Generated</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            From viral content predictions
          </div>
          <div className="mt-4 text-sm">
            <div className="text-gray-600 dark:text-gray-400">Cost: ${totalCost.toLocaleString()}</div>
            <div className="text-gray-900 dark:text-white font-semibold">Net: ${netProfit.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <Target className="w-5 h-5 mr-2 text-purple-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Efficiency Score</h3>
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {efficiencyScore}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Content efficiency rating
          </div>
          <div className="mt-4 text-sm">
            <div className="text-gray-600 dark:text-gray-400">Predictions: {data.totalContent || 0}</div>
            <div className="text-gray-600 dark:text-gray-400">Successful: {data.accuratePredictions || 0}</div>
          </div>
        </div>
      </div>

      {/* ROI Trend */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">📈 ROI Trend Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={roiTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="roi"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
              name="ROI %"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.3}
              name="Revenue $"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">💰 Cost Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7300'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {costBreakdown.map((item: any, index: number) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                <span className="font-semibold text-gray-900 dark:text-white">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Sources */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">💎 Revenue Sources</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueSources}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="source" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#82ca9d" name="Revenue $" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Performance Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">📅 Monthly Performance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.totalContent || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Predictions Made</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {data.accuratePredictions || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Successful Predictions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Revenue Generated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round(totalROI)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Monthly ROI</div>
          </div>
        </div>
      </div>
    </div>
  )
}
