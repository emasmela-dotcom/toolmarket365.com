"use client";

import { useState } from "react";
import type { PainPoint } from "@/lib/painExtractor";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const textareaClass =
  "w-full min-h-[160px] border p-3 rounded-lg border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Customer Pain Point Extractor",
    instructions: "Instructions",
    instructionsBody:
      "Paste reviews, comments, Reddit threads, or support logs. The tool finds sentences that match common pain signals, assigns a category, and ranks by how many signals hit per sentence.",
    expectedOutcome: "Expected outcome",
    expectedOutcomeBody:
      "Phrases with category and a frequency-style score (more keyword hits in the same sentence raises the score).",
    placeholder: "Paste raw text here…",
    extracting: "Extracting…",
    extractPainPoints: "Extract pain points",
    requestFailed: "Request failed",
    phrase: "Phrase",
    category: "Category",
    score: "Score",
  },
  es: {
    title: "Extractor de puntos de dolor del cliente",
    instructions: "Instrucciones",
    instructionsBody:
      "Pega reseñas, comentarios, hilos de Reddit o registros de soporte. La herramienta encuentra frases que coinciden con señales de dolor comunes, asigna una categoría y las ordena según cuántas señales aparecen en cada frase.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Frases con categoría y una puntuación basada en frecuencia (más coincidencias de palabras clave en la misma frase aumentan la puntuación).",
    placeholder: "Pega el texto aquí…",
    extracting: "Extrayendo…",
    extractPainPoints: "Extraer puntos de dolor",
    requestFailed: "La solicitud falló",
    phrase: "Frase",
    category: "Categoría",
    score: "Puntuación",
  },
};

export default function CustomerPainPointExtractorPage() {
  const { language } = useLanguage();
  const c = copy[language];
  const [text, setText] = useState("");
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/pain-extractor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || c.requestFailed);
      setPainPoints([]);
      setLoading(false);
      return;
    }
    setPainPoints(data.painPoints ?? []);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        {c.title}
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            {c.instructions}
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            {c.instructionsBody}
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            {c.expectedOutcome}
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            {c.expectedOutcomeBody}
          </p>
        </div>
      </section>

      <textarea
        className={textareaClass}
        placeholder={c.placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        type="button"
        onClick={handleExtract}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? c.extracting : c.extractPainPoints}
      </button>

      {error && (
        <p className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </p>
      )}

      {painPoints.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-mono-300 dark:border-mono-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-mono-300 dark:border-mono-600 bg-mono-100 dark:bg-mono-900">
              <tr>
                <th className="p-3 font-semibold text-mono-900 dark:text-mono-100">
                  {c.phrase}
                </th>
                <th className="p-3 font-semibold text-mono-900 dark:text-mono-100">
                  {c.category}
                </th>
                <th className="p-3 font-semibold text-mono-900 dark:text-mono-100">
                  {c.score}
                </th>
              </tr>
            </thead>
            <tbody>
              {painPoints.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-mono-200 dark:border-mono-800 last:border-0"
                >
                  <td className="p-3 text-mono-800 dark:text-mono-200 align-top">
                    {row.phrase}
                  </td>
                  <td className="p-3 text-mono-800 dark:text-mono-200 whitespace-nowrap">
                    {row.category}
                  </td>
                  <td className="p-3 font-medium text-mono-950 dark:text-mono-50">
                    {row.severity}
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
