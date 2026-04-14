"use client";

import { useState } from "react";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const cardClass =
  "border rounded border-mono-300 dark:border-mono-600 bg-mono-50 dark:bg-mono-900/50 p-3 text-mono-950 dark:text-mono-50";

export default function UpsellGenerator() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [upsells, setUpsells] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);

    const res = await fetch("/api/upsell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, audience, goal }),
    });

    const data = await res.json();
    setUpsells(data.upsells);

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Upsell Generator</h1>

      <section className="mb-4 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Enter your product, target audience, and an optional goal, then generate upsell lines.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>You get a set of ready-to-use upsell messages tailored to your inputs.</p>
        </div>
      </section>

      <input
        className={inputClass}
        placeholder="Product (e.g. CRM tool)"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />

      <input
        className={inputClass}
        placeholder="Audience (e.g. freelancers)"
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
      />

      <input
        className={inputClass}
        placeholder="Goal (optional)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <button
        type="button"
        onClick={generate}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded w-full"
      >
        {loading ? "Generating..." : "Generate Upsells"}
      </button>

      <div className="space-y-2 pt-2">
        {upsells.map((u, i) => (
          <div key={i} className={cardClass}>
            {u}
          </div>
        ))}
      </div>
    </div>
  );
}
