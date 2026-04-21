/**
 * Shared visual accents for life / local tool shells — category → left rail + badge.
 * Falls back to neutral when category is unknown.
 */

export type ToolSurfaceAccent = {
  /** Tailwind classes for a 4px left accent (use with border + border-l-4) */
  leftRail: string
  /** Tailwind classes for the category chip */
  badge: string
}

const NEUTRAL: ToolSurfaceAccent = {
  leftRail: "border-l-mono-800 dark:border-l-mono-200",
  badge:
    "border border-mono-200 bg-mono-100 text-mono-800 dark:border-mono-700 dark:bg-mono-800/90 dark:text-mono-100",
}

const LIFE_BY_CATEGORY: Record<string, ToolSurfaceAccent> = {
  "Personal Finance": {
    leftRail: "border-l-emerald-600 dark:border-l-emerald-400",
    badge:
      "border border-emerald-200/90 bg-emerald-50 text-emerald-900 dark:border-emerald-800/80 dark:bg-emerald-950/70 dark:text-emerald-100",
  },
  "Writing & Communication": {
    leftRail: "border-l-sky-600 dark:border-l-sky-400",
    badge:
      "border border-sky-200/90 bg-sky-50 text-sky-950 dark:border-sky-800/80 dark:bg-sky-950/70 dark:text-sky-100",
  },
  "Health & Wellness": {
    leftRail: "border-l-rose-600 dark:border-l-rose-400",
    badge:
      "border border-rose-200/90 bg-rose-50 text-rose-950 dark:border-rose-800/80 dark:bg-rose-950/70 dark:text-rose-100",
  },
  "Learning & Productivity": {
    leftRail: "border-l-violet-600 dark:border-l-violet-400",
    badge:
      "border border-violet-200/90 bg-violet-50 text-violet-950 dark:border-violet-800/80 dark:bg-violet-950/70 dark:text-violet-100",
  },
  "Home & Life": {
    leftRail: "border-l-amber-600 dark:border-l-amber-400",
    badge:
      "border border-amber-200/90 bg-amber-50 text-amber-950 dark:border-amber-800/80 dark:bg-amber-950/70 dark:text-amber-100",
  },
  "Family & Parenting": {
    leftRail: "border-l-fuchsia-600 dark:border-l-fuchsia-400",
    badge:
      "border border-fuchsia-200/90 bg-fuchsia-50 text-fuchsia-950 dark:border-fuchsia-800/80 dark:bg-fuchsia-950/70 dark:text-fuchsia-100",
  },
  Travel: {
    leftRail: "border-l-cyan-600 dark:border-l-cyan-400",
    badge:
      "border border-cyan-200/90 bg-cyan-50 text-cyan-950 dark:border-cyan-800/80 dark:bg-cyan-950/70 dark:text-cyan-100",
  },
  "Fun & Lifestyle": {
    leftRail: "border-l-orange-600 dark:border-l-orange-400",
    badge:
      "border border-orange-200/90 bg-orange-50 text-orange-950 dark:border-orange-800/80 dark:bg-orange-950/70 dark:text-orange-100",
  },
  "Privacy & Safety": {
    leftRail: "border-l-slate-600 dark:border-l-slate-400",
    badge:
      "border border-slate-200/90 bg-slate-100 text-slate-900 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100",
  },
  "Everyday Calculators": {
    leftRail: "border-l-indigo-600 dark:border-l-indigo-400",
    badge:
      "border border-indigo-200/90 bg-indigo-50 text-indigo-950 dark:border-indigo-800/80 dark:bg-indigo-950/70 dark:text-indigo-100",
  },
}

const LOCAL_BY_CATEGORY: Record<string, ToolSurfaceAccent> = {
  "Reviews & Reputation": {
    leftRail: "border-l-teal-600 dark:border-l-teal-400",
    badge:
      "border border-teal-200/90 bg-teal-50 text-teal-950 dark:border-teal-800/80 dark:bg-teal-950/70 dark:text-teal-100",
  },
  "Google Business Profile": {
    leftRail: "border-l-blue-600 dark:border-l-blue-400",
    badge:
      "border border-blue-200/90 bg-blue-50 text-blue-950 dark:border-blue-800/80 dark:bg-blue-950/70 dark:text-blue-100",
  },
  "SMS & Messaging": {
    leftRail: "border-l-green-600 dark:border-l-green-400",
    badge:
      "border border-green-200/90 bg-green-50 text-green-950 dark:border-green-800/80 dark:bg-green-950/70 dark:text-green-100",
  },
  "Local Offers & Promotions": {
    leftRail: "border-l-orange-600 dark:border-l-orange-400",
    badge:
      "border border-orange-200/90 bg-orange-50 text-orange-950 dark:border-orange-800/80 dark:bg-orange-950/70 dark:text-orange-100",
  },
  "Booking & Scheduling": {
    leftRail: "border-l-purple-600 dark:border-l-purple-400",
    badge:
      "border border-purple-200/90 bg-purple-50 text-purple-950 dark:border-purple-800/80 dark:bg-purple-950/70 dark:text-purple-100",
  },
  "CRM & Lead Management": {
    leftRail: "border-l-indigo-600 dark:border-l-indigo-400",
    badge:
      "border border-indigo-200/90 bg-indigo-50 text-indigo-950 dark:border-indigo-800/80 dark:bg-indigo-950/70 dark:text-indigo-100",
  },
  "Local SEO & Reporting": {
    leftRail: "border-l-slate-600 dark:border-l-slate-400",
    badge:
      "border border-slate-200/90 bg-slate-100 text-slate-900 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100",
  },
}

export function lifeToolSurfaceAccent(category: string): ToolSurfaceAccent {
  return LIFE_BY_CATEGORY[category] ?? NEUTRAL
}

export function localToolSurfaceAccent(category: string): ToolSurfaceAccent {
  return LOCAL_BY_CATEGORY[category] ?? NEUTRAL
}
