"use client";

import { useCallback, useEffect, useState } from "react";
import type { FollowUpRecord } from "@/types/followUp";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function FollowUpReminderAiPage() {
  const [form, setForm] = useState({
    userEmail: "",
    title: "",
    message: "",
    dueAt: "",
  });
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [cronLoading, setCronLoading] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/followups");
    const data = await res.json();
    setFollowUps(data.followUps || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function submit() {
    setLoading(true);
    setBanner(null);
    const res = await fetch("/api/followups/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setBanner(typeof err.error === "string" ? err.error : "Could not create follow-up.");
      return;
    }
    setBanner("Follow-up created.");
    setForm({ userEmail: "", title: "", message: "", dueAt: "" });
    await load();
  }

  async function runCron() {
    setCronLoading(true);
    setBanner(null);
    const res = await fetch("/api/cron/followups");
    const data = await res.json();
    setCronLoading(false);
    setBanner(`Processed due reminders. Sent: ${data.sent ?? 0}.`);
    await load();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Follow-Up Reminder AI</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Create follow-ups with email, title, message, and due time. Run the cron endpoint manually or on a schedule.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>
            Due unsent items are emailed (mock: server console) and marked sent. Vercel Cron:{" "}
            <code className="text-xs">GET /api/cron/followups</code>
          </p>
        </div>
        <p className="text-xs text-mono-600 dark:text-mono-400">
          MVP uses in-memory storage (no Prisma). Add Prisma + <code className="text-xs">RESEND_API_KEY</code> when you
          are ready.
        </p>
      </section>

      {banner ? (
        <p className="text-sm text-mono-700 dark:text-mono-300">{banner}</p>
      ) : null}

      <div className="space-y-2">
        <input
          placeholder="Email"
          type="email"
          className={inputClass}
          value={form.userEmail}
          onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
        />
        <input
          placeholder="Title"
          className={inputClass}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Message"
          className={`${inputClass} min-h-[100px]`}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <input
          type="datetime-local"
          className={inputClass}
          value={form.dueAt}
          onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
        />
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
        >
          {loading ? "Saving…" : "Create follow-up"}
        </button>
        <button
          type="button"
          onClick={runCron}
          disabled={cronLoading}
          className="w-full rounded-lg border border-mono-300 dark:border-mono-600 px-4 py-2 font-semibold text-mono-950 dark:text-mono-50 disabled:opacity-60"
        >
          {cronLoading ? "Running…" : "Run due reminders now (cron simulation)"}
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Your follow-ups</h2>
        <ul className="space-y-2">
          {followUps.length === 0 ? (
            <li className="text-sm text-mono-600 dark:text-mono-400">None yet.</li>
          ) : (
            followUps.map((f) => (
              <li
                key={f.id}
                className="rounded-lg border border-mono-300 dark:border-mono-700 p-3 text-sm"
              >
                <p className="font-semibold">{f.title}</p>
                <p className="text-mono-600 dark:text-mono-400">{f.userEmail}</p>
                <p className="text-xs mt-1">
                  Due: {new Date(f.dueAt).toLocaleString()} · Sent: {f.isSent ? "yes" : "no"}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
