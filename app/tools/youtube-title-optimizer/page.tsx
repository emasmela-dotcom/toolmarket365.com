"use client";

import { useState } from "react";

export default function TitleOptimizer() {
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
      <h1 className="text-xl font-bold mb-4">YouTube Title Optimizer</h1>

      <section className="mb-6 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Enter topic (required), optional audience and keyword, choose a tone, then click Generate Titles.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>You get multiple title options with CTR-style scores to help choose a stronger headline.</p>
        </div>
      </section>

      <input
        placeholder="Topic"
        className="border border-mono-300 dark:border-mono-600 p-2 w-full mb-2 rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={form.topic}
        onChange={(e) => setForm({ ...form, topic: e.target.value })}
      />

      <input
        placeholder="Audience (optional)"
        className="border border-mono-300 dark:border-mono-600 p-2 w-full mb-2 rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={form.audience}
        onChange={(e) => setForm({ ...form, audience: e.target.value })}
      />

      <input
        placeholder="Keyword (optional)"
        className="border border-mono-300 dark:border-mono-600 p-2 w-full mb-2 rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={form.keyword}
        onChange={(e) => setForm({ ...form, keyword: e.target.value })}
      />

      <select
        className="border border-mono-300 dark:border-mono-600 p-2 w-full mb-4 rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        value={form.tone}
        onChange={(e) => setForm({ ...form, tone: e.target.value })}
      >
        <option value="viral">Viral</option>
        <option value="educational">Educational</option>
        <option value="curiosity">Curiosity</option>
        <option value="authority">Authority</option>
      </select>

      <button
        type="button"
        onClick={handleGenerate}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Generate Titles
      </button>

      <div className="mt-6 space-y-2">
        {titles.map((t, i) => (
          <div key={i} className="border p-2 flex justify-between gap-2">
            <span>{t.title}</span>
            <span className="text-sm text-mono-500 shrink-0">CTR {t.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
