import type { ScopeItem } from "@/types/scope";

let scopeItems: ScopeItem[] = [];

export function getScopeItems(): ScopeItem[] {
  return scopeItems;
}

export function createScopeItem(input: {
  title: string;
  description?: string;
  estimatedHours: number;
  cost: number;
  isOriginal: boolean;
}): ScopeItem {
  const item: ScopeItem = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    description: input.description?.trim() || "",
    estimatedHours: input.estimatedHours,
    cost: input.cost,
    isOriginal: input.isOriginal,
    status: input.isOriginal ? "included" : "pending",
    createdAt: new Date().toISOString(),
  };
  scopeItems.push(item);
  return item;
}

export function updateScopeItemStatus(
  id: string,
  status: ScopeItem["status"]
): boolean {
  const idx = scopeItems.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  scopeItems[idx] = { ...scopeItems[idx], status };
  return true;
}
