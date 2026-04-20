export type LeadMagnetDeliveryInput = {
  magnetTitle: string
  downloadUrl: string
  fromName: string
}

export type LeadMagnetDeliveryResult = {
  email1: string
  email2: string
  email3: string
}

export function buildLeadMagnetSequence(input: LeadMagnetDeliveryInput): LeadMagnetDeliveryResult {
  const t = input.magnetTitle.trim() || 'your resource'
  const url = input.downloadUrl.trim() || 'https://'
  const from = input.fromName.trim() || 'The team'

  const email1 = `Subject: Here’s ${t}\n\nHi — ${from} here. Download ${t}:\n${url}\n\nIf the link expires, reply and we’ll resend.`

  const email2 = `Subject: Did ${t} land?\n\nQuick check — were you able to open ${t}? If not, tell us your preferred format (PDF / Notion / ZIP).`

  const email3 = `Subject: One thing to try from ${t}\n\nPick one action from page 1 of ${t} today. If you want the next resource, stay on this list — we send sparingly.`

  return { email1, email2, email3 }
}
