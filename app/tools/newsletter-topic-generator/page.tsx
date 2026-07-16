"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const copy = {
  en: {
    title: "Newsletter Topic Generator",
    instructions: "Instructions",
    instructionsBody:
      "Fill in niche and audience, add an optional goal, then click Generate Topics.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody:
      "You get a list of newsletter topic ideas aligned to your audience and goal.",
    niche: "Niche (e.g. Fitness)",
    audience: "Audience (e.g. Busy professionals)",
    goal: "Goal (optional)",
    generate: "Generate Topics",
  },
  es: {
    title: "Newsletter Topic Generator",
    instructions: "Instrucciones",
    instructionsBody:
      "Completa nicho y audiencia, agrega un objetivo opcional y haz clic en Generar temas.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Obtienes una lista de ideas de temas para newsletter alineadas a tu audiencia y objetivo.",
    niche: "Nicho (ej. Fitness)",
    audience: "Audiencia (ej. Profesionales ocupados)",
    goal: "Objetivo (opcional)",
    generate: "Generar temas",
  },
};

export default function NewsletterTopicGeneratorPage() {
  const { language } = useLanguage();
  const c = copy[language];

  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [topics, setTopics] = useState<string[]>([]);

  const generate = async () => {
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, audience, goal }),
    });

    const data = await res.json();
    setTopics((data.topics ?? []).map((t: { title: string }) => t.title));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">{c.title}</h1>

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

      <input
        className="border p-2 w-full mb-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        placeholder={c.niche}
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        placeholder={c.audience}
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        placeholder={c.goal}
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <button
        type="button"
        onClick={generate}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded w-full font-medium"
      >
        {c.generate}
      </button>

      <div className="mt-6">
        {topics.map((topic, i) => (
          <div key={i} className="border-b py-2">
            {topic}
          </div>
        ))}
      </div>
    </div>
  );
}
