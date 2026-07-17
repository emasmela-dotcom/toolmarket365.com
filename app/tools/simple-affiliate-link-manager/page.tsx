"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type AffiliateLink = {
  id: string;
  slug: string;
  url: string;
  title?: string;
  clicks: number;
  createdAt: number;
};

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Simple Affiliate Link Manager",
    instructions: "Instructions",
    instructionsBody: "Add a destination URL and optional title, then create a short link to track clicks.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody: "You get redirect links under /go/[slug] plus click counts in this dashboard.",
    urlPlaceholder: "Enter affiliate URL",
    titlePlaceholder: "Title (optional)",
    creating: "Creating...",
    createLink: "Create Link",
    clicks: (n: number) => `${n} clicks`,
  },
  es: {
    title: "Gestor simple de enlaces de afiliados",
    instructions: "Instrucciones",
    instructionsBody: "Agrega una URL de destino y un título opcional, luego crea un enlace corto para rastrear clics.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody: "Obtienes enlaces de redirección bajo /go/[slug] más conteos de clics en este panel.",
    urlPlaceholder: "Ingresa URL de afiliado",
    titlePlaceholder: "Título (opcional)",
    creating: "Creando...",
    createLink: "Crear enlace",
    clicks: (n: number) => `${n} clics`,
  },
};

export default function SimpleAffiliateLinkManagerPage() {
  const { language } = useLanguage();
  const c = copy[language];
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLinks = async () => {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data.links || []);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const createLink = async () => {
    if (!url.trim()) return;
    setLoading(true);
    await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, title }),
    });

    setUrl("");
    setTitle("");
    await fetchLinks();
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>

      <section className="mb-4 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1 text-mono-950 dark:text-mono-50">{c.instructions}</h2>
          <p className="text-mono-700 dark:text-mono-300">{c.instructionsBody}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1 text-mono-950 dark:text-mono-50">{c.expectedOutcome}</h2>
          <p className="text-mono-700 dark:text-mono-300">{c.expectedOutcomeBody}</p>
        </div>
      </section>

      <div className="space-y-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={c.urlPlaceholder}
          className={inputClass}
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={c.titlePlaceholder}
          className={inputClass}
        />
        <button
          type="button"
          onClick={createLink}
          disabled={loading}
          className="w-full bg-black dark:bg-mono-100 text-white dark:text-mono-950 py-2 rounded"
        >
          {loading ? c.creating : c.createLink}
        </button>
      </div>

      <div className="space-y-2 pt-2">
        {links.map((link) => (
          <div
            key={link.id}
            className="border border-mono-300 dark:border-mono-700 rounded p-3"
          >
            <a
              href={`/go/${link.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-accent-600 dark:text-accent-400 hover:underline break-all"
            >
              /go/{link.slug}
            </a>
            <p className="text-sm text-mono-700 dark:text-mono-300">{link.title || link.url}</p>
            <p className="text-sm text-mono-950 dark:text-mono-50">{c.clicks(link.clicks)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
