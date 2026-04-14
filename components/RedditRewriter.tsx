"use client";

import { useState } from "react";

export default function RedditRewriter() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleRewrite = async () => {
    const res = await fetch("/api/rewrite-reddit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post: input, variations: 3 }),
    });

    const data = await res.json();
    if (data.error) {
      setResults([]);
      return;
    }
    setResults(data.rewritten ?? []);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Reddit Post Rewriter</h1>

      <section className="mb-6 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Paste your Reddit post text and click Rewrite Post.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>You get multiple rewritten variations with adjusted wording and structure.</p>
        </div>
      </section>

      <p className="text-sm text-mono-600 dark:text-mono-400 mb-4">
        Local rewrites: synonyms, light restructuring, tone tweaks—no external
        API. Use for drafts; always follow subreddit rules.
      </p>

      <textarea
        className="w-full border border-mono-300 dark:border-mono-600 p-2 mb-4 rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        rows={6}
        placeholder="Paste your Reddit post..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        type="button"
        onClick={handleRewrite}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded"
      >
        Rewrite Post
      </button>

      <div className="mt-6 space-y-4">
        {results.map((r, i) => (
          <div
            key={i}
            className="border border-mono-200 dark:border-mono-700 p-3 rounded whitespace-pre-wrap text-sm"
          >
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}
