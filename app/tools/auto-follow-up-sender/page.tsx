"use client";

import { useState } from "react";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function AutoFollowUpSenderPage() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    message: "Hey {{name}}, just following up on this",
    delayHours: 24,
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setStatus("");
    const res = await fetch("/api/followups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        name: form.name,
        message: form.message,
        delayMs: form.delayHours * 60 * 60 * 1000,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Request failed");
      setLoading(false);
      return;
    }
    setStatus(`Scheduled for ${data.scheduledFor ?? ""}`);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold text-mono-950 dark:text-mono-50">
        Auto Follow-Up Sender
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm text-mono-700 dark:text-mono-300">
        <p>
          Queues a single follow-up email after your delay. Uses{" "}
          <code className="text-xs">POST /api/followups</code> with{" "}
          <code className="text-xs">delayMs</code>. Sending is logged on the
          server until you plug in Resend or SendGrid.
        </p>
      </section>

      <input
        placeholder="Email"
        className={inputClass}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Name"
        className={inputClass}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <textarea
        className={`${inputClass} min-h-[100px]`}
        rows={4}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      <input
        type="number"
        placeholder="Delay (hours)"
        className={inputClass}
        value={form.delayHours}
        onChange={(e) =>
          setForm({ ...form, delayHours: Number(e.target.value) || 0 })
        }
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 p-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? "Scheduling..." : "Schedule Follow-Up"}
      </button>

      {status ? (
        <p className="text-sm text-mono-800 dark:text-mono-200">{status}</p>
      ) : null}
    </div>
  );
}
