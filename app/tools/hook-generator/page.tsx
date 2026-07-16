"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const copy = {
  en: {
    title: "Hook Generator",
    instructions: "Instructions",
    instructionsBody:
      "Enter your niche, audience, pain point, and desire, then click Generate Hooks.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody:
      "You get multiple hook lines you can use for posts, reels, and short-form videos.",
    whatThisDoes: "What This Does",
    generatesFor: "Generates viral hooks for:",
    tweets: "Tweets (X)",
    reelsTikTok: "Reels / TikTok",
    provenPatterns:
      "Uses proven patterns (curiosity, controversy, numbers, pain points)",
    worksInstantly:
      "Works instantly (no AI required, but I'll show how to upgrade it too)",
    coreIdea: "🧠 Core Idea",
    hooksFormula: "Hooks = Templates + Variables",
    example: "Example:",
    exampleQuote:
      '"Nobody talks about how [PAIN POINT] is ruining your [DESIRED RESULT]…"',
    placeholders: {
      niche: "niche",
      audience: "audience",
      painPoint: "pain point",
      desire: "desire",
    },
    generate: "Generate Hooks",
  },
  es: {
    title: "Hook Generator",
    instructions: "Instrucciones",
    instructionsBody:
      "Ingresa tu nicho, audiencia, punto de dolor y deseo, luego haz clic en Generar ganchos.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Obtienes varias líneas de gancho que puedes usar en publicaciones, reels y videos cortos.",
    whatThisDoes: "Qué hace esto",
    generatesFor: "Genera ganchos virales para:",
    tweets: "Tweets (X)",
    reelsTikTok: "Reels / TikTok",
    provenPatterns:
      "Usa patrones probados (curiosidad, controversia, números, puntos de dolor)",
    worksInstantly:
      "Funciona al instante (no requiere IA, pero también te muestro cómo mejorarlo)",
    coreIdea: "🧠 Idea central",
    hooksFormula: "Ganchos = Plantillas + Variables",
    example: "Ejemplo:",
    exampleQuote:
      '"Nadie habla de cómo [PUNTO DE DOLOR] está arruinando tu [RESULTADO DESEADO]…"',
    placeholders: {
      niche: "nicho",
      audience: "audiencia",
      painPoint: "punto de dolor",
      desire: "deseo",
    },
    generate: "Generar ganchos",
  },
};

export default function HookGenerator() {
  const { language } = useLanguage();
  const c = copy[language];

  const [form, setForm] = useState({
    niche: "",
    audience: "",
    painPoint: "",
    desire: "",
  });

  const [hooks, setHooks] = useState<string[]>([]);

  const generate = async () => {
    const res = await fetch("/api/hooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setHooks(data.hooks ?? []);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
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
        <p className="text-sm">{c.generatesFor}</p>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>{c.tweets}</li>
          <li>{c.reelsTikTok}</li>
        </ul>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>{c.provenPatterns}</li>
          <li>{c.worksInstantly}</li>
        </ul>

        <h2 className="text-lg font-semibold text-mono-950 dark:text-mono-50 pt-2">
          {c.coreIdea}
        </h2>
        <p className="text-sm font-medium">{c.hooksFormula}</p>
        <p className="text-sm">{c.example}</p>
        <blockquote className="border-l-4 border-mono-300 dark:border-mono-600 pl-3 text-sm italic text-mono-700 dark:text-mono-300">
          {c.exampleQuote}
        </blockquote>
      </section>

      {(Object.keys(form) as (keyof typeof form)[]).map((key) => (
        <input
          key={key}
          placeholder={c.placeholders[key]}
          className="border border-mono-300 dark:border-mono-600 p-2 mb-2 w-full rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ))}

      <button
        onClick={generate}
        className="bg-black text-white px-4 py-2 mt-2"
      >
        {c.generate}
      </button>

      <div className="mt-4 space-y-2">
        {hooks.map((hook, i) => (
          <div
            key={i}
            className="border border-mono-200 dark:border-mono-700 p-2 rounded text-mono-900 dark:text-mono-100"
          >
            {hook}
          </div>
        ))}
      </div>
    </div>
  );
}
