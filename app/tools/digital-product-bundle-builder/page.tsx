"use client";

import { useState } from "react";
import { buildBundle, type BundleProduct, type BundleResult } from "@/lib/digitalProductBundle";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const copy = {
  en: {
    title: "Digital Product Bundle Builder",
    instructions: "Instructions",
    instructionsBody: "Add products with name, price, and category. Then click Generate Bundle.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBody: "You get total price, discount, final bundle price, savings, and can export JSON.",
    addProduct: "Add Product",
    namePlaceholder: "Name",
    pricePlaceholder: "Price",
    categoryPlaceholder: "Category",
    add: "Add",
    products: "Products",
    generateBundle: "Generate Bundle",
    bundleSummary: "Bundle Summary",
    originalPrice: (price: string) => `Original Price: $${price}`,
    discount: (pct: string) => `Discount: ${pct}%`,
    finalPrice: (price: string) => `Final Price: $${price}`,
    youSave: (amount: string) => `You Save: $${amount}`,
    exportJson: "Export JSON",
  },
  es: {
    title: "Constructor de paquetes de productos digitales",
    instructions: "Instrucciones",
    instructionsBody: "Agrega productos con nombre, precio y categoría. Luego haz clic en Generar paquete.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBody: "Obtienes precio total, descuento, precio final del paquete, ahorro y puedes exportar JSON.",
    addProduct: "Agregar producto",
    namePlaceholder: "Nombre",
    pricePlaceholder: "Precio",
    categoryPlaceholder: "Categoría",
    add: "Agregar",
    products: "Productos",
    generateBundle: "Generar paquete",
    bundleSummary: "Resumen del paquete",
    originalPrice: (price: string) => `Precio original: $${price}`,
    discount: (pct: string) => `Descuento: ${pct}%`,
    finalPrice: (price: string) => `Precio final: $${price}`,
    youSave: (amount: string) => `Ahorras: $${amount}`,
    exportJson: "Exportar JSON",
  },
};

export default function DigitalProductBundleBuilderPage() {
  const { language } = useLanguage();
  const c = copy[language];
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState<BundleProduct[]>([]);
  const [bundle, setBundle] = useState<BundleResult | null>(null);

  const addProduct = () => {
    if (!name.trim() || !price || !category.trim()) return;

    const product: BundleProduct = {
      id: crypto.randomUUID(),
      name: name.trim(),
      price: Number(price),
      category: category.trim(),
    };

    setProducts((prev) => [...prev, product]);
    setName("");
    setPrice("");
    setCategory("");
  };

  const generateBundle = () => {
    const result = buildBundle(products);
    setBundle(result);
  };

  const exportBundle = () => {
    if (!bundle) return;
    const data = JSON.stringify(bundle, null, 2);

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "bundle.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">{c.title}</h1>

      <section className="mb-4 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">{c.instructions}</h2>
          <p>{c.instructionsBody}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">{c.expectedOutcome}</h2>
          <p>{c.expectedOutcomeBody}</p>
        </div>
      </section>

      <h3 className="font-semibold">{c.addProduct}</h3>
      <input
        placeholder={c.namePlaceholder}
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder={c.pricePlaceholder}
        type="number"
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        placeholder={c.categoryPlaceholder}
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={addProduct} className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 w-full rounded">
        {c.add}
      </button>

      <h3 className="font-semibold">{c.products}</h3>
      <ul className="space-y-1">
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price} ({p.category})
          </li>
        ))}
      </ul>

      <button
        onClick={generateBundle}
        disabled={products.length === 0}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 w-full rounded disabled:opacity-50"
      >
        {c.generateBundle}
      </button>

      {bundle && (
        <div className="mt-4">
          <h3 className="font-semibold">{c.bundleSummary}</h3>
          <p>{c.originalPrice(bundle.originalPrice.toFixed(2))}</p>
          <p>{c.discount((bundle.discount * 100).toFixed(0))}</p>
          <p>{c.finalPrice(bundle.finalPrice.toFixed(2))}</p>
          <p>{c.youSave(bundle.savings.toFixed(2))}</p>

          <button onClick={exportBundle} className="mt-2 bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded">
            {c.exportJson}
          </button>
        </div>
      )}
    </div>
  );
}
