'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Target, BarChart3, GitCompare, Award } from 'lucide-react';
import { PerformanceOverview } from '@/components/dashboard/PerformanceOverview'
import { AccuracyTracker } from '@/components/dashboard/AccuracyTracker'
import { ContentInsights } from '@/components/dashboard/ContentInsights'
import { ABTestManager } from '@/components/dashboard/ABTestManager'
import { ROITracker } from '@/components/dashboard/ROITracker'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    title: '📊 Content Performance Dashboard',
    subtitle: 'Track predictions vs actual results',
    last7Days: 'Last 7 days',
    last30Days: 'Last 30 days',
    last90Days: 'Last 90 days',
    lastYear: 'Last year',
    allPlatforms: 'All Platforms',
    predictionAccuracy: 'Prediction Accuracy',
    totalContentAnalyzed: 'Total Content Analyzed',
    viralContentRate: 'Viral Content Rate',
    abTestsRunning: 'A/B Tests Running',
    tabOverview: 'Performance Overview',
    tabAccuracy: 'Accuracy Tracking',
    tabInsights: 'Content Insights',
    tabAbTests: 'A/B Testing',
    tabRoi: 'ROI Analysis',
  },
  es: {
    title: '📊 Panel de rendimiento de contenido',
    subtitle: 'Compara predicciones con resultados reales',
    last7Days: 'Últimos 7 días',
    last30Days: 'Últimos 30 días',
    last90Days: 'Últimos 90 días',
    lastYear: 'Último año',
    allPlatforms: 'Todas las plataformas',
    predictionAccuracy: 'Precisión de predicciones',
    totalContentAnalyzed: 'Contenido total analizado',
    viralContentRate: 'Tasa de contenido viral',
    abTestsRunning: 'Pruebas A/B en curso',
    tabOverview: 'Resumen de rendimiento',
    tabAccuracy: 'Seguimiento de precisión',
    tabInsights: 'Información del contenido',
    tabAbTests: 'Pruebas A/B',
    tabRoi: 'Análisis de ROI',
  },
}

export default function ContentPerformanceDashboard() {
  const { language } = useLanguage()
  const c = copy[language]
  const [timeRange, setTimeRange] = useState('30d')
  const [platform, setPlatform] = useState('all')
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [accuracyData, setAccuracyData] = useState<any>(null)
  const [insightsData, setInsightsData] = useState<any>(null)
  const [abTestData, setAbTestData] = useState<any>(null)
  const [roiData, setRoiData] = useState<any>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [timeRange, platform])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    
    try {
      const userId = 'anonymous' // Replace with actual user ID from auth
      
      // Fetch all dashboard data
      const [performance, accuracy, insights, abTests, roi] = await Promise.all([
        fetch(`/api/dashboard/performance?range=${timeRange}&platform=${platform}&userId=${userId}`).then(r => r.json()),
        fetch(`/api/dashboard/accuracy?range=${timeRange}&platform=${platform}&userId=${userId}`).then(r => r.json()),
        fetch(`/api/dashboard/insights?range=${timeRange}&platform=${platform}&userId=${userId}`).then(r => r.json()),
        fetch(`/api/dashboard/ab-tests?range=${timeRange}&userId=${userId}`).then(r => r.json()),
        fetch(`/api/dashboard/performance?range=${timeRange}&platform=${platform}&userId=${userId}`).then(r => r.json())
      ])

      setPerformanceData(performance)
      setAccuracyData(accuracy)
      setInsightsData(insights)
      setAbTestData(abTests)
      setRoiData(roi)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: c.tabOverview },
    { id: 'accuracy', label: c.tabAccuracy },
    { id: 'insights', label: c.tabInsights },
    { id: 'ab-tests', label: c.tabAbTests },
    { id: 'roi', label: c.tabRoi },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{c.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{c.subtitle}</p>
          </div>
          
          <div className="flex gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="7d">{c.last7Days}</option>
              <option value="30d">{c.last30Days}</option>
              <option value="90d">{c.last90Days}</option>
              <option value="1y">{c.lastYear}</option>
            </select>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">{c.allPlatforms}</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter</option>
            </select>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title={c.predictionAccuracy}
            value={`${accuracyData?.overallAccuracy || 0}%`}
            change={accuracyData?.accuracyTrend || 0}
            icon={<Target className="w-8 h-8 text-blue-500" />}
          />
          <MetricCard
            title={c.totalContentAnalyzed}
            value={performanceData?.totalContent || 0}
            change={performanceData?.contentGrowth || 0}
            icon={<BarChart3 className="w-8 h-8 text-green-500" />}
          />
          <MetricCard
            title={c.viralContentRate}
            value={`${performanceData?.viralRate || 0}%`}
            change={0}
            icon={<Award className="w-8 h-8 text-purple-500" />}
          />
          <MetricCard
            title={c.abTestsRunning}
            value={abTestData?.activeTestsCount ?? (Array.isArray(abTestData?.activeTests) ? abTestData.activeTests.length : 0)}
            change={0}
            icon={<GitCompare className="w-8 h-8 text-orange-500" />}
          />
        </div>

        {/* Main Dashboard Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && <PerformanceOverview data={performanceData} />}
          {activeTab === 'accuracy' && <AccuracyTracker data={accuracyData} />}
          {activeTab === 'insights' && <ContentInsights data={insightsData} />}
          {activeTab === 'ab-tests' && <ABTestManager data={abTestData} />}
          {activeTab === 'roi' && <ROITracker data={roiData} />}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, icon }: any) {
  const isPositive = change > 0
  const changeColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
  const changeIcon = isPositive ? '↗' : '↘'

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {change !== 0 && (
            <p className={`text-sm ${changeColor} flex items-center mt-1`}>
              <span>{changeIcon}</span>
              <span className="ml-1">{Math.abs(change)}%</span>
            </p>
          )}
        </div>
        {icon}
      </div>
    </div>
  )
}
