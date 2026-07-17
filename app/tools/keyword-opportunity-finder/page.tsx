"use client";

import { useState } from "react";
import type { KeywordResult } from "@/lib/keywordFinder";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Keyword Opportunity Finder",
    instructions: "Instructions",
    instructionsBody:
      "Enter a seed keyword. The tool expands it into variations and scores intent, simulated competition, and opportunity (higher = better).",
    expectedOutcome: "Expected outcome",
    expectedOutcomeBody:
      "A sorted list of keyword ideas with intent, competition, and opportunity scores.",
    seed: "Seed keyword (e.g. email marketing)",
    finding: "Finding…",
    findOpportunities: "Find opportunities",
    keyword: "Keyword",
    intent: "Intent",
    competition: "Competition",
    opportunity: "Opportunity",
  },
  es: {
    title: "Buscador de oportunidades de palabras clave",
    instructions: "Instrucciones",
    instructionsBody:
      "Ingresa una palabra clave inicial. La herramienta la expande en variaciones y puntúa intención, competencia simulada y oportunidad (más alto = mejor).",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Una lista ordenada de ideas de palabras clave con puntuaciones de intención, competencia y oportunidad.",
    seed: "Palabra clave inicial (ej. email marketing)",
    finding: "Buscando…",
    findOpportunities: "Encontrar oportunidades",
    keyword: "Palabra clave",
    intent: "Intención",
    competition: "Competencia",
    opportunity: "Oportunidad",
  },
};

export default function KeywordOpportunityFinderPage() {
  const { language } = useLanguage();
  const t = copy[language];

  const [seed, setSeed] = useState("");
  const [results, setResults] = useState<KeywordResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/keyword-finder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed }),
    });
    const data = await res.json();
    setResults(data.results ?? []);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
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
        className={inputClass}
        placeholder={t.seed}
        value={seed}
        onChange={(e) => setSeed(e.target.value)}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? t.finding : t.findOpportunities}
      </button>

      {results.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-mono-300 dark:border-mono-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-mono-300 dark:border-mono-600 bg-mono-100 dark:bg-mono-900">
              <tr>
                <th className="p-3 font-semibold text-mono-900 dark:text-mono-100">
                  {t.keyword}
                </th>
                <th className="p-3 font-semibold text-mono-900 dark:text-mono-100">
                  {t.intent}
                </th>
                <th className="p-3 font-semibold text-mono-900 dark:text-mono-100">
                  {t.competition}
                </th>
                <th className="p-3 font-semibold text-mono-900 dark:text-mono-100">
                  {t.opportunity}
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-mono-200 dark:border-mono-800 last:border-0"
                >
                  <td className="p-3 text-mono-800 dark:text-mono-200">
                    {row.keyword}
                  </td>
                  <td className="p-3 text-mono-800 dark:text-mono-200">
                    {row.intentScore}
                  </td>
                  <td className="p-3 text-mono-800 dark:text-mono-200">
                    {row.competitionScore}
                  </td>
                  <td className="p-3 font-medium text-mono-950 dark:text-mono-50">
                    {row.opportunityScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
