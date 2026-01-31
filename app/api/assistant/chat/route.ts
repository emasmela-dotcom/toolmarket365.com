import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/subscription'
import { getUserAPIKey } from '@/lib/services/external-ai-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CREATORFLOW_KNOWLEDGE = `CreatorFlow365 is a Micro-SaaS marketplace for content creators with 53+ tools.

Plans: Starter, Essential, Professional, Creator, Business. Pricing and features on /pricing.
Credits: Premium tools use credits per use. Plans include monthly credits. See /credits.
Tools: Organized by platform (Instagram, TikTok, YouTube, Twitter, LinkedIn, Facebook). Main areas: Tools (/tools), Content Library (/tools/content-library), Growth Suite (/growth-suite), Dashboard (/dashboard).
You cannot: schedule posts, post to social, connect APIs, or perform actions that require external services. Direct users to the right tool or page (e.g. "Use the Instagram Scheduler under Tools" or "Go to Dashboard > Caption Bot").
You can: answer questions about CreatorFlow365, explain plans/credits/tools, give general creator advice, and suggest which tool to use for a task.`

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req)
    if (!userId) {
      return NextResponse.json({ error: 'Sign in to use the assistant.' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const messages = Array.isArray(body.messages) ? body.messages : []
    const lastUser = messages.filter((m: { role: string }) => m.role === 'user').pop()
    const userMessage = lastUser?.content?.trim() || ''
    if (!userMessage) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY || (await getUserAPIKey(userId, 'openai'))
    if (!apiKey) {
      return NextResponse.json({
        error: 'No API key. Add OPENAI_API_KEY in env, or add your OpenAI key in Dashboard (e.g. Caption Bot or API Keys).',
        needsKey: true
      }, { status: 503 })
    }

    const { default: OpenAI } = await import('openai')
    const openai = new OpenAI({ apiKey })

    const systemContent = `${CREATORFLOW_KNOWLEDGE}

Be concise. If the user asks you to do something that requires an API or external action (post, schedule, connect, etc.), say you can't do that and point them to the right CreatorFlow365 tool or page.`

    const chatMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemContent },
      ...messages.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: typeof m.content === 'string' ? m.content : ''
      })).filter((m: { content: string }) => m.content)
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: chatMessages,
      max_tokens: 500,
      temperature: 0.7
    })

    const reply = completion.choices[0]?.message?.content?.trim() || 'I couldn’t generate a reply. Try again.'
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Assistant chat error:', err)
    return NextResponse.json({ error: 'Assistant failed. Try again.' }, { status: 500 })
  }
}
