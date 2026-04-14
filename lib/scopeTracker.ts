import type { ScopeItem } from "@/types/scope";

export function calculateTotals(items: ScopeItem[]) {
  const original = items.filter((i) => i.isOriginal);
  const creep = items.filter((i) => !i.isOriginal && i.status === "approved");

  const originalCost = original.reduce((sum, i) => sum + i.cost, 0);
  const creepCost = creep.reduce((sum, i) => sum + i.cost, 0);

  const originalHours = original.reduce((sum, i) => sum + i.estimatedHours, 0);
  const creepHours = creep.reduce((sum, i) => sum + i.estimatedHours, 0);

  return {
    originalCost,
    creepCost,
    totalCost: originalCost + creepCost,
    originalHours,
    creepHours,
    totalHours: originalHours + creepHours,
  };
}

export function detectScopeCreep(items: ScopeItem[]) {
  return items.filter((i) => !i.isOriginal);
}
