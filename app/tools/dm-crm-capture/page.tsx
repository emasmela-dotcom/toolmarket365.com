"use client";

import { useEffect, useState } from "react";
import type { DmLead } from "@/lib/dmCrmCapture";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const textareaClass =
  "w-full min-h-[120px] border p-3 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

const copy = {
  en: {
    title: "DM → CRM Capture",
    intro:
      'Simulates a DM webhook: paste raw DM text. The server extracts name (from "my name is …") and email, stores the lead in memory, and returns a suggested auto-reply.',
    webhookHint: "Point your platform webhook at",
    webhookBody: 'with',
    messagePlaceholder: "e.g. Hey, my name is Eric. My email is eric@email.com. I'm interested.",
    processing: "Processing...",
    processDm: "Process DM (webhook)",
    error: "Error",
    leadCaptured: "Lead captured",
    parsedLead: "Parsed lead",
    nameLabel: "Name:",
    emailLabel: "Email:",
    suggestedReply: "Suggested reply:",
    crmTitle: "CRM (this server instance)",
    noLeads: "No leads yet.",
    noEmail: "no email",
  },
  es: {
    title: "Captura DM → CRM",
    intro:
      'Simula un webhook de DM: pega el texto del DM. El servidor extrae el nombre (de "my name is …") y el correo, guarda el lead en memoria y devuelve una respuesta automática sugerida.',
    webhookHint: "Apunta el webhook de tu plataforma a",
    webhookBody: "con",
    messagePlaceholder: "p. ej. Hola, my name is Eric. My email is eric@email.com. I'm interested.",
    processing: "Procesando...",
    processDm: "Procesar DM (webhook)",
    error: "Error",
    leadCaptured: "Lead capturado",
    parsedLead: "Lead analizado",
    nameLabel: "Nombre:",
    emailLabel: "Correo:",
    suggestedReply: "Respuesta sugerida:",
    crmTitle: "CRM (esta instancia del servidor)",
    noLeads: "Aún no hay leads.",
    noEmail: "sin correo",
  },
};

export default function DmCrmCapturePage() {
  const { language } = useLanguage();
  const c = copy[language];
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [lastLead, setLastLead] = useState<DmLead | null>(null);
  const [leads, setLeads] = useState<DmLead[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const loadLeads = async () => {
    const res = await fetch("/api/dm-crm/leads");
    const data = await res.json();
    setLeads(data.leads ?? []);
  };

  useEffect(() => {
    void loadLeads();
  }, []);

  const simulateWebhook = async () => {
    setLoading(true);
    setStatus("");
    setReply("");
    setLastLead(null);

    const res = await fetch("/api/dm-crm/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || c.error);
      setLoading(false);
      return;
    }

    setLastLead(data.lead ?? null);
    setReply(data.reply ?? "");
    setStatus(c.leadCaptured);
    setLoading(false);
    await loadLeads();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-mono-950 dark:text-mono-50">
        {c.title}
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm text-mono-700 dark:text-mono-300">
        <p className="mb-2">{c.intro}</p>
        <p>
          {c.webhookHint}{" "}
          <code className="text-xs">POST /api/dm-crm/webhook</code> {c.webhookBody}{" "}
          <code className="text-xs">{"{ \"message\": \"...\" }"}</code>.
        </p>
      </section>

      <textarea
        className={textareaClass}
        placeholder={c.messagePlaceholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        type="button"
        onClick={simulateWebhook}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 p-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? c.processing : c.processDm}
      </button>

      {status ? (
        <p className="text-sm text-mono-800 dark:text-mono-200">{status}</p>
      ) : null}

      {lastLead ? (
        <div className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm">
          <p className="font-semibold text-mono-900 dark:text-mono-100">
            {c.parsedLead}
          </p>
          <p className="text-mono-800 dark:text-mono-200">
            {c.nameLabel} {lastLead.name}
          </p>
          <p className="text-mono-800 dark:text-mono-200">
            {c.emailLabel} {lastLead.email ?? "—"}
          </p>
          <p className="text-mono-800 dark:text-mono-200">
            {c.suggestedReply} {reply}
          </p>
        </div>
      ) : null}

      <div>
        <h2 className="font-semibold text-mono-900 dark:text-mono-100 mb-2">
          {c.crmTitle}
        </h2>
        <ul className="space-y-2 text-sm text-mono-800 dark:text-mono-200">
          {leads.length === 0 ? (
            <li>{c.noLeads}</li>
          ) : (
            leads.map((l, i) => (
              <li
                key={`${l.createdAt}-${i}`}
                className="rounded border border-mono-300 dark:border-mono-600 p-2"
              >
                <span className="font-medium">{l.name}</span> ·{" "}
                {l.email ?? c.noEmail}
                <br />
                <span className="text-mono-600 dark:text-mono-400">
                  {l.createdAt}
                </span>
                <br />
                {l.message}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
