"use client";

import { useState } from "react";

type CheckoutResult = {
  score: number;
  issues: string[];
  suggestions: string[];
  optimizedCTA: string;
  optimizedCopy: string;
};

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function CheckoutOptimizer() {
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const splitCsv = (value: FormDataEntryValue | null) =>
      String(value || "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

    const res = await fetch("/api/checkout-optimizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName: formData.get("productName"),
        price: Number(formData.get("price")),
        billingType: formData.get("billingType"),
        ctaText: formData.get("ctaText"),
        trustSignals: splitCsv(formData.get("trustSignals")),
        frictionPoints: splitCsv(formData.get("frictionPoints")),
        features: splitCsv(formData.get("features")),
      }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Checkout Page Optimizer</h1>

      <section className="mb-4 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>
            Enter checkout details, then optimize to get a score, issue list,
            and improved copy.
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>
            You get actionable conversion improvements plus a better CTA and
            checkout copy.
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="productName"
          placeholder="Product Name"
          className={inputClass}
          required
        />
        <input
          name="price"
          placeholder="Price"
          className={inputClass}
          type="number"
          min="0"
          step="0.01"
          required
        />
        <select name="billingType" className={inputClass}>
          <option value="one-time">One-time</option>
          <option value="subscription">Subscription</option>
        </select>
        <input
          name="ctaText"
          placeholder="CTA Text"
          className={inputClass}
          required
        />
        <input
          name="trustSignals"
          placeholder="Trust Signals (comma separated)"
          className={inputClass}
        />
        <input
          name="frictionPoints"
          placeholder="Friction Points (comma separated)"
          className={inputClass}
        />
        <input
          name="features"
          placeholder="Features (comma separated)"
          className={inputClass}
        />
        <button
          className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded w-full"
          type="submit"
        >
          {loading ? "Optimizing..." : "Optimize"}
        </button>
      </form>

      {result && (
        <div className="mt-6 border border-mono-300 dark:border-mono-700 rounded-lg p-4 space-y-3">
          <p>
            <strong>Score:</strong> {result.score}/100
          </p>
          <div>
            <h3 className="font-bold mt-2">Issues:</h3>
            <ul>
              {result.issues.map((issue, idx) => (
                <li key={idx}>- {issue}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mt-2">Suggestions:</h3>
            <ul>
              {result.suggestions.map((suggestion, idx) => (
                <li key={idx}>- {suggestion}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mt-2">Optimized CTA:</h3>
            <p>{result.optimizedCTA}</p>
          </div>
          <div>
            <h3 className="font-bold mt-2">Optimized Copy:</h3>
            <pre className="whitespace-pre-wrap font-sans">{result.optimizedCopy}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
