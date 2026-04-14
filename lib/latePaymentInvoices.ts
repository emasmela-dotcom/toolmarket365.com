export type LatePaymentInvoice = {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  dueDate: string; // ISO date (YYYY-MM-DD or full ISO)
  status: "pending" | "paid";
  lastReminderSent?: string;
};

export const latePaymentInvoices: LatePaymentInvoice[] = [
  {
    id: "inv_1",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    amount: 250,
    dueDate: "2026-04-10",
    status: "pending",
  },
  {
    id: "inv_2",
    customerName: "Sarah Smith",
    customerEmail: "sarah@example.com",
    amount: 120,
    dueDate: "2026-04-20",
    status: "pending",
  },
];
