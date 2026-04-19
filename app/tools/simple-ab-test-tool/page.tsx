"use client";

import ABTest from "@/components/ABTest";
import ABResults from "@/components/ABResults";

export default function SimpleABTestToolPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-mono-950 dark:text-mono-50">
        Simple A/B Test Tool
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-2">
        <p className="text-mono-700 dark:text-mono-300">
          Assigns variant A or B, tracks impressions and conversions, and shows
          the current winner.
        </p>
      </section>

      <ABTest />
      <ABResults />
    </div>
  );
}
