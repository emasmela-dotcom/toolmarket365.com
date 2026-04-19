export type PrivacyPolicyInput = {
  businessName: string;
  website: string;
  email: string;
  dataCollected?: string;
};

export function generatePrivacyPolicy(input: PrivacyPolicyInput): string {
  const { businessName, website, email, dataCollected } = input;

  return `
Privacy Policy

Effective Date: ${new Date().toLocaleDateString()}

Welcome to ${businessName} ("we", "our", or "us"). Your privacy is important to us.

This Privacy Policy explains how we collect, use, and protect your information when you visit ${website}.

1. Information We Collect
We may collect the following information:
${dataCollected || "- Personal information such as name, email, etc."}

2. How We Use Your Information
We use your information to:
- Provide and maintain our services
- Improve user experience
- Communicate with you

3. Cookies
We may use cookies to enhance your experience on our site.

4. Third-Party Services
We may use third-party services that collect, monitor, and analyze data.

5. Data Security
We take reasonable steps to protect your information but cannot guarantee absolute security.

6. Your Rights
You have the right to request access, correction, or deletion of your data.

7. Contact Us
If you have any questions, contact us at:
${email}

By using our website, you consent to this Privacy Policy.
  `.trim();
}
