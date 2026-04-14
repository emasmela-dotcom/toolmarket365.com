import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | ToolMarket365',
  description: 'Terms of Service for ToolMarket365 - The rules and guidelines for using our platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-8">
          Terms of Service
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-mono-600 dark:text-mono-400 mb-6">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              By accessing and using ToolMarket365 ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              2. Description of Service
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              ToolMarket365 provides a comprehensive suite of tools and services for content creators, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>Content creation and optimization tools</li>
              <li>Analytics and performance tracking</li>
              <li>Content library and storage</li>
              <li>Social media management tools</li>
              <li>SEO and marketing tools</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              3. User Accounts
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information as necessary</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              4. Subscription and Payment
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              <strong>Free Tier:</strong> Some features are available for free with limitations.
            </p>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              <strong>Paid Subscriptions:</strong> Premium features require a paid subscription. By subscribing, you agree to:
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>Pay all fees associated with your subscription</li>
              <li>Automatic renewal unless cancelled</li>
              <li>No refunds for partial subscription periods (unless required by law)</li>
              <li>Price changes with 30 days notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              5. Acceptable Use
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit viruses, malware, or harmful code</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              6. Content Ownership
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              You retain all ownership rights to content you create and store using the Service. By using the Service, you grant us a limited license to:
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>Store and process your content to provide the Service</li>
              <li>Back up and secure your content</li>
              <li>Display your content to you through the Service</li>
            </ul>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              We do not claim ownership of your content and will not use it for marketing or other purposes without your explicit consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              The Service, including all software, design, text, graphics, and other materials, is owned by ToolMarket365 and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or create derivative works without our written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              8. Service Availability
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              We strive to provide reliable service but do not guarantee:
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>Uninterrupted or error-free service</li>
              <li>That the Service will meet your specific requirements</li>
              <li>That defects will be corrected</li>
            </ul>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              We reserve the right to modify, suspend, or discontinue the Service at any time with or without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TOOLMARKET365 SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              10. Termination
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately.
            </p>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              You may cancel your subscription at any time through your account settings. Cancellation will take effect at the end of your current billing period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              11. Changes to Terms
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              We reserve the right to modify these Terms at any time. We will notify you of material changes via email or through the Service. Your continued use of the Service after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              12. Governing Law
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              13. Contact Information
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              <strong>Email:</strong> <a href="mailto:support@creatorflow365.com" className="text-accent-600 dark:text-accent-400 hover:underline">support@creatorflow365.com</a><br />
              <strong>Website:</strong> <Link href="/contact" className="text-accent-600 dark:text-accent-400 hover:underline">Contact Page</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
