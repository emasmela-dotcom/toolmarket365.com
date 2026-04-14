"use client";

import { useState } from "react";
import type { ActionItem, ActionItemsResult } from "@/lib/actionItems";

const inputClass =
  "w-full border p-3 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function MeetingSummaryActionItemsPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActionItemsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    const res = await fetch("/api/action-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Request failed");
      return;
    }

    setResult(data as ActionItemsResult);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Meeting Summary → Action Items</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Paste meeting notes or a transcript, then generate a short summary and structured action items.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Requirements</h2>
          <p>
            Requires <code className="text-xs">OPENAI_API_KEY</code> on the server.
          </p>
        </div>
      </section>

      {error ? (
        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
      ) : null}

      <textarea
        className={`${inputClass} h-64`}
        placeholder="Paste meeting notes here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? "Processing…" : "Generate action items"}
      </button>

      {result ? (
        <div className="mt-6 space-y-4">
          <div>
            <h2 className="font-semibold text-mono-950 dark:text-mono-50">Summary</h2>
            <p className="text-mono-800 dark:text-mono-200">{result.summary}</p>
          </div>

          <div>
            <h2 className="font-semibold text-mono-950 dark:text-mono-50">Action items</h2>
            <ul className="list-disc pl-5 space-y-2 text-mono-800 dark:text-mono-200">
              {result.actionItems?.map((item: ActionItem, i: number) => (
                <li key={i}>
                  <span className="font-semibold text-mono-950 dark:text-mono-50">{item.task}</span>
                  {item.owner ? ` — Owner: ${item.owner}` : ""}
                  {item.dueDate ? ` — Due: ${item.dueDate}` : ""}
                  {item.priority ? ` — (${item.priority})` : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
