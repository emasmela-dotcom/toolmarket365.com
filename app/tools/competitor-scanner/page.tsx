"use client";

import { useState } from "react";
import type { CompetitorScanResult } from "@/lib/competitorScanner";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-3">
      <h3 className="font-semibold text-mono-900 dark:text-mono-100">{title}</h3>
      <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function CompetitorScannerPage() {
  const [niche, setNiche] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [results, setResults] = useState<CompetitorScanResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);

    const res = await fetch("/api/competitor-scanner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        niche,
        competitors: competitors.split(",").map((c) => c.trim()).filter(Boolean),
      }),
    });

    const data = await res.json();
    setResults(data.result ?? []);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        Competitor Scanner
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            Instructions
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            Enter your niche and list competitors as comma-separated names or URLs,
            then scan for positioning-style insights.
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            Expected outcome
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            Per competitor: offers, pricing style, strengths, weaknesses, and market
            gaps.
          </p>
        </div>
      </section>

      <input
        className={inputClass}
        placeholder="Your niche (e.g. fitness coaches)"
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
      />

      <textarea
        className={`${inputClass} min-h-[100px]`}
        placeholder="Competitors (comma-separated URLs or names)"
        value={competitors}
        onChange={(e) => setCompetitors(e.target.value)}
      />

      <button
        type="button"
        onClick={handleScan}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? "Scanning…" : "Scan competitors"}
      </button>

      <div className="mt-6 space-y-6">
        {results.map((comp, i) => (
          <div
            key={i}
            className="border border-mono-300 dark:border-mono-700 p-4 rounded-lg"
          >
            <h2 className="text-xl font-semibold mb-2 text-mono-950 dark:text-mono-50">
              {comp.name}
            </h2>

            <Section title="Offer" items={comp.offer} />
            <Section title="Pricing" items={comp.pricing} />
            <Section title="Strengths" items={comp.strengths} />
            <Section title="Weaknesses" items={comp.weaknesses} />
            <Section title="Market gaps" items={comp.gaps} />
          </div>
        ))}
      </div>
    </div>
  );
}
