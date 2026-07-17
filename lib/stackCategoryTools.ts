export const STACK_CATEGORY_SLUGS = [
  'writing',
  'coding',
  'research',
  'images',
  'video',
  'meetings',
  'office',
  'automation',
] as const

export type StackCategorySlug = (typeof STACK_CATEGORY_SLUGS)[number]

export type StackCategoryInput = {
  category: StackCategorySlug
  topic: string
  details: string
}

export type StackCategoryResult = {
  category: StackCategorySlug
  title: string
  markdown: string
}

function clean(s: string) {
  return s.replace(/\s+/g, ' ').trim()
}

function linesFrom(details: string): string[] {
  return details
    .split(/\r?\n/)
    .map((l) => clean(l.replace(/^\s*[-*]\s*/, '')))
    .filter(Boolean)
}

export function isStackCategorySlug(value: string): value is StackCategorySlug {
  return (STACK_CATEGORY_SLUGS as readonly string[]).includes(value)
}

/** Template starters for ToolKeeper-aligned categories (rename later). */
export function runStackCategoryTool(input: StackCategoryInput): StackCategoryResult {
  const topic = clean(input.topic) || 'Untitled'
  const details = input.details.trim()
  const bullets = linesFrom(details)
  const extra = bullets.length
    ? bullets.map((b) => `- ${b}`).join('\n')
    : '- (Add more detail above and run again.)'

  switch (input.category) {
    case 'writing': {
      const markdown = `# Writing draft — ${topic}

## Goal
${topic}

## Outline
1. Hook — open with the problem or promise
2. Context — why this matters now
3. Main points
${extra}
4. Close — clear next step for the reader

## Starter draft
${topic}.

Lead with the problem your reader already feels. Then cover:
${bullets.length ? bullets.map((b, i) => `${i + 1}. ${b}`).join('\n') : '1. Point one\n2. Point two\n3. Point three'}

End with one sentence telling them what to do next.

---
_Starter writing draft — edit tone and facts before publishing._
`
      return { category: 'writing', title: `Writing — ${topic}`, markdown: markdown.trim() }
    }
    case 'coding': {
      const markdown = `# Coding plan — ${topic}

## Goal
${topic}

## Breakdown
1. Confirm inputs and expected output
2. Sketch the smallest working path
3. Implement core logic
4. Handle empty / error cases
5. Quick manual test

## Notes from you
${extra}

## Starter checklist
- [ ] Define function / module name
- [ ] List inputs and return shape
- [ ] Write happy-path steps
- [ ] Add one failure case
- [ ] Note where to plug this into the app

\`\`\`
// TODO: ${topic}
// Inputs: …
// Output: …
\`\`\`

---
_Starter coding plan — replace with real code in your editor._
`
      return { category: 'coding', title: `Coding — ${topic}`, markdown: markdown.trim() }
    }
    case 'research': {
      const markdown = `# Research brief — ${topic}

## Question
${topic}

## What to find
${extra}

## Source checklist
- [ ] Primary sources (official docs, data, filings)
- [ ] Recent articles or reports (last 12 months)
- [ ] Competing or alternate views
- [ ] Numbers you can verify

## Findings template
| Claim | Source | Confidence | Notes |
| --- | --- | --- | --- |
|  |  | High / Med / Low |  |

## Summary (fill in)
1. What we know:
2. What is still unclear:
3. Recommended next step:

---
_Starter research brief — replace placeholders with real sources._
`
      return { category: 'research', title: `Research — ${topic}`, markdown: markdown.trim() }
    }
    case 'images': {
      const markdown = `# Images brief — ${topic}

## Use
${topic}

## Visual direction
${extra}

## Prompt starter
Create an image for: ${topic}.
Style: clear, high-contrast, product-ready.
Include: ${bullets[0] || 'main subject centered'}.
Avoid: clutter, unreadable text, watermarks.

## Shot / layout notes
1. Subject: ${topic}
2. Background: simple, supports the subject
3. Text overlay (if any): short, large, high contrast
4. Alt text draft: Image of ${topic}${bullets[0] ? ` — ${bullets[0]}` : ''}.

---
_Starter images brief — refine in your image tool of choice._
`
      return { category: 'images', title: `Images — ${topic}`, markdown: markdown.trim() }
    }
    case 'video': {
      const markdown = `# Video outline — ${topic}

## Topic
${topic}

## Beats
1. Hook (0–3s) — stop the scroll with ${topic}
2. Setup — who this is for and why now
3. Core content
${extra}
4. Proof / example
5. CTA — one clear action

## Spoken draft
Hook: If you care about ${topic}, watch this.
Body: Cover each beat in plain language.
Close: Do this next — ${bullets[bullets.length - 1] || 'follow the link / try the step'}.

## Shoot notes
- One idea per clip
- On-screen text for the hook and CTA
- Keep total length tight unless details require more

---
_Starter video outline — adjust timing for your platform._
`
      return { category: 'video', title: `Video — ${topic}`, markdown: markdown.trim() }
    }
    case 'meetings': {
      const markdown = `# Meeting plan — ${topic}

## Purpose
${topic}

## Agenda
1. Open + goal (2 min)
2. Updates
${extra}
3. Decisions needed
4. Action items + owners
5. Close + next meeting

## Notes template
**Date:**  
**Attendees:**  
**Decisions:**  
**Action items:**  
- Owner — task — due date  

**Open questions:**  

---
_Starter meetings plan — paste into your calendar invite or notes doc._
`
      return { category: 'meetings', title: `Meetings — ${topic}`, markdown: markdown.trim() }
    }
    case 'office': {
      const markdown = `# Office doc — ${topic}

## Document goal
${topic}

## Structure
1. Title / subject: ${topic}
2. Summary (3–5 lines)
3. Details
${extra}
4. Ask / decision needed
5. Attachments / links

## Email / memo starter
Subject: ${topic}

Hi team,

I'm writing about ${topic}.

Key points:
${bullets.length ? bullets.map((b) => `- ${b}`).join('\n') : '- Point one\n- Point two'}

Please reply with your decision or the next step by [date].

Thanks

---
_Starter office draft — fit to email, memo, or slide outline as needed._
`
      return { category: 'office', title: `Office — ${topic}`, markdown: markdown.trim() }
    }
    case 'automation': {
      const markdown = `# Automation plan — ${topic}

## Outcome
${topic}

## Trigger → steps → result
**Trigger:** ${bullets[0] || 'When [event] happens'}
**Steps:**
${
  bullets.length > 1
    ? bullets
        .slice(1)
        .map((b, i) => `${i + 1}. ${b}`)
        .join('\n')
    : '1. Capture the input\n2. Transform or route it\n3. Notify or save the result'
}
**Result:** ${topic}

## Failure cases
- [ ] Missing input
- [ ] Duplicate run
- [ ] Downstream tool is down

## Build checklist
- [ ] Name the automation
- [ ] Confirm trigger
- [ ] Map each step owner / app
- [ ] Add one test run
- [ ] Log success and failure

---
_Starter automation plan — implement in Zapier, Make, or your own scripts._
`
      return { category: 'automation', title: `Automation — ${topic}`, markdown: markdown.trim() }
    }
  }
}
