export type ChangelogInput = {
  version: string
  commitsText: string
}

export type ChangelogResult = {
  markdown: string
}

function bucket(line: string): 'added' | 'changed' | 'fixed' | 'other' {
  const l = line.toLowerCase()
  if (/^(feat|feature|add)\b|^\+/.test(l)) return 'added'
  if (/^(fix|bug|hotfix)\b/.test(l)) return 'fixed'
  if (/^(chore|docs|refactor|perf|style|test)\b/.test(l)) return 'changed'
  if (l.includes('fix')) return 'fixed'
  if (l.includes('add') || l.includes('new')) return 'added'
  return 'other'
}

/** Build Keep-a-Changelog–style notes from pasted commit lines. */
export function changelogFromCommits(input: ChangelogInput): ChangelogResult {
  const version = (input.version || 'Unreleased').trim() || 'Unreleased'
  const lines = input.commitsText
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-*]\s*/, '').trim())
    .filter(Boolean)

  const groups: Record<'added' | 'changed' | 'fixed' | 'other', string[]> = {
    added: [],
    changed: [],
    fixed: [],
    other: [],
  }

  for (const line of lines) {
    groups[bucket(line)].push(line)
  }

  const section = (title: string, items: string[]) =>
    items.length
      ? `### ${title}\n${items.map((i) => `- ${i}`).join('\n')}\n`
      : ''

  const markdown = `## [${version}] - ${new Date().toISOString().slice(0, 10)}

${section('Added', groups.added)}${section('Changed', groups.changed)}${section('Fixed', groups.fixed)}${section('Other', groups.other)}
---
_Generated from pasted commits — edit grouping before publishing._
`

  return { markdown: markdown.trim() }
}
