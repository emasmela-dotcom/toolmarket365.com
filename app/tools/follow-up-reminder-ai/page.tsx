"use client";

import { useCallback, useEffect, useState } from "react";
import type { FollowUpRecord } from "@/types/followUp";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Follow-Up Reminder AI",
    instructions: "Instructions",
    instructionsBody:
      "Create follow-ups with email, title, message, and due time. Run the cron endpoint manually or on a schedule.",
    expectedOutcome: "Expected Outcome",
    expectedOutcomeBefore:
      "Due unsent items are emailed (mock: server console) and marked sent. Vercel Cron:",
    mvpNoteBefore: "MVP uses in-memory storage (no Prisma). Add Prisma +",
    mvpNoteAfter: "when you are ready.",
    emailPlaceholder: "Email",
    titlePlaceholder: "Title",
    messagePlaceholder: "Message",
    saving: "Saving…",
    create: "Create follow-up",
    running: "Running…",
    runCron: "Run due reminders now (cron simulation)",
    listHeading: "Your follow-ups",
    noneYet: "None yet.",
    due: "Due:",
    sent: "Sent:",
    yes: "yes",
    no: "no",
    createError: "Could not create follow-up.",
    created: "Follow-up created.",
    processed: "Processed due reminders. Sent:",
  },
  es: {
    title: "Recordatorios de seguimiento con IA",
    instructions: "Instrucciones",
    instructionsBody:
      "Crea seguimientos con correo, título, mensaje y fecha límite. Ejecuta el endpoint de cron manualmente o según un horario.",
    expectedOutcome: "Resultado esperado",
    expectedOutcomeBefore:
      "Los pendientes vencidos se envían por correo (prueba: consola del servidor) y se marcan como enviados. Vercel Cron:",
    mvpNoteBefore: "El MVP usa almacenamiento en memoria (sin Prisma). Añade Prisma +",
    mvpNoteAfter: "cuando estés listo.",
    emailPlaceholder: "Correo",
    titlePlaceholder: "Título",
    messagePlaceholder: "Mensaje",
    saving: "Guardando…",
    create: "Crear seguimiento",
    running: "Ejecutando…",
    runCron: "Ejecutar recordatorios vencidos ahora (simulación de cron)",
    listHeading: "Tus seguimientos",
    noneYet: "Aún no hay ninguno.",
    due: "Vence:",
    sent: "Enviado:",
    yes: "sí",
    no: "no",
    createError: "No se pudo crear el seguimiento.",
    created: "Seguimiento creado.",
    processed: "Recordatorios vencidos procesados. Enviados:",
  },
};

export default function FollowUpReminderAiPage() {
  const { language } = useLanguage();
  const c = copy[language];
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
      setBanner(typeof err.error === "string" ? err.error : c.createError);
      return;
    }
    setBanner(c.created);
    setForm({ userEmail: "", title: "", message: "", dueAt: "" });
    await load();
  }

  async function runCron() {
    setCronLoading(true);
    setBanner(null);
    const res = await fetch("/api/cron/followups");
    const data = await res.json();
    setCronLoading(false);
    setBanner(`${c.processed} ${data.sent ?? 0}.`);
    await load();
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{c.title}</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">{c.instructions}</h2>
          <p>{c.instructionsBody}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">{c.expectedOutcome}</h2>
          <p>
            {c.expectedOutcomeBefore}{" "}
            <code className="text-xs">GET /api/cron/followups</code>
          </p>
        </div>
        <p className="text-xs text-mono-600 dark:text-mono-400">
          {c.mvpNoteBefore} <code className="text-xs">RESEND_API_KEY</code>{" "}
          {c.mvpNoteAfter}
        </p>
      </section>

      {banner ? (
        <p className="text-sm text-mono-700 dark:text-mono-300">{banner}</p>
      ) : null}

      <div className="space-y-2">
        <input
          placeholder={c.emailPlaceholder}
          type="email"
          className={inputClass}
          value={form.userEmail}
          onChange={(e) => setForm({ ...form, userEmail: e.target.value })}
        />
        <input
          placeholder={c.titlePlaceholder}
          className={inputClass}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder={c.messagePlaceholder}
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
          {loading ? c.saving : c.create}
        </button>
        <button
          type="button"
          onClick={runCron}
          disabled={cronLoading}
          className="w-full rounded-lg border border-mono-300 dark:border-mono-600 px-4 py-2 font-semibold text-mono-950 dark:text-mono-50 disabled:opacity-60"
        >
          {cronLoading ? c.running : c.runCron}
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">{c.listHeading}</h2>
        <ul className="space-y-2">
          {followUps.length === 0 ? (
            <li className="text-sm text-mono-600 dark:text-mono-400">{c.noneYet}</li>
          ) : (
            followUps.map((f) => (
              <li
                key={f.id}
                className="rounded-lg border border-mono-300 dark:border-mono-700 p-3 text-sm"
              >
                <p className="font-semibold">{f.title}</p>
                <p className="text-mono-600 dark:text-mono-400">{f.userEmail}</p>
                <p className="text-xs mt-1">
                  {c.due} {new Date(f.dueAt).toLocaleString()} · {c.sent}{" "}
                  {f.isSent ? c.yes : c.no}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
