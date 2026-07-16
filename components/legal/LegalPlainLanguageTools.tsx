'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LEGAL_TOOLS, type LegalToolId } from '@/lib/legalTools/metadata'
import { LEGAL_TOOL_I18N } from '@/lib/legalTools/homeSections'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { TranslationKey } from '@/lib/i18n/translations'
import '@/app/tools/legal-plain-language-tools/legal-tools.css'

const CLASSIFY_QUESTION_IDS = [
  'q1',
  'q2',
  'q3',
  'q4',
  'q5',
  'q6',
  'q7',
  'q8',
  'q9',
  'q10',
] as const

const CLASSIFY_QUESTION_KEYS: Record<(typeof CLASSIFY_QUESTION_IDS)[number], TranslationKey> = {
  q1: 'legalClassifyQ1',
  q2: 'legalClassifyQ2',
  q3: 'legalClassifyQ3',
  q4: 'legalClassifyQ4',
  q5: 'legalClassifyQ5',
  q6: 'legalClassifyQ6',
  q7: 'legalClassifyQ7',
  q8: 'legalClassifyQ8',
  q9: 'legalClassifyQ9',
  q10: 'legalClassifyQ10',
}

const disputeIntros: Record<string, (facts: string) => string> = {
  deposit: (facts) => `I am writing to formally demand the return of my security deposit in the amount stated below. ${facts}`,
  unpaid: (facts) => `I am writing to formally demand payment for services rendered and/or wages owed to me. ${facts}`,
  damage: (facts) => `I am writing to demand compensation for property damage caused by your actions or negligence. ${facts}`,
  contract: (facts) => `I am writing regarding your material breach of our agreement. ${facts}`,
  refund: (facts) => `I am writing to formally request a full refund for a defective or misrepresented product/service. ${facts}`,
  debt: (facts) => `I am writing to formally demand repayment of a personal debt owed to me. ${facts}`,
}

const disputeWarnings: Record<string, string> = {
  deposit:
    'In most states, landlords are required by law to return security deposits within 14–30 days of move-out. Failure to do so may entitle me to double or triple damages plus attorney fees under state landlord-tenant law.',
  unpaid:
    'Under the Fair Labor Standards Act (FLSA) and applicable state wage laws, employers are required to pay all earned wages. Failure to pay may expose you to liquidated damages equal to the unpaid amount, plus penalties.',
  damage:
    'I reserve the right to seek compensation through small claims court or civil litigation if this matter is not resolved promptly.',
  contract:
    'Your failure to perform under the terms of our agreement constitutes a breach of contract for which I am entitled to seek damages.',
  refund:
    'Under consumer protection laws and implied warranty of merchantability, I am entitled to a full refund for goods or services that do not perform as represented.',
  debt: 'I expect prompt repayment of this debt. If necessary, I am prepared to pursue recovery through the appropriate legal channels.',
}

const EMP_YES = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q10']
const CON_YES = ['q7', 'q8', 'q9']

function parseTab(raw: string | null): LegalToolId {
  if (raw === 'rights' || raw === 'classify') return raw
  return 'demand'
}

export function LegalPlainLanguageTools() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const router = useRouter()
  const tab = parseTab(searchParams.get('tab'))
  const [active, setActive] = useState<LegalToolId>(tab)

  const tabs = useMemo(
    () =>
      [
        { id: 'demand' as const, label: t('legalTabDemand') },
        { id: 'rights' as const, label: t('legalTabRights') },
        { id: 'classify' as const, label: t('legalTabClassify') },
      ] satisfies { id: LegalToolId; label: string }[],
    [t]
  )

  const classifyQuestions = useMemo(
    () =>
      CLASSIFY_QUESTION_IDS.map((id) => ({
        id,
        text: t(CLASSIFY_QUESTION_KEYS[id]),
      })),
    [t]
  )

  const rightsChecks = useMemo(
    () =>
      [
        ['fired', t('legalCheckFired')],
        ['harass', t('legalCheckHarass')],
        ['wages', t('legalCheckWages')],
        ['discrim', t('legalCheckDiscrim')],
        ['fmla', t('legalCheckFmla')],
        ['retaliate', t('legalCheckRetaliate')],
        ['noncompete', t('legalCheckNoncompete')],
        ['safety', t('legalCheckSafety')],
      ] as const,
    [t]
  )

  useEffect(() => {
    setActive(tab)
  }, [tab])

  const setTab = (id: LegalToolId) => {
    setActive(id)
    router.replace(`/tools/legal-plain-language-tools?tab=${id}`, { scroll: false })
  }

  // Demand letter
  const [demand, setDemand] = useState({
    yourName: '',
    yourAddr: '',
    theirName: '',
    theirAddr: '',
    type: 'deposit',
    amount: '',
    deadline: '14',
    facts: '',
    prior: '',
  })
  const [letter, setLetter] = useState('')
  const [showLetter, setShowLetter] = useState(false)

  const genDemand = () => {
    const name = demand.yourName || '[Your Name]'
    const addr = demand.yourAddr || '[Your Address]'
    const them = demand.theirName || '[Recipient Name]'
    const theirAddr = demand.theirAddr || '[Recipient Address]'
    const amount = demand.amount || '[AMOUNT]'
    const deadline = demand.deadline || '14'
    const facts = demand.facts || '[Describe the facts of your dispute here.]'
    const prior = demand.prior
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + +deadline)
    const dueDateStr = dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const intro = disputeIntros[demand.type]?.(facts) ?? facts
    const warning = disputeWarnings[demand.type] ?? ''

    setLetter(`${name}
${addr}

${today}

${them}
${theirAddr}

RE: FORMAL DEMAND FOR PAYMENT — $${(+amount || 0).toLocaleString()}

Dear ${them},

${intro}
${prior ? '\n' + prior + '\n' : ''}
${warning}

DEMAND: I hereby formally demand payment of $${(+amount || 0).toLocaleString()} in full, no later than ${dueDateStr} (${deadline} days from the date of this letter).

Please remit payment to the address listed above or contact me directly to arrange resolution. All communications should be in writing.

If I do not receive a satisfactory response by the deadline above, I will not hesitate to pursue all available legal remedies, including filing a complaint with the appropriate state agency and/or initiating proceedings in small claims or civil court without further notice to you.

This letter shall serve as formal notice of my intent to pursue legal action if this matter is not resolved within the timeframe stated.

Sincerely,

${name}
${addr}

[Signature]

---
Sent via: Certified Mail (Return Receipt Requested) and Electronic Mail
Retain all copies for your records.`)
    setShowLetter(true)
  }

  // Rights
  const [rights, setRights] = useState({
    status: 'fulltime',
    size: 'small',
    fired: false,
    harass: false,
    wages: false,
    discrim: false,
    fmla: false,
    retaliate: false,
    noncompete: false,
    safety: false,
  })
  const [rightsHtml, setRightsHtml] = useState('')
  const [showRights, setShowRights] = useState(false)

  const checkRights = () => {
    const { status, size } = rights
    const sections: { title: string; color: string; items: string[] }[] = []

    if (rights.fired) {
      sections.push({
        title: 'Termination & Unemployment',
        color: '#1e2d4a',
        items: [
          'Most states are "at-will," meaning employers can terminate for any non-discriminatory reason — but NOT for illegal reasons (retaliation, discrimination).',
          'You are generally entitled to all earned wages and accrued PTO (varies by state) on your final paycheck.',
          'File for unemployment insurance with your state within 2–3 weeks of job loss. You are eligible unless fired for gross misconduct.',
          'If laid off with 50+ coworkers at once, your employer may owe you 60 days notice under the federal WARN Act.',
          'Review any severance agreement carefully — signing waives your right to sue. You typically have 21 days to review and 7 days to revoke.',
        ],
      })
    }
    if (rights.harass) {
      sections.push({
        title: 'Workplace Harassment',
        color: '#b32020',
        items: [
          'Harassment based on race, sex, religion, national origin, age (40+), or disability is illegal under federal law (Title VII, ADEA, ADA).',
          'Document every incident: date, time, location, what was said/done, witnesses.',
          'Report to HR in writing and keep a copy — this starts the official record.',
          'If HR fails to act, file a charge with the EEOC (eeoc.gov) within 180–300 days of the incident.',
          size === 'small'
            ? 'Note: Federal harassment laws apply to employers with 15+ employees. Your state may have broader protections.'
            : 'Federal protections apply to your employer size.',
        ],
      })
    }
    if (rights.wages) {
      sections.push({
        title: 'Unpaid Wages & Overtime',
        color: '#1a6b3a',
        items: [
          'The FLSA requires payment of at least federal minimum wage ($7.25/hr) and 1.5x for hours over 40/week for non-exempt employees.',
          'Your state minimum wage may be higher — it always applies.',
          'Wage theft (not paying for all hours worked, illegal deductions) is actionable. File with your state Department of Labor.',
          status === 'contractor'
            ? 'As a 1099 contractor, you are not covered by FLSA overtime rules — but you can still sue for unpaid contract amounts.'
            : 'As a W-2 employee, you are protected by FLSA wage rules.',
          'Statute of limitations: 2 years for regular violations, 3 years if willful. Act promptly.',
        ],
      })
    }
    if (rights.discrim) {
      sections.push({
        title: 'Workplace Discrimination',
        color: '#6b3a1a',
        items: [
          'Federal law prohibits discrimination based on: race, color, religion, sex, national origin, age (40+), disability, pregnancy, and genetic information.',
          'Discrimination can be direct (overtly biased treatment) or indirect (policies that disproportionately impact a protected class).',
          size === 'small'
            ? 'Federal anti-discrimination laws apply to employers with 15+ employees (ADA/Title VII) or 20+ (ADEA). State laws often cover smaller employers.'
            : 'Your employer size is covered by major federal anti-discrimination statutes.',
          'You must file an EEOC charge before suing in federal court. Do this within 180–300 days of the discriminatory act.',
          'Keep all performance reviews, emails, and records showing you were treated differently than comparable coworkers.',
        ],
      })
    }
    if (rights.fmla) {
      sections.push({
        title: 'Medical & Family Leave (FMLA)',
        color: '#1e4a2d',
        items: [
          'The Family and Medical Leave Act (FMLA) provides up to 12 weeks of unpaid, job-protected leave per year.',
          size === 'small' || size === 'mid'
            ? 'FMLA applies to employers with 50+ employees. If your employer is smaller, check state-level leave laws — many states have broader protections.'
            : 'Your employer is covered by FMLA.',
          'You must have worked for the employer for at least 12 months and 1,250 hours in the past year.',
          'Qualifying reasons: serious health condition, caring for a family member, childbirth/adoption.',
          'Your employer cannot fire or demote you for taking FMLA leave. If they do, that is illegal retaliation.',
        ],
      })
    }
    if (rights.retaliate) {
      sections.push({
        title: 'Retaliation Protections',
        color: '#4a1e2d',
        items: [
          'It is illegal for an employer to punish you for reporting discrimination, harassment, wage violations, safety issues, or participating in an investigation.',
          'Retaliation includes: termination, demotion, salary cuts, schedule changes, or creating a hostile environment in response to your complaint.',
          'Document the timeline: when you made the complaint and when the negative action occurred.',
          'File a retaliation charge with the EEOC or your state labor board as soon as possible.',
          'Whistleblower protections also apply if you reported illegal activity to a government agency.',
        ],
      })
    }
    if (rights.noncompete) {
      sections.push({
        title: 'Non-Compete Agreements',
        color: '#2d3a1e',
        items: [
          'Non-competes are unenforceable in California, North Dakota, Minnesota, and Oklahoma. Many other states are restricting them.',
          'For a non-compete to be enforceable, it generally must be: reasonable in duration (typically ≤1 year), limited in geography, and protect a legitimate business interest.',
          'The FTC proposed a near-ban on non-competes in 2024 — check current status in your state.',
          'If you are laid off (not fired for cause), some states refuse to enforce non-competes against employees who were let go.',
          'Have an employment attorney review your specific agreement before accepting a competing job offer.',
        ],
      })
    }
    if (rights.safety) {
      sections.push({
        title: 'Workplace Safety (OSHA)',
        color: '#1a2e4a',
        items: [
          'You have the right to a safe workplace under the Occupational Safety and Health Act (OSHA).',
          'You can report unsafe conditions to OSHA (osha.gov or 1-800-321-OSHA) anonymously.',
          'You cannot be fired or punished for reporting a safety violation or refusing to perform work that poses a clear risk of death or serious injury.',
          'OSHA must investigate formal complaints and can issue citations and fines to employers.',
          'Keep notes of the hazard, when you reported it internally, and any response (or non-response) from your employer.',
        ],
      })
    }

    if (sections.length === 0) {
      setRightsHtml(
        `<div class="legal-suite__result"><p>${t('legalRightsEmpty')}</p></div>`
      )
    } else {
      const body = sections
        .map(
          (s) => `
      <div class="legal-suite__rights" style="border-left-color:${s.color}">
        <h4 style="color:${s.color}">${s.title}</h4>
        <ul>${s.items.map((i) => `<li>${i}</li>`).join('')}</ul>
      </div>`
        )
        .join('')
      setRightsHtml(
        body +
          `<div class="legal-suite__result" style="background:var(--legal-warm)">
        <h3>Key Resources</h3>
        <ul style="font-size:.875rem;margin-left:1.2rem">
          <li><strong>EEOC</strong> (discrimination/harassment): eeoc.gov</li>
          <li><strong>Department of Labor</strong> (wages/FMLA): dol.gov</li>
          <li><strong>OSHA</strong> (safety): osha.gov</li>
          <li><strong>State Labor Board</strong>: search "[your state] department of labor"</li>
          <li><strong>Free legal help</strong>: lawhelp.org or your local legal aid society</li>
        </ul>
      </div>`
      )
    }
    setShowRights(true)
  }

  // Classifier
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [classifyVerdict, setClassifyVerdict] = useState('')
  const [classifyFactors, setClassifyFactors] = useState('')
  const [showClassify, setShowClassify] = useState(false)

  const classifyWorker = () => {
    let empScore = 0
    let conScore = 0
    let answered = 0
    const details: { text: string; result: 'emp' | 'con' | 'na' }[] = []

    CLASSIFY_QUESTION_IDS.forEach((qId) => {
      const q = classifyQuestions.find((item) => item.id === qId)
      if (!q) return
      const val = answers[q.id]
      if (!val || val === 'na') {
        details.push({ text: q.text, result: 'na' })
        return
      }
      answered++
      const isEmpQ = EMP_YES.includes(q.id)
      const isYes = val === 'yes'
      if ((isEmpQ && isYes) || (!isEmpQ && !isYes)) {
        empScore++
        details.push({ text: q.text, result: 'emp' })
      } else {
        conScore++
        details.push({ text: q.text, result: 'con' })
      }
    })

    if (answered < 5) {
      window.alert(t('legalClassifyMinAnswers'))
      return
    }

    const ratio = empScore / (empScore + conScore)
    if (ratio >= 0.65) {
      setClassifyVerdict(
        `<div class="legal-suite__verdict employee"><h3 style="color:var(--legal-green)">✅ Likely an Employee</h3><p style="font-size:.9rem;color:#2a5a3a;margin-top:.4rem">${empScore} of ${empScore + conScore} factors point toward employee status. The IRS and most courts would likely classify this as an employment relationship.</p></div>`
      )
    } else if (ratio <= 0.35) {
      setClassifyVerdict(
        `<div class="legal-suite__verdict contractor"><h3 style="color:#7a5800">📋 Likely an Independent Contractor</h3><p style="font-size:.9rem;color:#5a4000;margin-top:.4rem">${conScore} of ${empScore + conScore} factors point toward contractor status. This arrangement appears consistent with an independent contractor relationship.</p></div>`
      )
    } else {
      setClassifyVerdict(
        `<div class="legal-suite__verdict unclear"><h3 style="color:var(--legal-red)">⚠️ Unclear — Possible Misclassification Risk</h3><p style="font-size:.9rem;color:#7a1010;margin-top:.4rem">The factors are mixed (${empScore} employee / ${conScore} contractor). This is a gray area where misclassification risk is highest. Consider filing IRS Form SS-8 or consulting an employment attorney.</p></div>`
      )
    }

    setClassifyFactors(
      details
        .map(
          (d) => `
    <div class="legal-suite__factor">
      <div class="legal-suite__dot ${d.result === 'emp' ? 'legal-suite__dot-emp' : d.result === 'con' ? 'legal-suite__dot-con' : 'legal-suite__dot-na'}"></div>
      <span style="flex:1">${d.text}</span>
      <span class="legal-suite__badge ${d.result === 'emp' ? 'legal-suite__badge-emp' : d.result === 'con' ? 'legal-suite__badge-con' : ''}">${d.result === 'emp' ? t('legalBadgeEmployee') : d.result === 'con' ? t('legalBadgeContractor') : t('legalBadgeNotAnswered')}</span>
    </div>`
        )
        .join('')
    )
    setShowClassify(true)
  }

  const copyLetter = useCallback(async () => {
    if (!letter) return
    await navigator.clipboard.writeText(letter)
  }, [letter])

  return (
    <div className="legal-suite">
      <header className="legal-suite__header">
        <div className="legal-suite__eyebrow">{t('legalSuiteEyebrow')}</div>
        <h1>{t('legalSuiteTitle')}</h1>
        <p>{t('legalSuiteSubtitle')}</p>
      </header>
      <div className="legal-suite__disclaimer">
        ⚠️ <strong>{t('legalSuiteDisclaimerBold')}</strong> {t('legalSuiteDisclaimer')}
      </div>

      <section className="legal-suite__intro" aria-label={t('legalChooseToolAria')}>
        <p>{t('legalSuiteDescription')}</p>
        <ul className="legal-suite__intro-list">
          {LEGAL_TOOLS.map((tool) => (
            <li key={tool.id}>
              <Link
                href={`/tools/legal-plain-language-tools?tab=${tool.id}`}
                className={`legal-suite__intro-link${active === tool.id ? ' legal-suite__intro-link--active' : ''}`}
              >
                <strong>{t(LEGAL_TOOL_I18N[tool.id].title)}</strong>
                <span>{t(LEGAL_TOOL_I18N[tool.id].description)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <nav className="legal-suite__nav" aria-label={t('legalToolsNavAria')}>
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            type="button"
            className={active === tabItem.id ? 'active' : ''}
            onClick={() => setTab(tabItem.id)}
          >
            {tabItem.label}
          </button>
        ))}
      </nav>

      <main className="legal-suite__main">
        <div className={`legal-suite__panel ${active === 'demand' ? 'active' : ''}`} id="demand">
          <div className="legal-suite__card">
            <h2>{t('legalDemandTitle')}</h2>
            <p className="legal-suite__sub">{t('legalDemandSub')}</p>
            <div className="legal-suite__grid-2">
              <div className="legal-suite__field">
                <label className="field-label">{t('legalYourFullName')}</label>
                <input
                  value={demand.yourName}
                  onChange={(e) => setDemand({ ...demand, yourName: e.target.value })}
                  placeholder={t('legalPlaceholderYourName')}
                />
              </div>
              <div className="legal-suite__field">
                <label className="field-label">{t('legalYourAddress')}</label>
                <input
                  value={demand.yourAddr}
                  onChange={(e) => setDemand({ ...demand, yourAddr: e.target.value })}
                  placeholder={t('legalPlaceholderYourAddress')}
                />
              </div>
              <div className="legal-suite__field">
                <label className="field-label">{t('legalRecipientName')}</label>
                <input
                  value={demand.theirName}
                  onChange={(e) => setDemand({ ...demand, theirName: e.target.value })}
                  placeholder={t('legalPlaceholderRecipientName')}
                />
              </div>
              <div className="legal-suite__field">
                <label className="field-label">{t('legalRecipientAddress')}</label>
                <input
                  value={demand.theirAddr}
                  onChange={(e) => setDemand({ ...demand, theirAddr: e.target.value })}
                  placeholder={t('legalPlaceholderRecipientAddress')}
                />
              </div>
            </div>
            <div className="legal-suite__field">
              <label className="field-label">{t('legalDisputeType')}</label>
              <select value={demand.type} onChange={(e) => setDemand({ ...demand, type: e.target.value })}>
                <option value="deposit">{t('legalDisputeDeposit')}</option>
                <option value="unpaid">{t('legalDisputeUnpaid')}</option>
                <option value="damage">{t('legalDisputeDamage')}</option>
                <option value="contract">{t('legalDisputeContract')}</option>
                <option value="refund">{t('legalDisputeRefund')}</option>
                <option value="debt">{t('legalDisputeDebt')}</option>
              </select>
            </div>
            <div className="legal-suite__grid-2">
              <div className="legal-suite__field">
                <label className="field-label">{t('legalAmountOwed')}</label>
                <input
                  type="number"
                  min={0}
                  value={demand.amount}
                  onChange={(e) => setDemand({ ...demand, amount: e.target.value })}
                  placeholder={t('legalPlaceholderAmount')}
                />
              </div>
              <div className="legal-suite__field">
                <label className="field-label">{t('legalResponseDeadline')}</label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={demand.deadline}
                  onChange={(e) => setDemand({ ...demand, deadline: e.target.value })}
                />
              </div>
            </div>
            <div className="legal-suite__field">
              <label className="field-label">{t('legalDisputeDescription')}</label>
              <textarea
                value={demand.facts}
                onChange={(e) => setDemand({ ...demand, facts: e.target.value })}
                placeholder={t('legalPlaceholderDispute')}
              />
            </div>
            <div className="legal-suite__field">
              <label className="field-label">{t('legalPriorAttempts')}</label>
              <textarea
                value={demand.prior}
                onChange={(e) => setDemand({ ...demand, prior: e.target.value })}
              />
            </div>
            <button type="button" className="legal-suite__btn" onClick={genDemand}>
              {t('legalGenerateDemand')}
            </button>
            <div className={`legal-suite__output ${showLetter ? 'show' : ''}`}>
              <div className="legal-suite__letter">{letter}</div>
              <button type="button" className="legal-suite__copy" onClick={copyLetter}>
                {t('legalCopyLetter')}
              </button>
              <div className="legal-suite__note">
                <strong style={{ color: 'var(--legal-navy)' }}>{t('legalNextStepsBold')}</strong>{' '}
                {t('legalNextStepsText')}
              </div>
            </div>
          </div>
        </div>

        <div className={`legal-suite__panel ${active === 'rights' ? 'active' : ''}`} id="rights">
          <div className="legal-suite__card">
            <h2>{t('legalRightsTitle')}</h2>
            <p className="legal-suite__sub">{t('legalRightsSub')}</p>
            <div className="legal-suite__grid-2">
              <div className="legal-suite__field">
                <label className="field-label">{t('legalEmploymentStatus')}</label>
                <select
                  value={rights.status}
                  onChange={(e) => setRights({ ...rights, status: e.target.value })}
                >
                  <option value="fulltime">{t('legalStatusFulltime')}</option>
                  <option value="parttime">{t('legalStatusParttime')}</option>
                  <option value="contractor">{t('legalStatusContractor')}</option>
                  <option value="gig">{t('legalStatusGig')}</option>
                </select>
              </div>
              <div className="legal-suite__field">
                <label className="field-label">{t('legalCompanySize')}</label>
                <select value={rights.size} onChange={(e) => setRights({ ...rights, size: e.target.value })}>
                  <option value="small">{t('legalSizeSmall')}</option>
                  <option value="mid">{t('legalSizeMid')}</option>
                  <option value="large">{t('legalSizeLarge')}</option>
                  <option value="enterprise">{t('legalSizeEnterprise')}</option>
                </select>
              </div>
            </div>
            <div className="legal-suite__field">
              <label className="field-label">{t('legalYourSituation')}</label>
              <div className="legal-suite__check-grid">
                {rightsChecks.map(([key, label]) => (
                  <label key={key} className="legal-suite__check">
                    <input
                      type="checkbox"
                      checked={rights[key as keyof typeof rights] as boolean}
                      onChange={(e) =>
                        setRights({ ...rights, [key]: e.target.checked } as typeof rights)
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <button type="button" className="legal-suite__btn" onClick={checkRights}>
              {t('legalCheckRightsBtn')}
            </button>
            <div className={`legal-suite__output ${showRights ? 'show' : ''}`}>
              <div dangerouslySetInnerHTML={{ __html: rightsHtml }} />
            </div>
          </div>
        </div>

        <div className={`legal-suite__panel ${active === 'classify' ? 'active' : ''}`} id="classify">
          <div className="legal-suite__card">
            <h2>{t('legalClassifyTitle')}</h2>
            <p className="legal-suite__sub">{t('legalClassifySub')}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--legal-muted)', marginBottom: '1.25rem' }}>
              {t('legalClassifyHint')}
            </p>
            {classifyQuestions.map((q, i) => (
              <div key={q.id} className="legal-suite__field">
                <span className="legal-suite__q-label">
                  {i + 1}. {q.text}
                </span>
                <div className="legal-suite__radio-row">
                  {(['yes', 'no', 'na'] as const).map((v) => (
                    <label key={v} className="legal-suite__radio">
                      <input
                        type="radio"
                        name={q.id}
                        value={v}
                        checked={answers[q.id] === v}
                        onChange={() => setAnswers({ ...answers, [q.id]: v })}
                      />
                      {v === 'na' ? t('legalNotSure') : v === 'yes' ? t('legalYes') : t('legalNo')}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button type="button" className="legal-suite__btn" onClick={classifyWorker}>
              {t('legalClassifyBtn')}
            </button>
            <div className={`legal-suite__output ${showClassify ? 'show' : ''}`}>
              <div dangerouslySetInnerHTML={{ __html: classifyVerdict }} />
              <div className="legal-suite__result" style={{ marginTop: '1rem' }}>
                <h3>{t('legalFactorAnalysis')}</h3>
                <div dangerouslySetInnerHTML={{ __html: classifyFactors }} />
              </div>
              <div className="legal-suite__note">
                <strong style={{ color: 'var(--legal-navy)' }}>{t('legalWhyMattersBold')}</strong>{' '}
                {t('legalWhyMattersText')}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
