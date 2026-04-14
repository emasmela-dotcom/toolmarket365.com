export type ScopeItem = {
  id: string;
  title: string;
  description?: string;
  estimatedHours: number;
  cost: number;
  isOriginal: boolean;
  status: "included" | "pending" | "approved" | "rejected";
  createdAt: string;
};
