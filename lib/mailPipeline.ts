export const MAIL_PIPELINE_STAGES = [
  'New',
  'Talking',
  'Proposal Sent',
  'Verbal Yes',
  'Won',
  'Lost',
] as const

export type MailPipelineStage = (typeof MAIL_PIPELINE_STAGES)[number]

export type MailPipelineDeal = {
  id: string
  title: string
  contactEmail: string
  stage: MailPipelineStage
  amount: string
  lastContactAt: string
  nextFollowUpAt: string
  notes: string
}

export const MAIL_PIPELINE_STORAGE_KEY = 'toolmarket365-mailpipeline-v1'

export function createMailPipelineId() {
  return crypto.randomUUID()
}

export function emptyMailPipelineDeal(): Omit<MailPipelineDeal, 'id'> {
  const today = new Date().toISOString().slice(0, 10)
  return {
    title: '',
    contactEmail: '',
    stage: 'New',
    amount: '',
    lastContactAt: today,
    nextFollowUpAt: today,
    notes: '',
  }
}

export function normalizeMailPipelineDeals(raw: unknown): MailPipelineDeal[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const d = item as Partial<MailPipelineDeal>
      const stage = MAIL_PIPELINE_STAGES.includes(d.stage as MailPipelineStage)
        ? (d.stage as MailPipelineStage)
        : 'New'
      return {
        id: typeof d.id === 'string' ? d.id : createMailPipelineId(),
        title: typeof d.title === 'string' ? d.title : 'Untitled thread',
        contactEmail: typeof d.contactEmail === 'string' ? d.contactEmail : '',
        stage,
        amount: typeof d.amount === 'string' ? d.amount : '',
        lastContactAt:
          typeof d.lastContactAt === 'string' ? d.lastContactAt : '',
        nextFollowUpAt:
          typeof d.nextFollowUpAt === 'string' ? d.nextFollowUpAt : '',
        notes: typeof d.notes === 'string' ? d.notes : '',
      }
    })
    .filter((d): d is MailPipelineDeal => d !== null)
}

function dayStamp(value: string) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function todaysMailPipelineFollowUps(deals: MailPipelineDeal[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayMs = today.getTime()
  return deals.filter((deal) => {
    if (deal.stage === 'Won' || deal.stage === 'Lost') return false
    const follow = dayStamp(deal.nextFollowUpAt)
    return follow !== null && follow <= todayMs
  })
}

export function formatMailPipelineDate(value: string) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function shiftMailPipelineDate(value: string, days: number) {
  const base = value ? new Date(value) : new Date()
  if (Number.isNaN(base.getTime())) {
    const fallback = new Date()
    fallback.setDate(fallback.getDate() + days)
    return fallback.toISOString().slice(0, 10)
  }
  base.setDate(base.getDate() + days)
  return base.toISOString().slice(0, 10)
}

export function getMailPipelineStats(deals: MailPipelineDeal[]) {
  const open = deals.filter((d) => d.stage !== 'Won' && d.stage !== 'Lost')
  return {
    total: deals.length,
    open: open.length,
    dueToday: todaysMailPipelineFollowUps(deals).length,
    won: deals.filter((d) => d.stage === 'Won').length,
  }
}

/** Starter deals so the page isn’t blank on first visit. */
export const mailPipelineSampleDeals: MailPipelineDeal[] = [
  {
    id: 'sample-acme',
    title: 'Website redesign proposal — Acme Co',
    contactEmail: 'jordan@acme.example',
    stage: 'Proposal Sent',
    amount: '$4,500',
    lastContactAt: shiftMailPipelineDate('', -2),
    nextFollowUpAt: shiftMailPipelineDate('', 0),
    notes: 'Sent proposal Monday. Waiting on budget reply.',
  },
  {
    id: 'sample-north',
    title: 'Monthly retainer kickoff — North Studio',
    contactEmail: 'sam@north.example',
    stage: 'Talking',
    amount: '$1,200/mo',
    lastContactAt: shiftMailPipelineDate('', -1),
    nextFollowUpAt: shiftMailPipelineDate('', 1),
    notes: 'They liked the scope. Confirm start date.',
  },
  {
    id: 'sample-won',
    title: 'Logo package — Bright Leaf',
    contactEmail: 'hello@brightleaf.example',
    stage: 'Won',
    amount: '$900',
    lastContactAt: shiftMailPipelineDate('', -5),
    nextFollowUpAt: shiftMailPipelineDate('', -3),
    notes: 'Paid. Archive when files delivered.',
  },
]

