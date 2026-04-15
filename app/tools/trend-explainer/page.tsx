"use client";

import { useState } from "react";

const inputClass =
  "w-full border p-3 rounded-lg border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function TrendExplainerPage() {
  const [trend, setTrend] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeTrend = async () => {
    if (!trend.trim()) return;

    setLoading(true);
    setResult("");
    setError("");

    const res = await fetch("/api/trend-explainer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trend }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }
    setResult(data.explanation || "");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        Trend Explainer
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            Instructions
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            Enter a trend or topic. You get a short analysis of why it is hot,
            who is behind it, platforms, psychology, and how to use it.
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            Requirements
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            Server needs <code className="text-xs">OPENAI_API_KEY</code> set in
            the environment.
          </p>
        </div>
      </section>

      <input
        type="text"
        placeholder="Enter a trend (e.g. AI influencers, TikTok NPC live)"
        value={trend}
        onChange={(e) => setTrend(e.target.value)}
        className={inputClass}
      />

      <button
        type="button"
        onClick={analyzeTrend}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? "Analyzing…" : "Explain trend"}
      </button>

      {error && (
        <p className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-2 rounded-lg border border-mono-300 dark:border-mono-700 p-4 whitespace-pre-wrap text-mono-800 dark:text-mono-200">
          {result}
        </div>
      )}
    </div>
  );
}
