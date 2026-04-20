export type ExpenseTrackerInput = {
  /** Lines: Category, 12.50, optional note */
  rawLines: string[]
}

export type ExpenseTrackerResult = {
  byCategory: { category: string; total: number; count: number }[]
  csv: string
  grandTotal: number
}

export function categorizeExpenses(input: ExpenseTrackerInput): ExpenseTrackerResult {
  const map = new Map<string, { total: number; count: number }>()
  let grand = 0
  for (const line of input.rawLines) {
    const parts = line.split(',').map((s) => s.trim())
    if (parts.length < 2) continue
    const cat = parts[0] || 'Uncategorized'
    const amt = Number(parts[1].replace(/[^0-9.-]/g, ''))
    if (Number.isNaN(amt)) continue
    grand += amt
    const cur = map.get(cat) || { total: 0, count: 0 }
    cur.total += amt
    cur.count += 1
    map.set(cat, cur)
  }
  const byCategory = [...map.entries()]
    .map(([category, v]) => ({ category, total: v.total, count: v.count }))
    .sort((a, b) => b.total - a.total)
  const csv = ['category,total,count', ...byCategory.map((r) => `${r.category},${r.total.toFixed(2)},${r.count}`)].join(
    '\n'
  )
  return { byCategory, csv, grandTotal: grand }
}
