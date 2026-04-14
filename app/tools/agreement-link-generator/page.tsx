"use client";

import { useState } from "react";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function AgreementLinkGeneratorPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    dueAt: "",
  });
  const [link, setLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAgreement = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/agreement-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Could not create link.");
      setLink(null);
      setLoading(false);
      return;
    }
    setLink(data.link);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Agreement Link Generator</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Fill in the agreement details, then generate a shareable link for the other party.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>
            They open the link, review terms, and click <strong>I agree</strong> to update status.
          </p>
        </div>
      </section>

      <input
        placeholder="Title"
        className={inputClass}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Description"
        className={`${inputClass} min-h-[100px]`}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        placeholder="Amount ($)"
        className={inputClass}
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <input
        type="datetime-local"
        className={inputClass}
        value={form.dueAt}
        onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
      />

      {error ? <p className="text-sm text-red-700 dark:text-red-400">{error}</p> : null}

      <button
        type="button"
        onClick={createAgreement}
        disabled={loading}
        className="w-full rounded-lg bg-accent-600 px-4 py-2 font-semibold text-white hover:bg-accent-700 disabled:opacity-60"
      >
        {loading ? "Generating…" : "Generate Link"}
      </button>

      {link ? (
        <div className="mt-4 p-3 border border-mono-300 dark:border-mono-700 rounded-lg">
          <p className="text-sm text-mono-700 dark:text-mono-300">Share this link:</p>
          <a
            href={link}
            className="text-accent-600 dark:text-accent-400 break-all hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {link}
          </a>
        </div>
      ) : null}
    </div>
  );
}
