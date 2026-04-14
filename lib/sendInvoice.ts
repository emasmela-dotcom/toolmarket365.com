import type { Invoice } from "@/types/invoice";

export async function sendInvoiceEmail(invoice: Invoice) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const link = `${base}/tools/invoice-reminder-tool?invoice=${invoice.id}`;

  console.log(`
    Sending Invoice to ${invoice.clientEmail}
    Amount: $${invoice.amount}
    Due: ${invoice.dueDate}
    Link: ${link}
  `);

  // Later: integrate Resend / SendGrid
}
