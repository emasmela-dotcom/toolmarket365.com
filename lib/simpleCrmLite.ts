export type SimpleCrmInput = {
  /** TSV or CSV: name, email, stage, note */
  rawRows: string
}

export type SimpleCrmResult = {
  byStage: { stage: string; count: number; contacts: string[] }[]
  total: number
}

export function summarizeCrmPipeline(input: SimpleCrmInput): SimpleCrmResult {
  const lines = input.rawRows.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  const map = new Map<string, string[]>()
  for (const line of lines) {
    const parts = line.split(/\t|,/).map((s) => s.trim())
    const name = parts[0] || 'Unknown'
    const stage = (parts[2] || 'lead').toLowerCase()
    const list = map.get(stage) || []
    list.push(name)
    map.set(stage, list)
  }
  const byStage = [...map.entries()].map(([stage, contacts]) => ({
    stage,
    count: contacts.length,
    contacts,
  }))
  return { byStage, total: lines.length }
}
