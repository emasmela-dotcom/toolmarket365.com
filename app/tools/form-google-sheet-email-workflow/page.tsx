"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "Form → Google Sheet → Email",
    intro1:
      "Submissions append a row to your Google Sheet (Name, Email, Message, Date) then send a confirmation email to the submitter.",
    intro2Before:
      "Set",
    intro2Or: "or",
    intro2After:
      "(service account key JSON), and share the sheet with the service account email. Use",
    intro2End: "for mail (or entries log as mock).",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    messagePlaceholder: "Message",
    submitting: "Submitting...",
    submit: "Submit",
    error: "Error",
    submitted: "Submitted!",
  },
  es: {
    title: "Formulario → Google Sheet → Email",
    intro1:
      "Los envíos agregan una fila a tu Google Sheet (Nombre, Email, Mensaje, Fecha) y luego envían un email de confirmación al remitente.",
    intro2Before: "Configura",
    intro2Or: "o",
    intro2After:
      "(JSON de clave de cuenta de servicio) y comparte la hoja con el email de la cuenta de servicio. Usa",
    intro2End: "para el correo (o los envíos se registran como simulación).",
    namePlaceholder: "Nombre",
    emailPlaceholder: "Email",
    messagePlaceholder: "Mensaje",
    submitting: "Enviando...",
    submit: "Enviar",
    error: "Error",
    submitted: "¡Enviado!",
  },
};

export default function FormGoogleSheetEmailWorkflowPage() {
  const { language } = useLanguage();
  const c = copy[language];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const res = await fetch("/api/form-sheet-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const result = await res.json();
    if (!res.ok) {
      setStatus(result.error || c.error);
      setLoading(false);
      return;
    }
    setStatus(result.success ? c.submitted : c.error);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-mono-950 dark:text-mono-50">{c.title}</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm text-mono-700 dark:text-mono-300 space-y-2">
        <p>{c.intro1}</p>
        <p>
          {c.intro2Before}{" "}
          <code className="text-xs">GOOGLE_SHEET_ID</code> ({c.intro2Or}{" "}
          <code className="text-xs">SHEET_ID</code>),{" "}
          <code className="text-xs">GOOGLE_SERVICE_ACCOUNT_JSON</code>{" "}
          {c.intro2After}{" "}
          <code className="text-xs">EMAIL_USER</code> /{" "}
          <code className="text-xs">EMAIL_PASS</code> {c.intro2End}
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
        <textarea
          className={`${inputClass} min-h-[96px]`}
          placeholder={c.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black dark:bg-mono-100 p-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
        >
          {loading ? c.submitting : c.submit}
        </button>
      </form>

      {status ? (
        <p className="text-sm text-mono-800 dark:text-mono-200">{status}</p>
      ) : null}
    </div>
  );
}
