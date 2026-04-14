import type { Invoice } from "@/types/invoice";

let invoices: Invoice[] = [];

function normalizeDueDate(dueDate: string): string {
  if (!dueDate) return new Date().toISOString();
  if (dueDate.includes("T")) return new Date(dueDate).toISOString();
  return new Date(`${dueDate}T12:00:00`).toISOString();
}

export function createInvoice(
  data: Omit<Invoice, "id" | "status" | "createdAt" | "reminderCount">
) {
  const invoice: Invoice = {
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
    reminderCount: 0,
    ...data,
    dueDate: normalizeDueDate(data.dueDate),
  };

  invoices.push(invoice);
  return invoice;
}

export function getInvoices() {
  return invoices;
}

export function getInvoiceById(id: string): Invoice | undefined {
  return invoices.find((inv) => inv.id === id);
}

export function updateInvoice(id: string, updates: Partial<Invoice>) {
  invoices = invoices.map((inv) =>
    inv.id === id ? { ...inv, ...updates } : inv
  );
}

export function getOverdueInvoices() {
  const now = new Date();

  return invoices.filter(
    (inv) => inv.status === "pending" && new Date(inv.dueDate) < now
  );
}

export function markInvoicePaid(id: string): boolean {
  const inv = getInvoiceById(id);
  if (!inv || inv.status === "paid") return false;
  updateInvoice(id, { status: "paid" });
  return true;
}
