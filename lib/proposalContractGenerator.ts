export type ProposalContractInput = {
  clientName: string
  projectTitle: string
  scopeSummary: string
  fee: string
  paymentTerms: string
  termLength: string
}

export type ProposalContractResult = {
  proposalMarkdown: string
  contractChecklist: string[]
}

export function buildProposalAndContract(input: ProposalContractInput): ProposalContractResult {
  const proposalMarkdown = `# Proposal — ${input.projectTitle}

**Prepared for:** ${input.clientName.trim() || 'Client'}

## Scope
${input.scopeSummary.trim() || 'Describe deliverables, milestones, and out-of-scope items.'}

## Investment
${input.fee.trim() || 'Fee TBD'}

## Terms
- Payment: ${input.paymentTerms.trim() || 'Net 15'}
- Term: ${input.termLength.trim() || 'Until delivery + 30-day warranty'}
- Change requests: documented in writing; timeline/fees adjusted as needed.

## Acceptance
Signature below indicates agreement to scope and commercial terms.

---

_This is a drafting aid — have counsel review before e-signature._
`.trim()

  const contractChecklist = [
    'Entity names match invoices and tax IDs.',
    'IP assignment / license explicit for deliverables.',
    'Limitation of liability and confidentiality blocks present.',
    'Dispute resolution + governing law filled in.',
    'E-sign audit trail vendor chosen (Dropbox Sign, DocuSign, etc.).',
  ]

  return { proposalMarkdown, contractChecklist }
}
