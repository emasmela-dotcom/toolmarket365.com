"use client";

import { useState } from "react";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function LandingCopyPage() {
  const [form, setForm] = useState({
    product: "",
    audience: "",
    problem: "",
    benefit: "",
    tone: "bold",
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generate = async () => {
    setLoading(true);

    const res = await fetch("/api/landing-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setResult(data.copy);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Landing Page Copy Generator</h1>

      <section className="mb-4 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Fill product, audience, problem, benefit, pick tone, then click Generate Copy.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>You get headline, subheadline, value props, features, CTA, testimonials, and FAQ blocks.</p>
        </div>
      </section>

      <input name="product" placeholder="Product" onChange={handleChange} className={inputClass} />
      <input name="audience" placeholder="Audience" onChange={handleChange} className={inputClass} />
      <input name="problem" placeholder="Problem" onChange={handleChange} className={inputClass} />
      <input name="benefit" placeholder="Benefit" onChange={handleChange} className={inputClass} />

      <select name="tone" value={form.tone} onChange={handleChange} className={inputClass}>
        <option value="bold">Bold</option>
        <option value="casual">Casual</option>
        <option value="professional">Professional</option>
      </select>

      <button
        type="button"
        onClick={generate}
        className="bg-black dark:bg-mono-100 text-white dark:text-mono-950 px-4 py-2 rounded w-full"
      >
        {loading ? "Generating..." : "Generate Copy"}
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">{result.headline}</h2>
          <p>{result.subheadline}</p>

          <div>
            <h3 className="font-bold">Value Props</h3>
            <ul>
              {result.valueProps.map((v: string, i: number) => (
                <li key={i}>• {v}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold">Features</h3>
            <ul>
              {result.features.map((f: string, i: number) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold">CTA</h3>
            <p>{result.cta}</p>
          </div>

          <div>
            <h3 className="font-bold">Testimonials</h3>
            <ul>
              {result.testimonials.map((t: string, i: number) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold">FAQ</h3>
            {result.faq.map((f: { q: string; a: string }, i: number) => (
              <div key={i}>
                <p className="font-semibold">{f.q}</p>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
