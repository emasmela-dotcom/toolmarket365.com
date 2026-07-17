"use client";

import { useState } from "react";
import type { NicheResult } from "@/lib/nicheValidator";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Niche Validator",
    instructions: "Instructions",
    instructionsBody:
      "Describe your niche and who you serve. You get a score, strengths, gaps, and monetization ideas.",
    expectedOutcome: "Expected outcome",
    expectedOutcomeBody:
      "A 0–100 score, verdict, strengths, weaknesses, suggestions, and monetization angles.",
    niche: "Your niche (e.g. Help creators get clients using AI)",
    audience: "Target audience (e.g. small creators)",
    validating: "Validating…",
    validate: "Validate",
    score: "Score",
    strengths: "Strengths",
    weaknesses: "Weaknesses",
    suggestions: "Suggestions",
    monetizationIdeas: "Monetization ideas",
  },
  es: {
    title: "Validador de nicho",
    instructions: "Instrucciones",
    instructionsBody:
      "Describe tu nicho y a quién ayudas. Recibirás una puntuación, fortalezas, brechas e ideas de monetización.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Una puntuación de 0–100, veredicto, fortalezas, debilidades, sugerencias y ángulos de monetización.",
    niche: "Tu nicho (ej. Ayudar a creadores a conseguir clientes con IA)",
    audience: "Audiencia objetivo (ej. creadores pequeños)",
    validating: "Validando…",
    validate: "Validar",
    score: "Puntuación",
    strengths: "Fortalezas",
    weaknesses: "Debilidades",
    suggestions: "Sugerencias",
    monetizationIdeas: "Ideas de monetización",
  },
};

export default function NicheValidatorPage() {
  const { language } = useLanguage();
  const t = copy[language];

  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [result, setResult] = useState<NicheResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/niche-validator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, audience }),
    });
    const data = (await res.json()) as NicheResult;
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
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
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            {t.expectedOutcome}
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            {t.expectedOutcomeBody}
          </p>
        </div>
      </section>

      <input
        placeholder={t.niche}
        className={inputClass}
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
      />

      <input
        placeholder={t.audience}
        className={inputClass}
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? t.validating : t.validate}
      </button>

      {result && (
        <div className="space-y-4 rounded-lg border border-mono-300 dark:border-mono-700 p-4">
          <div>
            <p className="text-sm font-semibold text-mono-600 dark:text-mono-400">
              {t.score}
            </p>
            <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">
              {result.score}/100
            </p>
            <p className="mt-1 text-lg font-semibold text-mono-900 dark:text-mono-100">
              {result.verdict}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-mono-900 dark:text-mono-100">
              {t.strengths}
            </h2>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {result.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-mono-900 dark:text-mono-100">
              {t.weaknesses}
            </h2>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {result.weaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-mono-900 dark:text-mono-100">
              {t.suggestions}
            </h2>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-mono-900 dark:text-mono-100">
              {t.monetizationIdeas}
            </h2>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {result.monetizationIdeas.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
