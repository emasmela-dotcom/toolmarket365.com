"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Auto Follow-Up Sender",
    descriptionBefore: "Queues a single follow-up email after your delay. Uses",
    descriptionMid: "with",
    descriptionAfter:
      ". Sending is logged on the server until you plug in Resend or SendGrid.",
    emailPlaceholder: "Email",
    namePlaceholder: "Name",
    defaultMessage: "Hey {{name}}, just following up on this",
    delayPlaceholder: "Delay (hours)",
    scheduling: "Scheduling...",
    schedule: "Schedule Follow-Up",
    requestFailed: "Request failed",
    scheduledFor: "Scheduled for",
  },
  es: {
    title: "Envío automático de seguimientos",
    descriptionBefore: "Encola un solo correo de seguimiento tras tu demora. Usa",
    descriptionMid: "con",
    descriptionAfter:
      ". El envío se registra en el servidor hasta que conectes Resend o SendGrid.",
    emailPlaceholder: "Correo",
    namePlaceholder: "Nombre",
    defaultMessage: "Hola {{name}}, solo daba seguimiento a esto",
    delayPlaceholder: "Demora (horas)",
    scheduling: "Programando...",
    schedule: "Programar seguimiento",
    requestFailed: "La solicitud falló",
    scheduledFor: "Programado para",
  },
};

export default function AutoFollowUpSenderPage() {
  const { language } = useLanguage();
  const c = copy[language];
  const [form, setForm] = useState({
    email: "",
    name: "",
    message: copy.en.defaultMessage,
    delayHours: 24,
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((f) => {
      if (
        f.message === copy.en.defaultMessage ||
        f.message === copy.es.defaultMessage
      ) {
        return { ...f, message: c.defaultMessage };
      }
      return f;
    });
  }, [language, c.defaultMessage]);

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
      setStatus(data.error || c.requestFailed);
      setLoading(false);
      return;
    }
    setStatus(`${c.scheduledFor} ${data.scheduledFor ?? ""}`);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold text-mono-950 dark:text-mono-50">
        {c.title}
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm text-mono-700 dark:text-mono-300">
        <p>
          {c.descriptionBefore}{" "}
          <code className="text-xs">POST /api/followups</code> {c.descriptionMid}{" "}
          <code className="text-xs">delayMs</code>
          {c.descriptionAfter}
        </p>
      </section>

      <input
        placeholder={c.emailPlaceholder}
        className={inputClass}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder={c.namePlaceholder}
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
        placeholder={c.delayPlaceholder}
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
        {loading ? c.scheduling : c.schedule}
      </button>

      {status ? (
        <p className="text-sm text-mono-800 dark:text-mono-200">{status}</p>
      ) : null}
    </div>
  );
}
