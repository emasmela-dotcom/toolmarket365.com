import { NextRequest, NextResponse } from 'next/server'
import { buildProposalAndContract } from '@/lib/proposalContractGenerator'

export async function POST(req: NextRequest) {
  const body = await req.json()
  return NextResponse.json(
    buildProposalAndContract({
      clientName: String(body.clientName || ''),
      projectTitle: String(body.projectTitle || ''),
      scopeSummary: String(body.scopeSummary || ''),
      fee: String(body.fee || ''),
      paymentTerms: String(body.paymentTerms || ''),
      termLength: String(body.termLength || ''),
    })
  )
}
