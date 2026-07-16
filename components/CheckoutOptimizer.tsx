"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type CheckoutResult = {
  score: number;
  issues: string[];
  suggestions: string[];
  optimizedCTA: string;
  optimizedCopy: string;
};

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Checkout Page Optimizer",
    instructions: "Instructions",
    instructionsBody:
      "Enter checkout details, then optimize to get a score, issue list, and improved copy.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody:
      "You get actionable conversion improvements plus a better CTA and checkout copy.",
    productName: "Product Name",
    price: "Price",
    oneTime: "One-time",
    subscription: "Subscription",
    ctaText: "CTA Text",
    trustSignals: "Trust Signals (comma separated)",
    frictionPoints: "Friction Points (comma separated)",
    features: "Features (comma separated)",
    optimizing: "Optimizing...",
    optimize: "Optimize",
    score: "Score:",
    issues: "Issues:",
    suggestions: "Suggestions:",
    optimizedCta: "Optimized CTA:",
    optimizedCopy: "Optimized Copy:",
  },
  es: {
    title: "Optimizador de página de pago",
    instructions: "Instrucciones",
    instructionsBody:
      "Ingresa los detalles del checkout y optimiza para obtener una puntuación, una lista de problemas y un copy mejorado.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Obtienes mejoras de conversión accionables, además de un mejor CTA y copy de checkout.",
    productName: "Nombre del producto",
    price: "Precio",
    oneTime: "Pago único",
    subscription: "Suscripción",
    ctaText: "Texto del CTA",
    trustSignals: "Señales de confianza (separadas por comas)",
    frictionPoints: "Puntos de fricción (separados por comas)",
    features: "Funciones (separadas por comas)",
    optimizing: "Optimizando...",
    optimize: "Optimizar",
    score: "Puntuación:",
    issues: "Problemas:",
    suggestions: "Sugerencias:",
    optimizedCta: "CTA optimizado:",
    optimizedCopy: "Copy optimizado:",
  },
} as const;

export default function CheckoutOptimizer() {
  const { language } = useLanguage();
  const t = copy[language];

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
      <h1 className="text-2xl font-bold">{t.title}</h1>

      <section className="mb-4 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">{t.instructions}</h2>
          <p>{t.instructionsBody}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">{t.expectedOutcome}</h2>
          <p>{t.expectedOutcomeBody}</p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="productName"
          placeholder={t.productName}
          className={inputClass}
          required
        />
        <input
          name="price"
          placeholder={t.price}
          className={inputClass}
          type="number"
          min="0"
          step="0.01"
          required
        />
        <select name="billingType" className={inputClass}>
          <option value="one-time">{t.oneTime}</option>
          <option value="subscription">{t.subscription}</option>
        </select>
        <input
          name="ctaText"
          placeholder={t.ctaText}
          className={inputClass}
          required
        />
        <input
          name="trustSignals"
          placeholder={t.trustSignals}
          className={inputClass}
        />
        <input
          name="frictionPoints"
          placeholder={t.frictionPoints}
          className={inputClass}
        />
        <input
          name="features"
          placeholder={t.features}
          className={inputClass}
        />
        <button
          className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded w-full"
          type="submit"
        >
          {loading ? t.optimizing : t.optimize}
        </button>
      </form>

      {result && (
        <div className="mt-6 border border-mono-300 dark:border-mono-700 rounded-lg p-4 space-y-3">
          <p>
            <strong>{t.score}</strong> {result.score}/100
          </p>
          <div>
            <h3 className="font-bold mt-2">{t.issues}</h3>
            <ul>
              {result.issues.map((issue, idx) => (
                <li key={idx}>- {issue}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mt-2">{t.suggestions}</h3>
            <ul>
              {result.suggestions.map((suggestion, idx) => (
                <li key={idx}>- {suggestion}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mt-2">{t.optimizedCta}</h3>
            <p>{result.optimizedCTA}</p>
          </div>
          <div>
            <h3 className="font-bold mt-2">{t.optimizedCopy}</h3>
            <pre className="whitespace-pre-wrap font-sans">{result.optimizedCopy}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
