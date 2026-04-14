"use client";

import { useState } from "react";

export default function PaywallGenerator() {
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

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Paywall Link Generator</h1>

      <input
        placeholder="Product Title"
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price (USD)"
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <input
        placeholder="Redirect URL (after payment)"
        className="w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        onChange={(e) => setRedirectUrl(e.target.value)}
      />

      <button
        onClick={generate}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 w-full rounded"
      >
        Generate Paywall Link
      </button>

      {link && (
        <div className="break-all bg-gray-100 dark:bg-mono-800 p-3 rounded">
          <p className="text-sm">Your Paywall Link:</p>
          <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400">
            {link}
          </a>
        </div>
      )}
    </div>
  );
}
