import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'
    const platform = searchParams.get('platform') || 'all'
    const userId = searchParams.get('userId') || 'anonymous'

    const now = new Date()
    const startDate = getStartDate(range, now)

    const accuracyData = await getAccuracyData(
      userId,
      startDate.toISOString(),
      now.toISOString(),
      platform
    )

    return NextResponse.json(accuracyData)

  } catch (error) {
    console.error('Accuracy data error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accuracy data' },
      { status: 500 }
    )
  }
}

async function getAccuracyData(
  userId: string,
  startDate: string,
  endDate: string,
  platform: string
) {
  if (!sql) {
    return getMockAccuracyData()
  }

  try {
    let query = sql`
      SELECT * FROM content_performance
      WHERE user_id = ${userId}
        AND created_at >= ${startDate}
        AND created_at <= ${endDate}
      ORDER BY created_at DESC
    `

    if (platform !== 'all') {
      query = sql`
        SELECT * FROM content_performance
        WHERE user_id = ${userId}
          AND created_at >= ${startDate}
          AND created_at <= ${endDate}
          AND content->>'platform' = ${platform}
        ORDER BY created_at DESC
      `
    }

    const performances = await query

    if (performances.length === 0) {
      return getMockAccuracyData()
    }

    // Calculate overall accuracy
    const accuracies = performances
      .map((p: any) => p.accuracy ? (p.accuracy as any).overall : 0)
      .filter((a: number) => a > 0)
    
    const overallAccuracy = accuracies.length > 0
      ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length)
      : 0

    // Calculate metric-specific accuracies
    const likesAccuracies = performances
      .map((p: any) => p.accuracy ? (p.accuracy as any).likes : 0)
      .filter((a: number) => a > 0)
    const likesAccuracy = likesAccuracies.length > 0
      ? Math.round(likesAccuracies.reduce((a, b) => a + b, 0) / likesAccuracies.length)
      : 0

    const commentsAccuracies = performances
      .map((p: any) => p.accuracy ? (p.accuracy as any).comments : 0)
      .filter((a: number) => a > 0)
    const commentsAccuracy = commentsAccuracies.length > 0
      ? Math.round(commentsAccuracies.reduce((a, b) => a + b, 0) / commentsAccuracies.length)
      : 0

    const sharesAccuracies = performances
      .map((p: any) => p.accuracy ? (p.accuracy as any).shares : 0)
      .filter((a: number) => a > 0)
    const sharesAccuracy = sharesAccuracies.length > 0
      ? Math.round(sharesAccuracies.reduce((a, b) => a + b, 0) / sharesAccuracies.length)
      : 0

    const viewsAccuracies = performances
      .map((p: any) => p.accuracy ? (p.accuracy as any).views : 0)
      .filter((a: number) => a > 0)
    const viewsAccuracy = viewsAccuracies.length > 0
      ? Math.round(viewsAccuracies.reduce((a, b) => a + b, 0) / viewsAccuracies.length)
      : 0

    // Calculate average confidence
    const confidences = performances
      .map((p: any) => p.prediction ? (p.prediction as any).confidence : 0)
      .filter((c: number) => c > 0)
    const averageConfidence = confidences.length > 0
      ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
      : 0

    const highConfidencePredictions = confidences.filter((c: number) => c > 80).length

    // Calculate accuracy trend
    const accuracyTrend = calculateAccuracyTrend(performances)

    // Metric breakdown
    const metricBreakdown = [
      { metric: 'Likes', accuracy: likesAccuracy, target: 80 },
      { metric: 'Comments', accuracy: commentsAccuracy, target: 75 },
      { metric: 'Shares', accuracy: sharesAccuracy, target: 70 },
      { metric: 'Views', accuracy: viewsAccuracy, target: 85 }
    ]

    // Confidence correlation
    const confidenceCorrelation = calculateConfidenceCorrelation(performances)

    return {
      overallAccuracy,
      accuracyTrend: accuracyTrend,
      averageConfidence,
      highConfidencePredictions,
      likesAccuracy,
      commentsAccuracy,
      sharesAccuracy,
      viewsAccuracy,
      metricBreakdown,
      confidenceCorrelation,
      highAccuracyFactors: [
        'High confidence predictions (>80%)',
        'Content with emotional triggers',
        'Optimal posting times'
      ],
      improvementAreas: [
        'Weekend content predictions',
        'Carousel post accuracy',
        'Long-form content analysis'
      ]
    }
  } catch (error) {
    console.error('Error fetching accuracy data:', error)
    return getMockAccuracyData()
  }
}

function calculateAccuracyTrend(performances: any[]) {
  // Group by week
  const weeklyData: Record<string, number[]> = {}
  
  performances.forEach((perf: any) => {
    const date = new Date(perf.created_at)
    const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`
    if (!weeklyData[week]) {
      weeklyData[week] = []
    }
    if (perf.accuracy) {
      weeklyData[week].push((perf.accuracy as any).overall || 0)
    }
  })

  return Object.entries(weeklyData)
    .map(([week, accuracies]) => ({
      date: week,
      accuracy: accuracies.length > 0 
        ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length)
        : 0,
      confidence: 75 // Mock confidence
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

function calculateConfidenceCorrelation(performances: any[]) {
  // Group by confidence ranges
  const ranges = [
    { min: 0, max: 50, data: [] as number[] },
    { min: 50, max: 70, data: [] as number[] },
    { min: 70, max: 85, data: [] as number[] },
    { min: 85, max: 100, data: [] as number[] }
  ]

  performances.forEach((perf: any) => {
    const confidence = perf.prediction ? (perf.prediction as any).confidence : 0
    const accuracy = perf.accuracy ? (perf.accuracy as any).overall : 0
    
    ranges.forEach(range => {
      if (confidence >= range.min && confidence < range.max) {
        range.data.push(accuracy)
      }
    })
  })

  return ranges.map(range => ({
    confidence: `${range.min}-${range.max}`,
    accuracy: range.data.length > 0
      ? Math.round(range.data.reduce((a, b) => a + b, 0) / range.data.length)
      : 0
  }))
}

function getStartDate(range: string, now: Date): Date {
  const ranges: Record<string, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '1y': 365
  }
  
  const days = ranges[range] || 30
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - days)
  return startDate
}

function getMockAccuracyData() {
  return {
    overallAccuracy: 0,
    accuracyTrend: 0,
    averageConfidence: 0,
    highConfidencePredictions: 0,
    likesAccuracy: 0,
    commentsAccuracy: 0,
    sharesAccuracy: 0,
    viewsAccuracy: 0,
    accuracyTrend: [],
    metricBreakdown: [],
    confidenceCorrelation: [],
    highAccuracyFactors: [],
    improvementAreas: []
  }
}
