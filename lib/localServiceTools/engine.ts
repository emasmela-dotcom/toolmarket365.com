import type { LifeToolRunResult } from "@/lib/lifeTools/types"
import { getLocalServiceTool } from "./metadata"

function str(v: Record<string, string>, k: string): string {
  return (v[k] || "").trim()
}

function num(v: Record<string, string>, k: string, d = 0): number {
  const n = Number(v[k])
  return Number.isFinite(n) ? n : d
}

type HFn = (v: Record<string, string>) => string

const H: Record<string, HFn> = {
  "review-trigger-sequence": (v) => {
    const b = str(v, "biz") || "Our team"
    const s = str(v, "service") || "your visit"
    const u = str(v, "reviewUrl") || "https://"
    const h = Math.max(1, Math.floor(num(v, "hours", 24)))
    return `## After-service / after-payment review sequence\n\n**Trigger:** ${h}h after appointment marked complete or payment captured.\n\n### Email (same window)\nSubject: Quick thank you + tiny favor — ${b}\n\nHi — thanks for choosing us for **${s}**. If we met expectations, a short review helps neighbors find us:\n${u}\nIf anything was off, reply to this email first so we can fix it.\n\n— ${b}\n\n### SMS (${h}h after visit)\n${b}: Thanks for visiting! If we earned it, tap to review (${h}h follow-up): ${u}\n\n_Automate via your CRM, Stripe webhook, or Zapier — this tool only supplies copy._`
  },
  "review-monitoring-checklist": (v) => {
    const g = str(v, "google") || "[Google Business Profile]"
    const y = str(v, "yelp")
    const f = str(v, "facebook")
    return `## Weekly review monitoring (15 min)\n\n- [ ] **Google** — ${g} — new reviews? star avg? report spam.\n- [ ] **Respond** within 24–48h on public reviews.\n${y ? `- [ ] **Yelp** — ${y}\n` : "- [ ] **Yelp** — (add URL in tool inputs)\n"}${f ? `- [ ] **Facebook** — ${f}\n` : "- [ ] **Facebook** — (optional)\n"}\n- [ ] Screenshot or log counts in your tracker sheet.\n\n_No API: you check each platform manually or with your stack._`
  },
  "review-response-generator": (v) => {
    const b = str(v, "biz") || "Team"
    const t = str(v, "tone") || "warm and brief"
    const s = str(v, "snippet") || "(paste review)"
    const low = /1\s*star|one star|terrible|worst|disappointed|never again/i.test(s)
    return `## Draft replies (${t})\n\n**If positive:**\n> Thank you for the kind words about ${s.slice(0, 80)}${s.length > 80 ? "…" : ""} — it means a lot to our small crew. We hope to see you again soon. — ${b}\n\n**If ${low ? "negative (detected keywords)" : "constructive or negative"}:**\n> ${b} here — I'm sorry this missed the mark. I'd like to make it right. Please email [your inbox] or call [phone] so we can sort it directly. We appreciate you telling us.\n\n_Edit names/contacts; never argue in public._\n\n**Review excerpt you pasted:**\n${s}`
  },
  "review-funnel-copy": (v) => {
    const b = str(v, "biz") || "Us"
    const good = str(v, "reviewUrl") || "https://g.page/r/..."
    const bad = str(v, "feedbackEmail") || "feedback@example.com"
    return `## Split review funnel\n\n### Step 1 — SMS or email (day 1)\n${b}: How did we do today? Reply **1** = loved it, **2** = something off.\n\n### Step 2a — If they reply 1 (happy)\nAmazing — would you mind 20 seconds on Google? ${good}\n\n### Step 2b — If they reply 2 (unhappy)\nSorry to hear that. Please tell us privately so a manager can respond: ${bad}\n\n### Micro-landing (optional)\nHeadline: **How was your visit?**\nButtons: **[Loved it → leave a review]** → ${good}  |  **[Not quite right → message us]** → mailto:${bad.replace(/^mailto:/i, "")}\n\n_Keep unhappy path off public review sites._`
  },
  "reputation-score-tracker": (v) => {
    const m = str(v, "month") || "This month"
    const a = Math.min(5, Math.max(0, num(v, "avgStars", 0)))
    const c = Math.max(0, Math.floor(num(v, "count", 0)))
    return `## Reputation log — ${m}\n\n| Month | Avg stars | Review count | Notes |\n|-------|-----------|----------------|-------|\n| ${m} | ${a || "—"} | ${c} | (add competitor or campaign note) |\n| _Prev_ | | | |\n\n**Ideas:** track Google vs Yelp separately; weight recency; flag months with campaigns.\n\n**This row:** avg **${a}** / 5, **${c}** reviews.`
  },
  "gbp-post-calendar": (v) => {
    const b = str(v, "biz") || "We"
    const o = str(v, "offer") || "mention your current promo"
    return `## 4-week GBP post rhythm — ${b}\n\n**Week 1 — Proof:** Before/after photo + 2 lines of outcome (get consent).\n**Week 2 — Offer:** ${o}\n**Week 3 — FAQ:** Answer one question customers always ask.\n**Week 4 — Team:** Introduce a staff member + why they care.\n\nRepeat with new angles. Keep CTA: Call | Book | Get directions.\n\n_GBP has character limits — trim to ~1500 chars; add UTM on links if you track web._`
  },
  "nap-consistency-checklist": (v) => {
    const n = str(v, "name")
    const a = str(v, "address")
    const p = str(v, "phone")
    if (!n || !a || !p) throw new Error("Enter name, address, and phone")
    return `## Canonical NAP (copy exactly everywhere)\n\n**Name:** ${n}\n**Address:** ${a}\n**Phone:** ${p}\n\n## Directory checklist\n\n- [ ] Google Business Profile\n- [ ] Apple Maps / Bing Places\n- [ ] Yelp\n- [ ] Facebook Page\n- [ ] BBB\n- [ ] Industry directories (Angi, Healthgrades, etc.)\n- [ ] Footer of website + Contact page\n- [ ] Email signatures\n- [ ] SMS autoresponder footer\n\n**Rule:** Same spelling, suite format, and phone style (choose **+1** vs parentheses and stick to it).`
  },
  "citation-duplicate-checklist": (v) => {
    const b = str(v, "biz") || "Your business"
    const c = str(v, "city") || "your city"
    return `## Citations & duplicates — ${b} (${c})\n\n1. Search \`"${b}" ${c}\` on Google — note extra profiles you did not create.\n2. Claim or merge duplicates on: Google, Yelp, Facebook, Apple.\n3. Fix wrong categories or closed locations on aggregators (Yext/Moz/listings if you use them).\n4. Add missing high-trust citations: chamber of commerce, local .gov if eligible.\n5. Export a spreadsheet: site | URL | login owner | last checked date.\n\n_This tool does not crawl the web — it's your ops checklist._`
  },
  "local-rank-tracker-log": (v) => {
    const k = str(v, "keyword") || "near me service"
    const z = str(v, "zip") || "00000"
    const u = str(v, "url") || "https://"
    return `## Local rank log\n\n**Keyword:** ${k}\n**Area:** ${z}\n**Target URL:** ${u}\n\n| Date | Device | Incognito? | Rank (or not in top 20) | SERP notes |\n|------|--------|------------|--------------------------|------------|\n| YYYY-MM-DD | mobile | yes | | |\n| YYYY-MM-DD | desktop | yes | | |\n\n**Tips:** same browser profile skews results; try maps pack vs organic; track 3–5 head terms max weekly.`
  },
  "gbp-qa-responder": (v) => {
    const b = str(v, "biz") || "We"
    const lines = str(v, "questions")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean)
    const qs = lines.length ? lines : ["Do you take walk-ins?", "What insurance?", "Parking?"]
    return `## GBP Q&A drafts — ${b}\n\n${qs
      .map(
        (q, i) =>
          `### Q${i + 1}: ${q}\n**A:** Thanks for asking — [specific accurate answer]. For the latest hours and availability, call [phone] or book at [URL]. — ${b}`
      )
      .join("\n\n")}\n\n_Verify facts; GBP Q&A is public and indexed._`
  },
  "appointment-reminder-sms": (v) => {
    const b = str(v, "biz") || "Our office"
    const n = str(v, "customer") || "Alex"
    return `## Reminder SMS pack — ${b}\n\n**T-48h:**\nHi ${n} — reminder: appt with ${b} in 2 days at [date time]. Reply C to confirm or R to reschedule.\n\n**T-2h:**\nHi ${n} — ${b} at [time] today. [Address]. Parking: [tip]. See you soon!\n\n_Add STOP/help language if required by your SMS provider / region._`
  },
  "noshow-rebook-sms": (v) => {
    const b = str(v, "biz") || "We"
    const u = str(v, "bookUrl") || "https://"
    return `## No-show follow-up — ${b}\n\n**SMS 1 (same day):** We missed you at [time] — everything ok? Rebook without fees this week: ${u}\n\n**SMS 2 (+48h if no reply):** Last note from ${b}: we'd love another chance. One-tap schedule: ${u}\n\n**Internal:** mark pipeline stage NO_SHOW; cap at 2 touches unless they opt in._`
  },
  "post-visit-review-sms": (v) => {
    const b = str(v, "biz") || "Us"
    const u = str(v, "reviewUrl") || "https://"
    return `## Post-visit review SMS — ${b}\n\nThanks for visiting ${b} today! If we earned 5 stars, this link helps a ton: ${u} — thank you!\n\n_Optional:_ add "Problems? Reply here first" with a monitored inbox._`
  },
  "broadcast-sms-templates": (v) => {
    const b = str(v, "biz") || "Local Biz"
    const m = str(v, "msg") || "Flash sale this weekend"
    return `## Broadcast SMS — ${b}\n\n**Compliance reminder:** only text opted-in lists; honor STOP; identify brand in body.\n\n**Template A — Offer:**\n${b}: ${m}. Reply STOP to opt out. Details: [short URL]\n\n**Template B — Closure:**\n${b}: We're closed [date] for [reason]. Appts resume [date]. Questions? Call [phone]. Reply STOP to opt out.\n\n**Pre-send checklist:** list source = opt-in? quiet hours respected? link UTMed?_`
  },
  "sms-inbox-playbook": (v) => {
    const b = str(v, "biz") || "Business"
    const h = str(v, "hours") || "business hours"
    return `## Two-way SMS inbox — ${b}\n\n**Tags:** BOOKING | BILLING | URGENT | SPAM\n**Routing:** after-hours → auto-reply + on-call rotation\n**SLAs:** aim <5 min for "new lead" during ${h}\n**Scripts:**\n- New lead: "Thanks for texting ${b}. May I have your name + best callback #?"\n- Price shopping: answer range + book consult\n**Escalation:** owner pinged if keyword URGENT or 2+ msgs no resolution\n\n_Log threads in CRM; this doc is policy only._`
  },
  "recall-campaign-sms": (v) => {
    const b = str(v, "biz") || "We"
    const s = str(v, "service") || "your maintenance"
    const u = str(v, "bookUrl") || "https://"
    return `## Recall campaign — ${b}\n\n**SMS:** Hi from ${b} — you're due for ${s}. Grab a time that works: ${u} (reply STOP to opt out)\n\n**Follow-up email subject:** Time for ${s}? — ${b}\n\n**Cadence suggestion:** T-30d overdue, T-7d, then quarterly max unless opted in._`
  },
  "deal-offer-builder": (v) => {
    const t = str(v, "title") || "Spring special"
    const val = str(v, "value") || "20% off"
    const ex = str(v, "expires") || "End of month"
    const code = str(v, "code")
    return `## Offer: **${t}**\n\n**Value:** ${val}\n**Valid:** ${ex}\n${code ? `**Code:** ${code}\n` : ""}\n**Web blurb:**\n${t} — ${val}. Expires ${ex}. ${code ? `Use code **${code}** at checkout.` : "Mention this post at booking."}\n\n**SMS:** ${t}: ${val}. Ends ${ex}.${code ? ` Code ${code}.` : ""} [short link]\n\n**Redemption tracking:** add a column \`source / code / staff initials\` in your sheet._`
  },
  "lsa-lead-templates": (v) => {
    const b = str(v, "biz") || "Our crew"
    const tr = str(v, "trade") || "service pro"
    return `## Local Services Ads — first replies — ${b}\n\n**Under 60s:**\nThanks for choosing ${b} — we're a ${tr} team. Are you in [city] and is this urgent today?\n\n**Qualify:**\n- Address / ZIP\n- Scope in one sentence\n- Photos if leak/damage\n\n**Book next step:** "I can send [tech] [window]. Does that work?"\n\n**If spam:** mark in LSA; don't engage._`
  },
  "nextdoor-ad-copy": (v) => {
    const b = str(v, "biz") || "Local business"
    const n = str(v, "neighborhood") || "near you"
    const o = str(v, "offer") || "intro offer for neighbors"
    return `## Nextdoor-style sponsored copy — ${b}\n\n**Headline:** Neighbors trust ${b} for ${n}\n\n**Body:**\n${o}\n\nWe're local, licensed, and obsessed with showing up on time. Questions? Comment or DM.\n\n**CTA:** Comment **BOOK** or visit [URL]\n\n_Follow Nextdoor advertising policies and disclosure requirements._`
  },
  "referral-program-copy": (v) => {
    const b = str(v, "biz") || "We"
    const r = str(v, "reward") || "$20 credit each"
    const base = str(v, "baseUrl") || "https://example.com"
    const u = base.replace(/\/$/, "")
    return `## Referral program — ${b}\n\n**Reward:** ${r}\n\n**Landing snippet:**\nLove ${b}? Refer a friend. They get [X], you get [Y] after their first completed visit. Share your link below.\n\n**Link pattern:**\n${u}/book?ref={{CUSTOMER_ID}}\n\n**Fine print block:**\nReferral credits post after paid service; no stacking with other promos; we reserve the right to pause the program._`
  },
  "booking-widget-copy": (v) => {
    const b = str(v, "biz") || "Our shop"
    const sv = str(v, "services") || "cuts, color, extensions"
    return `## Booking widget above-the-fold — ${b}\n\n**Headline:** Book ${b} in under a minute\n\n**Bullets:**\n- Pick ${sv}\n- Choose a pro (optional)\n- Instant confirmation + calendar invite\n\n**Trust:** Licensed & insured · [X] five-star reviews · Cancel free up to [policy]\n\n**Sticky CTA button:** Check availability\n\n_Paste into Squarespace, Wix, or your scheduling provider embed zone._`
  },
  "intake-deposit-booking": (v) => {
    const b = str(v, "biz") || "Team"
    const d = str(v, "deposit") || "50% deposit"
    const pol = str(v, "policyUrl")
    return `## Booking confirmation + deposit — ${b}\n\n**Email subject:** You're booked — ${b} + next steps\n\n**Body:**\nThanks for booking [service] on [date].\n\nTo hold your slot we take **${d}** (charged to the card on file / link: [payment link]).\n${pol ? `Policies: ${pol}\n` : ""}\nPlease complete intake: [form link] before [deadline].\n\n**SMS:** You're booked with ${b} [date]. ${d} secures the spot — pay: [short link]. Intake: [short link]_`
  },
  "cancellation-reschedule-templates": (v) => {
    const b = str(v, "biz") || "Us"
    const w = str(v, "window") || "24 hours"
    const fee = str(v, "fee")
    return `## Cancellation policy (customer-facing)\n\n**Policy:** Cancellations or reschedules within **${w}** of start may incur **${fee || "a fee per policy"}**.\n\n**Customer email:**\nWe received your request to move/cancel [appt]. ${fee ? `Because this is inside ${w}, ${fee} applies per policy.` : `Because this is inside ${w}, our policy applies — see attached link.`} Want to rebook instead? [link]\n\n**Internal Slack/email:**\n${b} — [customer] [action]. Slot [open/fill]. Fee flag: [yes/no]._`
  },
  "waitlist-manager-templates": (v) => {
    const b = str(v, "biz") || "We"
    const s = str(v, "service") || "your appointment"
    return `## Waitlist — ${b}\n\n**Signup confirmation:**\nYou're on the waitlist for **${s}**. If a slot opens [day range], we'll text you first. Reply STOP to opt out.\n\n**Slot opened SMS:**\nA ${s} spot opened at [time] [date]. First reply YES books it: [link]\n\n**Ops rule:** hold slot 15–30 min max; if no reply, go to next waitlist row._`
  },
  "staff-availability-rules": (v) => {
    const r = str(v, "roles") || "Room A, Room B, Dr Smith"
    const rules = str(v, "rules") || "30m buffer between visits; lunch 12-1 closed"
    return `## Scheduling rules — ${r}\n\n${rules}\n\n**System settings to mirror:**\n- Minimum notice for booking: [X]h\n- Max appointments per day per resource: [n]\n- Buffer after heavy services: [min]\n- Blackout dates: [list]\n\n_Copy into Calendly / Acuity / Mindbody / custom logic._`
  },
  "lead-capture-unified-tags": (v) => {
    const code = str(v, "biz") || "acme"
    const path = str(v, "domain") || "/contact"
    const gbp = `?utm_source=gbp&utm_medium=organic&utm_campaign=profile&utm_content=${code}`
    const lsa = `?utm_source=lsa&utm_medium=paid&utm_campaign=leads&utm_content=${code}`
    const web = `${path}?utm_source=web&utm_medium=form&utm_campaign=homepage`
    return `## Unified lead tagging — ${code}\n\n**UTM examples:**\n- GBP profile link: \`${gbp}\`\n- LSA landing: \`${lsa}\`\n- Website form: \`${web}\`\n\n**CRM custom fields:** lead_source (enum), landing_page, first_touch_date, campaign_notes.\n\n_Sync forms → one inbox; dedupe on phone/email._`
  },
  "contact-timeline-template": (v) => {
    const n = str(v, "name") || "Customer"
    return `## Contact timeline — ${n}\n\n### Visits\n- YYYY-MM-DD — [service] — $[amount] — staff [initials]\n\n### Messages\n- YYYY-MM-DD — SMS/email — summary\n\n### Reviews\n- YYYY-MM-DD — [platform] — [stars] — link\n\n### Spend / LTV\n- Running total: $____\n- Margin notes: ____\n\n_Paste into CRM note or Notion/Sheets._`
  },
  "reactivation-90d-campaign": (v) => {
    const b = str(v, "biz") || "We"
    const o = str(v, "offer")
    const u = str(v, "bookUrl") || "https://"
    return `## 90+ day win-back — ${b}\n\n**Email 1 — subject:** We miss you at ${b}\nBody: It's been a while — here's ${o || "a welcome-back perk"} if you return this month: ${u}\n\n**SMS 3d later:** ${b}: still your go-to for [service]? Grab a spot: ${u}\n\n**Email 2 (+10d) — subject:** Should we close your file?\nOne-line human check-in + same CTA.\n\n**Stop rules:** honor unsubscribes; cap at 3 touches._`
  },
  "customer-segmentation-guide": (v) => {
    const b = str(v, "biz") || "Business"
    const sv = str(v, "services") || "cut, color, retail"
    return `## Segments — ${b}\n\n**Services:** ${sv}\n\n| Segment | Rule | Message angle |\n|---------|------|---------------|\n| VIP | 6+ visits / 12 mo | early access, referral ask |\n| At-risk | no visit 90d | win-back offer |\n| One-and-done | 1 visit only | education + second service bundle |\n| High ticket | avg ticket top quartile | premium add-ons |\n\n_Build segments in your CRM or a simple pivot on export._`
  },
  "monthly-local-seo-report": (v) => {
    const b = str(v, "biz") || "Client"
    const m = str(v, "month") || "This month"
    return `## Local SEO report — ${b} — ${m}\n\n### Executive summary\n- 3 bullets: visibility, reputation, actions\n\n### Rankings\n- Top keywords + movement vs last month (paste from rank tracker)\n\n### Google Business Profile\n- Views, searches, calls, direction requests (paste GBP insights)\n\n### Website (local landing)\n- Sessions from local / organic; top landing pages\n\n### Reviews\n- New reviews, avg rating, response time\n\n### Next month priorities\n- [ ] GBP posts planned\n- [ ] citation fixes\n- [ ] on-page tweaks\n\n_This is an outline — you fill numbers from Analytics / GBP / rank tools._`
  },
  "review-velocity-sentiment": (v) => {
    const n = Math.max(0, Math.floor(num(v, "newReviews", 0)))
    const neg = Math.max(0, Math.floor(num(v, "neg", 0)))
    const pos = Math.max(0, n - neg)
    const pct = n ? Math.round((neg / n) * 100) : 0
    return `## Review velocity & sentiment (monthly snapshot)\n\n- **New reviews:** ${n}\n- **Negative (1–2★) count:** ${neg}\n- **Non-negative:** ${pos}\n- **Negative share:** ${n ? `${pct}%` : "n/a"}\n\n**Narration template:**\n"This month we added **${n}** reviews. **${neg}** needed careful responses; overall negative share was **${n ? `${pct}%` : "n/a"}** — [trend vs prior month]. Next actions: [list]."\n\n_You supply counts from GBP/Yelp exports._`
  },
  "noshow-cancel-rate-tracker": (v) => {
    const ap = Math.max(1, Math.floor(num(v, "appts", 1)))
    const ns = Math.max(0, Math.floor(num(v, "noshow", 0)))
    const lc = Math.max(0, Math.floor(num(v, "lateCancel", 0)))
    const rate = Math.round(((ns + lc) / ap) * 1000) / 10
    return `## No-show + late cancel rate\n\n- Appointments: **${ap}**\n- No-shows: **${ns}**\n- Late cancels: **${lc}**\n- **Combined rate:** **${rate}%** of appointments\n\n**Targets (rule of thumb):** many clinics aim <5% no-show; tune reminders and deposit policy if higher.\n\n**Ops ideas:** card on file, SMS T-2h, waitlist backfill._`
  },
  "lead-source-attribution": (v) => {
    const b = str(v, "biz") || "Business"
    return `## Lead source worksheet — ${b}\n\n| Lead ID | Date | Name | Source (GBP / LSA / Web / Ref / Other) | Campaign / UTM | Booked? | Revenue |\n|---------|------|------|------------------------------------------|----------------|--------|--------|\n| 001 | | | GBP profile | | | |\n| 002 | | | LSA | | | |\n\n**Weekly rollup:** count by source; cost per lead if paid; book-to-job %.\n\n_Attribution is never perfect — pick a primary "first touch" rule and stay consistent._`
  },
}

export function runLocalServiceTool(id: string, v: Record<string, string>): LifeToolRunResult {
  if (!getLocalServiceTool(id)) return { ok: false, error: "Unknown tool" }
  const fn = H[id]
  if (!fn) return { ok: false, error: "Not implemented" }
  try {
    return { ok: true, output: fn(v) }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error"
    return { ok: false, error: msg }
  }
}
