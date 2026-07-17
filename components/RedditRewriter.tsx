"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const copy = {
  en: {
    title: "Reddit Post Rewriter",
    instructions: "Instructions",
    instructionsBody: "Paste your Reddit post text and click Rewrite Post.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody:
      "You get multiple rewritten variations with adjusted wording and structure.",
    blurb:
      "Local rewrites: synonyms, light restructuring, tone tweaks—no external API. Use for drafts; always follow subreddit rules.",
    placeholder: "Paste your Reddit post...",
    rewrite: "Rewrite Post",
  },
  es: {
    title: "Reescritor de publicaciones de Reddit",
    instructions: "Instrucciones",
    instructionsBody:
      "Pega el texto de tu publicación de Reddit y haz clic en Reescribir publicación.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Obtienes varias versiones reescritas con redacción y estructura ajustadas.",
    blurb:
      "Reescrituras locales: sinónimos, reestructuración ligera y ajustes de tono—sin API externa. Úsalo para borradores; respeta siempre las reglas del subreddit.",
    placeholder: "Pega tu publicación de Reddit...",
    rewrite: "Reescribir publicación",
  },
};

export default function RedditRewriter() {
  const { language } = useLanguage();
  const c = copy[language];

  const [input, setInput] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleRewrite = async () => {
    const res = await fetch("/api/rewrite-reddit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post: input, variations: 3 }),
    });

    const data = await res.json();
    if (data.error) {
      setResults([]);
      return;
    }
    setResults(data.rewritten ?? []);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-2">{c.title}</h1>

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

      <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">{c.blurb}</p>

      <textarea
        className="w-full border border-mono-300 dark:border-mono-600 p-2 mb-4 rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        rows={6}
        placeholder={c.placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        type="button"
        onClick={handleRewrite}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded"
      >
        {c.rewrite}
      </button>

      <div className="mt-6 space-y-4">
        {results.map((r, i) => (
          <div
            key={i}
            className="border border-mono-200 dark:border-mono-700 p-3 rounded whitespace-pre-wrap text-sm"
          >
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}
