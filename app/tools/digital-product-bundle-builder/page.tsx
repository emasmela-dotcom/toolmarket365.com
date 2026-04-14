"use client";

import { useState } from "react";
import { buildBundle, type BundleProduct, type BundleResult } from "@/lib/digitalProductBundle";

export default function DigitalProductBundleBuilderPage() {
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
      <h1 className="text-xl font-bold">Digital Product Bundle Builder</h1>

      <section className="mb-4 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Add products with name, price, and category. Then click Generate Bundle.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>You get total price, discount, final bundle price, savings, and can export JSON.</p>
        </div>
      </section>

      <h3 className="font-semibold">Add Product</h3>
      <input
        placeholder="Name"
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Price"
        type="number"
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        placeholder="Category"
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button onClick={addProduct} className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 w-full rounded">
        Add
      </button>

      <h3 className="font-semibold">Products</h3>
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
        Generate Bundle
      </button>

      {bundle && (
        <div className="mt-4">
          <h3 className="font-semibold">Bundle Summary</h3>
          <p>Original Price: ${bundle.originalPrice.toFixed(2)}</p>
          <p>Discount: {(bundle.discount * 100).toFixed(0)}%</p>
          <p>Final Price: ${bundle.finalPrice.toFixed(2)}</p>
          <p>You Save: ${bundle.savings.toFixed(2)}</p>

          <button onClick={exportBundle} className="mt-2 bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded">
            Export JSON
          </button>
        </div>
      )}
    </div>
  );
}
