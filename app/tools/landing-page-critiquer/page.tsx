"use client";

import { useState } from "react";
import type { CritiqueOutput } from "@/lib/landingCritiquer";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Landing Page Critiquer",
    instructions: "Instructions",
    instructionsBody:
      "Paste your landing page headline, subheadline, core body copy, CTA, and audience. The tool scores core conversion signals and gives rewrite guidance.",
    headline: "Headline",
    subheadline: "Subheadline",
    body: "Body",
    cta: "CTA",
    audience: "Audience",
    analyzing: "Analyzing...",
    analyze: "Analyze",
    score: "Score",
    breakdown: "Breakdown",
    clarity: "Clarity",
    value: "Value",
    urgency: "Urgency",
    trust: "Trust",
    conversion: "Conversion",
    issues: "Issues",
    suggestions: "Suggestions",
    improvedVersion: "Improved Version",
    improvedHeadline: "Headline:",
    improvedSubheadline: "Subheadline:",
    improvedCta: "CTA:",
  },
  es: {
    title: "Crítico de páginas de aterrizaje",
    instructions: "Instrucciones",
    instructionsBody:
      "Pega el titular, subtítulo, texto principal, CTA y audiencia de tu página. La herramienta puntúa señales clave de conversión y da orientación para reescribir.",
    headline: "Titular",
    subheadline: "Subtítulo",
    body: "Cuerpo",
    cta: "CTA",
    audience: "Audiencia",
    analyzing: "Analizando...",
    analyze: "Analizar",
    score: "Puntuación",
    breakdown: "Desglose",
    clarity: "Claridad",
    value: "Valor",
    urgency: "Urgencia",
    trust: "Confianza",
    conversion: "Conversión",
    issues: "Problemas",
    suggestions: "Sugerencias",
    improvedVersion: "Versión mejorada",
    improvedHeadline: "Titular:",
    improvedSubheadline: "Subtítulo:",
    improvedCta: "CTA:",
  },
} as const;

export default function LandingPageCritiquerPage() {
  const { language } = useLanguage();
  const t = copy[language];

  const [form, setForm] = useState({
    headline: "",
    subheadline: "",
    body: "",
    cta: "",
    audience: "",
  });

  const [result, setResult] = useState<CritiqueOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/critique", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        {t.title}
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            {t.instructions}
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            {t.instructionsBody}
          </p>
        </div>
      </section>

      <input
        className={inputClass}
        placeholder={t.headline}
        onChange={(e) => setForm({ ...form, headline: e.target.value })}
      />
      <input
        className={inputClass}
        placeholder={t.subheadline}
        onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
      />
      <textarea
        className={`${inputClass} min-h-[120px]`}
        placeholder={t.body}
        onChange={(e) => setForm({ ...form, body: e.target.value })}
      />
      <input
        className={inputClass}
        placeholder={t.cta}
        onChange={(e) => setForm({ ...form, cta: e.target.value })}
      />
      <input
        className={inputClass}
        placeholder={t.audience}
        onChange={(e) => setForm({ ...form, audience: e.target.value })}
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? t.analyzing : t.analyze}
      </button>

      {result && (
        <div className="mt-6 space-y-3 rounded-lg border border-mono-300 dark:border-mono-700 p-4">
          <h2 className="text-lg font-bold text-mono-950 dark:text-mono-50">
            {t.score}: {result.score}
          </h2>

          <div>
            <h3 className="font-semibold text-mono-900 dark:text-mono-100">
              {t.breakdown}
            </h3>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              <li>
                {t.clarity}: {result.breakdown.clarity}
              </li>
              <li>
                {t.value}: {result.breakdown.value}
              </li>
              <li>
                {t.urgency}: {result.breakdown.urgency}
              </li>
              <li>
                {t.trust}: {result.breakdown.trust}
              </li>
              <li>
                {t.conversion}: {result.breakdown.conversion}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-mono-900 dark:text-mono-100">
              {t.issues}
            </h3>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {result.issues.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-mono-900 dark:text-mono-100">
              {t.suggestions}
            </h3>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {result.suggestions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-mono-900 dark:text-mono-100">
              {t.improvedVersion}
            </h3>
            <p className="text-mono-800 dark:text-mono-200">
              <strong>{t.improvedHeadline}</strong> {result.improvedVersion.headline}
            </p>
            <p className="text-mono-800 dark:text-mono-200">
              <strong>{t.improvedSubheadline}</strong>{" "}
              {result.improvedVersion.subheadline}
            </p>
            <p className="text-mono-800 dark:text-mono-200">
              <strong>{t.improvedCta}</strong> {result.improvedVersion.cta}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
