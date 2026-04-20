import { NextRequest, NextResponse } from 'next/server'
import { buildFreelancerInvoice } from '@/lib/invoiceGenerator'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const lines = Array.isArray(body.lines) ? body.lines : []
  const result = buildFreelancerInvoice({
    clientName: String(body.clientName || ''),
    yourBusinessName: String(body.yourBusinessName || ''),
    invoiceNumber: String(body.invoiceNumber || ''),
    dueDate: String(body.dueDate || ''),
    lines: lines.map((l: { description?: unknown; amount?: unknown; quantity?: unknown }) => ({
      description: String(l.description || ''),
      amount: Number(l.amount) || 0,
      quantity: l.quantity != null ? Number(l.quantity) : undefined,
    })),
    taxPercent: Number(body.taxPercent) || 0,
    currency: String(body.currency || 'USD'),
  })
  return NextResponse.json(result)
}
