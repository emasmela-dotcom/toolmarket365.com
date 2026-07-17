"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Lead Capture → Email Sequence",
    description1:
      "Captures a lead and queues a simple sequence: Day 0, Day 1, Day 3. A background job runs every hour and sends due emails (no duplicate subjects per lead).",
    description2Prefix: "Set",
    description2Suffix:
      "for real sends; otherwise messages are logged on the server (same as other mail tools here).",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email",
    submitting: "Submitting...",
    joinList: "Join list",
    somethingWrong: "Something went wrong",
    leadCaptured: "Lead captured!",
  },
  es: {
    title: "Captura de leads → Secuencia de correos",
    description1:
      "Captura un lead y encola una secuencia simple: Día 0, Día 1, Día 3. Un trabajo en segundo plano se ejecuta cada hora y envía los correos pendientes (sin asuntos duplicados por lead).",
    description2Prefix: "Configura",
    description2Suffix:
      "para envíos reales; de lo contrario, los mensajes se registran en el servidor (igual que otras herramientas de correo aquí).",
    namePlaceholder: "Tu nombre",
    emailPlaceholder: "Tu correo electrónico",
    submitting: "Enviando...",
    joinList: "Unirse a la lista",
    somethingWrong: "Algo salió mal",
    leadCaptured: "¡Lead capturado!",
  },
};

export default function LeadCaptureEmailSequencePage() {
  const { language } = useLanguage();
  const c = copy[language];
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
      setStatus(data.error || c.somethingWrong);
      setLoading(false);
      return;
    }
    setStatus(data.message || c.leadCaptured);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-mono-950 dark:text-mono-50">
        {c.title}
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm text-mono-700 dark:text-mono-300">
        <p className="mb-2">
          {c.description1}
        </p>
        <p>
          {c.description2Prefix}{" "}
          <code className="text-xs">EMAIL_USER</code> {language === "en" ? "and" : "y"}{" "}
          <code className="text-xs">EMAIL_PASS</code> {c.description2Suffix}
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className={inputClass}
          placeholder={c.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className={inputClass}
          placeholder={c.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black dark:bg-mono-100 p-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
        >
          {loading ? c.submitting : c.joinList}
        </button>
      </form>

      {status ? (
        <p className="text-sm text-mono-800 dark:text-mono-200">{status}</p>
      ) : null}
    </div>
  );
}
