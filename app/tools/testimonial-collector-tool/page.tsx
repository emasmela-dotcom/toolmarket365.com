"use client";

import { useState } from "react";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function TestimonialCollectorToolPage() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setSuccess(false);
    const value = e.target.name === "rating" ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setForm({
        name: "",
        role: "",
        company: "",
        content: "",
        rating: 5,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Testimonial Collector Tool</h1>

      <section className="mb-4 rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Fill out customer details and testimonial copy, then submit the form.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>Your testimonial is stored via API and available through the GET endpoint.</p>
        </div>
      </section>

      {success && (
        <p className="text-green-700 dark:text-green-400 mb-2">
          Thanks! Your testimonial was submitted.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          className={inputClass}
          required
        />
        <input
          name="role"
          placeholder="Your Role (optional)"
          value={form.role}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          name="company"
          placeholder="Company (optional)"
          value={form.company}
          onChange={handleChange}
          className={inputClass}
        />
        <textarea
          name="content"
          placeholder="Your testimonial..."
          value={form.content}
          onChange={handleChange}
          className={`${inputClass} h-32`}
          required
        />
        <select
          name="rating"
          value={form.rating}
          onChange={handleChange}
          className={inputClass}
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ⭐
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black dark:bg-mono-100 text-white dark:text-mono-950 py-2 rounded"
        >
          {loading ? "Submitting..." : "Submit Testimonial"}
        </button>
      </form>
    </div>
  );
}
