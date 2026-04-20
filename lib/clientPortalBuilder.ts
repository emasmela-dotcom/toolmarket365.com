export type ClientPortalInput = {
  clientName: string
  modules: string[]
}

export type ClientPortalResult = {
  outlineMarkdown: string
}

export function buildClientPortalOutline(input: ClientPortalInput): ClientPortalResult {
  const c = input.clientName.trim() || 'Client'
  const mods = input.modules.length
    ? input.modules
    : ['Status', 'Files', 'Invoices', 'Messages', 'Approvals']

  const sections = mods.map(
    (m) => `### ${m}\n- Latest update pinned at top\n- Permissions: client read/write as needed\n- Audit trail on uploads\n`
  )

  const outlineMarkdown = `# Portal: ${c}

## Home
- Branded header, primary CTA (approve / pay / reply)

${sections.join('\n')}

## Footer
- Support link, timezone, data retention note
`.trim()

  return { outlineMarkdown }
}
