"use client";

import { useState } from "react";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function LeadCaptureEmailSequencePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const res = await fetch("/api/lead-sequence/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Something went wrong");
      setLoading(false);
      return;
    }
    setStatus(data.message || "Lead captured!");
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-mono-950 dark:text-mono-50">
        Lead Capture → Email Sequence
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm text-mono-700 dark:text-mono-300">
        <p className="mb-2">
          Captures a lead and queues a simple sequence: Day 0, Day 1, Day 3. A
          background job runs every hour and sends due emails (no duplicate
          subjects per lead).
        </p>
        <p>
          Set <code className="text-xs">EMAIL_USER</code> and{" "}
          <code className="text-xs">EMAIL_PASS</code> for real sends; otherwise
          messages are logged on the server (same as other mail tools here).
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className={inputClass}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className={inputClass}
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black dark:bg-mono-100 p-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Join list"}
        </button>
      </form>

      {status ? (
        <p className="text-sm text-mono-800 dark:text-mono-200">{status}</p>
      ) : null}
    </div>
  );
}
