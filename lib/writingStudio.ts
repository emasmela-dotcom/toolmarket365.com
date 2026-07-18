/**
 * Writing studio — template engine (no live LLM).
 * Stronger than the category shells: real multi-format packs with
 * publishable-looking drafts. Not Jasper / ChatGPT — same class as
 * Landing Copy and AI Blog Post Writer on this site.
 */

export const WRITING_FORMATS = [
  'blog',
  'email',
  'social',
  'ad',
  'landing',
  'newsletter',
] as const

export const WRITING_TONES = [
  'professional',
  'friendly',
  'bold',
  'casual',
  'persuasive',
] as const

export const WRITING_LENGTHS = ['short', 'medium', 'long'] as const

export type WritingFormat = (typeof WRITING_FORMATS)[number]
export type WritingTone = (typeof WRITING_TONES)[number]
export type WritingLength = (typeof WRITING_LENGTHS)[number]

export type WritingStudioInput = {
  topic: string
  audience: string
  problem: string
  keyPoints: string
  cta: string
  format: WritingFormat
  tone: WritingTone
  length: WritingLength
}

export type WritingStudioResult = {
  format: WritingFormat
  engine: 'template'
  wordCount: number
  headlines: string[]
  outline: string[]
  draft: string
  extras: { label: string; items: string[] }[]
  tips: string[]
}

function clean(s: string) {
  return s.replace(/\s+/g, ' ').trim()
}

function bullets(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => clean(l.replace(/^\s*[-*•]\s*/, '')))
    .filter(Boolean)
}

function pointList(points: string[], topic: string, problem: string): string[] {
  if (points.length) return points.slice(0, 8)
  return [
    `Clear answer to ${problem || topic}`,
    `Fastest first win with ${topic}`,
    `What ${topic} replaces or simplifies`,
  ]
}

type VoiceBits = {
  opener: string
  bridge: string
  closer: string
  energy: string
}

function voiceBits(tone: WritingTone): VoiceBits {
  switch (tone) {
    case 'friendly':
      return {
        opener: 'Let’s keep this simple.',
        bridge: 'Here’s what that looks like in practice:',
        closer: 'You’ve got this — take the next step when you’re ready.',
        energy: 'warm',
      }
    case 'bold':
      return {
        opener: 'Cut the noise.',
        bridge: 'Do this instead:',
        closer: 'Stop waiting. Move.',
        energy: 'direct',
      }
    case 'casual':
      return {
        opener: 'Real talk:',
        bridge: 'Basically:',
        closer: 'That’s the whole play. Go try it.',
        energy: 'relaxed',
      }
    case 'persuasive':
      return {
        opener: 'If results matter more than busywork,',
        bridge: 'The upside is concrete:',
        closer: 'The people who win act while others keep researching.',
        energy: 'benefit-first',
      }
    default:
      return {
        opener: 'Here’s the practical take.',
        bridge: 'Key points:',
        closer: 'Decide the next action and ship it.',
        energy: 'clear',
      }
  }
}

function lengthGuide(length: WritingLength): {
  blogSections: number
  emailBullets: number
  socialVariants: number
} {
  if (length === 'short') return { blogSections: 3, emailBullets: 3, socialVariants: 2 }
  if (length === 'long') return { blogSections: 6, emailBullets: 6, socialVariants: 4 }
  return { blogSections: 4, emailBullets: 4, socialVariants: 3 }
}

function words(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function expandPoint(
  point: string,
  topic: string,
  audience: string,
  problem: string,
  tone: WritingTone
): string {
  const v = voiceBits(tone)
  const pain = problem || `guesswork around ${topic}`
  if (tone === 'bold') {
    return `${point}. ${audience} still lose hours to ${pain}. ${topic} removes that drag — one clear move, then measure.`
  }
  if (tone === 'friendly') {
    return `${point}. If you’re ${audience} dealing with ${pain}, ${topic} is the calm path: start small, prove it, then scale.`
  }
  if (tone === 'persuasive') {
    return `${point}. ${audience} who fix ${pain} with ${topic} free time for revenue work — not another tab of tools.`
  }
  if (tone === 'casual') {
    return `${point}. Yeah — ${pain} is exhausting. ${topic} is the version that doesn’t make ${audience} learn a new stack first.`
  }
  return `${point}. For ${audience}, the cost of ${pain} is time and focus. ${topic} turns that into a repeatable step. ${v.bridge}`
}

export function runWritingStudio(input: WritingStudioInput): WritingStudioResult {
  const topic = clean(input.topic) || 'Your offer'
  const audience = clean(input.audience) || 'your audience'
  const problem = clean(input.problem) || `tool sprawl and slow ${topic} workflows`
  const cta = clean(input.cta) || 'Start today'
  const points = pointList(bullets(input.keyPoints), topic, problem)
  const v = voiceBits(input.tone)
  const guide = lengthGuide(input.length)
  const format = input.format

  const headlines = [
    `${topic}: built for ${audience} tired of ${problem}`,
    `Stop losing time to ${problem} — ${topic} for ${audience}`,
    `The ${topic} playbook ${audience} can run this week`,
    `How ${audience} fix ${problem} with ${topic}`,
    `${topic} in plain English (no fluff)`,
    `${cta} — ${topic} for ${audience}`,
  ]

  const outline = [
    `Hook — name ${problem}`,
    `Promise — ${topic} as the fix for ${audience}`,
    ...points.map((p, i) => `Section ${i + 1} — ${p}`),
    `Proof — example or number`,
    `CTA — ${cta}`,
  ]

  let draft = ''
  const extras: { label: string; items: string[] }[] = []
  const tips: string[] = []

  if (format === 'blog') {
    const sections = points.slice(0, guide.blogSections).map((p, i) => {
      const body = expandPoint(p, topic, audience, problem, input.tone)
      const next =
        i < guide.blogSections - 1
          ? `\n\nNext: connect this to ${points[(i + 1) % points.length]}.`
          : `\n\n${v.closer}`
      return `## ${p}\n\n${body}${next}`
    })

    draft = `# ${headlines[0]}

${v.opener} ${audience} don’t need another lecture — they need a way past ${problem}.

${topic} is that path: practical, focused, and built to ship.

## Why this matters

${problem} drains attention. ${audience} who win pick one system (${topic}) and repeat it. ${v.bridge}

${sections.join('\n\n')}

## Wrap-up

Recap: name the pain (${problem}), show the path (${topic}), ask once — **${cta}**.

---`
    extras.push({
      label: 'SEO title options',
      items: headlines.slice(0, 4),
    })
    extras.push({
      label: 'Meta descriptions',
      items: [
        `Practical ${topic} guide for ${audience}. Fix ${problem}, follow clear steps, then ${cta}.`.slice(
          0,
          155
        ),
        `${topic} without fluff — for ${audience} who want results this week, not more tabs.`.slice(
          0,
          155
        ),
      ],
    })
    extras.push({
      label: 'Internal link ideas',
      items: [
        `Pillar page: “${topic} overview”`,
        `Related: “how ${audience} handle ${problem}”`,
        `CTA page: ${cta}`,
      ],
    })
    tips.push('Put the main phrase in the H1 and first 100 words.')
    tips.push('One primary CTA — repeat it once at the end.')
  } else if (format === 'email') {
    const bulletsBlock = points
      .slice(0, guide.emailBullets)
      .map((p) => `• ${p} — so ${audience} spend less time on ${problem}`)
      .join('\n')

    draft = `Subject A: ${topic} for ${audience} (quick)
Subject B: Tired of ${problem}?
Subject C: ${cta} — takes 2 minutes

Preview text: ${v.opener} A clear path past ${problem}.

---

Hi {{first_name}},

${v.opener} I put this together for ${audience} stuck on ${problem}.

${topic} helps because it stays focused:

${bulletsBlock}

${v.bridge}
If that matches what you’re dealing with, ${cta}.

Thanks,
{{sender}}

P.S. Reply with your #1 blocker around ${topic} — I’ll keep it practical.`
    extras.push({
      label: 'Subject line tests',
      items: [
        `${topic}: one clear next step`,
        `Quick fix for ${problem}`,
        `For ${audience}: ${cta}`,
        `${topic} without the overwhelm`,
      ],
    })
    extras.push({
      label: 'Follow-up (day 3)',
      items: [
        `Subject: Circling back on ${topic}`,
        `Body opener: Wanted to make sure this didn’t get buried — still useful if ${problem} is on your list.`,
      ],
    })
    tips.push('One email = one ask.')
    tips.push('Personalize {{first_name}} and one line about their niche.')
  } else if (format === 'social') {
    const hooks = [
      `${audience}: if ${problem} still owns your week, read this.`,
      `Unpopular take: ${topic} beats another “all-in-one” promise.`,
      `${v.opener} ${problem} isn’t a personality trait — it’s a systems gap.`,
    ]
    const variants = Array.from({ length: guide.socialVariants }, (_, i) => {
      const hook = hooks[i % hooks.length]
      const body = points
        .slice(0, 3)
        .map((p) => `→ ${p}`)
        .join('\n')
      return `--- Variant ${i + 1} ---\n${hook}\n\n${body}\n\n${cta}\n#${topic.replace(/\s+/g, '').slice(0, 24)}`
    })

    draft = `LINKEDIN / LONG POST
${hooks[0]}

${v.bridge}
${points
  .slice(0, 4)
  .map((p, i) => `${i + 1}. ${p}`)
  .join('\n')}

${expandPoint(points[0], topic, audience, problem, input.tone)}

${cta}

---

SHORT / X-STYLE
${hooks[1]}
${points[0]}.
${cta}

---

THREAD STARTERS
${variants.join('\n\n')}`
    extras.push({
      label: 'Hashtag pack',
      items: [
        '#buildinpublic',
        '#creators',
        '#solopreneur',
        '#marketing',
        '#productivity',
        `#${audience.replace(/\s+/g, '')}`.slice(0, 30),
      ],
    })
    extras.push({ label: 'Hook bank', items: hooks })
    tips.push('Lead with tension or a specific audience callout.')
    tips.push('Pin one CTA — don’t stack three links.')
  } else if (format === 'ad') {
    draft = `PRIMARY TEXT (feed)
${v.opener} ${audience} wasting hours on ${problem} — ${topic} is the focused fix.

${points
  .slice(0, 3)
  .map((p) => `• ${p}`)
  .join('\n')}

${cta}

---

HEADLINE OPTIONS
1) ${headlines[1]}
2) ${headlines[2]}
3) ${headlines[5]}

---

DESCRIPTION
${points.slice(0, 2).join(' · ')} — for ${audience}.

---

CTA BUTTON IDEAS
${cta} | Learn more | Get started

---`
    extras.push({
      label: 'A/B headline tests',
      items: headlines.slice(0, 5),
    })
    extras.push({
      label: 'Audience angle lines',
      items: [
        `Pain: ${problem}`,
        `Offer: ${topic}`,
        `Who: ${audience}`,
        `Ask: ${cta}`,
      ],
    })
    tips.push('Match ad headline to landing H1.')
    tips.push('One promise per creative.')
  } else if (format === 'landing') {
    draft = `# ${headlines[1]}

## Subhead
Built for ${audience} who want ${topic} without drowning in ${problem}. ${
      input.tone === 'bold' ? 'No fluff.' : v.opener
    }

## Hero CTA
**${cta}**

## Benefits
${points.map((p) => `- **${p}** — so you spend less time on ${problem}`).join('\n')}

## How it works
1. Name your goal around ${topic}
2. Follow the short plan (no fluff)
3. ${cta} and measure one metric this week

## Social proof placeholders
“We finally stopped guessing on ${topic}.” — Name, role  
“Cut the hours we burned on ${problem}.” — Name, role

## Objection crushers
- **Is this another bloated suite?** No — ${topic} stays focused for ${audience}.
- **Will this take forever to learn?** No — first win is meant to land fast.
- **What if it doesn’t fit?** Start with one use case; expand only if it earns it.

## Final CTA
${cta}

---`
    extras.push({
      label: 'Hero headline options',
      items: headlines,
    })
    extras.push({
      label: 'FAQ starters',
      items: [
        `Q: Who is ${topic} for? A: ${audience} dealing with ${problem}.`,
        `Q: What’s the first step? A: ${cta}.`,
        `Q: How is this different? A: Focused on ${topic} — not 40 unrelated features.`,
      ],
    })
    tips.push('Hero = outcome + who it’s for + one CTA.')
    tips.push('Put real proof above the fold when you have it.')
  } else {
    draft = `Subject: ${topic} for ${audience} — this week

Hey {{first_name}},

${v.opener}

**This week’s focus:** ${topic}  
**The pain we’re cutting:** ${problem}

${points
  .slice(0, guide.emailBullets)
  .map((p, i) => `${i + 1}. ${p}`)
  .join('\n')}

**One story / note:** ${expandPoint(points[0], topic, audience, problem, input.tone)}

**One action:** ${cta}

See you next send,
{{sender}}

---`
    extras.push({
      label: 'Subject lines',
      items: [
        `${topic} — 3 moves for ${audience}`,
        `This week: kill ${problem}`,
        `Quick ${topic} note`,
        `${cta} (newsletter)`,
      ],
    })
    extras.push({
      label: 'PS options',
      items: [
        `P.S. Forward this to one ${audience} friend stuck on ${problem}.`,
        `P.S. Reply “NEXT” if you want next week’s deep dive on ${topic}.`,
      ],
    })
    tips.push('One theme per send.')
    tips.push('CTA once at the end — not in every paragraph.')
  }

  const trimmed = draft.trim()
  return {
    format,
    engine: 'template',
    wordCount: words(trimmed),
    headlines,
    outline,
    draft: trimmed,
    extras,
    tips,
  }
}
