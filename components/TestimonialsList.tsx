"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
};

export default function TestimonialsList() {
  const [data, setData] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((res) => setData(res.testimonials || []));
  }, []);

  return (
    <div className="grid gap-4">
      {data.map((t) => (
        <div
          key={t.id}
          className="border border-mono-300 dark:border-mono-700 p-4 rounded shadow-sm"
        >
          <p className="text-lg">"{t.content}"</p>
          <p className="mt-2 text-sm text-mono-600 dark:text-mono-400">
            - {t.name}, {t.role} {t.company && `@ ${t.company}`}
          </p>
          <p>{"⭐".repeat(t.rating)}</p>
        </div>
      ))}
    </div>
  );
}
