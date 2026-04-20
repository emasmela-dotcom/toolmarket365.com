import { NextRequest, NextResponse } from 'next/server'
import { generateFeedbackWidgetSnippet } from '@/lib/feedbackWidgetGenerator'

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json(
    generateFeedbackWidgetSnippet({
      projectTitle: String(body.projectTitle || ''),
      webhookUrl: String(body.webhookUrl || ''),
    })
  )
}
