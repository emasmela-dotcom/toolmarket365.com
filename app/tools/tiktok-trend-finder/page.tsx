"use client";

import { useState } from "react";

type TikTokTrend = {
  label: string;
  description: string;
  hashtags: string[];
  suggestedFormat: string;
  momentum: string;
};

export default function TikTokTrendFinderPage() {
  const [niche, setNiche] = useState("");
  const [focus, setFocus] = useState<"sounds" | "hashtags" | "formats" | "all">(
    "all"
  );
  const [trends, setTrends] = useState<TikTokTrend[]>([]);

  const run = async () => {
    const res = await fetch("/api/tiktok-trends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, focus, count: 6 }),
    });
    const data = await res.json();
    setTrends(data.trends ?? []);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">TikTok Trend Finder</h1>
      <p className="text-sm text-mono-600 dark:text-mono-400 mb-6">
        Angle ideas, formats, and hashtag stacks tailored to your niche—built
        for fast iteration (no live TikTok API; offline templates + your
        inputs).
      </p>

      <input
        placeholder="Your niche (e.g. fitness coaching, SaaS, skincare)"
        className="border border-mono-300 dark:border-mono-600 p-2 w-full mb-2 rounded bg-white dark:bg-mono-900"
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
      />

      <select
        className="border border-mono-300 dark:border-mono-600 p-2 w-full mb-4 rounded bg-white dark:bg-mono-900"
        value={focus}
        onChange={(e) =>
          setFocus(e.target.value as typeof focus)
        }
      >
        <option value="all">All signals</option>
        <option value="sounds">Sound / audio angles</option>
        <option value="hashtags">Hashtag / discovery</option>
        <option value="formats">Video formats</option>
      </select>

      <button
        type="button"
        onClick={run}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 w-full rounded font-medium"
      >
        Find trends
      </button>

      <div className="mt-6 space-y-4">
        {trends.map((t, i) => (
          <div
            key={i}
            className="border border-mono-200 dark:border-mono-700 rounded-lg p-4 space-y-2"
          >
            <div className="flex justify-between gap-2 items-start">
              <h2 className="font-semibold text-mono-950 dark:text-mono-50">
                {t.label}
              </h2>
              <span className="text-xs uppercase tracking-wide px-2 py-0.5 rounded bg-mono-100 dark:bg-mono-800 text-mono-600 dark:text-mono-300 shrink-0">
                {t.momentum}
              </span>
            </div>
            <p className="text-sm text-mono-700 dark:text-mono-300">
              {t.description}
            </p>
            <p className="text-sm text-mono-600 dark:text-mono-400">
              <span className="font-medium text-mono-800 dark:text-mono-200">
                Format:{" "}
              </span>
              {t.suggestedFormat}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {t.hashtags.map((h) => (
                <span
                  key={h}
                  className="text-xs px-2 py-0.5 rounded-full bg-accent-50 dark:bg-accent-900/30 text-accent-800 dark:text-accent-200"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
