import Link from 'next/link'
import { sql } from '@/lib/db'
import {
  FALLBACK_TOOL_SLUGS_BY_PLAN,
  labelFromToolSlug,
  normalizePlanQueryParam,
  type PublicPlanDbName,
} from '@/lib/plan-tools-data'

export const dynamic = 'force-dynamic'

type PlanRow = {
  name: string
  display_name: string | null
  tool_slugs: string[] | null
}

async function getSlugsForPlan(plan: PublicPlanDbName): Promise<string[]> {
  if (sql) {
    try {
      const rows = (await sql`
        SELECT name, display_name, tool_slugs
        FROM plans
        WHERE name = ${plan}
        LIMIT 1
      `) as PlanRow[]
      const row = rows[0]
      if (row?.tool_slugs?.length) {
        return [...new Set(row.tool_slugs)]
      }
    } catch {
      // use fallback below
    }
  }
  return [...new Set([...FALLBACK_TOOL_SLUGS_BY_PLAN[plan]])]
}

function planHeading(plan: PublicPlanDbName): string {
  if (plan === 'starter') return 'ToolMarket365'
  return plan === 'essential' ? 'Creator' : 'Full Creator'
}

export default async function PlanToolsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const planKey = normalizePlanQueryParam(sp.plan)

  if (!planKey) {
    return (
      <div className="min-h-screen bg-mono-50 px-4 py-16 text-mono-900 dark:bg-mono-950 dark:text-mono-50">
        <div className="mx-auto max-w-lg rounded-lg border border-mono-200 bg-white p-8 dark:border-mono-600 dark:bg-white dark:text-mono-950">
          <h1 className="mb-2 text-xl font-bold text-mono-950 dark:text-mono-950">Plan not found</h1>
          <p className="mb-6 text-sm text-mono-700 dark:text-mono-700">
            Open this page from a pricing tier link, or choose{' '}
            <code className="rounded bg-mono-100 px-1 text-mono-900">?plan=essential</code> or{' '}
            <code className="rounded bg-mono-100 px-1 text-mono-900">?plan=professional</code>.
          </p>
          <Link
            href="/pricing"
            className="font-semibold text-accent-700 underline hover:text-accent-800 dark:text-accent-700"
          >
            ← Back to pricing
          </Link>
        </div>
      </div>
    )
  }

  const slugs = await getSlugsForPlan(planKey)
  const title = planHeading(planKey)

  return (
    <div className="min-h-screen bg-mono-50 px-4 py-12 text-mono-900 dark:bg-mono-950 dark:text-mono-50">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 text-sm text-mono-600 dark:text-mono-400">
          <Link href="/pricing" className="font-medium text-accent-700 hover:underline dark:text-accent-400">
            ← Pricing
          </Link>
        </p>
        <h1 className="mb-2 text-3xl font-bold text-mono-950 dark:text-mono-50">
          Tools in the <span className="text-accent-600 dark:text-accent-400">{title}</span> plan
        </h1>
        <p className="mb-8 text-mono-700 dark:text-mono-300">
          {slugs.length} tools included with this subscription tier. Credit-priced tools may still show a credit
          badge elsewhere; see the plan disclaimer on pricing.
        </p>
        <ul className="divide-y divide-mono-200 rounded-lg border border-mono-200 bg-white dark:divide-mono-600 dark:border-mono-600 dark:bg-white">
          {slugs.map((slug) => (
            <li key={slug}>
              <Link
                href={`/tools/${slug}`}
                className="flex items-center justify-between gap-3 px-4 py-3 text-mono-950 hover:bg-mono-50 dark:text-mono-950 dark:hover:bg-mono-100"
              >
                <span className="font-medium">{labelFromToolSlug(slug)}</span>
                <span className="text-sm text-accent-700 dark:text-accent-700">Open →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
