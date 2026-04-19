"use client";

import { useState } from "react";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function FormGoogleSheetEmailWorkflowPage() {
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
      setStatus(result.error || "Error");
      setLoading(false);
      return;
    }
    setStatus(result.success ? "Submitted!" : "Error");
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-mono-950 dark:text-mono-50">
        Form → Google Sheet → Email
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm text-mono-700 dark:text-mono-300 space-y-2">
        <p>
          Submissions append a row to your Google Sheet (Name, Email, Message,
          Date) then send a confirmation email to the submitter.
        </p>
        <p>
          Set <code className="text-xs">GOOGLE_SHEET_ID</code> (or{" "}
          <code className="text-xs">SHEET_ID</code>),{" "}
          <code className="text-xs">GOOGLE_SERVICE_ACCOUNT_JSON</code>{" "}
          (service account key JSON), and share the sheet with the service
          account email. Use <code className="text-xs">EMAIL_USER</code> /{" "}
          <code className="text-xs">EMAIL_PASS</code> for mail (or entries log
          as mock).
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className={inputClass}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          className={inputClass}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          className={`${inputClass} min-h-[96px]`}
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black dark:bg-mono-100 p-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {status ? (
        <p className="text-sm text-mono-800 dark:text-mono-200">{status}</p>
      ) : null}
    </div>
  );
}
