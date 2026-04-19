"use client";

import { useEffect, useState } from "react";
import { getVariant } from "@/lib/abTest";

export default function ABTest() {
  const [variant, setVariant] = useState<"A" | "B" | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const v = getVariant();
    setVariant(v);

    fetch("/api/ab-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "impression", variant: v }),
    });
  }, []);

  const handleClick = async () => {
    if (!variant) return;

    await fetch("/api/ab-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "conversion", variant }),
    });

    setMessage("Conversion tracked!");
  };

  if (!variant) return null;

  return (
    <div className="rounded-lg border border-mono-300 dark:border-mono-700 p-4">
      {variant === "A" ? (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50">
            Variant A Headline
          </h2>
          <button
            type="button"
            onClick={handleClick}
            className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950"
          >
            Buy Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50">
            Variant B Headline
          </h2>
          <button
            type="button"
            onClick={handleClick}
            className="rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950"
          >
            Get Started
          </button>
        </div>
      )}
      {message ? (
        <p className="mt-3 text-sm text-green-700 dark:text-green-400">{message}</p>
      ) : null}
    </div>
  );
}
