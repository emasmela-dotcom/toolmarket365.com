"use client";

import { useState } from "react";

type IdeaBuckets = Record<string, string[]>;

const BUCKET_ORDER = [
  "viral",
  "reels",
  "educational",
  "authority",
  "monetization",
] as const;

const BUCKET_LABELS: Record<(typeof BUCKET_ORDER)[number], string> = {
  viral: "Viral post ideas",
  educational: "Carousel ideas",
  reels: "Reel / TikTok ideas",
  authority: "Authority-building content",
  monetization: "Monetization ideas",
};

export default function ContentIdeaEnginePage() {
  const [niche, setNiche] = useState("");
  const [ideas, setIdeas] = useState<IdeaBuckets | null>(null);

  const generate = async () => {
    const res = await fetch("/api/content-ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche }),
    });
    const data = await res.json();
    setIdeas(data.ideas ?? null);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Content Idea Engine</h1>

      <section className="mb-8 space-y-4 text-mono-800 dark:text-mono-200">
        <h2 className="text-lg font-semibold text-mono-950 dark:text-mono-50">What This Does</h2>
        <p className="text-sm font-medium">Input:</p>
        <pre className="text-xs bg-mono-100 dark:bg-mono-800 border border-mono-200 dark:border-mono-600 p-3 rounded overflow-x-auto text-mono-900 dark:text-mono-100">
{`{
  niche: "fitness"
}`}
        </pre>
        <p className="text-sm font-medium">Output:</p>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Viral post ideas</li>
          <li>Reel / TikTok ideas</li>
          <li>Carousel ideas</li>
          <li>Authority-building content</li>
          <li>Monetization ideas</li>
        </ul>
      </section>

      <input
        placeholder="niche (e.g. fitness)"
        className="border border-mono-300 dark:border-mono-600 p-2 mb-2 w-full rounded bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
      />

      <button
        onClick={generate}
        className="bg-black text-white px-4 py-2 mt-2"
      >
        Generate ideas
      </button>

      {ideas && (
        <div className="mt-6 space-y-6">
          {BUCKET_ORDER.map((bucket) => {
            const lines = ideas[bucket];
            if (!lines?.length) return null;
            return (
              <div key={bucket}>
                <h2 className="font-semibold mb-2 text-mono-950 dark:text-mono-50">
                  {BUCKET_LABELS[bucket]}
                </h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-mono-800 dark:text-mono-200">
                  {lines.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
