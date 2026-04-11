"use client";

import { useState } from "react";

export default function HookGenerator() {
  const [form, setForm] = useState({
    niche: "",
    audience: "",
    painPoint: "",
    desire: "",
  });

  const [hooks, setHooks] = useState<string[]>([]);

  const generate = async () => {
    const res = await fetch("/api/hooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setHooks(data.hooks ?? []);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Hook Generator</h1>

      <section className="mb-8 space-y-4 text-mono-800">
        <h2 className="text-lg font-semibold text-mono-950">What This Does</h2>
        <p className="text-sm">Generates viral hooks for:</p>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Tweets (X)</li>
          <li>Reels / TikTok</li>
        </ul>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Uses proven patterns (curiosity, controversy, numbers, pain points)</li>
          <li>
            Works instantly (no AI required, but I&apos;ll show how to upgrade it too)
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-mono-950 pt-2">🧠 Core Idea</h2>
        <p className="text-sm font-medium">Hooks = Templates + Variables</p>
        <p className="text-sm">Example:</p>
        <blockquote className="border-l-4 border-mono-300 pl-3 text-sm italic text-mono-700">
          &quot;Nobody talks about how [PAIN POINT] is ruining your [DESIRED RESULT]…&quot;
        </blockquote>
      </section>

      {(Object.keys(form) as (keyof typeof form)[]).map((key) => (
        <input
          key={key}
          placeholder={key}
          className="border p-2 mb-2 w-full"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ))}

      <button
        onClick={generate}
        className="bg-black text-white px-4 py-2 mt-2"
      >
        Generate Hooks
      </button>

      <div className="mt-4 space-y-2">
        {hooks.map((hook, i) => (
          <div key={i} className="border p-2">
            {hook}
          </div>
        ))}
      </div>
    </div>
  );
}
