import { sql } from '@/lib/db'
import {
  FALLBACK_TOOL_SLUGS_BY_PLAN,
  normalizePlanQueryParam,
  type PublicPlanDbName,
} from '@/lib/plan-tools-data'
import PlanToolsClient from './PlanToolsClient'

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

export default async function PlanToolsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const planKey = normalizePlanQueryParam(sp.plan)

  if (!planKey) {
    return <PlanToolsClient planKey={null} slugs={[]} />
  }

  const slugs = await getSlugsForPlan(planKey)

  return <PlanToolsClient planKey={planKey} slugs={slugs} />
}
