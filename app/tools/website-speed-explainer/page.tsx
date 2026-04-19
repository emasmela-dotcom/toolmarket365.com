"use client";

import { useState } from "react";
import type { SpeedIssue } from "@/lib/speedExplainer";

const inputClass =
  "border p-2 w-full rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function WebsiteSpeedExplainerPage() {
  const [form, setForm] = useState({
    loadTime: "",
    imageSizeMB: "",
    numRequests: "",
    usesCDN: false,
    renderBlocking: false,
  });

  const [report, setReport] = useState<SpeedIssue[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/speed-explainer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loadTime: Number(form.loadTime),
        imageSizeMB: Number(form.imageSizeMB),
        numRequests: Number(form.numRequests),
        usesCDN: form.usesCDN,
        renderBlocking: form.renderBlocking,
      }),
    });

    const data = await res.json();
    setReport(data.report ?? []);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        Website Speed Explainer
      </h1>

      <input
        placeholder="Load Time (seconds)"
        className={inputClass}
        onChange={(e) => setForm({ ...form, loadTime: e.target.value })}
      />

      <input
        placeholder="Image Size (MB)"
        className={inputClass}
        onChange={(e) => setForm({ ...form, imageSizeMB: e.target.value })}
      />

      <input
        placeholder="Number of Requests"
        className={inputClass}
        onChange={(e) => setForm({ ...form, numRequests: e.target.value })}
      />

      <label className="block text-mono-900 dark:text-mono-100">
        <input
          type="checkbox"
          className="mr-2"
          onChange={(e) => setForm({ ...form, usesCDN: e.target.checked })}
        />
        Uses CDN
      </label>

      <label className="block text-mono-900 dark:text-mono-100">
        <input
          type="checkbox"
          className="mr-2"
          onChange={(e) =>
            setForm({ ...form, renderBlocking: e.target.checked })
          }
        />
        Render Blocking Resources
      </label>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white dark:bg-mono-100 dark:text-mono-950 px-4 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      <div className="mt-6 space-y-4">
        {report.map((item, i) => (
          <div
            key={i}
            className="border border-mono-300 dark:border-mono-700 p-4 rounded"
          >
            <h2 className="font-semibold text-mono-900 dark:text-mono-100">
              {item.issue}
            </h2>
            <p className="text-sm text-mono-600 dark:text-mono-400">
              {item.explanation}
            </p>
            <p className="text-sm mt-2 text-mono-800 dark:text-mono-200">
              {item.fix}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
