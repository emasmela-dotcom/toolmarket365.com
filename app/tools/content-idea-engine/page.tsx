"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type IdeaBuckets = Record<string, string[]>;

const BUCKET_ORDER = [
  "viral",
  "reels",
  "educational",
  "authority",
  "monetization",
] as const;

const copy = {
  en: {
    title: "Content Idea Engine",
    instructions: "Instructions",
    instructionsBody: "Type your niche and click Generate ideas.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody:
      "You get grouped content ideas for viral posts, reels, educational content, authority, and monetization.",
    whatThisDoes: "What This Does",
    input: "Input:",
    output: "Output:",
    placeholder: "niche (e.g. fitness)",
    generate: "Generate ideas",
    buckets: {
      viral: "Viral post ideas",
      educational: "Carousel ideas",
      reels: "Reel / TikTok ideas",
      authority: "Authority-building content",
      monetization: "Monetization ideas",
    },
  },
  es: {
    title: "Content Idea Engine",
    instructions: "Instrucciones",
    instructionsBody: "Escribe tu nicho y haz clic en Generar ideas.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Obtienes ideas de contenido agrupadas para publicaciones virales, reels, contenido educativo, autoridad y monetización.",
    whatThisDoes: "Qué hace esto",
    input: "Entrada:",
    output: "Salida:",
    placeholder: "nicho (ej. fitness)",
    generate: "Generar ideas",
    buckets: {
      viral: "Ideas de publicaciones virales",
      educational: "Ideas de carrusel",
      reels: "Ideas de Reel / TikTok",
      authority: "Contenido para construir autoridad",
      monetization: "Ideas de monetización",
    },
  },
};

export default function ContentIdeaEnginePage() {
  const { language } = useLanguage();
  const c = copy[language];

  const [niche, setNiche] = useState("");
  const [ideas, setIdeas] = useState<IdeaBuckets | null>(null);

  const generate = async () => {
    const res = await fetch("/api/content-ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche }),
    });
    const data = await res.json();
    setIdeas(data.ideas ?? null);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{c.title}</h1>

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

      <section className="mb-8 space-y-4 text-mono-800 dark:text-mono-200">
        <h2 className="text-lg font-semibold text-mono-950 dark:text-mono-50">
          {c.whatThisDoes}
        </h2>
        <p className="text-sm font-medium">{c.input}</p>
        <pre className="text-xs bg-mono-100 dark:bg-mono-800 border border-mono-200 dark:border-mono-600 p-3 rounded overflow-x-auto text-mono-900 dark:text-mono-100">
{`{
  niche: "fitness"
}`}
        </pre>
        <p className="text-sm font-medium">{c.output}</p>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>{c.buckets.viral}</li>
          <li>{c.buckets.reels}</li>
          <li>{c.buckets.educational}</li>
          <li>{c.buckets.authority}</li>
          <li>{c.buckets.monetization}</li>
        </ul>
      </section>

      <input
        placeholder={c.placeholder}
        className="border border-mono-300 dark:border-mono-600 p-2 mb-2 w-full rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
      />

      <button
        onClick={generate}
        className="bg-black text-white px-4 py-2 mt-2"
      >
        {c.generate}
      </button>

      {ideas && (
        <div className="mt-6 space-y-6">
          {BUCKET_ORDER.map((bucket) => {
            const lines = ideas[bucket];
            if (!lines?.length) return null;
            return (
              <div key={bucket}>
                <h2 className="font-semibold mb-2 text-mono-950 dark:text-mono-50">
                  {c.buckets[bucket]}
                </h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-mono-800 dark:text-mono-200">
                  {lines.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
