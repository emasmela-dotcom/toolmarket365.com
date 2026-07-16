"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type TikTokTrend = {
  label: string;
  description: string;
  hashtags: string[];
  suggestedFormat: string;
  momentum: string;
};

const copy = {
  en: {
    title: "TikTok Trend Finder",
    instructions: "Instructions",
    instructionsBody:
      "Enter your niche, select focus type, then click Find trends.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody:
      "You get trend angles with descriptions, suggested formats, momentum labels, and hashtag sets.",
    blurb:
      "Angle ideas, formats, and hashtag stacks tailored to your niche—built for fast iteration (no live TikTok API; offline templates + your inputs).",
    nichePlaceholder:
      "Your niche (e.g. fitness coaching, SaaS, skincare)",
    focus: {
      all: "All signals",
      sounds: "Sound / audio angles",
      hashtags: "Hashtag / discovery",
      formats: "Video formats",
    },
    find: "Find trends",
    format: "Format:",
  },
  es: {
    title: "TikTok Trend Finder",
    instructions: "Instrucciones",
    instructionsBody:
      "Ingresa tu nicho, selecciona el tipo de enfoque y haz clic en Buscar tendencias.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Obtienes ángulos de tendencia con descripciones, formatos sugeridos, etiquetas de impulso y conjuntos de hashtags.",
    blurb:
      "Ideas de ángulos, formatos y packs de hashtags adaptados a tu nicho—pensados para iterar rápido (sin API en vivo de TikTok; plantillas offline + tus datos).",
    nichePlaceholder:
      "Tu nicho (ej. coaching de fitness, SaaS, skincare)",
    focus: {
      all: "Todas las señales",
      sounds: "Ángulos de sonido / audio",
      hashtags: "Hashtag / descubrimiento",
      formats: "Formatos de video",
    },
    find: "Buscar tendencias",
    format: "Formato:",
  },
};

export default function TikTokTrendFinderPage() {
  const { language } = useLanguage();
  const c = copy[language];

  const [niche, setNiche] = useState("");
  const [focus, setFocus] = useState<"sounds" | "hashtags" | "formats" | "all">(
    "all"
  );
  const [trends, setTrends] = useState<TikTokTrend[]>([]);

  const run = async () => {
    const res = await fetch("/api/tiktok-trends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, focus, count: 6 }),
    });
    const data = await res.json();
    setTrends(data.trends ?? []);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{c.title}</h1>

      <section className="mb-6 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">{c.instructions}</h2>
          <p>{c.instructionsBody}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">{c.expectedOutcome}</h2>
          <p>{c.expectedOutcomeBody}</p>
        </div>
      </section>

      <p className="text-sm text-mono-600 dark:text-mono-400 mb-6">
        {c.blurb}
      </p>

      <input
        placeholder={c.nichePlaceholder}
        className="border border-mono-300 dark:border-mono-600 p-2 w-full mb-2 rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
      />

      <select
        className="border border-mono-300 dark:border-mono-600 p-2 w-full mb-4 rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        value={focus}
        onChange={(e) =>
          setFocus(e.target.value as typeof focus)
        }
      >
        <option value="all">{c.focus.all}</option>
        <option value="sounds">{c.focus.sounds}</option>
        <option value="hashtags">{c.focus.hashtags}</option>
        <option value="formats">{c.focus.formats}</option>
      </select>

      <button
        type="button"
        onClick={run}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 w-full rounded font-medium"
      >
        {c.find}
      </button>

      <div className="mt-6 space-y-4">
        {trends.map((t, i) => (
          <div
            key={i}
            className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 space-y-2"
          >
            <div className="flex justify-between gap-2 items-start">
              <h2 className="font-semibold text-mono-950 dark:text-mono-50">
                {t.label}
              </h2>
              <span className="text-xs uppercase tracking-wide px-2 py-0.5 rounded bg-mono-100 dark:bg-mono-800 text-mono-600 dark:text-mono-300 shrink-0">
                {t.momentum}
              </span>
            </div>
            <p className="text-sm text-mono-700 dark:text-mono-300">
              {t.description}
            </p>
            <p className="text-sm text-mono-600 dark:text-mono-400">
              <span className="font-medium text-mono-800 dark:text-mono-200">
                {c.format}{" "}
              </span>
              {t.suggestedFormat}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {t.hashtags.map((h) => (
                <span
                  key={h}
                  className="text-xs px-2 py-0.5 rounded-full bg-accent-50 dark:bg-accent-900/30 text-accent-800 dark:text-accent-200"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
