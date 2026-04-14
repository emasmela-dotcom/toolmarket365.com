"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Agreement = {
  id: string;
  title: string;
  description: string;
  amount: string;
  dueAt: string;
  status: "pending" | "agreed";
  createdAt: number;
  agreedAt?: number;
};

export default function AgreementPublicPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agreeing, setAgreeing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/agreements/${id}`);
    if (!res.ok) {
      setNotFound(true);
      setAgreement(null);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setAgreement(data.agreement);
    setNotFound(false);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const agree = async () => {
    if (!id) return;
    setAgreeing(true);
    setError(null);
    const res = await fetch(`/api/agreements/${id}/agree`, { method: "POST" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(typeof body.error === "string" ? body.error : "Could not record agreement.");
      setAgreeing(false);
      return;
    }
    await load();
    setAgreeing(false);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] bg-mono-50 dark:bg-mono-950 p-8 text-mono-700 dark:text-mono-300">
        Loading…
      </div>
    );
  }

  if (notFound || !agreement) {
    return (
      <div className="min-h-[50vh] bg-mono-50 dark:bg-mono-950 p-8 text-mono-950 dark:text-mono-50">
        <h1 className="text-xl font-bold">Agreement not found</h1>
        <p className="mt-2 text-mono-600 dark:text-mono-400">
          This link may be invalid or expired.
        </p>
      </div>
    );
  }

  const dueLabel =
    agreement.dueAt &&
    !Number.isNaN(Date.parse(agreement.dueAt)) &&
    new Date(agreement.dueAt).toLocaleString();

  return (
    <div className="min-h-[60vh] bg-mono-50 dark:bg-mono-950 px-4 py-10 text-mono-950 dark:text-mono-50">
      <div className="mx-auto max-w-lg rounded-lg border border-mono-200 dark:border-mono-700 bg-white dark:bg-mono-900 p-6 shadow-sm">
        <h1 className="text-2xl font-bold">{agreement.title}</h1>
        {agreement.description ? (
          <p className="mt-4 whitespace-pre-wrap text-mono-700 dark:text-mono-300">
            {agreement.description}
          </p>
        ) : null}
        {agreement.amount ? (
          <p className="mt-4 text-lg font-semibold">Amount: {agreement.amount}</p>
        ) : null}
        {dueLabel ? (
          <p className="mt-2 text-sm text-mono-600 dark:text-mono-400">Due: {dueLabel}</p>
        ) : null}

        <p className="mt-6 text-sm font-medium">
          Status:{" "}
          <span
            className={
              agreement.status === "agreed"
                ? "text-green-700 dark:text-green-400"
                : "text-amber-800 dark:text-amber-300"
            }
          >
            {agreement.status === "agreed" ? "Agreed" : "Pending your agreement"}
          </span>
        </p>

        {error ? (
          <p className="mt-3 text-sm text-red-700 dark:text-red-400">{error}</p>
        ) : null}

        {agreement.status === "pending" ? (
          <button
            type="button"
            onClick={agree}
            disabled={agreeing}
            className="mt-6 w-full rounded-lg bg-accent-600 px-4 py-3 font-semibold text-white hover:bg-accent-700 disabled:opacity-60"
          >
            {agreeing ? "Saving…" : "I agree"}
          </button>
        ) : (
          <p className="mt-6 text-sm text-mono-600 dark:text-mono-400">
            Thank you — this agreement is on record.
          </p>
        )}
      </div>
    </div>
  );
}
