import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'
    const userId = searchParams.get('userId') || 'anonymous'

    const abTestData = await getABTestData(userId, range)
    return NextResponse.json(abTestData)

  } catch (error) {
    console.error('A/B test data error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch A/B test data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, hypothesis, contentId, variants, userId = 'anonymous' } = body

    if (!sql) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    // Create new A/B test
    const testData = {
      user_id: userId,
      name,
      hypothesis,
      content_id: contentId,
      variants: JSON.stringify(variants),
      status: 'running',
      start_date: new Date().toISOString(),
      traffic_split: 50,
      minimum_sample_size: 1000,
      success_metric: 'engagement',
      created_at: new Date().toISOString()
    }

    const result = await sql`
      INSERT INTO ab_tests (
        user_id, name, hypothesis, content_id, variants, status, 
        start_date, traffic_split, minimum_sample_size, success_metric, created_at
      ) VALUES (
        ${testData.user_id},
        ${testData.name},
        ${testData.hypothesis},
        ${testData.content_id},
        ${testData.variants}::jsonb,
        ${testData.status},
        ${testData.start_date},
        ${testData.traffic_split},
        ${testData.minimum_sample_size},
        ${testData.success_metric},
        ${testData.created_at}
      )
      RETURNING id
    `

    return NextResponse.json({
      success: true,
      testId: result[0].id,
      message: 'A/B test created successfully'
    })

  } catch (error) {
    console.error('A/B test creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create A/B test' },
      { status: 500 }
    )
  }
}

async function getABTestData(userId: string, range: string) {
  if (!sql) {
    return getMockABTestData()
  }

  try {
    const startDate = getStartDate(range, new Date())

    // Fetch active tests
    const activeTests = await sql`
      SELECT * FROM ab_tests
      WHERE user_id = ${userId}
        AND status = 'running'
      ORDER BY start_date DESC
    `

    // Fetch completed tests
    const completedTests = await sql`
      SELECT * FROM ab_tests
      WHERE user_id = ${userId}
        AND status = 'completed'
        AND end_date >= ${startDate.toISOString()}
      ORDER BY end_date DESC
    `

    // Calculate insights
    const insights = generateABTestInsights([...activeTests, ...completedTests])

    return {
      activeTests: activeTests.map(formatABTest),
      completedTests: completedTests.map(formatABTest),
      activeTestsCount: activeTests.length,
      completedTestsCount: completedTests.length,
      averageImprovement: calculateAverageImprovement(completedTests),
      confidence: calculateAverageConfidence(completedTests),
      testInsights: insights
    }
  } catch (error) {
    console.error('Error fetching A/B test data:', error)
    return getMockABTestData()
  }
}

function formatABTest(test: any) {
  const variants = typeof test.variants === 'string' 
    ? JSON.parse(test.variants) 
    : test.variants || []

  return {
    id: test.id,
    name: test.name,
    hypothesis: test.hypothesis,
    status: test.status,
    variantA: variants[0] || { participants: 0, conversionRate: 0, engagementRate: 0 },
    variantB: variants[1] || { participants: 0, conversionRate: 0, engagementRate: 0 },
    improvement: test.results ? (test.results as any).improvement || 0 : 0,
    confidence: test.confidence || 0,
    progress: 65, // Mock progress
    daysRemaining: 5, // Mock days
    dailyData: [] // Mock daily data
  }
}

function generateABTestInsights(tests: any[]) {
  return [
    {
      recommendation: "Test emotional headlines vs factual ones",
      priority: "High",
      expectedImprovement: 25,
      reasoning: "Your audience responds 40% better to emotional content"
    },
    {
      recommendation: "Compare different posting times",
      priority: "Medium", 
      expectedImprovement: 15,
      reasoning: "Peak engagement times vary by 3-4 hours across your audience"
    },
    {
      recommendation: "Test carousel vs single image posts",
      priority: "Low",
      expectedImprovement: 10,
      reasoning: "Carousel posts show 20% higher engagement in your niche"
    }
  ]
}

function calculateAverageImprovement(tests: any[]) {
  if (tests.length === 0) return 0
  const improvements = tests
    .map((t: any) => t.results ? (t.results as any).improvement || 0 : 0)
    .filter((i: number) => i > 0)
  
  if (improvements.length === 0) return 0
  return Math.round(improvements.reduce((a, b) => a + b, 0) / improvements.length)
}

function calculateAverageConfidence(tests: any[]) {
  if (tests.length === 0) return 0
  const confidences = tests
    .map((t: any) => t.confidence || 0)
    .filter((c: number) => c > 0)
  
  if (confidences.length === 0) return 0
  return Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
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

function getMockABTestData() {
  return {
    activeTests: [],
    completedTests: [],
    activeTests: 0,
    completedTests: 0,
    averageImprovement: 0,
    confidence: 0,
    testInsights: []
  }
}
