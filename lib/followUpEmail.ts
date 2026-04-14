import type { FollowUpRecord } from "@/types/followUp";

/**
 * Mock sender (logs to server console). Replace with Resend when
 * `RESEND_API_KEY` is set and `resend` is installed — see your MVP snippet.
 */
export async function sendReminderEmail(
  to: string,
  subject: string,
  message: string
) {
  console.log(`
    [Follow-Up Reminder AI] Would send email
    To: ${to}
    Subject: ${subject}
    Message: ${message}
  `);
}

export async function sendFollowUpReminderForRecord(item: FollowUpRecord) {
  await sendReminderEmail(
    item.userEmail,
    `Follow-Up: ${item.title}`,
    item.message
  );
}
