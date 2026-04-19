import { google } from "googleapis";
import { sendHtmlEmail } from "@/lib/latePaymentMailer";

export async function appendFormRowToSheet(
  name: string,
  email: string,
  message: string
): Promise<void> {
  const spreadsheetId =
    process.env.GOOGLE_SHEET_ID ?? process.env.SHEET_ID ?? "";
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? "";

  if (!spreadsheetId || !raw.trim()) {
    console.log(
      "[form-sheet-email] Missing GOOGLE_SHEET_ID (or SHEET_ID) or GOOGLE_SERVICE_ACCOUNT_JSON; skipped sheet append"
    );
    return;
  }

  let credentials: Record<string, unknown>;
  try {
    credentials = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON must be valid JSON");
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:D",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[name, email, message, new Date().toISOString()]],
    },
  });
}

export async function sendSubmissionConfirmation(
  name: string,
  email: string,
  message: string
): Promise<void> {
  const html = `
        <h2>Hey ${name},</h2>
        <p>We received your message:</p>
        <p><strong>${message}</strong></p>
        <br/>
        <p>We'll get back to you soon.</p>
      `;

  await sendHtmlEmail(email, "Thanks for your submission", html);
}

export async function runFormSheetEmailWorkflow(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await appendFormRowToSheet(input.name, input.email, input.message);
  await sendSubmissionConfirmation(
    input.name,
    input.email,
    input.message
  );
}
