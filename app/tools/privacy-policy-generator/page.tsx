"use client";

import { useState } from "react";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function PrivacyPolicyGeneratorPage() {
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
        Privacy Policy Generator
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <p className="text-mono-700 dark:text-mono-300">
          Fill out your business details and generate a usable privacy policy
          instantly.
        </p>
      </section>

      <input
        className={inputClass}
        type="text"
        name="businessName"
        placeholder="Business Name"
        onChange={handleChange}
      />

      <input
        className={inputClass}
        type="text"
        name="website"
        placeholder="Website URL"
        onChange={handleChange}
      />

      <input
        className={inputClass}
        type="email"
        name="email"
        placeholder="Contact Email"
        onChange={handleChange}
      />

      <textarea
        className={`${inputClass} min-h-[100px]`}
        name="dataCollected"
        placeholder="What data do you collect? (optional)"
        onChange={handleChange}
      />

      <button
        type="button"
        onClick={generatePolicy}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Policy"}
      </button>

      {policy && (
        <div className="space-y-3">
          <h2 className="font-semibold text-mono-900 dark:text-mono-100">
            Generated Policy
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
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
