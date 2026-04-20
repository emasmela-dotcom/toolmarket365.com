import type { LifeField, LifeToolMeta } from "@/lib/lifeTools/types"

const f = (
  id: string,
  category: string,
  title: string,
  description: string,
  fields: LifeField[]
): LifeToolMeta => ({ id, category, title, description, fields })

/** Local & service-business playbooks — templates and checklists (no live Google/Yelp/SMS APIs). */
export const LOCAL_SERVICE_TOOLS: LifeToolMeta[] = [
  f(
    "review-trigger-sequence",
    "Reviews & Reputation",
    "Review request after appointment or payment",
    "SMS + email lines triggered after service or payment (you wire automation).",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "service", label: "Service or product", type: "text" },
      { key: "reviewUrl", label: "Google (or primary) review URL", type: "text" },
      { key: "hours", label: "Hours after visit to send (e.g. 24)", type: "number" },
    ]
  ),
  f(
    "review-monitoring-checklist",
    "Reviews & Reputation",
    "Multi-platform review monitoring checklist",
    "Weekly checklist for Google, Yelp, Facebook — paste handles or URLs.",
    [
      { key: "google", label: "Google Business Profile name or link", type: "text" },
      { key: "yelp", label: "Yelp URL (optional)", type: "text", optional: true },
      { key: "facebook", label: "Facebook page URL (optional)", type: "text", optional: true },
    ]
  ),
  f(
    "review-response-generator",
    "Reviews & Reputation",
    "Review response drafts (positive & negative)",
    "Short public replies you can edit before posting.",
    [
      { key: "biz", label: "Business / signer name", type: "text" },
      { key: "tone", label: "Tone (warm, formal, brief)", type: "text", optional: true },
      { key: "snippet", label: "Paste review text (or summary)", type: "textarea" },
    ]
  ),
  f(
    "review-funnel-copy",
    "Reviews & Reputation",
    "Review funnel: happy → Google, unhappy → private",
    "Landing copy + SMS/email for split path after NPS-style ask.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "reviewUrl", label: "Public review link (happy path)", type: "text" },
      { key: "feedbackEmail", label: "Private feedback email or form URL", type: "text" },
    ]
  ),
  f(
    "reputation-score-tracker",
    "Reviews & Reputation",
    "Reputation score log (manual)",
    "Simple month-over-month table template from stars + volume you enter.",
    [
      { key: "month", label: "Month label (e.g. March 2026)", type: "text" },
      { key: "avgStars", label: "Average stars (1-5)", type: "number" },
      { key: "count", label: "Review count this month", type: "number" },
    ]
  ),
  f(
    "gbp-post-calendar",
    "Google Business Profile",
    "GBP post ideas + weekly rhythm",
    "Four weeks of post prompts you can paste into GBP.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "offer", label: "Current offer or seasonal hook", type: "textarea" },
    ]
  ),
  f(
    "nap-consistency-checklist",
    "Google Business Profile",
    "NAP consistency audit",
    "Single canonical block + directory checklist from your legal NAP.",
    [
      { key: "name", label: "Legal business name", type: "text" },
      { key: "address", label: "Full address (one line)", type: "text" },
      { key: "phone", label: "Primary phone (digits + format you want everywhere)", type: "text" },
    ]
  ),
  f(
    "citation-duplicate-checklist",
    "Google Business Profile",
    "Citation & duplicate listing checklist",
    "Places to claim or fix duplicates; you verify each site.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "city", label: "City / metro", type: "text" },
    ]
  ),
  f(
    "local-rank-tracker-log",
    "Google Business Profile",
    "Local rank tracker log (keyword + ZIP)",
    "Spreadsheet-style rows to copy; track manually or with rank tools.",
    [
      { key: "keyword", label: "Primary keyword", type: "text" },
      { key: "zip", label: "ZIP or neighborhood", type: "text" },
      { key: "url", label: "Your GBP or landing URL to rank", type: "text" },
    ]
  ),
  f(
    "gbp-qa-responder",
    "Google Business Profile",
    "GBP Q&A response drafts",
    "Polite answers to common questions; edit for accuracy.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "questions", label: "Paste questions (one per line)", type: "textarea" },
    ]
  ),
  f(
    "appointment-reminder-sms",
    "SMS & Messaging",
    "Appointment reminder sequence (48h, 2h)",
    "Two SMS templates with placeholders.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "customer", label: "Sample customer first name", type: "text", optional: true },
    ]
  ),
  f(
    "noshow-rebook-sms",
    "SMS & Messaging",
    "No-show follow-up & rebook SMS",
    "Short sequence after a missed appointment.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "bookUrl", label: "Booking link", type: "text" },
    ]
  ),
  f(
    "post-visit-review-sms",
    "SMS & Messaging",
    "Post-visit review request SMS",
    "One SMS after service with review link.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "reviewUrl", label: "Review URL", type: "text" },
    ]
  ),
  f(
    "broadcast-sms-templates",
    "SMS & Messaging",
    "Broadcast SMS (flash offer / closure)",
    "TCPA-style reminders + two templates.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "msg", label: "Your offer or closure (one line)", type: "text" },
    ]
  ),
  f(
    "sms-inbox-playbook",
    "SMS & Messaging",
    "Two-way SMS inbox playbook",
    "Tags, hours, and escalation rules for a business number.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "hours", label: "Support hours (e.g. 9-5 Mon-Fri)", type: "text" },
    ]
  ),
  f(
    "recall-campaign-sms",
    "SMS & Messaging",
    "Recall / due-for-service SMS",
    "Dentist-style recall; edit for your trade.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "service", label: "Service (e.g. cleaning, oil change)", type: "text" },
      { key: "bookUrl", label: "Book URL", type: "text" },
    ]
  ),
  f(
    "deal-offer-builder",
    "Local Offers & Promotions",
    "Deal / offer with expiry & redemption notes",
    "Copy for web + SMS + fine print reminders.",
    [
      { key: "title", label: "Offer title", type: "text" },
      { key: "value", label: "Discount or value prop", type: "text" },
      { key: "expires", label: "Expiry date or window", type: "text" },
      { key: "code", label: "Redemption code (optional)", type: "text", optional: true },
    ]
  ),
  f(
    "lsa-lead-templates",
    "Local Offers & Promotions",
    "Google Local Services Ads lead reply templates",
    "Fast first response + qualification questions.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "trade", label: "Trade (e.g. plumber, HVAC)", type: "text" },
    ]
  ),
  f(
    "nextdoor-ad-copy",
    "Local Offers & Promotions",
    "Neighborhood ad copy (Nextdoor-style)",
    "Short sponsored-post style copy; follow Nextdoor ad policies.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "neighborhood", label: "Target neighborhood or radius note", type: "text" },
      { key: "offer", label: "Offer hook", type: "textarea" },
    ]
  ),
  f(
    "referral-program-copy",
    "Local Offers & Promotions",
    "Referral program + unique link pattern",
    "Landing blurbs and ?ref= pattern for simple tracking.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "reward", label: "Reward for referrer & friend", type: "text" },
      { key: "baseUrl", label: "Your site base URL", type: "text" },
    ]
  ),
  f(
    "booking-widget-copy",
    "Booking & Scheduling",
    "Self-serve booking widget copy",
    "Headline, bullets, and trust lines for embeddable booking.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "services", label: "Top services (comma-separated)", type: "text" },
    ]
  ),
  f(
    "intake-deposit-booking",
    "Booking & Scheduling",
    "Intake form + deposit at booking",
    "Email to customer after booking + deposit policy snippet.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "deposit", label: "Deposit rule (e.g. 50% or $50)", type: "text" },
      { key: "policyUrl", label: "Cancellation policy URL (optional)", type: "text", optional: true },
    ]
  ),
  f(
    "cancellation-reschedule-templates",
    "Booking & Scheduling",
    "Cancellation & rescheduling automation messages",
    "Policy paragraph + customer + internal templates.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "window", label: "Free cancel window (e.g. 24h)", type: "text" },
      { key: "fee", label: "Late cancel fee rule (or none)", type: "text", optional: true },
    ]
  ),
  f(
    "waitlist-manager-templates",
    "Booking & Scheduling",
    "Waitlist for fully booked slots",
    "SMS/email when a slot opens + signup confirmation.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "service", label: "Service name", type: "text" },
    ]
  ),
  f(
    "staff-availability-rules",
    "Booking & Scheduling",
    "Staff / resource scheduling rules",
    "Human-readable rules block for Calendly-style tools.",
    [
      { key: "roles", label: "Roles or rooms (comma-separated)", type: "text" },
      { key: "rules", label: "Special rules (lunch, buffers, blackout)", type: "textarea" },
    ]
  ),
  f(
    "lead-capture-unified-tags",
    "CRM & Lead Management",
    "Lead capture tags (GBP, web, ads → one inbox)",
    "UTM + source tags to paste into CRM or spreadsheet.",
    [
      { key: "biz", label: "Business short code (e.g. acme-dental)", type: "text" },
      { key: "domain", label: "Your thank-you or contact page path", type: "text" },
    ]
  ),
  f(
    "contact-timeline-template",
    "CRM & Lead Management",
    "Contact timeline template",
    "Markdown sections for visits, messages, reviews, spend.",
    [
      { key: "name", label: "Sample customer name", type: "text" },
    ]
  ),
  f(
    "reactivation-90d-campaign",
    "CRM & Lead Management",
    "Reactivation: not seen in 90+ days",
    "Three-touch email + SMS sequence.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "offer", label: "Win-back offer (optional)", type: "text", optional: true },
      { key: "bookUrl", label: "Book or reply link", type: "text" },
    ]
  ),
  f(
    "customer-segmentation-guide",
    "CRM & Lead Management",
    "Segmentation by visit frequency or service",
    "Rule-of-thumb segments + message angles.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "services", label: "Service lines (comma-separated)", type: "text" },
    ]
  ),
  f(
    "monthly-local-seo-report",
    "Local SEO & Reporting",
    "Monthly local SEO report outline",
    "Sections for rankings, GBP views, calls — you paste numbers.",
    [
      { key: "biz", label: "Business name", type: "text" },
      { key: "month", label: "Report month", type: "text" },
    ]
  ),
  f(
    "review-velocity-sentiment",
    "Local SEO & Reporting",
    "Review velocity & sentiment notes",
    "Simple formulas description + narrative template.",
    [
      { key: "newReviews", label: "New reviews this month", type: "number" },
      { key: "neg", label: "Negative (1-2 star) count", type: "number" },
    ]
  ),
  f(
    "noshow-cancel-rate-tracker",
    "Local SEO & Reporting",
    "No-show & cancellation rate tracker",
    "Monthly rate lines from appointments you enter.",
    [
      { key: "appts", label: "Total appointments", type: "number" },
      { key: "noshow", label: "No-shows", type: "number" },
      { key: "lateCancel", label: "Late cancellations", type: "number" },
    ]
  ),
  f(
    "lead-source-attribution",
    "Local SEO & Reporting",
    "Lead source attribution worksheet",
    "Table header + example rows for GBP, LSA, web, referral.",
    [
      { key: "biz", label: "Business name", type: "text" },
    ]
  ),
]

const byId = new Map(LOCAL_SERVICE_TOOLS.map((t) => [t.id, t]))

export function getLocalServiceTool(id: string): LifeToolMeta | undefined {
  return byId.get(id)
}

export function allLocalServiceToolIds(): string[] {
  return LOCAL_SERVICE_TOOLS.map((t) => t.id)
}

export function localServiceToolHomeDescriptions(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const t of LOCAL_SERVICE_TOOLS) {
    out[`/tools/local/${t.id}`] = t.description
  }
  return out
}
