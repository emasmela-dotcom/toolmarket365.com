import type { LifeToolRunResult } from "./types"
import { getLifeTool } from "./metadata"

function num(v: Record<string, string>, k: string, d = 0): number {
  const n = Number(v[k])
  return Number.isFinite(n) ? n : d
}

function str(v: Record<string, string>, k: string): string {
  return (v[k] || "").trim()
}

function money(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

function monthlyPayment(principal: number, aprPct: number, months: number): number {
  if (months <= 0 || principal <= 0) return 0
  const r = aprPct / 100 / 12
  if (r === 0) return principal / months
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

function parseYmd(s: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim())
  if (!m) return null
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
  return Number.isNaN(d.getTime()) ? null : d
}

type HFn = (v: Record<string, string>) => string

const H: Record<string, HFn> = {
  "bill-split-calculator": (v) => {
    const total = num(v, "total")
    const people = Math.max(1, Math.floor(num(v, "people", 1)))
    const tipPct = num(v, "tipPct", 0)
    if (total <= 0) throw new Error("Enter a positive bill total")
    const tip = total * (tipPct / 100)
    const grand = total + tip
    return `## Split\n- Subtotal: $${money(total)}\n- Tip (${tipPct}%): $${money(tip)}\n- **Total: $${money(grand)}**\n- **Per person (${people}): $${money(grand / people)}**`
  },
  "debt-payoff-planner": (v) => {
    let bal = num(v, "balance")
    const apr = num(v, "apr")
    const pay = num(v, "payment")
    if (bal <= 0 || pay <= 0) throw new Error("Balance and payment must be positive")
    const r = apr / 100 / 12
    let months = 0
    const maxM = 600
    while (bal > 0.01 && months < maxM) {
      const interest = bal * r
      const principal = pay - interest
      if (principal <= 0) throw new Error("Payment too low to cover interest — increase payment or lower APR")
      bal -= principal
      months++
    }
    return `## Debt payoff (approx.)\n- Months to payoff: **${months}** (~${Math.round(months / 12)} yr)\n- Total paid (principal + est. interest): about **$${money(num(v, "payment") * months)}** (simplified; rounding differs from bank software).`
  },
  "savings-goal-tracker": (v) => {
    const target = num(v, "target")
    const saved = num(v, "saved")
    const monthly = num(v, "monthly")
    if (monthly <= 0) throw new Error("Monthly save must be > 0")
    const left = Math.max(0, target - saved)
    const m = Math.ceil(left / monthly)
    return `## Savings goal\n- Remaining: $${money(left)}\n- **Months to goal (at $${money(monthly)}/mo): ${m}**`
  },
  "net-worth-calculator": (v) => {
    const nw = num(v, "assets") - num(v, "liabilities")
    return `## Net worth\n- Assets: $${money(num(v, "assets"))}\n- Liabilities: $${money(num(v, "liabilities"))}\n- **Net worth: $${money(nw)}**`
  },
  "budget-planner-502020": (v) => {
    const inc = num(v, "income")
    if (inc <= 0) throw new Error("Enter after-tax income")
    return `## 50 / 30 / 20 (monthly)\n- **Needs (50%): $${money(inc * 0.5)}**\n- **Wants (30%): $${money(inc * 0.3)}**\n- **Savings/debt (20%): $${money(inc * 0.2)}**`
  },
  "loan-comparison-tool": (v) => {
    const a = monthlyPayment(num(v, "p1"), num(v, "apr1"), Math.floor(num(v, "m1")))
    const b = monthlyPayment(num(v, "p2"), num(v, "apr2"), Math.floor(num(v, "m2")))
    const ta = a * num(v, "m1")
    const tb = b * num(v, "m2")
    return `## Loan comparison (monthly payment)\n- **Loan A:** $${money(a)}/mo → ~$${money(ta)} total over term\n- **Loan B:** $${money(b)}/mo → ~$${money(tb)} total over term\n- Lower monthly: **${a <= b ? "A" : "B"}** (verify fees & APR with lender).`
  },
  "tip-calculator": (v) => {
    const sub = num(v, "subtotal")
    const pct = num(v, "tipPct")
    const split = Math.max(1, Math.floor(num(v, "split", 1)))
    const tip = sub * (pct / 100)
    const tot = sub + tip
    return `## Tip\n- Tip: **$${money(tip)}**\n- Total: **$${money(tot)}**\n- Per person (${split}): **$${money(tot / split)}**`
  },
  "currency-converter": (v) => {
    const out = num(v, "amount") * num(v, "rate")
    return `## Converted\n- ${money(num(v, "amount"))} ${str(v, "from") || "?"} × rate ${num(v, "rate")} ≈ **${money(out)} ${str(v, "to") || "?"}**\n- Rate is **yours** (no live FX in this tool).`
  },
  "cover-letter-generator": (v) =>
    `## Draft\nDear hiring team,\n\nI am applying for **${str(v, "role")}** at **${str(v, "company")}**. ${str(v, "skill")}\n\nI would welcome a conversation.\n\nSincerely,\n[Your name]\n\n_Tone: ${str(v, "tone") || "professional"} — edit before sending._`,
  "resume-bullet-writer": (v) =>
    `## Bullet ideas\n- **${str(v, "action")}** → **${str(v, "metric")}**${str(v, "context") ? ` (${str(v, "context")})` : ""}\n- Led ${str(v, "action")} resulting in ${str(v, "metric")}.`,
  "apology-letter-writer": (v) =>
    `## Apology draft\nDear ${str(v, "recipient")},\n\nI am sorry for ${str(v, "wrong")}. I will ${str(v, "fix")}.\n\nThank you for your patience,\n[You]`,
  "thank-you-note-generator": (v) =>
    `## Thank you\nDear ${str(v, "recipient")},\n\nThank you for ${str(v, "reason")}. It meant a lot.\n\nWarmly,\n[You]`,
  "text-tone-rewriter": (v) =>
    `## ${str(v, "direction") || "Adjusted"} version (start here)\n\n${str(v, "text")}\n\n_Edit manually toward ${str(v, "direction") || "your target tone"}._`,
  "profile-bio-generator": (v) =>
    `## Bios (${str(v, "platform")})\n- **Short:** ${str(v, "facts").split("\n")[0]?.slice(0, 120) || "…"}\n- **Long:** ${str(v, "facts")}\n_Goal: ${str(v, "goal") || "credibility + personality"}_`,
  "email-subject-line-tester": (v) => {
    const s = str(v, "subject")
    const len = s.length
    const issues: string[] = []
    if (len < 20) issues.push("Short — may lack context")
    if (len > 60) issues.push("Long — may truncate on mobile")
    if (!/[a-z]/i.test(s)) issues.push("No letters?")
    return `## Subject check\n- Length: **${len}** chars\n- Notes: ${issues.length ? issues.join("; ") : "Looks reasonable — A/B test if important."}`
  },
  "complaint-letter-writer": (v) =>
    `## Complaint\nTo ${str(v, "company")},\n\nI am writing about: ${str(v, "issue")}\n\nI request: ${str(v, "ask")}\n\nSincerely,\n[Your name & contact]`,
  "bmi-calculator": (v) => {
    const feet = Math.max(0, num(v, "feet"))
    const inchesPart = Math.max(0, num(v, "inches"))
    const heightIn = feet * 12 + inchesPart
    const lbs = num(v, "lbs")
    if (heightIn <= 0) throw new Error("Enter height (feet and optional inches)")
    if (lbs <= 0) throw new Error("Enter weight in pounds")
    const bmi = (703 * lbs) / (heightIn * heightIn)
    return `## BMI\n- **${bmi.toFixed(1)}** (height **${feet} ft ${inchesPart} in** = **${heightIn} in**, weight **${lbs} lb**) — not medical advice`
  },
  "water-intake-calculator": (v) => {
    const kg = num(v, "kg")
    let L = kg * 0.033
    const a = str(v, "activity").toLowerCase()
    if (a.includes("high")) L *= 1.15
    if (a.includes("low")) L *= 0.95
    return `## Water (rough)\n- Target **~${L.toFixed(1)} L/day** — adjust for heat, pregnancy, or doctor advice.`
  },
  "calorie-deficit-calculator": (v) => {
    const kg = num(v, "kg")
    const cm = num(v, "cm")
    const age = num(v, "age")
    const def = num(v, "deficit")
    const male = str(v, "sex").toLowerCase().startsWith("m")
    const tdee = 10 * kg + 6.25 * cm - 5 * age + (male ? 5 : -161)
    return `## TDEE (Mifflin–St Jeor est.)\n- Maintenance ≈ **${Math.round(tdee)} kcal/day**\n- At **${def}** deficit → target intake ≈ **${Math.round(tdee - def)} kcal/day**\n_Not medical advice._`
  },
  "sleep-cycle-calculator": (v) => {
    const h = num(v, "bedHour")
    const mi = num(v, "bedMin")
    const cycles = Math.max(1, Math.floor(num(v, "cycles", 5)))
    const bedMin = h * 60 + mi
    const wake: string[] = []
    for (let c = 1; c <= cycles; c++) {
      const w = bedMin + c * 90
      const hh = Math.floor(w / 60) % 24
      const mm = Math.floor(w % 60)
      wake.push(`${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`)
    }
    return `## Wake targets (~90m cycles)\n- After ${cycles} cycles: **${wake.join(", ")}** (adjust for your fall-asleep latency).`
  },
  "workout-plan-generator": (v) => {
    const d = Math.max(1, Math.min(7, Math.floor(num(v, "days"))))
    const focus = str(v, "focus") || "full body"
    return `## ${d} days / week — ${focus}\n${Array.from({ length: d }, (_, i) => `- Day ${i + 1}: main lift + accessories (log reps)`).join("\n")}`
  },
  "meal-prep-planner": (v) => {
    const meals = Math.max(1, Math.floor(num(v, "meals", 3)))
    const days = Math.max(1, Math.floor(num(v, "days", 7)))
    return `## ${days} days × ${meals} meals\n- Batch proteins Sun; fill ${str(v, "prefs") || "balanced plates"}\n- List: breakfast ×${days}, lunch ×${days}, dinner ×${days}`
  },
  "habit-streak-tracker": (v) => {
    const start = parseYmd(str(v, "start"))
    if (!start) throw new Error("Use YYYY-MM-DD for start")
    const done = Math.max(0, Math.floor(num(v, "done")))
    const now = new Date()
    const days = Math.max(1, Math.ceil((now.getTime() - start.getTime()) / 86400000))
    return `## Streak view\n- Days since start: ${days}\n- Logged completions: **${done}** (track daily in a calendar app).`
  },
  "symptom-journal-helper": (v) =>
    `## Journal entry\n- **Symptoms:** ${str(v, "symptoms")}\n- **Duration / severity:** ${str(v, "duration")}\n- Triggers / meds / sleep: _add_\n_Not medical advice — contact a clinician if urgent._`,
  "flashcard-generator": (v) => {
    const lines = str(v, "notes")
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean)
    return (
      "## Flashcards (Q | A)\n" +
      lines
        .slice(0, 40)
        .map((l, i) => `- **Q${i + 1}:** ${l}  \n  **A:** _fill answer_`)
        .join("\n")
    )
  },
  "study-schedule-builder": (v) => {
    const hrs = num(v, "hours", 2)
    const topics = str(v, "topics")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    const w = Math.max(1, Math.floor(num(v, "weeks", 4)))
    return `## ${w} weeks @ ${hrs}h/day\n` + topics.map((t, i) => `- Block ${i + 1}: ${t} (${hrs}h focus + 10m review)`).join("\n")
  },
  "pomodoro-timer-planner": (v) => {
    const w = num(v, "work", 25)
    const b = num(v, "break", 5)
    const r = Math.max(1, Math.floor(num(v, "rounds", 4)))
    return `## Session\n- ${r}× (${w}m work / ${b}m break) → **~${r * (w + b)} min** total`
  },
  "reading-time-estimator": (v) => {
    const words = num(v, "words")
    const wpm = Math.max(60, num(v, "wpm", 200))
    return `## Reading time\n- **${(words / wpm).toFixed(1)} minutes** at ${wpm} WPM`
  },
  "speed-reading-trainer": (v) => {
    const wpl = num(v, "words", 12)
    const lines = Math.max(3, Math.floor(num(v, "lines", 10)))
    return `## Drill\n- Set pointer ${wpl} words/line × ${lines} lines; widen peripheral span each pass.`
  },
  "note-summarizer-helper": (v) =>
    `## Summary bullets\n- Main idea: _from:_ ${str(v, "notes").slice(0, 200)}…\n- Action items: _list_\n- Open questions: _list_`,
  "quiz-from-text-generator": (v) => {
    const n = Math.max(3, Math.min(20, Math.floor(num(v, "count", 5))))
    const t = str(v, "text").slice(0, 2000)
    return `## Draft quiz (${n} qs)\n` + Array.from({ length: n }, (_, i) => `${i + 1}. From the text: ___________?\n   A) … B) …`).join("\n\n")
  },
  "language-phrase-cheatsheet": (v) => {
    const lang = str(v, "lang")
    const rows = str(v, "phrases")
      .split("\n")
      .filter(Boolean)
      .map((p) => `| ${p} | _${lang}_ |`)
      .join("\n")
    return `## Phrases → ${lang}\n| Phrase | Translation |\n|--------|-------------|\n${rows}`
  },
  "moving-checklist-generator": (v) => {
    const d = parseYmd(str(v, "moveDate"))
    if (!d) throw new Error("Move date YYYY-MM-DD")
    return `## Moving toward ${str(v, "moveDate")}\n- 8 weeks: book movers; purge\n- 4 weeks: address change; utilities\n- 2 weeks: packing room by room\n- 1 week: essentials box; confirm keys`
  },
  "rent-vs-buy-calculator": (v) => {
    const rent = num(v, "rent")
    const price = num(v, "price")
    const down = num(v, "down")
    const apr = num(v, "rate")
    const years = Math.max(1, num(v, "years", 30))
    const principal = price - down
    const m = monthlyPayment(principal, apr, years * 12)
    const rentY = rent * 12 * years
    const buyY = down + m * years * 12
    return `## Rough ${years}y comparison (not advice)\n- Rent total ≈ $${money(rentY)}\n- Buy (down + est. payments) ≈ $${money(buyY)} — ignores taxes, insurance, appreciation, repairs.\n- **Lower in this model:** ${rentY < buyY ? "Rent" : "Buy (maybe)"}`
  },
  "home-cleaning-schedule": (v) => {
    const rooms = str(v, "rooms")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    return `## Weekly rotation\n` + rooms.map((r, i) => `- ${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7]}: ${r}`).join("\n")
  },
  "grocery-list-organizer": (v) => {
    const items = str(v, "items")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
    return `## By aisle (rough)\n- Produce: ${items.filter((x) => /fruit|veg|lettuce|apple|banana/i.test(x)).join(", ") || "—"}\n- Dairy: ${items.filter((x) => /milk|cheese|yogurt|egg/i.test(x)).join(", ") || "—"}\n- Other: ${items.join(", ")}`
  },
  "recipe-scaler": (v) => {
    const from = num(v, "fromServ", 1)
    const to = num(v, "toServ", 1)
    const r = to / from
    return (
      "## Scaled lines\n" +
      str(v, "ingredients")
        .split("\n")
        .map((line) => {
          const m = /(\d+(\.\d+)?)/.exec(line)
          if (!m) return `- ${line}`
          const n = Number(m[1]) * r
          return `- ${line.replace(m[1], money(n))}`
        })
        .join("\n")
    )
  },
  "party-planner-checklist": (v) =>
    `## Party (${num(v, "guests")} guests, ${str(v, "type")})\n- Food & drinks headcount\n- Music / playlist\n- Seating + trash bags\n- Ice, opener, non-alcoholic options\n- Thank-you / ride coordination`,
  "gift-idea-generator": (v) =>
    `## Ideas for ${str(v, "who")} ($${money(num(v, "budget"))}, ${str(v, "occasion")})\n- Experience voucher in their city\n- Quality consumable + handwritten card\n- Hobby-adjacent kit (verify they do not already own)`,
  "lease-explainer-plain-english": (v) =>
    `## Ask your landlord / lawyer\n- Rent amount, due date, grace period?\n- Who pays utilities / repairs?\n- Subletting & early termination?\n- Security deposit return timeline?\n\n**Your excerpt:**\n${str(v, "clauses").slice(0, 1500)}`,
  "baby-name-generator": (v) =>
    `## Shortlist (${str(v, "style")}${str(v, "letters") ? `, starts ${str(v, "letters")}` : ""})\n- Add 5 names you like → check initials, domain, and pronunciation with family.`,
  "chore-chart-kids": (v) => {
    const kids = str(v, "kids").split(",").map((s) => s.trim()).filter(Boolean)
    const chores = str(v, "chores").split(",").map((s) => s.trim()).filter(Boolean)
    return `## Week grid\n` + kids.map((k) => `- **${k}:** ${chores.join(", ")} (rotate weekly)`).join("\n")
  },
  "allowance-calculator": (v) => {
    const c = num(v, "chores")
    const r = num(v, "rate")
    return `## Weekly allowance\n- **$${money(c * r)}** (${c} chores × $${money(r)})`
  },
  "school-supply-checklist": (v) =>
    `## ${str(v, "grade")} starter list\n- Backpack, lunch box, water bottle\n- Notebooks, folders, pencils, erasers, markers\n- Calculator (if required), headphones\n- Label everything; photo the supply list from school.`,
  "homework-helper-prompt-builder": (v) =>
    `## Paste into your LLM (you supervise)\nYou are a tutor for a student. Subject: **${str(v, "subject")}**. Explain step-by-step without doing graded work for them. Topic:\n${str(v, "topic")}`,
  "family-meeting-agenda": (v) => {
    const topics = str(v, "topics").split(",").map((s) => s.trim()).filter(Boolean)
    const mins = num(v, "minutes", 30)
    const slot = Math.floor(mins / Math.max(1, topics.length))
    return `## ${mins} min meeting\n` + topics.map((t, i) => `${i + 1}. ${t} (~${slot}m)`).join("\n")
  },
  "packing-list-generator": (v) =>
    `## ${num(v, "days")} days, ${str(v, "climate")}\n- Underwear × ${num(v, "days") + 1}, socks, sleepwear\n- Layers + ${str(v, "carryon").toLowerCase().includes("yes") ? "1 bag toiletries TSA-size" : "checked bag if needed"}\n- Chargers, meds, ID, copies of reservations`,
  "trip-budget-estimator": (v) => {
    const d = num(v, "days")
    const daily = num(v, "daily")
    const f = num(v, "flights", 0)
    return `## Trip budget (rough)\n- Daily × days: $${money(d * daily)}\n- Fixed (flights/lodging): $${money(f)}\n- **Total est.: $${money(d * daily + f)}** + buffer 10–15%`
  },
  "timezone-converter-helper": (v) => {
    const from = num(v, "from")
    const to = num(v, "to")
    const hour = num(v, "hour", 12)
    const utc = hour - from
    const local = (utc + to + 24) % 24
    return `## Time\n- ${hour}:00 in FROM (UTC${from >= 0 ? "+" : ""}${from}) → **${local}:00** in TO (UTC${to >= 0 ? "+" : ""}${to}) _same calendar day assumption_`
  },
  "flight-layover-calculator": (v) => {
    const arr = num(v, "arrH") * 60 + num(v, "arrM")
    const dep = num(v, "depH") * 60 + num(v, "depM")
    let lay = dep - arr
    if (lay < 0) lay += 24 * 60
    return `## Layover\n- **${Math.floor(lay / 60)}h ${lay % 60}m** between legs (same-day simplification).`
  },
  "travel-itinerary-builder": (v) => {
    const cities = str(v, "cities").split(",").map((s) => s.trim()).filter(Boolean)
    return `## ${str(v, "start")} → ${str(v, "end")}\n` + cities.map((c, i) => `- Day ${i + 1}: arrive ${c}; core activity; dinner`).join("\n")
  },
  "visa-requirement-checklist": (v) =>
    `## Research checklist (${str(v, "passport")} → ${str(v, "dest")})\n- Official embassy / consulate site\n- ETA vs visa vs visa-free\n- Passport validity (often 6m past exit)\n- Proof of funds, onward ticket, insurance\n_Not legal advice._`,
  "random-decision-maker": (v) => {
    const opts = str(v, "options")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    if (!opts.length) throw new Error("Add comma-separated options")
    const pick = opts[Math.floor(Math.random() * opts.length)]
    return `## Pick\n- **${pick}**`
  },
  "would-you-rather-generator": (v) =>
    `## ${str(v, "theme") || "Fun"} pairs\n1. Would you rather A or B?\n2. Would you rather C or D?\n3. Would you rather E or F?\n_(Replace A–F with your theme.)_`,
  "personality-quiz-builder": (v) =>
    `## ${str(v, "topic")} quiz outline\n1. Scenario Q → A/B/C\n2. Values Q → A/B/C\n3. Social Q → A/B/C\n4. Result buckets: Type 1 / 2 / 3`,
  "icebreaker-question-generator": (v) => {
    const n = Math.max(3, Math.min(12, Math.floor(num(v, "size", 6))))
    return `## Icebreakers (${str(v, "context")})\n` + Array.from({ length: n }, (_, i) => `${i + 1}. What's one win from this week?`).join("\n")
  },
  "trivia-generator-by-topic": (v) => {
    const c = Math.max(3, Math.min(15, Math.floor(num(v, "count", 5))))
    return `## ${str(v, "topic")} trivia (verify answers)\n` + Array.from({ length: c }, (_, i) => `Q${i + 1}. [Write fact about ${str(v, "topic")}] → A / B / C`).join("\n\n")
  },
  "random-challenge-generator": (v) =>
    `## ${str(v, "difficulty")} challenge (${num(v, "minutes")} min)\n- ${str(v, "difficulty").toLowerCase().includes("hard") ? "50 burpees or equivalent" : "20-min walk + 10 pushups"}\n- Log completion`,
  "movie-book-recommendation-quiz": (v) =>
    `## Mood: ${str(v, "mood")} · Genres: ${str(v, "genre")}\n- If cozy: character-driven novel + comfort film\n- If energetic: thriller + podcast deep-dive\n_Edit with your library._`,
  "password-strength-checker": (v) => {
    const p = str(v, "pw")
    let score = 0
    if (p.length >= 12) score++
    if (p.length >= 16) score++
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++
    if (/\d/.test(p)) score++
    if (/[^a-zA-Z0-9]/.test(p)) score++
    return `## Score: ${score}/5 (heuristic)\n- Length: ${p.length}\n- Avoid dictionary words & reuse across sites.`
  },
  "phishing-email-analyzer": (v) =>
    `## Red flags to check in pasted email\n- Mismatched From: vs Reply-To\n- Urgent wire / gift card / “verify account”\n- Suspicious links (hover on desktop)\n- Poor grammar + unexpected attachment\n\n**Snippet:**\n${str(v, "email").slice(0, 1200)}`,
  "digital-footprint-checklist": (v) =>
    `## Accounts to review\n- Google, Apple, Microsoft\n- Banks, PayPal, shopping\n- Social: X, IG, LinkedIn, TikTok\n- Old forums + ${str(v, "handles") || "search your emails"}`,
  "privacy-policy-plain-explainer": (v) =>
    `## Questions for this policy\n- What data is collected? Cookies?\n- Who is it shared with? Processors?\n- Retention & deletion rights?\n- Children / region (GDPR, COPPA)?\n\n**Excerpt:**\n${str(v, "policy").slice(0, 1500)}`,
  "two-factor-auth-setup-guide": (v) =>
    `## 2FA checklist\n- ${str(v, "accounts") || "Email, bank, cloud, social, domain registrar"}\n- Prefer **app-based TOTP** or hardware key; SMS as fallback only\n- Save backup codes offline`,
  "age-calculator": (v) => {
    const b = parseYmd(str(v, "birth"))
    if (!b) throw new Error("Birth date YYYY-MM-DD")
    const now = new Date()
    let age = now.getUTCFullYear() - b.getUTCFullYear()
    const m = now.getUTCMonth() - b.getUTCMonth()
    if (m < 0 || (m === 0 && now.getUTCDate() < b.getUTCDate())) age--
    return `## Age\n- **${age}** years (UTC approximation)`
  },
  "days-between-dates": (v) => {
    const a = parseYmd(str(v, "a"))
    const b = parseYmd(str(v, "b"))
    if (!a || !b) throw new Error("Use YYYY-MM-DD for both dates")
    const d = Math.round(Math.abs(b.getTime() - a.getTime()) / 86400000) + 1
    return `## Days (inclusive)\n- **${d}** days between ${str(v, "a")} and ${str(v, "b")}`
  },
  "countdown-planner": (v) => {
    const t = parseYmd(str(v, "target"))
    if (!t) throw new Error("Target YYYY-MM-DD")
    const now = new Date()
    const days = Math.ceil((t.getTime() - now.getTime()) / 86400000)
    return `## Countdown\n- **${days}** days until ${str(v, "target")}`
  },
  "unit-converter": (v) => {
    const kind = str(v, "kind").toLowerCase()
    const val = num(v, "value")
    const from = str(v, "from").toLowerCase()
    let out = 0
    let label = ""
    if (kind.includes("weight")) {
      if (from === "kg") {
        out = val * 2.20462
        label = "lb"
      } else if (from === "lb") {
        out = val / 2.20462
        label = "kg"
      } else throw new Error("Use kg or lb")
    } else if (kind.includes("temp")) {
      if (from === "c") {
        out = (val * 9) / 5 + 32
        label = "°F"
      } else if (from === "f") {
        out = ((val - 32) * 5) / 9
        label = "°C"
      } else throw new Error("Use C or F as from unit")
    } else if (kind.includes("length")) {
      if (from === "m") {
        out = val * 3.28084
        label = "ft"
      } else if (from === "ft") {
        out = val / 3.28084
        label = "m"
      } else throw new Error("Use m or ft")
    } else throw new Error('Kind must include "weight", "temp", or "length"')
    return `## Result\n- **${money(out)} ${label}**`
  },
  "percentage-calculator": (v) => {
    const x = num(v, "x")
    const y = num(v, "y")
    if (y === 0) throw new Error("Y cannot be 0")
    return `## Percentages\n- **${money((x / 100) * y)}** is ${x}% of ${y}\n- **${money((x / y) * 100)}%** — x as % of y`
  },
  "gpa-calculator": (v) => {
    const rows = str(v, "lines")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
    let pts = 0
    let wsum = 0
    for (const row of rows) {
      const [g, w] = row.split(",").map((s) => s.trim())
      const weight = Number(w) || 1
      const map: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 }
      const gp = map[g.toUpperCase().slice(0, 1)] ?? 0
      pts += gp * weight
      wsum += weight
    }
    if (!wsum) throw new Error("Enter lines like A,1 or B,3")
    return `## GPA (4.0 scale est.)\n- **${(pts / wsum).toFixed(2)}**`
  },
  "grade-needed-calculator": (v) => {
    const cur = num(v, "current") / 100
    const want = num(v, "want") / 100
    const fw = num(v, "finalW")
    if (fw <= 0 || fw > 1) throw new Error("Final weight between 0 and 1")
    const need = (want - (1 - fw) * cur) / fw
    return `## Final exam grade needed (as decimal of course)\n- **${(need * 100).toFixed(1)}%** on the final (model: overall = (1-w)×current + w×final)\n_Verify your syllabus weights._`
  },
}

export function runLifeTool(id: string, v: Record<string, string>): LifeToolRunResult {
  if (!getLifeTool(id)) return { ok: false, error: "Unknown tool" }
  const fn = H[id]
  if (!fn) return { ok: false, error: "Not implemented" }
  try {
    return { ok: true, output: fn(v) }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}
