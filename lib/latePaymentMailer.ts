import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, text: string) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.log(`
[Late Payment Nudger] Mock email (set EMAIL_USER + EMAIL_PASS for Gmail send)
To: ${to}
Subject: ${subject}
---
${text}
`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `Payments <${user}>`,
    to,
    subject,
    text,
  });
}

export async function sendHtmlEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.log(`
[Email] Mock HTML (set EMAIL_USER + EMAIL_PASS for Gmail send)
To: ${to}
Subject: ${subject}
---
${html}
`);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `Forms <${user}>`,
    to,
    subject,
    html,
  });
}
