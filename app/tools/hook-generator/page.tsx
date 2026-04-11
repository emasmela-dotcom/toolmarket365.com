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

      {Object.keys(form).map((key) => (
        <input
          key={key}
          placeholder={key}
          className="border p-2 mb-2 w-full"
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
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