"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-3 rounded-lg border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Trend Explainer",
    instructions: "Instructions",
    instructionsBody:
      "Enter a trend or topic. You get a short analysis of why it is hot, who is behind it, platforms, psychology, and how to use it.",
    requirements: "Requirements",
    requirementsBodyStart: "Server needs",
    requirementsBodyEnd: "set in the environment.",
    placeholder: "Enter a trend (e.g. AI influencers, TikTok NPC live)",
    analyzing: "Analyzing…",
    explainTrend: "Explain trend",
    genericError: "Something went wrong",
  },
  es: {
    title: "Explicador de tendencias",
    instructions: "Instrucciones",
    instructionsBody:
      "Ingresa una tendencia o tema. Recibirás un análisis corto de por qué está en auge, quién está detrás, plataformas, psicología y cómo usarla.",
    requirements: "Requisitos",
    requirementsBodyStart: "El servidor necesita",
    requirementsBodyEnd: "configurada en el entorno.",
    placeholder: "Ingresa una tendencia (ej. influencers de IA, TikTok NPC live)",
    analyzing: "Analizando…",
    explainTrend: "Explicar tendencia",
    genericError: "Algo salió mal",
  },
};

export default function TrendExplainerPage() {
  const { language } = useLanguage();
  const t = copy[language];

  const [trend, setTrend] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeTrend = async () => {
    if (!trend.trim()) return;

    setLoading(true);
    setResult("");
    setError("");

    const res = await fetch("/api/trend-explainer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trend }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || t.genericError);
      setLoading(false);
      return;
    }
    setResult(data.explanation || "");
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
            {t.requirements}
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            {t.requirementsBodyStart}{" "}
            <code className="text-xs">OPENAI_API_KEY</code>{" "}
            {t.requirementsBodyEnd}
          </p>
        </div>
      </section>

      <input
        type="text"
        placeholder={t.placeholder}
        value={trend}
        onChange={(e) => setTrend(e.target.value)}
        className={inputClass}
      />

      <button
        type="button"
        onClick={analyzeTrend}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? t.analyzing : t.explainTrend}
      </button>

      {error && (
        <p className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-2 rounded-lg border border-mono-300 dark:border-mono-700 p-4 whitespace-pre-wrap text-mono-800 dark:text-mono-200">
          {result}
        </div>
      )}
    </div>
  );
}
