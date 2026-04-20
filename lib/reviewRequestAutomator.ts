export type ReviewRequestInput = {
  brandName: string
  productName: string
  reviewLink: string
}

export type ReviewRequestResult = {
  emailDay3: string
  emailDay10: string
  smsShort: string
}

export function buildReviewRequestCopy(input: ReviewRequestInput): ReviewRequestResult {
  const b = input.brandName.trim() || 'Our shop'
  const p = input.productName.trim() || 'your order'
  const u = input.reviewLink.trim() || 'https://'

  const emailDay3 = `Subject: How’s ${p} treating you?\n\nHi — it’s ${b}. If you’re loving ${p}, a 20-second review helps others decide.\n${u}\n\nThank you either way.`

  const emailDay10 = `Subject: Quick favor — review ${p}\n\nWe’re a small team and reviews keep us shipping. If anything’s wrong, reply here first; if you’re happy, tap:\n${u}`

  const smsShort = `${b}: Enjoying ${p}? Star us here (20s): ${u}`

  return { emailDay3, emailDay10, smsShort }
}
