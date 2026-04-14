export function latePaymentMessage(
  name: string,
  amount: number,
  daysLate: number
) {
  return `
Hi ${name},

This is a friendly reminder that your payment of $${amount} is ${daysLate} day(s) overdue.

Please submit payment as soon as possible.

Thanks,
Billing Team
`.trim();
}
