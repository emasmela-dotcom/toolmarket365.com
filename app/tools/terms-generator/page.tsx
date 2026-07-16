"use client";

import { useState } from "react";
import { useLanguage } from '@/lib/i18n/LanguageContext';

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Terms Generator",
    description:
      "Generate a basic Terms of Service document from business details.",
    businessNamePlaceholder: "Business Name",
    websitePlaceholder: "Website URL",
    countryPlaceholder: "Country",
    servicePlaceholder: "What your service does",
    generating: "Generating...",
    generate: "Generate Terms",
    generatedHeading: "Generated Terms",
    copy: "Copy",
  },
  es: {
    title: "Generador de términos",
    description:
      "Genera un documento básico de Términos de Servicio a partir de los datos del negocio.",
    businessNamePlaceholder: "Nombre del negocio",
    websitePlaceholder: "URL del sitio web",
    countryPlaceholder: "País",
    servicePlaceholder: "Qué hace tu servicio",
    generating: "Generando...",
    generate: "Generar términos",
    generatedHeading: "Términos generados",
    copy: "Copiar",
  },
};

export default function TermsGeneratorPage() {
  const { language } = useLanguage();
  const c = copy[language];
  const [form, setForm] = useState({
    businessName: "",
    websiteUrl: "",
    country: "",
    service: "",
  });
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateTerms = async () => {
    setLoading(true);
    const res = await fetch("/api/generate-terms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setTerms(data.terms ?? "");
    setLoading(false);
  };

  const copyToClipboard = async () => {
    if (!terms) return;
    await navigator.clipboard.writeText(terms);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        {c.title}
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <p className="text-mono-700 dark:text-mono-300">
          {c.description}
        </p>
      </section>

      <input
        name="businessName"
        placeholder={c.businessNamePlaceholder}
        onChange={handleChange}
        className={inputClass}
      />
      <input
        name="websiteUrl"
        placeholder={c.websitePlaceholder}
        onChange={handleChange}
        className={inputClass}
      />
      <input
        name="country"
        placeholder={c.countryPlaceholder}
        onChange={handleChange}
        className={inputClass}
      />
      <input
        name="service"
        placeholder={c.servicePlaceholder}
        onChange={handleChange}
        className={inputClass}
      />

      <button
        type="button"
        onClick={generateTerms}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? c.generating : c.generate}
      </button>

      {terms && (
        <div className="space-y-3">
          <h2 className="font-semibold text-mono-900 dark:text-mono-100">
            {c.generatedHeading}
          </h2>
          <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-mono-300 dark:border-mono-700 bg-mono-50 dark:bg-mono-900 p-4 text-mono-900 dark:text-mono-100">
            {terms}
          </pre>
          <button
            type="button"
            onClick={copyToClipboard}
            className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950"
          >
            {c.copy}
          </button>
        </div>
      )}
    </div>
  );
}
