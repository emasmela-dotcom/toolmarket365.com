"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const cardClass =
  "border rounded border-mono-300 dark:border-mono-600 bg-mono-50 dark:bg-mono-900/50 p-3 text-mono-950 dark:text-mono-50";

const copy = {
  en: {
    title: "Upsell Generator",
    instructions: "Instructions",
    instructionsBody:
      "Enter your product, target audience, and an optional goal, then generate upsell lines.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody:
      "You get a set of ready-to-use upsell messages tailored to your inputs.",
    productPlaceholder: "Product (e.g. CRM tool)",
    audiencePlaceholder: "Audience (e.g. freelancers)",
    goalPlaceholder: "Goal (optional)",
    generating: "Generating...",
    generate: "Generate Upsells",
  },
  es: {
    title: "Generador de upsells",
    instructions: "Instrucciones",
    instructionsBody:
      "Introduce tu producto, audiencia objetivo y un objetivo opcional, luego genera líneas de upsell.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Obtienes un conjunto de mensajes de upsell listos para usar, adaptados a tus datos.",
    productPlaceholder: "Producto (p. ej., herramienta CRM)",
    audiencePlaceholder: "Audiencia (p. ej., freelancers)",
    goalPlaceholder: "Objetivo (opcional)",
    generating: "Generando...",
    generate: "Generar upsells",
  },
};

export default function UpsellGenerator() {
  const { language } = useLanguage();
  const c = copy[language];

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
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>

      <section className="mb-4 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">{c.instructions}</h2>
          <p className="text-mono-700 dark:text-mono-300">{c.instructionsBody}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">{c.expectedOutcome}</h2>
          <p className="text-mono-700 dark:text-mono-300">{c.expectedOutcomeBody}</p>
        </div>
      </section>

      <input
        className={inputClass}
        placeholder={c.productPlaceholder}
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />

      <input
        className={inputClass}
        placeholder={c.audiencePlaceholder}
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
      />

      <input
        className={inputClass}
        placeholder={c.goalPlaceholder}
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <button
        type="button"
        onClick={generate}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded w-full"
      >
        {loading ? c.generating : c.generate}
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
