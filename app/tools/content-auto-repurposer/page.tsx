"use client";

import { useState } from "react";

const textareaClass =
  "w-full min-h-[150px] border p-3 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function ContentAutoRepurposerPage() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const repurpose = async () => {
    setLoading(true);
    setResult("");
    setError("");

    const res = await fetch("/api/content-repurpose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }
    setResult(data.result || "");
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        Content Auto Repurposer
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm text-mono-700 dark:text-mono-300">
        <p>
          Paste one piece of content (tweet, blog snippet, or idea). You get a
          Twitter thread, LinkedIn post, Instagram caption, and email
          newsletter draft. Requires{" "}
          <code className="text-xs">OPENAI_API_KEY</code> on the server.
        </p>
      </section>

      <textarea
        id="content"
        className={textareaClass}
        placeholder="Paste your content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="button"
        onClick={repurpose}
        disabled={loading}
        className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? "Repurposing..." : "Repurpose"}
      </button>

      {error ? (
        <p className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-800 dark:text-red-200">
          {error}
        </p>
      ) : null}

      {result ? (
        <div>
          <h2 className="font-semibold text-mono-900 dark:text-mono-100 mb-2">
            Output
          </h2>
          <pre className="whitespace-pre-wrap rounded-lg border border-mono-300 dark:border-mono-700 bg-mono-50 dark:bg-mono-900 p-4 text-sm text-mono-900 dark:text-mono-100">
            {result}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
