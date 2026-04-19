import type { Metadata } from "next"
import type { ReactNode } from "react"
import { CopyTextButton } from "@/components/CopyTextButton"
import {
  buildUtmUrl,
  CTAS,
  EMAIL_SUBJECTS,
  HEADLINES,
  LANDING_SECTION_OUTLINE,
  SOCIAL_SNIPPETS,
  SUBHEADS,
  TRACKING_CHECKLIST,
  UTM_FIELD_HELP,
  UTM_PRESETS,
} from "@/lib/marketingKit"
import { getLifepack365Url, LIFEPACK365_NAME, SITE_NAME, getSiteUrl } from "@/lib/siteConfig"

export const metadata: Metadata = {
  title: "Marketing kit",
  description: `UTM presets, copy bank, and tracking checklist for ${SITE_NAME}.`,
  robots: { index: false, follow: true },
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12 rounded-xl border border-mono-200 dark:border-mono-700 bg-white dark:bg-mono-900 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-4">{title}</h2>
      {children}
    </section>
  )
}

export default function MarketingKitPage() {
  const origin = getSiteUrl()
  const lifepack = getLifepack365Url()

  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
        <header className="mb-10">
          <p className="text-sm font-medium text-accent-600 dark:text-accent-400 mb-2">Internal</p>
          <h1 className="text-3xl font-bold text-mono-950 dark:text-mono-50 mb-2">Marketing kit</h1>
          <p className="text-mono-600 dark:text-mono-400">
            UTM patterns, ready-to-edit copy, landing section outline, and tracking notes for {SITE_NAME}. Not indexed
            in search — share this URL with collaborators. Replace{" "}
            <code className="text-sm bg-mono-100 dark:bg-mono-800 px-1 rounded">{"{{BASE}}"}</code> with{" "}
            <strong className="text-mono-800 dark:text-mono-200">{origin}</strong> in snippets.
          </p>
        </header>

        <Block title="UTM parameter reference">
          <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300 mb-6">
            {UTM_FIELD_HELP.map((row) => (
              <li key={row.param}>
                <code className="text-accent-700 dark:text-accent-300">{row.param}</code> — {row.use}
              </li>
            ))}
          </ul>
          <h3 className="font-semibold text-mono-900 dark:text-mono-100 mb-2">Preset links (click copy)</h3>
          <ul className="space-y-4">
            {UTM_PRESETS.map((p) => {
              const url = buildUtmUrl(origin, p.path, p.params)
              return (
                <li
                  key={p.id}
                  className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-t border-mono-100 dark:border-mono-800 pt-4 first:border-0 first:pt-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-mono-900 dark:text-mono-100">{p.label}</p>
                    <p className="text-xs text-mono-500 mb-1">{p.note}</p>
                    <pre className="text-xs break-all whitespace-pre-wrap bg-mono-100 dark:bg-mono-950 p-2 rounded text-mono-800 dark:text-mono-200">
                      {url}
                    </pre>
                  </div>
                  <CopyTextButton text={url} />
                </li>
              )
            })}
          </ul>
        </Block>

        <Block title="Copy bank — headlines">
          <ul className="space-y-3">
            {HEADLINES.map((h, i) => (
              <li key={i} className="flex gap-2 items-start justify-between">
                <p className="text-mono-800 dark:text-mono-200 text-sm flex-1">{h}</p>
                <CopyTextButton text={h} />
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Copy bank — subheads">
          <ul className="space-y-3">
            {SUBHEADS.map((h, i) => (
              <li key={i} className="flex gap-2 items-start justify-between">
                <p className="text-mono-800 dark:text-mono-200 text-sm flex-1">{h}</p>
                <CopyTextButton text={h} />
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Copy bank — CTAs">
          <ul className="space-y-3">
            {CTAS.map((h, i) => (
              <li key={i} className="flex gap-2 items-start justify-between">
                <p className="text-mono-800 dark:text-mono-200 text-sm flex-1">{h}</p>
                <CopyTextButton text={h} />
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Social snippets">
          <ul className="space-y-4">
            {SOCIAL_SNIPPETS.map((s, i) => {
              const filled = s.text.replace(/\{\{BASE\}\}/g, origin)
              return (
                <li key={i} className="border border-mono-200 dark:border-mono-700 rounded-lg p-4">
                  <p className="text-xs font-semibold text-mono-500 mb-2">{s.platform}</p>
                  <p className="text-sm text-mono-800 dark:text-mono-200 whitespace-pre-wrap mb-2">{filled}</p>
                  <CopyTextButton text={filled} label="Copy snippet" />
                </li>
              )
            })}
          </ul>
        </Block>

        <Block title="Email subject lines">
          <ul className="space-y-3">
            {EMAIL_SUBJECTS.map((h, i) => (
              <li key={i} className="flex gap-2 items-start justify-between">
                <p className="text-mono-800 dark:text-mono-200 text-sm flex-1">{h}</p>
                <CopyTextButton text={h} />
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Landing page section outline">
          <ol className="list-decimal pl-5 space-y-2 text-sm text-mono-700 dark:text-mono-300">
            {LANDING_SECTION_OUTLINE.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </Block>

        <Block title="Tracking & analytics checklist">
          <ul className="list-disc pl-5 space-y-2 text-sm text-mono-700 dark:text-mono-300">
            {TRACKING_CHECKLIST.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </Block>

        <Block title="LifePack365 cross-promo (sister product)">
          <p className="text-sm text-mono-700 dark:text-mono-300 mb-2">
            Public URL: <a className="text-accent-600 hover:underline font-medium" href={lifepack}>{lifepack}</a> (
            {LIFEPACK365_NAME})
          </p>
          <ul className="space-y-2 text-sm text-mono-700 dark:text-mono-300">
            <li>Use separate UTMs on the LifePack365 site when you drive traffic from TM365 emails or banners.</li>
            <li>Example out-link with UTMs (edit host):</li>
          </ul>
          <pre className="mt-2 text-xs break-all bg-mono-100 dark:bg-mono-950 p-3 rounded text-mono-800 dark:text-mono-200">
            {`${lifepack}/?utm_source=toolmarket365&utm_medium=referral&utm_campaign=sister_footer`}
          </pre>
          <div className="mt-2">
            <CopyTextButton
              text={`${lifepack}/?utm_source=toolmarket365&utm_medium=referral&utm_campaign=sister_footer`}
              label="Copy example LP link"
            />
          </div>
        </Block>
      </main>
    </div>
  )
}
