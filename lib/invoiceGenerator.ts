export type InvoiceLine = { description: string; amount: number; quantity?: number }

export type InvoiceInput = {
  clientName: string
  yourBusinessName: string
  invoiceNumber: string
  dueDate: string
  lines: InvoiceLine[]
  taxPercent?: number
  currency?: string
}

export type InvoiceResult = { markdown: string; subtotal: number; tax: number; total: number }

export function buildFreelancerInvoice(input: InvoiceInput): InvoiceResult {
  const tax = Math.min(100, Math.max(0, input.taxPercent ?? 0))
  const currency = (input.currency || 'USD').toUpperCase()
  let subtotal = 0
  const rows = input.lines.map((l) => {
    const q = l.quantity && l.quantity > 0 ? l.quantity : 1
    const line = l.amount * q
    subtotal += line
    return `| ${l.description.replace(/\|/g, '/')} | ${q} | ${l.amount.toFixed(2)} | ${line.toFixed(2)} |`
  })
  const taxAmt = subtotal * (tax / 100)
  const total = subtotal + taxAmt
  const md = `# Invoice ${input.invoiceNumber}

**From:** ${input.yourBusinessName}  
**To:** ${input.clientName}  
**Due:** ${input.dueDate}

| Item | Qty | Rate (${currency}) | Line total |
|------|-----|----------------------|-------------|
${rows.join('\n')}

**Subtotal:** ${currency} ${subtotal.toFixed(2)}  
**Tax (${tax}%):** ${currency} ${taxAmt.toFixed(2)}  
**Total due:** ${currency} ${total.toFixed(2)}

_Payment terms: Net due by date above. Thank you._
`
  return { markdown: md.trim(), subtotal, tax: taxAmt, total }
}
