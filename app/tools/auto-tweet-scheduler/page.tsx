"use client";

import { useEffect, useState } from "react";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

type ScheduledTweet = {
  id: number;
  text: string;
  postAt: string;
  posted: boolean;
};

export default function AutoTweetSchedulerPage() {
  const [text, setText] = useState("");
  const [postAt, setPostAt] = useState("");
  const [status, setStatus] = useState("");
  const [queue, setQueue] = useState<ScheduledTweet[]>([]);
  const [loading, setLoading] = useState(false);

  const loadQueue = async () => {
    const res = await fetch("/api/tweet-scheduler");
    const data = await res.json();
    setQueue(data.tweets ?? []);
  };

  useEffect(() => {
    void loadQueue();
  }, []);

  const handleSchedule = async () => {
    setLoading(true);
    setStatus("");
    const res = await fetch("/api/tweet-scheduler/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, postAt }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Error");
      setLoading(false);
      return;
    }
    setStatus(data.message || "Scheduled");
    setLoading(false);
    await loadQueue();
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-mono-950 dark:text-mono-50">
        Auto Tweet Scheduler
      </h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm text-mono-700 dark:text-mono-300">
        <p className="mb-2">
          Queue a tweet and time (ISO). A background job runs every minute and
          posts due tweets via the X API v2.
        </p>
        <p>
          Set{" "}
          <code className="text-xs">
            TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN,
            TWITTER_ACCESS_SECRET
          </code>
          . Without them, due items are marked posted after a server log (no
          live post).
        </p>
      </section>

      <textarea
        className={`${inputClass} min-h-[100px]`}
        placeholder="Tweet text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="text"
        className={inputClass}
        placeholder='postAt (e.g. 2026-04-16T15:00:00Z)'
        value={postAt}
        onChange={(e) => setPostAt(e.target.value)}
      />

      <button
        type="button"
        onClick={handleSchedule}
        disabled={loading}
        className="w-full rounded-lg bg-black dark:bg-mono-100 p-2 font-semibold text-white dark:text-mono-950 disabled:opacity-60"
      >
        {loading ? "Scheduling..." : "Schedule tweet"}
      </button>

      {status ? (
        <p className="text-sm text-mono-800 dark:text-mono-200">{status}</p>
      ) : null}

      <div>
        <h2 className="font-semibold text-mono-900 dark:text-mono-100 mb-2">
          Queue
        </h2>
        <ul className="space-y-2 text-sm text-mono-800 dark:text-mono-200">
          {queue.length === 0 ? (
            <li>No scheduled tweets yet.</li>
          ) : (
            queue.map((t) => (
              <li
                key={t.id}
                className="rounded border border-mono-300 dark:border-mono-600 p-2"
              >
                <span className={t.posted ? "text-mono-500" : ""}>
                  {t.posted ? "Posted" : "Pending"}
                </span>
                {" · "}
                {t.postAt}
                <br />
                <span className="text-mono-600 dark:text-mono-400">{t.text}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
