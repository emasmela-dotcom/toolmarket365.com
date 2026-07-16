"use client";

import { useState } from "react";
import { useLanguage } from '@/lib/i18n/LanguageContext';

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Privacy Policy Generator",
    description:
      "Fill out your business details and generate a usable privacy policy instantly.",
    businessNamePlaceholder: "Business Name",
    websitePlaceholder: "Website URL",
    emailPlaceholder: "Contact Email",
    dataCollectedPlaceholder: "What data do you collect? (optional)",
    generating: "Generating...",
    generate: "Generate Policy",
    generatedHeading: "Generated Policy",
    copy: "Copy",
  },
  es: {
    title: "Generador de política de privacidad",
    description:
      "Completa los datos de tu negocio y genera al instante una política de privacidad usable.",
    businessNamePlaceholder: "Nombre del negocio",
    websitePlaceholder: "URL del sitio web",
    emailPlaceholder: "Correo de contacto",
    dataCollectedPlaceholder: "¿Qué datos recopilas? (opcional)",
    generating: "Generando...",
    generate: "Generar política",
    generatedHeading: "Política generada",
    copy: "Copiar",
  },
};

export default function PrivacyPolicyGeneratorPage() {
  const { language } = useLanguage();
  const c = copy[language];
  const [form, setForm] = useState({
    businessName: "",
    website: "",
    email: "",
    dataCollected: "",
  });
  const [policy, setPolicy] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePolicy = async () => {
    setLoading(true);
    const res = await fetch("/api/privacy-policy-generator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setPolicy(data.policy ?? "");
    setLoading(false);
  };

  const copyToClipboard = async () => {
    if (!policy) return;
    await navigator.clipboard.writeText(policy);
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
        className={inputClass}
        type="text"
        name="businessName"
        placeholder={c.businessNamePlaceholder}
        onChange={handleChange}
      />

      <input
        className={inputClass}
        type="text"
        name="website"
        placeholder={c.websitePlaceholder}
        onChange={handleChange}
      />

      <input
        className={inputClass}
        type="email"
        name="email"
        placeholder={c.emailPlaceholder}
        onChange={handleChange}
      />

      <textarea
        className={`${inputClass} min-h-[100px]`}
        name="dataCollected"
        placeholder={c.dataCollectedPlaceholder}
        onChange={handleChange}
      />

      <button
        type="button"
        onClick={generatePolicy}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? c.generating : c.generate}
      </button>

      {policy && (
        <div className="space-y-3">
          <h2 className="font-semibold text-mono-900 dark:text-mono-100">
            {c.generatedHeading}
          </h2>
          <textarea
            value={policy}
            readOnly
            className="w-full h-72 border p-2 rounded border-mono-300 dark:border-mono-600 bg-mono-50 dark:bg-mono-900 text-mono-900 dark:text-mono-100"
          />
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
