import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { businessName, websiteUrl, country, service } = await req.json();

  const domain = String(websiteUrl ?? "").replace(/^https?:\/\//, "");
  const terms = `TERMS OF SERVICE
Last Updated: ${new Date().toLocaleDateString()}

Welcome to ${businessName} ("we", "our", "us").

By accessing or using ${websiteUrl}, you agree to be bound by these Terms of Service.

1. USE OF OUR SERVICE
You agree to use our service (${service}) only for lawful purposes and in accordance with these Terms.

2. ACCOUNTS
If you create an account, you are responsible for maintaining the confidentiality of your information.

3. INTELLECTUAL PROPERTY
All content, trademarks, and data on this website are owned by ${businessName}.

4. TERMINATION
We reserve the right to suspend or terminate access at our discretion.

5. LIMITATION OF LIABILITY
${businessName} is not liable for any indirect, incidental, or consequential damages.

6. GOVERNING LAW
These Terms are governed by the laws of ${country}.

7. CHANGES
We may update these Terms at any time. Continued use means acceptance.

Contact us at: support@${domain}`;

  return NextResponse.json({ terms });
}
