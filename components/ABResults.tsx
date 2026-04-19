"use client";

import { useEffect, useState } from "react";

type ABData = {
  A: { impressions: number; conversions: number };
  B: { impressions: number; conversions: number };
};

export default function ABResults() {
  const [data, setData] = useState<ABData | null>(null);

  useEffect(() => {
    fetch("/api/ab-test")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-mono-600 dark:text-mono-400">Loading...</p>;

  const calcRate = (v: { impressions: number; conversions: number }) =>
    v.impressions ? (v.conversions / v.impressions) * 100 : 0;

  const rateA = calcRate(data.A);
  const rateB = calcRate(data.B);
  const winner = rateA > rateB ? "A" : "B";

  return (
    <div className="rounded-lg border border-mono-300 dark:border-mono-700 p-4">
      <h2 className="text-xl font-bold text-mono-950 dark:text-mono-50 mb-3">
        A/B Test Results
      </h2>

      <p className="text-mono-800 dark:text-mono-200">
        A: {data.A.impressions} views / {data.A.conversions} conversions (
        {rateA.toFixed(2)}%)
      </p>
      <p className="text-mono-800 dark:text-mono-200">
        B: {data.B.impressions} views / {data.B.conversions} conversions (
        {rateB.toFixed(2)}%)
      </p>

      <h3 className="mt-3 font-semibold text-mono-900 dark:text-mono-100">
        Winner: Variant {winner}
      </h3>
    </div>
  );
}
