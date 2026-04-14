"use client";

import { useCallback, useEffect, useState } from "react";
import type { LatePaymentInvoice } from "@/lib/latePaymentInvoices";

export default function LatePaymentNudgerPage() {
  const [rows, setRows] = useState<LatePaymentInvoice[]>([]);
  const [banner, setBanner] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/late-payment-invoices");
    const data = await res.json();
    setRows(data.invoices || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function runNudger() {
    setRunning(true);
    setBanner(null);
    await fetch("/api/nudge");
    setBanner("Nudger ran — check server logs for mock emails or your inbox if Gmail is configured.");
    setRunning(false);
    await load();
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Late Payment Nudger (auto messages)</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>
            Overdue pending invoices get reminder emails (mock in console unless{" "}
            <code className="text-xs">EMAIL_USER</code> + <code className="text-xs">EMAIL_PASS</code> are set for
            Gmail).
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Cron</h2>
          <p>
            Schedule <code className="text-xs">GET /api/nudge</code> (e.g. Vercel Cron). Reminders throttle to once
            every 3 days per invoice.
          </p>
        </div>
      </section>

      {banner ? <p className="text-sm text-mono-700 dark:text-mono-300">{banner}</p> : null}

      <button
        type="button"
        onClick={runNudger}
        disabled={running}
        className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {running ? "Running…" : "Run nudger now (cron simulation)"}
      </button>

      <div>
        <h2 className="text-lg font-bold mb-2">Invoices (in-memory)</h2>
        <ul className="space-y-2 text-sm">
          {rows.map((inv) => (
            <li
              key={inv.id}
              className="rounded-lg border border-mono-300 dark:border-mono-700 p-3"
            >
              <p className="font-semibold">
                {inv.customerName} · {inv.id}
              </p>
              <p className="text-mono-600 dark:text-mono-400">
                {inv.customerEmail} · ${inv.amount} · Due {inv.dueDate}
              </p>
              <p className="text-xs mt-1">
                Status: {inv.status}
                {inv.lastReminderSent
                  ? ` · Last reminder: ${new Date(inv.lastReminderSent).toLocaleString()}`
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
