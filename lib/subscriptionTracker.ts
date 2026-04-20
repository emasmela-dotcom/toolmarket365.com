export type SubscriptionTrackerInput = {
  /** Lines: Service name, 29, monthly | yearly */
  rawLines: string[]
}

export type SubscriptionRow = { name: string; amount: number; cadence: 'monthly' | 'yearly' }

export type SubscriptionTrackerResult = {
  rows: SubscriptionRow[]
  monthlyEquivalent: number
  yearlyBurn: number
  markdownTable: string
}

function parseLine(line: string): SubscriptionRow | null {
  const parts = line.split(',').map((s) => s.trim())
  if (parts.length < 2) return null
  const name = parts[0]
  const amount = Number(parts[1].replace(/[^0-9.-]/g, ''))
  if (!name || Number.isNaN(amount)) return null
  const c = (parts[2] || 'monthly').toLowerCase()
  const cadence: 'monthly' | 'yearly' = c.startsWith('y') ? 'yearly' : 'monthly'
  return { name, amount, cadence }
}

export function trackSubscriptions(input: SubscriptionTrackerInput): SubscriptionTrackerResult {
  const rows: SubscriptionRow[] = []
  for (const line of input.rawLines) {
    const r = parseLine(line)
    if (r) rows.push(r)
  }
  let monthlyEquivalent = 0
  let yearlyBurn = 0
  for (const r of rows) {
    if (r.cadence === 'monthly') {
      monthlyEquivalent += r.amount
      yearlyBurn += r.amount * 12
    } else {
      monthlyEquivalent += r.amount / 12
      yearlyBurn += r.amount
    }
  }
  const md = `| Service | Amount | Cadence | Monthly eq. |
|---------|--------|---------|-------------|
${rows
  .map((r) => {
    const meq = r.cadence === 'monthly' ? r.amount : r.amount / 12
    return `| ${r.name} | ${r.amount.toFixed(2)} | ${r.cadence} | ${meq.toFixed(2)} |`
  })
  .join('\n')}

**Approx. monthly burn:** ${monthlyEquivalent.toFixed(2)}  
**Approx. yearly burn:** ${yearlyBurn.toFixed(2)}
`
  return { rows, monthlyEquivalent, yearlyBurn, markdownTable: md.trim() }
}
