export type TwitterThreadInput = {
  text: string
  maxChars?: number
}

export type TwitterThreadResult = {
  tweets: string[]
}

export function composeTwitterThread(input: TwitterThreadInput): TwitterThreadResult {
  const max = Math.min(280, Math.max(100, input.maxChars ?? 270))
  const raw = input.text.trim().replace(/\s+/g, ' ')
  if (!raw) return { tweets: [] }

  const tweets: string[] = []
  let remaining = raw
  while (remaining.length > 0) {
    if (remaining.length <= max) {
      tweets.push(remaining)
      break
    }
    let cut = remaining.lastIndexOf(' ', max)
    if (cut < max * 0.5) cut = max
    tweets.push(remaining.slice(0, cut).trim())
    remaining = remaining.slice(cut).trim()
  }
  return { tweets: tweets.map((t, i) => `${i + 1}/${tweets.length} ${t}`) }
}
