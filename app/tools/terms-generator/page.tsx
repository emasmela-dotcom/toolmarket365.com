"use client";

import { useState } from "react";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function TermsGeneratorPage() {
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
        Terms Generator
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <p className="text-mono-700 dark:text-mono-300">
          Generate a basic Terms of Service document from business details.
        </p>
      </section>

      <input
        name="businessName"
        placeholder="Business Name"
        onChange={handleChange}
        className={inputClass}
      />
      <input
        name="websiteUrl"
        placeholder="Website URL"
        onChange={handleChange}
        className={inputClass}
      />
      <input
        name="country"
        placeholder="Country"
        onChange={handleChange}
        className={inputClass}
      />
      <input
        name="service"
        placeholder="What your service does"
        onChange={handleChange}
        className={inputClass}
      />

      <button
        type="button"
        onClick={generateTerms}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Terms"}
      </button>

      {terms && (
        <div className="space-y-3">
          <h2 className="font-semibold text-mono-900 dark:text-mono-100">
            Generated Terms
          </h2>
          <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-mono-300 dark:border-mono-700 bg-mono-50 dark:bg-mono-900 p-4 text-mono-900 dark:text-mono-100">
            {terms}
          </pre>
          <button
            type="button"
            onClick={copyToClipboard}
            className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
