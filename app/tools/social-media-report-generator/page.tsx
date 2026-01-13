'use client'

import React, { useMemo, useState } from 'react'

type Platform =
  | 'Instagram'
  | 'TikTok'
  | 'YouTube'
  | 'X (Twitter)'
  | 'LinkedIn'
  | 'Facebook'
  | 'Other'

function toNumber(value: string): number {
  const n = Number(value.replace(/,/g, '').trim())
  return Number.isFinite(n) ? n : 0
}

function pct(n: number): string {
  if (!Number.isFinite(n)) return '0.00%'
  return `${n.toFixed(2)}%`
}

function money(n: number): string {
  if (!Number.isFinite(n)) return '$0.00'
  return `$${n.toFixed(2)}`
}

export default function SocialMediaReportGenerator() {
  const [platform, setPlatform] = useState<Platform>('Instagram')
  const [campaignName, setCampaignName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [impressions, setImpressions] = useState('0')
  const [reach, setReach] = useState('0')
  const [clicks, setClicks] = useState('0')
  const [likes, setLikes] = useState('0')
  const [comments, setComments] = useState('0')
  const [shares, setShares] = useState('0')
  const [saves, setSaves] = useState('0')
  const [followersGained, setFollowersGained] = useState('0')
  const [spend, setSpend] = useState('0')

  const computed = useMemo(() => {
    const imp = Math.max(0, toNumber(impressions))
    const rch = Math.max(0, toNumber(reach))
    const clk = Math.max(0, toNumber(clicks))
    const l = Math.max(0, toNumber(likes))
    const c = Math.max(0, toNumber(comments))
    const sh = Math.max(0, toNumber(shares))
    const sv = Math.max(0, toNumber(saves))
    const fg = Math.max(0, toNumber(followersGained))
    const sp = Math.max(0, toNumber(spend))

    const engagements = l + c + sh + sv
    const erImpressions = imp > 0 ? (engagements / imp) * 100 : 0
    const erReach = rch > 0 ? (engagements / rch) * 100 : 0
    const ctr = imp > 0 ? (clk / imp) * 100 : 0

    const cpc = clk > 0 ? sp / clk : 0
    const cpm = imp > 0 ? (sp / imp) * 1000 : 0
    const cpf = fg > 0 ? sp / fg : 0

    const insights: string[] = []
    if (imp > 0 && engagements === 0) insights.push('Engagements are at 0 — double-check the input metrics.')
    if (ctr < 0.5 && imp > 0) insights.push('CTR is low — test stronger hooks, clearer CTAs, and more relevant landing pages.')
    if (erImpressions >= 3) insights.push('Engagement rate is strong — consider scaling the winning creative format.')
    if (erImpressions > 0 && erImpressions < 1) insights.push('Engagement rate is weak — test new content pillars, posting times, and formats.')
    if (sp > 0 && clk === 0) insights.push('Spend is recorded but clicks are 0 — confirm attribution/UTMs or tracking.')
    if (fg > 0) insights.push('Follower growth is positive — replicate the posts that drove follows and add “follow” CTAs.')

    const recommendations: string[] = []
    recommendations.push('Repurpose the best-performing posts into 3–5 variants (hook, thumbnail, caption) and A/B test them.')
    recommendations.push('Add a clear CTA on every post and align the landing page message with the post promise.')
    recommendations.push('Track results weekly: impressions, engagements, CTR, follower growth, and cost metrics (if paid).')

    return {
      imp,
      rch,
      clk,
      l,
      c,
      sh,
      sv,
      fg,
      sp,
      engagements,
      erImpressions,
      erReach,
      ctr,
      cpc,
      cpm,
      cpf,
      insights,
      recommendations,
    }
  }, [impressions, reach, clicks, likes, comments, shares, saves, followersGained, spend])

  const reportMarkdown = useMemo(() => {
    const title = campaignName.trim() ? campaignName.trim() : 'Social Media Performance'
    const range =
      startDate && endDate ? `${startDate} → ${endDate}` : startDate ? `${startDate} → (ongoing)` : endDate ? `(unknown) → ${endDate}` : 'Not specified'

    return [
      `## ${title} Report`,
      ``,
      `- **Platform**: ${platform}`,
      `- **Date range**: ${range}`,
      ``,
      `### Key Metrics`,
      `- **Impressions**: ${computed.imp.toLocaleString()}`,
      `- **Reach**: ${computed.rch.toLocaleString()}`,
      `- **Clicks**: ${computed.clk.toLocaleString()}`,
      `- **Engagements** (likes + comments + shares + saves): ${computed.engagements.toLocaleString()}`,
      `- **Followers gained**: ${computed.fg.toLocaleString()}`,
      `- **Spend** (if paid): ${money(computed.sp)}`,
      ``,
      `### KPIs`,
      `- **Engagement rate (by impressions)**: ${pct(computed.erImpressions)}`,
      `- **Engagement rate (by reach)**: ${pct(computed.erReach)}`,
      `- **CTR**: ${pct(computed.ctr)}`,
      `- **CPC**: ${computed.sp > 0 ? money(computed.cpc) : 'N/A'}`,
      `- **CPM**: ${computed.sp > 0 ? money(computed.cpm) : 'N/A'}`,
      `- **Cost per follower**: ${computed.sp > 0 ? money(computed.cpf) : 'N/A'}`,
      ``,
      `### Insights`,
      ...(computed.insights.length ? computed.insights.map((x) => `- ${x}`) : ['- Not enough data to generate insights yet.']),
      ``,
      `### Recommendations`,
      ...computed.recommendations.map((x) => `- ${x}`),
      ``,
      `---`,
      `Generated by Social Media Report Generator.`,
      ``,
    ].join('\n')
  }, [campaignName, platform, startDate, endDate, computed])

  const copy = async () => {
    await navigator.clipboard.writeText(reportMarkdown)
    alert('Report copied to clipboard!')
  }

  const download = () => {
    const blob = new Blob([reportMarkdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(campaignName.trim() || 'social-media-report')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use This Tool</h2>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">What It Does</h3>
              <p>
                Generates a clean, copy-ready performance report from your social metrics, including engagement rate, CTR,
                and paid media KPIs like CPC/CPM.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">How to Use</h3>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Enter campaign details (platform + date range).</li>
                <li>Paste metrics from your analytics dashboard.</li>
                <li>Copy or download the generated Markdown report.</li>
              </ol>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Social Media Report Generator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {['Instagram', 'TikTok', 'YouTube', 'X (Twitter)', 'LinkedIn', 'Facebook', 'Other'].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Campaign name</label>
                <input
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., January product launch"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">End date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <MetricInput label="Impressions" value={impressions} onChange={setImpressions} />
              <MetricInput label="Reach" value={reach} onChange={setReach} />
              <MetricInput label="Clicks" value={clicks} onChange={setClicks} />
              <MetricInput label="Likes" value={likes} onChange={setLikes} />
              <MetricInput label="Comments" value={comments} onChange={setComments} />
              <MetricInput label="Shares" value={shares} onChange={setShares} />
              <MetricInput label="Saves" value={saves} onChange={setSaves} />
              <MetricInput label="Followers gained" value={followersGained} onChange={setFollowersGained} />
              <MetricInput label="Spend (optional)" value={spend} onChange={setSpend} />
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Quick KPIs</h2>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>
                  Engagement rate (impressions): <b>{pct(computed.erImpressions)}</b> ({computed.engagements.toLocaleString()}{' '}
                  engagements)
                </li>
                <li>
                  Engagement rate (reach): <b>{pct(computed.erReach)}</b>
                </li>
                <li>
                  CTR: <b>{pct(computed.ctr)}</b> ({computed.clk.toLocaleString()} clicks)
                </li>
                <li>
                  CPC: <b>{computed.sp > 0 ? money(computed.cpc) : 'N/A'}</b>
                </li>
                <li>
                  CPM: <b>{computed.sp > 0 ? money(computed.cpm) : 'N/A'}</b>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={copy}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm transition-colors"
              >
                Copy report
              </button>
              <button
                onClick={download}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
              >
                Download .md
              </button>
            </div>
            <textarea
              value={reportMarkdown}
              readOnly
              rows={22}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm resize-vertical"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricInput(props: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{props.label}</label>
      <input
        inputMode="numeric"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder="0"
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>
  )
}

