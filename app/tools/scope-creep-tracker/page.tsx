"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ScopeItem } from "@/types/scope";
import { calculateTotals, detectScopeCreep } from "@/lib/scopeTracker";

const inputClass =
  "w-full border p-2 rounded border-mono-300 dark:border-mono-600 bg-white dark:bg-mono-900 text-mono-950 dark:text-mono-50 placeholder:text-mono-500 dark:placeholder:text-mono-400";

export default function ScopeCreepTrackerPage() {
  const [items, setItems] = useState<ScopeItem[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    estimatedHours: "",
    cost: "",
    isOriginal: false,
  });

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/scope");
    const data = await res.json();
    setItems(data.items || []);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const totals = useMemo(() => calculateTotals(items), [items]);
  const creepItems = useMemo(() => detectScopeCreep(items), [items]);
  const pendingCreep = creepItems.filter((i) => i.status === "pending").length;

  async function addItem() {
    await fetch("/api/scope", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        estimatedHours: Number(form.estimatedHours),
        cost: Number(form.cost),
        isOriginal: form.isOriginal,
      }),
    });

    setForm({
      title: "",
      description: "",
      estimatedHours: "",
      cost: "",
      isOriginal: false,
    });
    fetchItems();
  }

  async function updateStatus(id: string, status: ScopeItem["status"]) {
    await fetch("/api/scope", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchItems();
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Scope Creep Tracker</h1>

      <section className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 text-sm space-y-3">
        <div>
          <h2 className="font-semibold mb-1">Instructions</h2>
          <p>Add original scope lines and new client requests. Approve or reject creep items to update totals.</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">Expected Outcome</h2>
          <p>
            Approved creep (non-original) adds to extra cost and hours in the summary. Pending creep:{" "}
            <strong>{pendingCreep}</strong>
          </p>
        </div>
      </section>

      <div className="rounded-lg border border-mono-300 dark:border-mono-700 p-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <p className="text-mono-600 dark:text-mono-400">Original cost</p>
          <p className="text-lg font-semibold">${totals.originalCost}</p>
        </div>
        <div>
          <p className="text-mono-600 dark:text-mono-400">Creep cost (approved)</p>
          <p className="text-lg font-semibold">${totals.creepCost}</p>
        </div>
        <div>
          <p className="text-mono-600 dark:text-mono-400">Total cost</p>
          <p className="text-lg font-semibold">${totals.totalCost}</p>
        </div>
        <div>
          <p className="text-mono-600 dark:text-mono-400">Original hours</p>
          <p className="text-lg font-semibold">{totals.originalHours}h</p>
        </div>
        <div>
          <p className="text-mono-600 dark:text-mono-400">Creep hours (approved)</p>
          <p className="text-lg font-semibold">{totals.creepHours}h</p>
        </div>
        <div>
          <p className="text-mono-600 dark:text-mono-400">Total hours</p>
          <p className="text-lg font-semibold">{totals.totalHours}h</p>
        </div>
      </div>

      <div className="space-y-2">
        <input
          placeholder="Task title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={`${inputClass} min-h-[72px]`}
        />
        <input
          placeholder="Hours"
          type="number"
          min="0"
          step="0.25"
          value={form.estimatedHours}
          onChange={(e) => setForm({ ...form, estimatedHours: e.target.value })}
          className={inputClass}
        />
        <input
          placeholder="Cost ($)"
          type="number"
          min="0"
          step="0.01"
          value={form.cost}
          onChange={(e) => setForm({ ...form, cost: e.target.value })}
          className={inputClass}
        />
        <label className="flex items-center gap-2 text-sm text-mono-800 dark:text-mono-200">
          <input
            type="checkbox"
            checked={form.isOriginal}
            onChange={(e) => setForm({ ...form, isOriginal: e.target.checked })}
            className="h-4 w-4 rounded border-mono-400"
          />
          Original scope
        </label>

        <button
          type="button"
          onClick={addItem}
          className="w-full rounded-lg bg-black dark:bg-mono-100 px-4 py-2 font-semibold text-white dark:text-mono-950"
        >
          Add item
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-mono-300 dark:border-mono-700 p-3"
          >
            <div className="font-semibold text-mono-950 dark:text-mono-50">{item.title}</div>
            {item.description ? (
              <p className="mt-1 text-sm text-mono-700 dark:text-mono-300">{item.description}</p>
            ) : null}
            <div className="text-sm text-mono-700 dark:text-mono-300">
              {item.estimatedHours}h · ${item.cost}
            </div>
            <div className="text-xs text-mono-600 dark:text-mono-400 mt-1">
              {item.isOriginal ? "Original scope" : "Scope creep"} · Status:{" "}
              <span className="font-medium text-mono-900 dark:text-mono-100">{item.status}</span>
            </div>
            {!item.isOriginal && item.status === "pending" ? (
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => updateStatus(item.id, "approved")}
                  className="rounded bg-green-700 px-2 py-1 text-xs font-medium text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(item.id, "rejected")}
                  className="rounded bg-red-700 px-2 py-1 text-xs font-medium text-white hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-500"
                >
                  Reject
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
