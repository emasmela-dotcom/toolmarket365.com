"use client";

import { useCallback, useEffect, useState } from "react";
import type { LatePaymentInvoice } from "@/lib/latePaymentInvoices";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const copy = {
  en: {
    title: "Late Payment Nudger (auto messages)",
    instructions: "Instructions",
    instructionsBody:
      "Overdue pending invoices get reminder emails (mock in console unless EMAIL_USER + EMAIL_PASS are set for Gmail).",
    cron: "Cron",
    cronBody:
      "Schedule GET /api/nudge (e.g. Vercel Cron). Reminders throttle to once every 3 days per invoice.",
    banner:
      "Nudger ran — check server logs for mock emails or your inbox if Gmail is configured.",
    running: "Running…",
    runNudger: "Run nudger now (cron simulation)",
    invoicesTitle: "Invoices (in-memory)",
    due: "Due",
    status: "Status:",
    lastReminder: (date: string) => ` · Last reminder: ${date}`,
  },
  es: {
    title: "Recordatorio de pagos atrasados (mensajes automáticos)",
    instructions: "Instrucciones",
    instructionsBody:
      "Las facturas pendientes vencidas reciben correos de recordatorio (simulados en consola a menos que EMAIL_USER + EMAIL_PASS estén configurados para Gmail).",
    cron: "Cron",
    cronBody:
      "Programa GET /api/nudge (p. ej. Vercel Cron). Los recordatorios se limitan a una vez cada 3 días por factura.",
    banner:
      "El recordatorio se ejecutó — revisa los registros del servidor para correos simulados o tu bandeja de entrada si Gmail está configurado.",
    running: "Ejecutando…",
    runNudger: "Ejecutar recordatorio ahora (simulación cron)",
    invoicesTitle: "Facturas (en memoria)",
    due: "Vence",
    status: "Estado:",
    lastReminder: (date: string) => ` · Último recordatorio: ${date}`,
  },
};

export default function LatePaymentNudgerPage() {
  const { language } = useLanguage();
  const c = copy[language];
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
    setBanner(c.banner);
    setRunning(false);
    await load();
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{c.title}</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">{c.instructions}</h2>
          <p>
            {language === "en" ? (
              <>
                Overdue pending invoices get reminder emails (mock in console unless{" "}
                <code className="text-xs">EMAIL_USER</code> + <code className="text-xs">EMAIL_PASS</code> are set for
                Gmail).
              </>
            ) : (
              <>
                Las facturas pendientes vencidas reciben correos de recordatorio (simulados en consola a menos que{" "}
                <code className="text-xs">EMAIL_USER</code> + <code className="text-xs">EMAIL_PASS</code> estén configurados para
                Gmail).
              </>
            )}
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">{c.cron}</h2>
          <p>
            {language === "en" ? (
              <>
                Schedule <code className="text-xs">GET /api/nudge</code> (e.g. Vercel Cron). Reminders throttle to once
                every 3 days per invoice.
              </>
            ) : (
              <>
                Programa <code className="text-xs">GET /api/nudge</code> (p. ej. Vercel Cron). Los recordatorios se limitan a una vez
                cada 3 días por factura.
              </>
            )}
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
        {running ? c.running : c.runNudger}
      </button>

      <div>
        <h2 className="text-lg font-bold mb-2">{c.invoicesTitle}</h2>
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
                {inv.customerEmail} · ${inv.amount} · {c.due} {inv.dueDate}
              </p>
              <p className="text-xs mt-1">
                {c.status} {inv.status}
                {inv.lastReminderSent
                  ? c.lastReminder(new Date(inv.lastReminderSent).toLocaleString())
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
