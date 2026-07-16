"use client";

import { useState } from "react";
import { generateSeoMetaTags } from "@/lib/seoMetaTagGenerator";
import { useLanguage } from '@/lib/i18n/LanguageContext';

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "SEO Meta Tag Generator",
    instructionsHeading: "Instructions",
    instructions:
      "Fill in page details to instantly generate Primary Meta Tags, Open Graph, and Twitter tags for your head section.",
    titlePlaceholder: "Page Title",
    descriptionPlaceholder: "Meta Description",
    keywordsPlaceholder: "Keywords (comma separated)",
    authorPlaceholder: "Author",
    urlPlaceholder: "Page URL",
    imagePlaceholder: "Image URL (for social sharing)",
    generatedHeading: "Generated Meta Tags",
  },
  es: {
    title: "Generador de meta etiquetas SEO",
    instructionsHeading: "Instrucciones",
    instructions:
      "Completa los datos de la página para generar al instante etiquetas meta principales, Open Graph y Twitter para tu sección head.",
    titlePlaceholder: "Título de la página",
    descriptionPlaceholder: "Meta descripción",
    keywordsPlaceholder: "Palabras clave (separadas por comas)",
    authorPlaceholder: "Autor",
    urlPlaceholder: "URL de la página",
    imagePlaceholder: "URL de la imagen (para compartir en redes)",
    generatedHeading: "Meta etiquetas generadas",
  },
};

export default function SEOMetaTagGeneratorPage() {
  const { language } = useLanguage();
  const c = copy[language];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");

  const tags = generateSeoMetaTags({
    title,
    description,
    keywords,
    author,
    url,
    image,
  });

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        {c.title}
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1 text-mono-900 dark:text-mono-100">
            {c.instructionsHeading}
          </h2>
          <p className="text-mono-700 dark:text-mono-300">
            {c.instructions}
          </p>
        </div>
      </section>

      <div className="grid gap-3">
        <input
          className={inputClass}
          placeholder={c.titlePlaceholder}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={`${inputClass} min-h-[96px]`}
          placeholder={c.descriptionPlaceholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder={c.keywordsPlaceholder}
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder={c.authorPlaceholder}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder={c.urlPlaceholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder={c.imagePlaceholder}
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <h2 className="font-semibold mb-2 text-mono-900 dark:text-mono-100">
          {c.generatedHeading}
        </h2>
        <textarea
          className="w-full h-60 border p-2 rounded border-mono-300 dark:border-mono-600 bg-mono-50 dark:bg-mono-900 text-mono-900 dark:text-mono-100"
          readOnly
          value={tags}
        />
      </div>
    </div>
  );
}
