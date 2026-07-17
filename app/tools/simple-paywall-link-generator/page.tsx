"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const copy = {
  en: {
    title: "Paywall Link Generator",
    productTitlePlaceholder: "Product Title",
    pricePlaceholder: "Price (USD)",
    redirectPlaceholder: "Redirect URL (after payment)",
    generate: "Generate Paywall Link",
    yourLink: "Your Paywall Link:",
  },
  es: {
    title: "Generador de enlaces con paywall",
    productTitlePlaceholder: "Título del producto",
    pricePlaceholder: "Precio (USD)",
    redirectPlaceholder: "URL de redirección (después del pago)",
    generate: "Generar enlace con paywall",
    yourLink: "Tu enlace con paywall:",
  },
};

export default function PaywallGenerator() {
  const { language } = useLanguage();
  const c = copy[language];
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(5);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [link, setLink] = useState("");

  const generate = async () => {
    const res = await fetch("/api/create-paywall", {
      method: "POST",
      body: JSON.stringify({ title, price, redirectUrl }),
    });

    const data = await res.json();
    setLink(data.url);
  };

  const inputClass =
    "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>

      <input
        placeholder={c.productTitlePlaceholder}
        className={inputClass}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder={c.pricePlaceholder}
        className={inputClass}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <input
        placeholder={c.redirectPlaceholder}
        className={inputClass}
        onChange={(e) => setRedirectUrl(e.target.value)}
      />

      <button
        onClick={generate}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 w-full rounded"
      >
        {c.generate}
      </button>

      {link && (
        <div className="break-all bg-gray-100 dark:bg-mono-800 p-3 rounded">
          <p className="text-sm text-mono-950 dark:text-mono-50">{c.yourLink}</p>
          <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400">
            {link}
          </a>
        </div>
      )}
    </div>
  );
}
