"use client";

import { useState } from "react";

export default function PricingCalculator() {
  const [form, setForm] = useState({
    cost: "",
    margin: "",
    competitors: "",
    value: "",
    demand: "1",
  });

  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    const res = await fetch("/api/pricing", {
      method: "POST",
      body: JSON.stringify({
        cost: parseFloat(form.cost),
        margin: parseFloat(form.margin),
        competitors: form.competitors
          .split(",")
          .map((n) => parseFloat(n.trim()))
          .filter(Boolean),
        value: parseFloat(form.value),
        demand: parseFloat(form.demand),
      }),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Pricing Calculator</h2>

      <input
        placeholder="Cost ($)"
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        onChange={(e) => setForm({ ...form, cost: e.target.value })}
      />
      <input
        placeholder="Margin (0.7 = 70%)"
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        onChange={(e) => setForm({ ...form, margin: e.target.value })}
      />
      <input
        placeholder="Competitor Prices (comma separated)"
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        onChange={(e) => setForm({ ...form, competitors: e.target.value })}
      />
      <input
        placeholder="Perceived Value ($)"
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        onChange={(e) => setForm({ ...form, value: e.target.value })}
      />
      <input
        placeholder="Demand Multiplier (1-2)"
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        onChange={(e) => setForm({ ...form, demand: e.target.value })}
      />

      <button onClick={handleSubmit} className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded">
        Calculate
      </button>

      {result && (
        <div className="mt-4 space-y-2">
          <p>Cost-Based: ${result.costBasedPrice}</p>
          <p>Competitor Avg: ${result.competitorAvg}</p>
          <p>Competitor Adjusted: ${result.competitorAdjustedPrice}</p>
          <p>Value-Based: ${result.valueBasedPrice}</p>
          <h3 className="font-bold">Suggested Price: ${result.finalSuggestedPrice}</h3>
        </div>
      )}
    </div>
  );
}
