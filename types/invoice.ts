export type InvoiceStatus = "pending" | "paid" | "overdue";

export interface Invoice {
  id: string;
  clientEmail: string;
  clientName: string;
  amount: number;
  description: string;
  dueDate: string; // ISO
  status: InvoiceStatus;
  createdAt: string;
  reminderCount: number;
}
