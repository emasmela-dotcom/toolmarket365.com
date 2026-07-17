"use client";

import ABTest from "@/components/ABTest";
import ABResults from "@/components/ABResults";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const copy = {
  en: {
    title: "Simple A/B Test Tool",
    description:
      "Assigns variant A or B, tracks impressions and conversions, and shows the current winner.",
  },
  es: {
    title: "Herramienta simple de prueba A/B",
    description:
      "Asigna la variante A o B, registra impresiones y conversiones, y muestra el ganador actual.",
  },
};

export default function SimpleABTestToolPage() {
  const { language } = useLanguage();
  const c = copy[language];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        {c.title}
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-2">
        <p className="text-mono-700 dark:text-mono-300">
          {c.description}
        </p>
      </section>

      <ABTest />
      <ABResults />
    </div>
  );
}
