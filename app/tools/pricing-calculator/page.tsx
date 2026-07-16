"use client";

import { useState } from "react";
import { useLanguage } from '@/lib/i18n/LanguageContext';

const copy = {
  en: {
    title: "Pricing Calculator",
    costPlaceholder: "Cost ($)",
    marginPlaceholder: "Margin (0.7 = 70%)",
    competitorsPlaceholder: "Competitor Prices (comma separated)",
    valuePlaceholder: "Perceived Value ($)",
    demandPlaceholder: "Demand Multiplier (1-2)",
    calculate: "Calculate",
    costBased: "Cost-Based",
    competitorAvg: "Competitor Avg",
    competitorAdjusted: "Competitor Adjusted",
    valueBased: "Value-Based",
    suggestedPrice: "Suggested Price",
  },
  es: {
    title: "Calculadora de precios",
    costPlaceholder: "Costo ($)",
    marginPlaceholder: "Margen (0.7 = 70%)",
    competitorsPlaceholder: "Precios de competidores (separados por comas)",
    valuePlaceholder: "Valor percibido ($)",
    demandPlaceholder: "Multiplicador de demanda (1-2)",
    calculate: "Calcular",
    costBased: "Basado en costo",
    competitorAvg: "Promedio de competidores",
    competitorAdjusted: "Ajustado por competidores",
    valueBased: "Basado en valor",
    suggestedPrice: "Precio sugerido",
  },
};

export default function PricingCalculator() {
  const { language } = useLanguage();
  const c = copy[language];
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
      <h2 className="text-xl font-bold">{c.title}</h2>

      <input
        placeholder={c.costPlaceholder}
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        onChange={(e) => setForm({ ...form, cost: e.target.value })}
      />
      <input
        placeholder={c.marginPlaceholder}
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        onChange={(e) => setForm({ ...form, margin: e.target.value })}
      />
      <input
        placeholder={c.competitorsPlaceholder}
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        onChange={(e) => setForm({ ...form, competitors: e.target.value })}
      />
      <input
        placeholder={c.valuePlaceholder}
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        onChange={(e) => setForm({ ...form, value: e.target.value })}
      />
      <input
        placeholder={c.demandPlaceholder}
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        onChange={(e) => setForm({ ...form, demand: e.target.value })}
      />

      <button onClick={handleSubmit} className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded">
        {c.calculate}
      </button>

      {result && (
        <div className="mt-4 space-y-2">
          <p>{c.costBased}: ${result.costBasedPrice}</p>
          <p>{c.competitorAvg}: ${result.competitorAvg}</p>
          <p>{c.competitorAdjusted}: ${result.competitorAdjustedPrice}</p>
          <p>{c.valueBased}: ${result.valueBasedPrice}</p>
          <h3 className="font-bold">{c.suggestedPrice}: ${result.finalSuggestedPrice}</h3>
        </div>
      )}
    </div>
  );
}
