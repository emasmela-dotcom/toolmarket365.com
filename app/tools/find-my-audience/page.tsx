"use client";

import { useState } from "react";
import type { AudienceSegmentResult } from "@/lib/audience";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Find My Audience",
    instructions: "Instructions",
    instructionsBody:
      "Enter your niche, product or service, and the problem you solve, then generate audience ideas.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody:
      "Segments, pain points, platforms, messaging angles, and a simple offer line per segment.",
    niche: "Niche (e.g. Fitness, SaaS, Real Estate)",
    product: "Product (e.g. Coaching, App, Course)",
    problem: "Problem you solve",
    finding: "Finding…",
    findAudience: "Find audience",
    painPoints: "Pain points",
    whereToFind: "Where to find them",
    messagingAngles: "Messaging angles",
    offerIdea: "Offer idea",
  },
  es: {
    title: "Encontrar mi audiencia",
    instructions: "Instrucciones",
    instructionsBody:
      "Ingresa tu nicho, producto o servicio, y el problema que resuelves. Luego genera ideas de audiencia.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Segmentos, puntos de dolor, plataformas, ángulos de mensaje y una línea simple de oferta por segmento.",
    niche: "Nicho (ej. Fitness, SaaS, Bienes raíces)",
    product: "Producto (ej. Coaching, app, curso)",
    problem: "Problema que resuelves",
    finding: "Buscando…",
    findAudience: "Encontrar audiencia",
    painPoints: "Puntos de dolor",
    whereToFind: "Dónde encontrarlos",
    messagingAngles: "Ángulos de mensaje",
    offerIdea: "Idea de oferta",
  },
};

export default function FindMyAudiencePage() {
  const { language } = useLanguage();
  const t = copy[language];

  const [form, setForm] = useState({
    niche: "",
    product: "",
    problem: "",
  });
  const [results, setResults] = useState<AudienceSegmentResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/find-audience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResults(data.audiences || []);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{t.title}</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">{t.instructions}</h2>
          <p>{t.instructionsBody}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">{t.expectedOutcome}</h2>
          <p>{t.expectedOutcomeBody}</p>
        </div>
      </section>

      <input
        placeholder={t.niche}
        className={inputClass}
        value={form.niche}
        onChange={(e) => setForm({ ...form, niche: e.target.value })}
      />

      <input
        placeholder={t.product}
        className={inputClass}
        value={form.product}
        onChange={(e) => setForm({ ...form, product: e.target.value })}
      />

      <input
        placeholder={t.problem}
        className={inputClass}
        value={form.problem}
        onChange={(e) => setForm({ ...form, problem: e.target.value })}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? t.finding : t.findAudience}
      </button>

      <div className="space-y-4">
        {results.map((audience, i) => (
          <div
            key={i}
            className="rounded-lg border border-mono-300 dark:border-mono-700 p-4"
          >
            <h2 className="font-bold text-lg text-mono-950 dark:text-mono-50">{audience.segment}</h2>

            <p className="mt-2 font-semibold text-mono-900 dark:text-mono-100">{t.painPoints}</p>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {audience.painPoints.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>

            <p className="mt-2 font-semibold text-mono-900 dark:text-mono-100">{t.whereToFind}</p>
            <p className="text-mono-800 dark:text-mono-200">{audience.platforms.join(", ")}</p>

            <p className="mt-2 font-semibold text-mono-900 dark:text-mono-100">{t.messagingAngles}</p>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {audience.messaging.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>

            <p className="mt-2 font-semibold text-mono-900 dark:text-mono-100">{t.offerIdea}</p>
            <p className="text-mono-800 dark:text-mono-200">{audience.recommendedOffer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
