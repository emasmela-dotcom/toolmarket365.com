"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Agreement Link Generator",
    instructions: "Instructions",
    instructionsBody:
      "Fill in the agreement details, then generate a shareable link for the other party.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBefore: "They open the link, review terms, and click",
    iAgree: "I agree",
    expectedOutcomeAfter: "to update status.",
    titlePlaceholder: "Title",
    descriptionPlaceholder: "Description",
    amountPlaceholder: "Amount ($)",
    generate: "Generate Link",
    generating: "Generating…",
    createError: "Could not create link.",
    shareLink: "Share this link:",
  },
  es: {
    title: "Generador de enlaces de acuerdo",
    instructions: "Instrucciones",
    instructionsBody:
      "Completa los detalles del acuerdo y genera un enlace para compartir con la otra parte.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBefore: "Abren el enlace, revisan los términos y hacen clic en",
    iAgree: "Estoy de acuerdo",
    expectedOutcomeAfter: "para actualizar el estado.",
    titlePlaceholder: "Título",
    descriptionPlaceholder: "Descripción",
    amountPlaceholder: "Monto ($)",
    generate: "Generar enlace",
    generating: "Generando…",
    createError: "No se pudo crear el enlace.",
    shareLink: "Comparte este enlace:",
  },
};

export default function AgreementLinkGeneratorPage() {
  const { language } = useLanguage();
  const c = copy[language];
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    dueAt: "",
  });
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAgreement = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/agreement-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : c.createError);
      setLink(null);
      setLoading(false);
      return;
    }
    setLink(data.link);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{c.title}</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">{c.instructions}</h2>
          <p>{c.instructionsBody}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">{c.expectedOutcome}</h2>
          <p>
            {c.expectedOutcomeBefore} <strong>{c.iAgree}</strong> {c.expectedOutcomeAfter}
          </p>
        </div>
      </section>

      <input
        placeholder={c.titlePlaceholder}
        className={inputClass}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder={c.descriptionPlaceholder}
        className={`${inputClass} min-h-[100px]`}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        placeholder={c.amountPlaceholder}
        className={inputClass}
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <input
        type="datetime-local"
        className={inputClass}
        value={form.dueAt}
        onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
      />

      {error ? <p className="text-sm text-red-700 dark:text-red-400">{error}</p> : null}

      <button
        type="button"
        onClick={createAgreement}
        disabled={loading}
        className="w-full rounded-lg bg-accent-600 px-4 py-2 font-semibold text-white hover:bg-accent-700 disabled:opacity-60"
      >
        {loading ? c.generating : c.generate}
      </button>

      {link ? (
        <div className="mt-4 p-3 border border-mono-300 dark:border-mono-700 rounded-lg">
          <p className="text-sm text-mono-700 dark:text-mono-300">{c.shareLink}</p>
          <a
            href={link}
            className="text-accent-600 dark:text-accent-400 break-all hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {link}
          </a>
        </div>
      ) : null}
    </div>
  );
}
