"use client";

import { useState } from "react";
import type { ChecklistItem } from "@/lib/onboarding";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Client Onboarding Checklist Generator",
    instructions: "Instructions",
    instructionsBody:
      "Enter business type, service, and client type, then generate a structured checklist.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody:
      "You get sections with concrete onboarding tasks tailored to your inputs.",
    businessTypePlaceholder: "Business Type",
    servicePlaceholder: "Service",
    clientTypePlaceholder: "Client Type",
    generate: "Generate Checklist",
    generating: "Generating…",
  },
  es: {
    title: "Generador de lista de onboarding de clientes",
    instructions: "Instrucciones",
    instructionsBody:
      "Ingresa el tipo de negocio, el servicio y el tipo de cliente, luego genera una lista estructurada.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody:
      "Obtienes secciones con tareas concretas de onboarding adaptadas a tus datos.",
    businessTypePlaceholder: "Tipo de negocio",
    servicePlaceholder: "Servicio",
    clientTypePlaceholder: "Tipo de cliente",
    generate: "Generar lista",
    generating: "Generando…",
  },
};

export default function ClientOnboardingChecklistGeneratorPage() {
  const { language } = useLanguage();
  const c = copy[language];
  const [form, setForm] = useState({
    businessType: "",
    service: "",
    clientType: "",
  });
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setChecklist(data.checklist || []);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{c.title}</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">{c.instructions}</h2>
          <p>{c.instructionsBody}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">{c.expectedOutcome}</h2>
          <p>{c.expectedOutcomeBody}</p>
        </div>
      </section>

      <input
        placeholder={c.businessTypePlaceholder}
        className={inputClass}
        value={form.businessType}
        onChange={(e) => setForm({ ...form, businessType: e.target.value })}
      />
      <input
        placeholder={c.servicePlaceholder}
        className={inputClass}
        value={form.service}
        onChange={(e) => setForm({ ...form, service: e.target.value })}
      />
      <input
        placeholder={c.clientTypePlaceholder}
        className={inputClass}
        value={form.clientType}
        onChange={(e) => setForm({ ...form, clientType: e.target.value })}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? c.generating : c.generate}
      </button>

      <div className="mt-6 space-y-4">
        {checklist.map((section, i) => (
          <div
            key={i}
            className="rounded-lg border border-mono-300 dark:border-mono-700 p-4"
          >
            <h2 className="font-semibold text-mono-950 dark:text-mono-50">{section.section}</h2>
            <ul className="list-disc ml-5 mt-2 text-mono-800 dark:text-mono-200">
              {section.tasks.map((task, j) => (
                <li key={j}>{task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
