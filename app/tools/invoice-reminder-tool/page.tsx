"use client";

import { useCallback, useEffect, useState } from "react";
import type { Invoice } from "@/types/invoice";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function InvoiceReminderToolPage() {
  const [form, setForm] = useState({
    clientEmail: "",
    clientName: "",
    amount: "",
    description: "",
    dueDate: "",
  });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [reminderLoading, setReminderLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    const res = await fetch("/api/invoices");
    const data = await res.json();
    setInvoices(data.invoices || []);
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  async function handleSubmit() {
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/invoice/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMessage(typeof err.error === "string" ? err.error : "Could not create invoice.");
      return;
    }
    setMessage("Invoice created.");
    setForm({
      clientEmail: "",
      clientName: "",
      amount: "",
      description: "",
      dueDate: "",
    });
    await loadInvoices();
  }

  async function markPaid(id: string) {
    await fetch(`/api/invoice/${id}/pay`, { method: "POST" });
    await loadInvoices();
  }

  async function sendMock(id: string) {
    await fetch(`/api/invoice/${id}/send`, { method: "POST" });
    setMessage("Mock send logged (see server console).");
  }

  async function runReminders() {
    setReminderLoading(true);
    setMessage(null);
    await fetch("/api/reminders/run");
    await loadInvoices();
    setReminderLoading(false);
    setMessage("Reminders processed.");
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Invoice + Reminder Tool</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Create invoices, send a mock email (console), mark paid, or run the reminder job manually.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>
            Overdue pending invoices get mock reminders (up to 3) and move to <strong>overdue</strong>.
            Hook <code className="text-xs">GET /api/reminders/run</code> to Vercel Cron or another scheduler.
          </p>
        </div>
      </section>

      {message ? (
        <p className="text-sm text-mono-700 dark:text-mono-300">{message}</p>
      ) : null}

      <div className="space-y-3">
        <input
          placeholder="Client Name"
          className={inputClass}
          value={form.clientName}
          onChange={(e) => setForm({ ...form, clientName: e.target.value })}
        />
        <input
          placeholder="Client Email"
          type="email"
          className={inputClass}
          value={form.clientEmail}
          onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
        />
        <input
          placeholder="Amount"
          type="number"
          min="0"
          step="0.01"
          className={inputClass}
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <input
          placeholder="Description"
          className={inputClass}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="date"
          className={inputClass}
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create Invoice"}
        </button>

        <button
          type="button"
          onClick={runReminders}
          disabled={reminderLoading}
          className="w-full rounded-lg border border-mono-300 dark:border-mono-600 px-4 py-2 font-semibold text-mono-950 dark:text-mono-50 disabled:opacity-60"
        >
          {reminderLoading ? "Running…" : "Run reminders now (cron simulation)"}
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Invoices</h2>
        <div className="space-y-2">
          {invoices.length === 0 ? (
            <p className="text-sm text-mono-600 dark:text-mono-400">No invoices yet.</p>
          ) : (
            invoices.map((inv) => (
              <div
                key={inv.id}
                className="rounded-lg border border-mono-300 dark:border-mono-700 p-3 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{inv.clientName || inv.clientEmail}</p>
                    <p className="text-mono-600 dark:text-mono-400">${inv.amount}</p>
                    <p className="text-mono-600 dark:text-mono-400">
                      Due: {new Date(inv.dueDate).toLocaleDateString()}
                    </p>
                    <p className="text-mono-600 dark:text-mono-400">
                      Status: <span className="font-medium text-mono-950 dark:text-mono-50">{inv.status}</span> ·
                      Reminders: {inv.reminderCount}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    {inv.status !== "paid" ? (
                      <button
                        type="button"
                        className="rounded bg-accent-600 px-2 py-1 text-xs font-medium text-white hover:bg-accent-700"
                        onClick={() => markPaid(inv.id)}
                      >
                        Mark paid
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="rounded border border-mono-300 dark:border-mono-600 px-2 py-1 text-xs font-medium"
                      onClick={() => sendMock(inv.id)}
                    >
                      Send (mock)
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
