"use client";

import { useState } from "react";

type Platform = "twitter" | "instagram" | "linkedin" | "email";
type Tone = "casual" | "professional" | "friendly" | "direct";

export default function ColdDMPersonalizer() {
  const [niche, setNiche] = useState("");
  const [target, setTarget] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [tone, setTone] = useState<Tone>("friendly");
  const [goal, setGoal] = useState("");
  const [dms, setDms] = useState<string[]>([]);

  const run = async () => {
    const res = await fetch("/api/cold-dm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, target, platform, tone, goal }),
    });

    const data = await res.json();
    setDms(data.dms ?? []);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Cold DM Personalizer</h1>

      <section className="mb-6 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Enter niche, target, platform, tone, and goal, then click Generate DMs.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>You get several personalized cold DM drafts ready to edit and send.</p>
        </div>
      </section>

      <input
        className="border p-2 w-full mb-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        placeholder="Niche (e.g. content creation)"
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        placeholder="Target (e.g. small creators)"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />

      <select
        className="border p-2 w-full mb-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        value={platform}
        onChange={(e) => setPlatform(e.target.value as Platform)}
      >
        <option value="instagram">Instagram</option>
        <option value="twitter">Twitter / X</option>
        <option value="linkedin">LinkedIn</option>
        <option value="email">Email</option>
      </select>

      <select
        className="border p-2 w-full mb-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50"
        value={tone}
        onChange={(e) => setTone(e.target.value as Tone)}
      >
        <option value="friendly">Friendly</option>
        <option value="casual">Casual</option>
        <option value="professional">Professional</option>
        <option value="direct">Direct</option>
      </select>

      <input
        className="border p-2 w-full mb-4 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400"
        placeholder="Goal (e.g. get reply, book a call)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

      <button
        type="button"
        onClick={run}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded w-full"
      >
        Generate DMs
      </button>

      <div className="mt-6 space-y-4">
        {dms.map((dm, i) => (
          <div
            key={i}
            className="border border-mono-200 dark:border-mono-700 p-3 rounded text-sm whitespace-pre-wrap"
          >
            {dm}
          </div>
        ))}
      </div>
    </div>
  );
}
