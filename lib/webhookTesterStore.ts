export type WebhookCapturedEvent = {
  id: string
  receivedAt: string
  method: string
  query: Record<string, string>
  headers: Record<string, string>
  bodyPreview: string
  bodyBytes: number
}

const MAX_EVENTS_PER_TOKEN = 40
const MAX_TOKENS = 150

const buckets = new Map<string, WebhookCapturedEvent[]>()
const tokenTouch = new Map<string, number>()

function pruneTokens() {
  if (tokenTouch.size <= MAX_TOKENS) return
  const entries = [...tokenTouch.entries()].sort((a, b) => a[1] - b[1])
  const drop = entries.slice(0, tokenTouch.size - MAX_TOKENS + 5)
  for (const [t] of drop) {
    tokenTouch.delete(t)
    buckets.delete(t)
  }
}

export function isValidWebhookToken(token: string): boolean {
  return /^[a-zA-Z0-9_-]{16,128}$/.test(token)
}

export function appendWebhookCapture(
  token: string,
  partial: Omit<WebhookCapturedEvent, 'id' | 'receivedAt'> & {
    id?: string
    receivedAt?: string
  }
): WebhookCapturedEvent {
  tokenTouch.set(token, Date.now())
  pruneTokens()
  const id = partial.id ?? crypto.randomUUID()
  const receivedAt = partial.receivedAt ?? new Date().toISOString()
  const ev: WebhookCapturedEvent = {
    id,
    receivedAt,
    method: partial.method,
    query: partial.query,
    headers: partial.headers,
    bodyPreview: partial.bodyPreview,
    bodyBytes: partial.bodyBytes,
  }
  const list = buckets.get(token) ?? []
  list.unshift(ev)
  while (list.length > MAX_EVENTS_PER_TOKEN) list.pop()
  buckets.set(token, list)
  return ev
}

export function listWebhookCaptures(token: string): WebhookCapturedEvent[] {
  tokenTouch.set(token, Date.now())
  return [...(buckets.get(token) ?? [])]
}
