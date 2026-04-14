import { latePaymentInvoices } from "@/lib/latePaymentInvoices";
import { sendEmail } from "@/lib/latePaymentMailer";
import { latePaymentMessage } from "@/lib/latePaymentMessages";

function daysBetween(date1: Date, date2: Date) {
  return Math.floor(
    (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export async function runLatePaymentNudger() {
  const today = new Date();

  for (const invoice of latePaymentInvoices) {
    if (invoice.status === "paid") continue;

    const due = new Date(invoice.dueDate);
    const daysLate = daysBetween(today, due);

    if (daysLate <= 0) continue;

    if (invoice.lastReminderSent) {
      const last = new Date(invoice.lastReminderSent);
      const diff = daysBetween(today, last);
      if (diff < 3) continue;
    }

    const message = latePaymentMessage(
      invoice.customerName,
      invoice.amount,
      daysLate
    );

    try {
      await sendEmail(
        invoice.customerEmail,
        `Payment Overdue - Invoice ${invoice.id}`,
        message
      );
    } catch (err) {
      console.error(`[Late Payment Nudger] Failed for ${invoice.id}:`, err);
      continue;
    }

    invoice.lastReminderSent = today.toISOString();
  }
}
