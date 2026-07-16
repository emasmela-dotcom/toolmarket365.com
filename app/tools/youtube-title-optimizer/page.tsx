"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const copy = {
  en: {
    title: "YouTube Title Optimizer",
    instructions: "Instructions",
    instructionsBody:
      "Enter topic (required), optional audience and keyword, choose a tone, then click Generate Titles.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody:
      "You get multiple title options with CTR-style scores to help choose a stronger headline.",
    topic: "Topic",
    audience: "Audience (optional)",
    keyword: "Keyword (optional)",
    tones: {
      viral: "Viral",
      educational: "Educational",
      curiosity: "Curiosity",
      authority: "Authority",
    },
    generate: "Generate Titles",
    ctr: "CTR",
  },
  es: {
    title: "YouTube Title Optimizer",
    instructions: "Instrucciones",
    instructionsBody:
      "Ingresa el tema (obligatorio), audiencia y palabra clave opcionales, elige un tono y haz clic en Generar títulos.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Obtienes varias opciones de título con puntuaciones tipo CTR para ayudarte a elegir un titular más fuerte.",
    topic: "Tema",
    audience: "Audiencia (opcional)",
    keyword: "Palabra clave (opcional)",
    tones: {
      viral: "Viral",
      educational: "Educativo",
      curiosity: "Curiosidad",
      authority: "Autoridad",
    },
    generate: "Generar títulos",
    ctr: "CTR",
  },
};

export default function TitleOptimizer() {
  const { language } = useLanguage();
  const c = copy[language];

  const [form, setForm] = useState({
    topic: "",
    audience: "",
    keyword: "",
    tone: "viral",
  });

  const [titles, setTitles] = useState<{ title: string; score: number }[]>([]);

  const handleGenerate = async () => {
    const res = await fetch("/api/title-optimizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setTitles(data.titles ?? []);
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
        placeholder={c.topic}
        className="border border-mono-300 dark:border-mono-600 p-2 w-full mb-2 rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={form.topic}
        onChange={(e) => setForm({ ...form, topic: e.target.value })}
      />

      <input
        placeholder={c.audience}
        className="border border-mono-300 dark:border-mono-600 p-2 w-full mb-2 rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={form.audience}
        onChange={(e) => setForm({ ...form, audience: e.target.value })}
      />

      <input
        placeholder={c.keyword}
        className="border border-mono-300 dark:border-mono-600 p-2 w-full mb-2 rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={form.keyword}
        onChange={(e) => setForm({ ...form, keyword: e.target.value })}
      />

      <select
        className="border border-mono-300 dark:border-mono-600 p-2 w-full mb-4 rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        value={form.tone}
        onChange={(e) => setForm({ ...form, tone: e.target.value })}
      >
        <option value="viral">{c.tones.viral}</option>
        <option value="educational">{c.tones.educational}</option>
        <option value="curiosity">{c.tones.curiosity}</option>
        <option value="authority">{c.tones.authority}</option>
      </select>

      <button
        type="button"
        onClick={handleGenerate}
        className="bg-black text-white px-4 py-2 w-full"
      >
        {c.generate}
      </button>

      <div className="mt-6 space-y-2">
        {titles.map((t, i) => (
          <div key={i} className="border p-2 flex justify-between gap-2">
            <span>{t.title}</span>
            <span className="text-sm text-mono-500 shrink-0">
              {c.ctr} {t.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
