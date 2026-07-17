"use client"

import { useState } from "react"
import type { FormBuilderField, FormBuilderFieldType } from "@/lib/formBuilder"
import { useLanguage } from "@/lib/i18n/LanguageContext"

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 !text-neutral-900 dark:!text-neutral-100 placeholder:text-neutral-600 dark:placeholder:text-neutral-400"

const emptyField = (): FormBuilderField => ({
  name: "",
  label: "",
  type: "text",
  required: true,
})

const copy = {
  en: {
    title: "Form builder",
    description:
      "Build embeddable HTML for a form that POSTs to Formspree, Netlify Forms, or your own endpoint. Email notifications are handled by that service — not by this page.",
    formTitle: "Form title",
    actionUrl: "Action URL (receives POST)",
    method: "Method",
    netlifyLabel: "Add Netlify",
    fields: "Fields",
    addField: "Add field",
    namePlaceholder: "name attribute",
    labelPlaceholder: "Label",
    typeText: "Text",
    typeEmail: "Email",
    typePhone: "Phone",
    typeTextarea: "Textarea",
    required: "Required",
    removeField: "Remove field",
    generate: "Generate HTML",
    generating: "Generating…",
    embedCode: "Embed code",
    checklist: "Checklist",
    requestFailed: "Request failed",
    networkError: "Network error",
  },
  es: {
    title: "Constructor de formularios",
    description:
      "Crea HTML insertable para un formulario que envía POST a Formspree, Netlify Forms o tu propio endpoint. Las notificaciones por correo las gestiona ese servicio — no esta página.",
    formTitle: "Título del formulario",
    actionUrl: "URL de acción (recibe el POST)",
    method: "Método",
    netlifyLabel: "Añadir Netlify",
    fields: "Campos",
    addField: "Añadir campo",
    namePlaceholder: "atributo name",
    labelPlaceholder: "Etiqueta",
    typeText: "Texto",
    typeEmail: "Correo",
    typePhone: "Teléfono",
    typeTextarea: "Área de texto",
    required: "Obligatorio",
    removeField: "Quitar campo",
    generate: "Generar HTML",
    generating: "Generando…",
    embedCode: "Código para insertar",
    checklist: "Lista de comprobación",
    requestFailed: "Error en la solicitud",
    networkError: "Error de red",
  },
}

export default function FormBuilderPage() {
  const { language } = useLanguage()
  const c = copy[language]
  const [title, setTitle] = useState("Contact us")
  const [actionUrl, setActionUrl] = useState("https://formspree.io/f/your-id")
  const [method, setMethod] = useState<"post" | "get">("post")
  const [netlify, setNetlify] = useState(false)
  const [fields, setFields] = useState<FormBuilderField[]>([
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "message", label: "Message", type: "textarea", required: false },
  ])
  const [html, setHtml] = useState("")
  const [checklist, setChecklist] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  const updateField = (i: number, patch: Partial<FormBuilderField>) => {
    setFields((rows) => rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  }

  const generate = async () => {
    setLoading(true)
    setErr("")
    try {
      const res = await fetch("/api/form-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, actionUrl, method, netlify, fields }),
      })
      const data = (await res.json()) as { html?: string; checklist?: string[]; error?: string }
      if (!res.ok) {
        setErr(data.error || c.requestFailed)
        setLoading(false)
        return
      }
      setHtml(data.html || "")
      setChecklist(data.checklist || [])
    } catch {
      setErr(c.networkError)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 text-mono-900 dark:text-mono-100">
      <h1 className="text-2xl font-bold">{c.title}</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400">{c.description}</p>

      <div className="space-y-3">
        <label className="block text-sm font-medium">
          {c.formTitle}
          <input className={`${inputClass} mt-1`} value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          {c.actionUrl}
          <input
            className={`${inputClass} mt-1 font-mono text-sm`}
            value={actionUrl}
            onChange={(e) => setActionUrl(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium">
          {c.method}
          <select
            className={`${inputClass} mt-1`}
            value={method}
            onChange={(e) => setMethod(e.target.value as "post" | "get")}
          >
            <option value="post">POST</option>
            <option value="get">GET</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={netlify} onChange={(e) => setNetlify(e.target.checked)} />
          {c.netlifyLabel} <code className="text-xs">data-netlify=&quot;true&quot;</code>
        </label>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">{c.fields}</h2>
          <button
            type="button"
            className="text-sm text-accent-600 hover:underline"
            onClick={() => setFields((f) => [...f, emptyField()])}
          >
            {c.addField}
          </button>
        </div>
        {fields.map((f, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded border border-mono-200 dark:border-mono-700 p-3"
          >
            <input
              className={inputClass}
              placeholder={c.namePlaceholder}
              value={f.name}
              onChange={(e) => updateField(i, { name: e.target.value })}
            />
            <input
              className={inputClass}
              placeholder={c.labelPlaceholder}
              value={f.label}
              onChange={(e) => updateField(i, { label: e.target.value })}
            />
            <select
              className={inputClass}
              value={f.type}
              onChange={(e) => updateField(i, { type: e.target.value as FormBuilderFieldType })}
            >
              <option value="text">{c.typeText}</option>
              <option value="email">{c.typeEmail}</option>
              <option value="tel">{c.typePhone}</option>
              <option value="textarea">{c.typeTextarea}</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(f.required)}
                onChange={(e) => updateField(i, { required: e.target.checked })}
              />
              {c.required}
            </label>
            <button
              type="button"
              className="text-sm text-red-600 dark:text-red-400 sm:col-span-2"
              onClick={() => setFields((rows) => rows.filter((_, j) => j !== i))}
            >
              {c.removeField}
            </button>
          </div>
        ))}
      </section>

      {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
      <button
        type="button"
        disabled={loading}
        onClick={() => void generate()}
        className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 text-sm font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? c.generating : c.generate}
      </button>

      {html ? (
        <div className="space-y-3">
          <h2 className="font-semibold text-sm">{c.embedCode}</h2>
          <textarea
            readOnly
            className={`${inputClass} min-h-[200px] font-mono text-xs`}
            value={html}
            onFocus={(e) => e.target.select()}
          />
          {checklist.length > 0 ? (
            <div>
              <p className="font-semibold text-sm mb-1">{c.checklist}</p>
              <ul className="list-disc pl-5 text-sm text-mono-700 dark:text-mono-300">
                {checklist.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
