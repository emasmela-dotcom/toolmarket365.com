'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { labelFromToolSlug, type PublicPlanDbName } from '@/lib/plan-tools-data'

const copy = {
  en: {
    planNotFound: 'Plan not found',
    planNotFoundBody: 'Open this page from pricing, or use',
    planNotFoundSuffix: 'for ToolMarket365.',
    backToPricing: '← Back to pricing',
    pricing: '← Pricing',
    allTools: '— all tools',
    starterDesc:
      'Your subscription includes every tool on ToolMarket365 (120+). Browse the full catalog on the homepage or open any tool below.',
    planDesc: (count: number) => `${count} tools listed for this plan.`,
    viewCatalog: 'View full tools catalog →',
    open: 'Open →',
  },
  es: {
    planNotFound: 'Plan no encontrado',
    planNotFoundBody: 'Abre esta página desde precios, o usa',
    planNotFoundSuffix: 'para ToolMarket365.',
    backToPricing: '← Volver a precios',
    pricing: '← Precios',
    allTools: '— todas las herramientas',
    starterDesc:
      'Tu suscripción incluye todas las herramientas de ToolMarket365 (120+). Explora el catálogo completo en la página principal o abre cualquier herramienta abajo.',
    planDesc: (count: number) => `${count} herramientas listadas para este plan.`,
    viewCatalog: 'Ver catálogo completo de herramientas →',
    open: 'Abrir →',
  },
}

function planHeading(plan: PublicPlanDbName): string {
  if (plan === 'starter') return 'ToolMarket365'
  return plan === 'essential' ? 'Creator' : 'Full Creator'
}

export default function PlanToolsClient({
  planKey,
  slugs,
}: {
  planKey: PublicPlanDbName | null
  slugs: string[]
}) {
  const { language } = useLanguage()
  const c = copy[language]

  if (!planKey) {
    return (
      <div className="min-h-screen bg-mono-50 px-4 py-16 text-mono-900 dark:bg-mono-950 dark:text-mono-50">
        <div className="mx-auto max-w-lg rounded-lg border border-mono-200 bg-white p-8 dark:border-mono-600 dark:bg-white dark:text-mono-950">
          <h1 className="mb-2 text-xl font-bold text-mono-950 dark:text-mono-950">{c.planNotFound}</h1>
          <p className="mb-6 text-sm text-mono-700 dark:text-mono-700">
            {c.planNotFoundBody}{' '}
            <code className="rounded bg-mono-100 px-1 text-mono-900">?plan=starter</code> {c.planNotFoundSuffix}
          </p>
          <Link
            href="/pricing"
            className="font-semibold text-accent-700 underline hover:text-accent-800 dark:text-accent-700"
          >
            {c.backToPricing}
          </Link>
        </div>
      </div>
    )
  }

  const title = planHeading(planKey)

  return (
    <div className="min-h-screen bg-mono-50 px-4 py-12 text-mono-900 dark:bg-mono-950 dark:text-mono-50">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 text-sm text-mono-600 dark:text-mono-400">
          <Link href="/pricing" className="font-medium text-accent-700 hover:underline dark:text-accent-400">
            {c.pricing}
          </Link>
        </p>
        <h1 className="mb-2 text-3xl font-bold text-mono-950 dark:text-mono-50">
          <span className="text-accent-600 dark:text-accent-400">{title}</span> {c.allTools}
        </h1>
        <p className="mb-4 text-mono-700 dark:text-mono-300">
          {planKey === 'starter' ? c.starterDesc : c.planDesc(slugs.length)}
        </p>
        {planKey === 'starter' && (
          <p className="mb-8">
            <Link href="/tools" className="font-semibold text-accent-700 hover:underline dark:text-accent-400">
              {c.viewCatalog}
            </Link>
          </p>
        )}
        <ul className="divide-y divide-mono-200 rounded-lg border border-mono-200 bg-white dark:divide-mono-600 dark:border-mono-600 dark:bg-white">
          {slugs.map((slug) => (
            <li key={slug}>
              <Link
                href={`/tools/${slug}`}
                className="flex items-center justify-between gap-3 px-4 py-3 text-mono-950 hover:bg-mono-50 dark:text-mono-950 dark:hover:bg-mono-100"
              >
                <span className="font-medium">{labelFromToolSlug(slug)}</span>
                <span className="text-sm text-accent-700 dark:text-accent-700">{c.open}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
