"use client";

import { useState } from "react";
import type { CritiqueOutput } from "@/lib/landingCritiquer";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function LandingPageCritiquerPage() {
  const [form, setForm] = useState({
    headline: "",
    subheadline: "",
    body: "",
    cta: "",
    audience: "",
  });

  const [result, setResult] = useState<CritiqueOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/critique", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        Landing Page Critiquer
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            Instructions
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            Paste your landing page headline, subheadline, core body copy, CTA,
            and audience. The tool scores core conversion signals and gives
            rewrite guidance.
          </p>
        </div>
      </section>

      <input
        className={inputClass}
        placeholder="Headline"
        onChange={(e) => setForm({ ...form, headline: e.target.value })}
      />
      <input
        className={inputClass}
        placeholder="Subheadline"
        onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
      />
      <textarea
        className={`${inputClass} min-h-[120px]`}
        placeholder="Body"
        onChange={(e) => setForm({ ...form, body: e.target.value })}
      />
      <input
        className={inputClass}
        placeholder="CTA"
        onChange={(e) => setForm({ ...form, cta: e.target.value })}
      />
      <input
        className={inputClass}
        placeholder="Audience"
        onChange={(e) => setForm({ ...form, audience: e.target.value })}
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div className="mt-6 space-y-3 rounded-lg border border-mono-300 dark:border-mono-700 p-4">
          <h2 className="text-lg font-bold text-mono-950 dark:text-mono-50">
            Score: {result.score}
          </h2>

          <div>
            <h3 className="font-semibold text-mono-900 dark:text-mono-100">
              Breakdown
            </h3>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              <li>Clarity: {result.breakdown.clarity}</li>
              <li>Value: {result.breakdown.value}</li>
              <li>Urgency: {result.breakdown.urgency}</li>
              <li>Trust: {result.breakdown.trust}</li>
              <li>Conversion: {result.breakdown.conversion}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-mono-900 dark:text-mono-100">
              Issues
            </h3>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {result.issues.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-mono-900 dark:text-mono-100">
              Suggestions
            </h3>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {result.suggestions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-mono-900 dark:text-mono-100">
              Improved Version
            </h3>
            <p className="text-mono-800 dark:text-mono-200">
              <strong>Headline:</strong> {result.improvedVersion.headline}
            </p>
            <p className="text-mono-800 dark:text-mono-200">
              <strong>Subheadline:</strong> {result.improvedVersion.subheadline}
            </p>
            <p className="text-mono-800 dark:text-mono-200">
              <strong>CTA:</strong> {result.improvedVersion.cta}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
