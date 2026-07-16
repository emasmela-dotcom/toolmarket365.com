"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Landing Page Copy Generator",
    instructions: "Instructions",
    instructionsBody:
      "Fill product, audience, problem, benefit, pick tone, then click Generate Copy.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody:
      "You get headline, subheadline, value props, features, CTA, testimonials, and FAQ blocks.",
    product: "Product",
    audience: "Audience",
    problem: "Problem",
    benefit: "Benefit",
    toneBold: "Bold",
    toneCasual: "Casual",
    toneProfessional: "Professional",
    generating: "Generating...",
    generate: "Generate Copy",
    valueProps: "Value Props",
    features: "Features",
    cta: "CTA",
    testimonials: "Testimonials",
    faq: "FAQ",
  },
  es: {
    title: "Generador de copy para landing",
    instructions: "Instrucciones",
    instructionsBody:
      "Completa producto, audiencia, problema y beneficio, elige el tono y haz clic en Generar copy.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Obtienes titular, subtítulo, propuestas de valor, funciones, CTA, testimonios y bloques de preguntas frecuentes.",
    product: "Producto",
    audience: "Audiencia",
    problem: "Problema",
    benefit: "Beneficio",
    toneBold: "Audaz",
    toneCasual: "Casual",
    toneProfessional: "Profesional",
    generating: "Generando...",
    generate: "Generar copy",
    valueProps: "Propuestas de valor",
    features: "Funciones",
    cta: "CTA",
    testimonials: "Testimonios",
    faq: "Preguntas frecuentes",
  },
} as const;

export default function LandingCopyPage() {
  const { language } = useLanguage();
  const t = copy[language];

  const [form, setForm] = useState({
    product: "",
    audience: "",
    problem: "",
    benefit: "",
    tone: "bold",
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generate = async () => {
    setLoading(true);

    const res = await fetch("/api/landing-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setResult(data.copy);
    setLoading(false);
  };

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

      <input name="product" placeholder={t.product} onChange={handleChange} className={inputClass} />
      <input name="audience" placeholder={t.audience} onChange={handleChange} className={inputClass} />
      <input name="problem" placeholder={t.problem} onChange={handleChange} className={inputClass} />
      <input name="benefit" placeholder={t.benefit} onChange={handleChange} className={inputClass} />

      <select name="tone" value={form.tone} onChange={handleChange} className={inputClass}>
        <option value="bold">{t.toneBold}</option>
        <option value="casual">{t.toneCasual}</option>
        <option value="professional">{t.toneProfessional}</option>
      </select>

      <button
        type="button"
        onClick={generate}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded w-full"
      >
        {loading ? t.generating : t.generate}
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">{result.headline}</h2>
          <p>{result.subheadline}</p>

          <div>
            <h3 className="font-bold">{t.valueProps}</h3>
            <ul>
              {result.valueProps.map((v: string, i: number) => (
                <li key={i}>• {v}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold">{t.features}</h3>
            <ul>
              {result.features.map((f: string, i: number) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold">{t.cta}</h3>
            <p>{result.cta}</p>
          </div>

          <div>
            <h3 className="font-bold">{t.testimonials}</h3>
            <ul>
              {result.testimonials.map((tItem: string, i: number) => (
                <li key={i}>{tItem}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold">{t.faq}</h3>
            {result.faq.map((f: { q: string; a: string }, i: number) => (
              <div key={i}>
                <p className="font-semibold">{f.q}</p>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
