'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  MAIL_PIPELINE_STAGES,
  MAIL_PIPELINE_STORAGE_KEY,
  createMailPipelineId,
  emptyMailPipelineDeal,
  formatMailPipelineDate,
  normalizeMailPipelineDeals,
  todaysMailPipelineFollowUps,
  type MailPipelineDeal,
  type MailPipelineStage,
} from '@/lib/mailPipeline'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const copy = {
  en: {
    back: 'Back to ToolMarket365',
    kicker: 'On ToolMarket365',
    title: 'MailPipelineCRM',
    tagline:
      'Never lose a lead in your inbox again. Track threads, stages, and follow-ups in one place.',
    today: "Today's follow-ups",
    nothingDue: 'Nothing due today.',
    allDeals: 'All deals',
    empty: 'No deals yet. Track your first thread below.',
    track: 'Track a thread',
    cancel: 'Cancel',
    save: 'Save deal',
    titleLabel: 'Thread / deal title',
    emailLabel: 'Contact email',
    stageLabel: 'Stage',
    amountLabel: 'Amount (optional)',
    lastLabel: 'Last contact',
    nextLabel: 'Next follow-up',
    notesLabel: 'Notes',
    delete: 'Delete',
    colTitle: 'Title',
    colContact: 'Contact',
    colStage: 'Stage',
    colLast: 'Last contact',
    colNext: 'Next follow-up',
  },
  es: {
    back: 'Volver a ToolMarket365',
    kicker: 'En ToolMarket365',
    title: 'MailPipelineCRM',
    tagline:
      'No vuelvas a perder un lead en tu bandeja. Rastrea hilos, etapas y seguimientos en un solo lugar.',
    today: 'Seguimientos de hoy',
    nothingDue: 'Nada pendiente hoy.',
    allDeals: 'Todos los tratos',
    empty: 'Aún no hay tratos. Rastrea tu primer hilo abajo.',
    track: 'Rastrear un hilo',
    cancel: 'Cancelar',
    save: 'Guardar trato',
    titleLabel: 'Título del hilo / trato',
    emailLabel: 'Correo de contacto',
    stageLabel: 'Etapa',
    amountLabel: 'Monto (opcional)',
    lastLabel: 'Último contacto',
    nextLabel: 'Próximo seguimiento',
    notesLabel: 'Notas',
    delete: 'Eliminar',
    colTitle: 'Título',
    colContact: 'Contacto',
    colStage: 'Etapa',
    colLast: 'Último contacto',
    colNext: 'Próximo seguimiento',
  },
}

export default function MailPipelinePage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [deals, setDeals] = useState<MailPipelineDeal[]>([])
  const [loaded, setLoaded] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyMailPipelineDeal())

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MAIL_PIPELINE_STORAGE_KEY)
      if (raw) {
        setDeals(normalizeMailPipelineDeals(JSON.parse(raw)))
      }
    } catch {
      setDeals([])
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    window.localStorage.setItem(MAIL_PIPELINE_STORAGE_KEY, JSON.stringify(deals))
  }, [deals, loaded])

  const followUps = useMemo(() => todaysMailPipelineFollowUps(deals), [deals])

  function resetForm() {
    setForm(emptyMailPipelineDeal())
    setShowForm(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = form.title.trim()
    const contactEmail = form.contactEmail.trim()
    if (!title || !contactEmail) return
    setDeals((current) => [
      {
        ...form,
        id: createMailPipelineId(),
        title,
        contactEmail,
      },
      ...current,
    ])
    resetForm()
  }

  function deleteDeal(id: string) {
    setDeals((current) => current.filter((deal) => deal.id !== id))
  }

  if (!loaded) {
    return (
      <main className="mp-shell">
        <p className="mp-muted">Loading MailPipelineCRM…</p>
      </main>
    )
  }

  return (
    <main className="mp-shell">
      <style>{`
        .mp-shell {
          min-height: 100vh;
          padding: 1.5rem 1rem 3rem;
          color: #e0f2fe;
          background:
            radial-gradient(900px 420px at 8% -10%, rgba(56,189,248,0.22), transparent 55%),
            radial-gradient(700px 360px at 95% 5%, rgba(45,212,191,0.14), transparent 50%),
            linear-gradient(165deg, #07111f 0%, #0c1b2e 45%, #0f2740 100%);
          font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
        }
        .mp-wrap { max-width: 56rem; margin: 0 auto; }
        .mp-back {
          display: inline-flex;
          margin-bottom: 1rem;
          color: #7dd3fc;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
        }
        .mp-back:hover { color: #bae6fd; text-decoration: underline; }
        .mp-hero {
          border: 1px solid rgba(56,189,248,0.45);
          border-radius: 1.25rem;
          padding: 1.35rem 1.25rem;
          background:
            radial-gradient(600px 180px at 0% 0%, rgba(56,189,248,0.2), transparent 60%),
            rgba(8,24,40,0.85);
          box-shadow: 0 20px 40px rgba(0,0,0,0.28);
          margin-bottom: 1.25rem;
        }
        .mp-kicker {
          display: inline-flex;
          margin: 0 0 0.55rem;
          padding: 0.28rem 0.65rem;
          border-radius: 999px;
          border: 1px solid rgba(56,189,248,0.5);
          background: rgba(56,189,248,0.14);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #bae6fd;
        }
        .mp-title {
          margin: 0 0 0.45rem;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #f0f9ff;
        }
        .mp-tagline { margin: 0; max-width: 40rem; color: #bae6fd; line-height: 1.5; }
        .mp-actions { margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.6rem; }
        .mp-btn {
          border: 0;
          border-radius: 999px;
          padding: 0.65rem 1.1rem;
          font-size: 0.9rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
        }
        .mp-btn-primary {
          background: linear-gradient(180deg, #38bdf8, #0ea5e9);
          color: #082f49;
          box-shadow: 0 10px 24px rgba(14,165,233,0.3);
        }
        .mp-btn-secondary {
          background: rgba(15,23,42,0.7);
          color: #e0f2fe;
          border: 1px solid rgba(125,211,252,0.35);
        }
        .mp-panel {
          border: 1px solid rgba(125,211,252,0.25);
          border-radius: 1rem;
          background: rgba(8,24,40,0.72);
          padding: 1.1rem 1rem;
          margin-bottom: 1rem;
        }
        .mp-panel h2 {
          margin: 0 0 0.75rem;
          font-size: 1.05rem;
          font-weight: 800;
          color: #f0f9ff;
        }
        .mp-muted { color: #7dd3fc; font-size: 0.9rem; }
        .mp-badge {
          margin-left: 0.45rem;
          background: #ef4444;
          color: #fff;
          border-radius: 999px;
          padding: 0.1rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .mp-list { list-style: none; margin: 0; padding: 0; }
        .mp-item {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
          align-items: center;
          padding: 0.75rem 0.85rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(125,211,252,0.2);
          background: rgba(15,23,42,0.55);
          margin-bottom: 0.5rem;
        }
        .mp-stage {
          display: inline-flex;
          margin-left: 0.4rem;
          font-size: 0.72rem;
          padding: 0.12rem 0.45rem;
          border-radius: 0.35rem;
          background: rgba(56,189,248,0.16);
          color: #e0f2fe;
        }
        .mp-table-wrap { overflow-x: auto; }
        table.mp-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;
        }
        .mp-table th {
          text-align: left;
          padding: 0.5rem 0.65rem;
          color: #7dd3fc;
          border-bottom: 1px solid rgba(125,211,252,0.25);
          font-weight: 700;
        }
        .mp-table td {
          padding: 0.65rem;
          border-bottom: 1px solid rgba(125,211,252,0.12);
          color: #e0f2fe;
          vertical-align: top;
        }
        .mp-form {
          display: grid;
          gap: 0.75rem;
        }
        .mp-form label {
          display: grid;
          gap: 0.35rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: #bae6fd;
        }
        .mp-form input, .mp-form select, .mp-form textarea {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(125,211,252,0.3);
          background: rgba(15,23,42,0.8);
          color: #f0f9ff;
          padding: 0.65rem 0.75rem;
          font: inherit;
        }
        .mp-form-grid {
          display: grid;
          gap: 0.75rem;
        }
        @media (min-width: 640px) {
          .mp-form-grid { grid-template-columns: 1fr 1fr; }
        }
        .mp-danger {
          background: transparent;
          border: 1px solid rgba(248,113,113,0.45);
          color: #fecaca;
          border-radius: 0.5rem;
          padding: 0.35rem 0.55rem;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>

      <div className="mp-wrap">
        <Link href="/" className="mp-back">
          ← {c.back}
        </Link>

        <header className="mp-hero">
          <p className="mp-kicker">{c.kicker}</p>
          <h1 className="mp-title">{c.title}</h1>
          <p className="mp-tagline">{c.tagline}</p>
          <div className="mp-actions">
            <button
              type="button"
              className="mp-btn mp-btn-primary"
              onClick={() => {
                setForm(emptyMailPipelineDeal())
                setShowForm(true)
              }}
            >
              {c.track}
            </button>
          </div>
        </header>

        <section className="mp-panel">
          <h2>
            {c.today}
            {followUps.length > 0 ? <span className="mp-badge">{followUps.length}</span> : null}
          </h2>
          {followUps.length === 0 ? (
            <p className="mp-muted">{c.nothingDue}</p>
          ) : (
            <ul className="mp-list">
              {followUps.map((deal) => (
                <li key={deal.id} className="mp-item">
                  <div>
                    <strong>{deal.title}</strong>
                    <span className="mp-stage">{deal.stage}</span>
                    <div className="mp-muted">{deal.contactEmail}</div>
                  </div>
                  <span className="mp-muted">{formatMailPipelineDate(deal.nextFollowUpAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mp-panel">
          <h2>{c.allDeals}</h2>
          {deals.length === 0 ? (
            <p className="mp-muted">{c.empty}</p>
          ) : (
            <div className="mp-table-wrap">
              <table className="mp-table">
                <thead>
                  <tr>
                    <th>{c.colTitle}</th>
                    <th>{c.colContact}</th>
                    <th>{c.colStage}</th>
                    <th>{c.colLast}</th>
                    <th>{c.colNext}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr key={deal.id}>
                      <td>{deal.title}</td>
                      <td>{deal.contactEmail}</td>
                      <td>
                        <span className="mp-stage">{deal.stage}</span>
                      </td>
                      <td>{formatMailPipelineDate(deal.lastContactAt)}</td>
                      <td>{formatMailPipelineDate(deal.nextFollowUpAt)}</td>
                      <td>
                        <button
                          type="button"
                          className="mp-danger"
                          onClick={() => deleteDeal(deal.id)}
                        >
                          {c.delete}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {showForm ? (
          <section className="mp-panel">
            <div className="mp-actions" style={{ marginTop: 0, marginBottom: '0.85rem' }}>
              <h2 style={{ margin: 0, flex: 1 }}>{c.track}</h2>
              <button type="button" className="mp-btn mp-btn-secondary" onClick={resetForm}>
                {c.cancel}
              </button>
            </div>
            <form className="mp-form" onSubmit={handleSubmit}>
              <label>
                {c.titleLabel}
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Proposal follow-up — Acme"
                />
              </label>
              <div className="mp-form-grid">
                <label>
                  {c.emailLabel}
                  <input
                    required
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                    placeholder="client@example.com"
                  />
                </label>
                <label>
                  {c.stageLabel}
                  <select
                    value={form.stage}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, stage: e.target.value as MailPipelineStage }))
                    }
                  >
                    {MAIL_PIPELINE_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mp-form-grid">
                <label>
                  {c.amountLabel}
                  <input
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    placeholder="$2,500"
                  />
                </label>
                <label>
                  {c.lastLabel}
                  <input
                    type="date"
                    value={form.lastContactAt}
                    onChange={(e) => setForm((f) => ({ ...f, lastContactAt: e.target.value }))}
                  />
                </label>
                <label>
                  {c.nextLabel}
                  <input
                    type="date"
                    value={form.nextFollowUpAt}
                    onChange={(e) => setForm((f) => ({ ...f, nextFollowUpAt: e.target.value }))}
                  />
                </label>
              </div>
              <label>
                {c.notesLabel}
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                />
              </label>
              <button type="submit" className="mp-btn mp-btn-primary">
                {c.save}
              </button>
            </form>
          </section>
        ) : null}
      </div>
    </main>
  )
}
