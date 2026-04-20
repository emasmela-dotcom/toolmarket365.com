export type WebhookInspectResult = {
  formattedBody: string
  parsedJson: unknown | null
  headerPairs: { name: string; value: string }[]
  hints: string[]
}

function parseHeaderBlock(block: string): { name: string; value: string }[] {
  const pairs: { name: string; value: string }[] = []
  for (const line of block.split(/\r?\n/)) {
    const m = line.match(/^([^:]+):\s*(.*)$/)
    if (m) pairs.push({ name: m[1].trim(), value: m[2].trim() })
  }
  return pairs
}

export function inspectWebhookPaste(rawBody: string, headersText: string): WebhookInspectResult {
  const hints: string[] = []
  const trimmed = rawBody.trim()
  let parsedJson: unknown | null = null
  let formattedBody = rawBody

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      parsedJson = JSON.parse(trimmed) as unknown
      formattedBody = JSON.stringify(parsedJson, null, 2)
    } catch {
      hints.push('Body looks like JSON but failed to parse — check trailing commas or quotes.')
    }
  } else if (trimmed.includes('=') && trimmed.includes('&')) {
    hints.push('Body looks like application/x-www-form-urlencoded (not parsed to objects here).')
  }

  const headerPairs = parseHeaderBlock(headersText)
  if (headersText.trim() && headerPairs.length === 0) {
    hints.push('No headers parsed — use lines like Content-Type: application/json')
  }

  return { formattedBody, parsedJson, headerPairs, hints }
}
