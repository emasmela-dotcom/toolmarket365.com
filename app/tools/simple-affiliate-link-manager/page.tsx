"use client";

import { useEffect, useState } from "react";

type AffiliateLink = {
  id: string;
  slug: string;
  url: string;
  title?: string;
  clicks: number;
  createdAt: number;
};

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function SimpleAffiliateLinkManagerPage() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLinks = async () => {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data.links || []);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const createLink = async () => {
    if (!url.trim()) return;
    setLoading(true);
    await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, title }),
    });

    setUrl("");
    setTitle("");
    await fetchLinks();
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Simple Affiliate Link Manager</h1>

      <section className="mb-4 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Add a destination URL and optional title, then create a short link to track clicks.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>You get redirect links under /go/[slug] plus click counts in this dashboard.</p>
        </div>
      </section>

      <div className="space-y-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter affiliate URL"
          className={inputClass}
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className={inputClass}
        />
        <button
          type="button"
          onClick={createLink}
          disabled={loading}
          className="w-full bg-black dark:bg-mono-100 text-white dark:text-mono-950 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Link"}
        </button>
      </div>

      <div className="space-y-2 pt-2">
        {links.map((link) => (
          <div
            key={link.id}
            className="border border-mono-300 dark:border-mono-700 rounded p-3"
          >
            <a
              href={`/go/${link.slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-accent-600 dark:text-accent-400 hover:underline break-all"
            >
              /go/{link.slug}
            </a>
            <p className="text-sm text-mono-700 dark:text-mono-300">{link.title || link.url}</p>
            <p className="text-sm">{link.clicks} clicks</p>
          </div>
        ))}
      </div>
    </div>
  );
}
