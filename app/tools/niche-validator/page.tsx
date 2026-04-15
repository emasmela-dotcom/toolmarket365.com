"use client";

import { useState } from "react";
import type { NicheResult } from "@/lib/nicheValidator";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function NicheValidatorPage() {
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [result, setResult] = useState<NicheResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/niche-validator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, audience }),
    });
    const data = (await res.json()) as NicheResult;
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        Niche Validator
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            Instructions
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            Describe your niche and who you serve. You get a score, strengths,
            gaps, and monetization ideas.
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            Expected outcome
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            A 0–100 score, verdict, strengths, weaknesses, suggestions, and
            monetization angles.
          </p>
        </div>
      </section>

      <input
        placeholder="Your niche (e.g. Help creators get clients using AI)"
        className={inputClass}
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
      />

      <input
        placeholder="Target audience (e.g. small creators)"
        className={inputClass}
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? "Validating…" : "Validate"}
      </button>

      {result && (
        <div className="space-y-4 rounded-lg border border-mono-300 dark:border-mono-700 p-4">
          <div>
            <p className="text-sm font-semibold text-mono-600 dark:text-mono-400">
              Score
            </p>
            <p className="text-2xl font-bold text-mono-950 dark:text-mono-50">
              {result.score}/100
            </p>
            <p className="mt-1 text-lg font-semibold text-mono-900 dark:text-mono-100">
              {result.verdict}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-mono-900 dark:text-mono-100">
              Strengths
            </h2>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {result.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-mono-900 dark:text-mono-100">
              Weaknesses
            </h2>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {result.weaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-mono-900 dark:text-mono-100">
              Suggestions
            </h2>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {result.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-mono-900 dark:text-mono-100">
              Monetization ideas
            </h2>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {result.monetizationIdeas.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
