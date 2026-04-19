"use client";

import { useEffect, useState } from "react";
import type { DmLead } from "@/lib/dmCrmCapture";

const textareaClass =
  "w-full min-h-[120px] border p-3 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function DmCrmCapturePage() {
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
      setStatus(data.error || "Error");
      setLoading(false);
      return;
    }

    setLastLead(data.lead ?? null);
    setReply(data.reply ?? "");
    setStatus("Lead captured");
    setLoading(false);
    await loadLeads();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-mono-950 dark:text-mono-50">
        DM → CRM Capture
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm text-mono-700 dark:text-mono-300">
        <p className="mb-2">
          Simulates a DM webhook: paste raw DM text. The server extracts name
          (from &quot;my name is …&quot;) and email, stores the lead in memory,
          and returns a suggested auto-reply.
        </p>
        <p>
          Point your platform webhook at{" "}
          <code className="text-xs">POST /api/dm-crm/webhook</code> with{" "}
          <code className="text-xs">{"{ \"message\": \"...\" }"}</code>.
        </p>
      </section>

      <textarea
        className={textareaClass}
        placeholder="e.g. Hey, my name is Eric. My email is eric@email.com. I'm interested."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        type="button"
        onClick={simulateWebhook}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 p-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? "Processing..." : "Process DM (webhook)"}
      </button>

      {status ? (
        <p className="text-sm text-mono-800 dark:text-mono-200">{status}</p>
      ) : null}

      {lastLead ? (
        <div className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm">
          <p className="font-semibold text-mono-900 dark:text-mono-100">
            Parsed lead
          </p>
          <p className="text-mono-800 dark:text-mono-200">
            Name: {lastLead.name}
          </p>
          <p className="text-mono-800 dark:text-mono-200">
            Email: {lastLead.email ?? "—"}
          </p>
          <p className="text-mono-800 dark:text-mono-200">
            Suggested reply: {reply}
          </p>
        </div>
      ) : null}

      <div>
        <h2 className="font-semibold text-mono-900 dark:text-mono-100 mb-2">
          CRM (this server instance)
        </h2>
        <ul className="space-y-2 text-sm text-mono-800 dark:text-mono-200">
          {leads.length === 0 ? (
            <li>No leads yet.</li>
          ) : (
            leads.map((l, i) => (
              <li
                key={`${l.createdAt}-${i}`}
                className="rounded border border-mono-300 dark:border-mono-600 p-2"
              >
                <span className="font-medium">{l.name}</span> ·{" "}
                {l.email ?? "no email"}
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
