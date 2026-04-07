import { NextRequest, NextResponse } from 'next/server'
import { ViralPredictionEngine } from '@/lib/viral-predictor/ViralPredictionEngine'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, niche = 'general', userId = 'anonymous' } = body

    if (!content?.text || !content?.platform) {
      return NextResponse.json(
        { error: 'Content text and platform are required' },
        { status: 400 }
      )
    }

    // Initialize prediction engine
    const engine = new ViralPredictionEngine(content.platform)
    
    // Run prediction
    const prediction = await engine.predictViralPotential(
      content,
      userId || 'anonymous',
      niche
    )

    return NextResponse.json({ 
      success: true,
      prediction,
      message: 'Viral potential analyzed successfully'
    })

  } catch (error) {
    console.error('Viral prediction error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze viral potential', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET trending content endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform') || 'tiktok'
    const niche = searchParams.get('niche') || 'general'
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get trending content for inspiration
    const trendingContent = getTrendingContent(platform, niche, limit)

    return NextResponse.json({ 
      trending: trendingContent,
      platform,
      niche
    })

  } catch (error) {
    console.error('Trending content error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending content' },
      { status: 500 }
    )
  }
}

function getTrendingContent(platform: string, niche: string, limit: number): any[] {
  // Mock trending content - in production, this would fetch from APIs
  const mockContent = [
    { id: '1', title: 'Trending Topic 1', engagement: 95000, platform },
    { id: '2', title: 'Trending Topic 2', engagement: 87000, platform },
    { id: '3', title: 'Trending Topic 3', engagement: 72000, platform }
  ]
  
  return mockContent.slice(0, limit)
}
