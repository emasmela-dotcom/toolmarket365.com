export type HeatmapRecorderInput = {
  /** Lines like "12,34" or "12 34 5" = x y optional weight */
  samplesText: string
  gridSize?: number
}

export type HeatmapRecorderResult = {
  asciiGrid: string
  /** Cell count per row/column used for this preview (after clamping 4–12). */
  gridN: number
  implementationTips: string[]
  privacyChecklist: string[]
}

function parseSamples(text: string): { x: number; y: number; w: number }[] {
  const out: { x: number; y: number; w: number }[] = []
  for (const line of text.split(/\r?\n/)) {
    const parts = line.trim().split(/[\s,;]+/).map(Number).filter((n) => !Number.isNaN(n))
    if (parts.length >= 2) {
      out.push({ x: parts[0] % 100, y: parts[1] % 100, w: parts[2] > 0 ? parts[2] : 1 })
    }
  }
  return out
}

function resolveGridN(raw: number | undefined): number {
  const fallback = 8
  if (raw === undefined || !Number.isFinite(raw)) return fallback
  const rounded = Math.round(raw)
  if (!Number.isFinite(rounded) || rounded <= 0) return fallback
  return Math.min(12, Math.max(4, rounded))
}

/** Textual heat grid from click coordinates + guidance for real session recording. */
export function buildHeatmapRecorderPlan(input: HeatmapRecorderInput): HeatmapRecorderResult {
  const n = resolveGridN(input.gridSize)
  const cells = Array.from({ length: n }, () => Array(n).fill(0))
  let samples = parseSamples(input.samplesText)
  if (samples.length === 0) {
    samples = [{ x: 50, y: 50, w: 1 }]
  }

  for (const s of samples) {
    const gx = Math.min(n - 1, Math.floor((s.x / 100) * n))
    const gy = Math.min(n - 1, Math.floor((s.y / 100) * n))
    cells[gy][gx] += s.w
  }

  const max = Math.max(1, ...cells.flat())
  /** First char must be visible (not space) or an “empty” grid looks broken. */
  const chars = '.:-=+*#%@'
  const asciiGrid = cells
    .map((row) =>
      row
        .map((v) => {
          const idx = Math.round((v / max) * (chars.length - 1))
          return chars[idx] ?? ' '
        })
        .join('')
    )
    .join('\n')

  const implementationTips = [
    'Production heatmaps usually use a small SDK (e.g. Hotjar, Clarity, FullStory) — this tool visualizes pasted samples only.',
    'Sample at most click/x/y from your own analytics export; never paste PII.',
    'Debounce pointer events and batch posts every N seconds to reduce noise and cost.',
    'Respect Do Not Track / consent banners before recording.',
  ]

  const privacyChecklist = [
    'Document what is recorded (URL, coordinates, device class) in your privacy policy.',
    'Mask password fields and credit-card inputs at capture time.',
    'Offer opt-out and data deletion aligned with your jurisdiction.',
  ]

  return { asciiGrid, gridN: n, implementationTips, privacyChecklist }
}
