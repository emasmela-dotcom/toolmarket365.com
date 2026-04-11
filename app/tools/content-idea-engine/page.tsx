"use client";

import { useState } from "react";

type IdeaBuckets = Record<string, string[]>;

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

      <input
        placeholder="niche (e.g. fitness)"
        className="border p-2 mb-2 w-full"
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
          {Object.entries(ideas).map(([bucket, lines]) => (
            <div key={bucket}>
              <h2 className="font-semibold capitalize mb-2">{bucket}</h2>
              <ul className="list-disc pl-5 space-y-1">
                {lines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
