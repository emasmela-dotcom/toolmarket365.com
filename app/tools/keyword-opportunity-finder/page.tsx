"use client";

import { useState } from "react";
import type { KeywordResult } from "@/lib/keywordFinder";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function KeywordOpportunityFinderPage() {
  const [seed, setSeed] = useState("");
  const [results, setResults] = useState<KeywordResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/keyword-finder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed }),
    });
    const data = await res.json();
    setResults(data.results ?? []);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        Keyword Opportunity Finder
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            Instructions
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            Enter a seed keyword. The tool expands it into variations and scores
            intent, simulated competition, and opportunity (higher = better).
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            Expected outcome
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            A sorted list of keyword ideas with intent, competition, and
            opportunity scores.
          </p>
        </div>
      </section>

      <input
        className={inputClass}
        placeholder="Seed keyword (e.g. email marketing)"
        value={seed}
        onChange={(e) => setSeed(e.target.value)}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? "Finding…" : "Find opportunities"}
      </button>

      {results.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-mono-300 dark:border-mono-700">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-mono-300 dark:border-mono-600 bg-mono-100 dark:bg-mono-900">
              <tr>
                <th className="p-3 font-semibold text-mono-900 dark:text-mono-100">
                  Keyword
                </th>
                <th className="p-3 font-semibold text-mono-900 dark:text-mono-100">
                  Intent
                </th>
                <th className="p-3 font-semibold text-mono-900 dark:text-mono-100">
                  Competition
                </th>
                <th className="p-3 font-semibold text-mono-900 dark:text-mono-100">
                  Opportunity
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-mono-200 dark:border-mono-800 last:border-0"
                >
                  <td className="p-3 text-mono-800 dark:text-mono-200">
                    {row.keyword}
                  </td>
                  <td className="p-3 text-mono-800 dark:text-mono-200">
                    {row.intentScore}
                  </td>
                  <td className="p-3 text-mono-800 dark:text-mono-200">
                    {row.competitionScore}
                  </td>
                  <td className="p-3 font-medium text-mono-950 dark:text-mono-50">
                    {row.opportunityScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
