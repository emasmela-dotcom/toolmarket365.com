import { NextRequest, NextResponse } from 'next/server'
import { buildEmbeddableForm, type FormBuilderField } from '@/lib/formBuilder'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    title?: string
    actionUrl?: string
    method?: 'post' | 'get'
    netlify?: boolean
    fields?: FormBuilderField[]
  }
  const title = typeof body.title === 'string' ? body.title : ''
  const actionUrl = typeof body.actionUrl === 'string' ? body.actionUrl : ''
  if (!actionUrl.trim()) {
    return NextResponse.json({ error: 'actionUrl is required' }, { status: 400 })
  }
  const fields = Array.isArray(body.fields) ? body.fields : []
  const method = body.method === 'get' ? 'get' : 'post'
  const result = buildEmbeddableForm({
    title,
    fields,
    actionUrl,
    method,
    netlify: Boolean(body.netlify),
  })
  return NextResponse.json(result)
}
