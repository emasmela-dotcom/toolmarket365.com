"use client";

import { useState } from "react";

export default function NewsletterGenerator() {
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("");
  const [topics, setTopics] = useState<string[]>([]);

  const generate = async () => {
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, audience, goal }),
    });

    const data = await res.json();
    setTopics((data.topics ?? []).map((t: { title: string }) => t.title));
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Newsletter Topic Generator</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Niche (e.g. Fitness)"
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Audience (e.g. Busy professionals)"
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Goal (optional)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <button
        type="button"
        onClick={generate}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Generate Topics
      </button>

      <div className="mt-6">
        {topics.map((topic, i) => (
          <div key={i} className="border-b py-2">
            {topic}
          </div>
        ))}
      </div>
    </div>
  );
}
