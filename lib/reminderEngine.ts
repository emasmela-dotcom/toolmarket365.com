import { getOverdueInvoices, updateInvoice } from "@/lib/invoiceStore";
import { sendInvoiceEmail } from "@/lib/sendInvoice";

export async function runReminders() {
  const overdue = getOverdueInvoices();

  for (const invoice of overdue) {
    if (invoice.reminderCount >= 3) continue;

    await sendInvoiceEmail(invoice);

    updateInvoice(invoice.id, {
      reminderCount: invoice.reminderCount + 1,
      status: "overdue",
    });
  }
}
