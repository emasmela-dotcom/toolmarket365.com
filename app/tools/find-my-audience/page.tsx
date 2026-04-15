"use client";

import { useState } from "react";
import type { AudienceSegmentResult } from "@/lib/audience";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function FindMyAudiencePage() {
  const [form, setForm] = useState({
    niche: "",
    product: "",
    problem: "",
  });
  const [results, setResults] = useState<AudienceSegmentResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/find-audience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResults(data.audiences || []);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Find My Audience</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Enter your niche, product or service, and the problem you solve, then generate audience ideas.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>Segments, pain points, platforms, messaging angles, and a simple offer line per segment.</p>
        </div>
      </section>

      <input
        placeholder="Niche (e.g. Fitness, SaaS, Real Estate)"
        className={inputClass}
        value={form.niche}
        onChange={(e) => setForm({ ...form, niche: e.target.value })}
      />

      <input
        placeholder="Product (e.g. Coaching, App, Course)"
        className={inputClass}
        value={form.product}
        onChange={(e) => setForm({ ...form, product: e.target.value })}
      />

      <input
        placeholder="Problem you solve"
        className={inputClass}
        value={form.problem}
        onChange={(e) => setForm({ ...form, problem: e.target.value })}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? "Finding…" : "Find audience"}
      </button>

      <div className="space-y-4">
        {results.map((audience, i) => (
          <div
            key={i}
            className="rounded-lg border border-mono-300 dark:border-mono-700 p-4"
          >
            <h2 className="font-bold text-lg text-mono-950 dark:text-mono-50">{audience.segment}</h2>

            <p className="mt-2 font-semibold text-mono-900 dark:text-mono-100">Pain points</p>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {audience.painPoints.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>

            <p className="mt-2 font-semibold text-mono-900 dark:text-mono-100">Where to find them</p>
            <p className="text-mono-800 dark:text-mono-200">{audience.platforms.join(", ")}</p>

            <p className="mt-2 font-semibold text-mono-900 dark:text-mono-100">Messaging angles</p>
            <ul className="list-disc ml-5 text-mono-800 dark:text-mono-200">
              {audience.messaging.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>

            <p className="mt-2 font-semibold text-mono-900 dark:text-mono-100">Offer idea</p>
            <p className="text-mono-800 dark:text-mono-200">{audience.recommendedOffer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
