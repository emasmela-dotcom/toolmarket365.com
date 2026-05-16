import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | ToolMarket365',
  description: 'Privacy Policy for ToolMarket365 - How we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-mono-50 dark:bg-mono-950 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-mono-950 dark:text-mono-50 mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-mono-600 dark:text-mono-400 mb-6">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>Account information (email address, password)</li>
              <li>Content you create and store in our Content Library</li>
              <li>Usage data (which tools you use, how often)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Communication data (support requests, feedback)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze usage patterns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              3. Data Storage and Security
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              Your data is stored securely using:
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li><strong>Neon Database:</strong> PostgreSQL database hosted on Neon.tech</li>
              <li><strong>Vercel:</strong> Application hosting and CDN</li>
              <li><strong>Local Storage:</strong> Browser-based storage for offline functionality</li>
            </ul>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              We implement industry-standard security measures to protect your data, including encryption, secure authentication, and regular security audits.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              4. Third-Party Services
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li><strong>Stripe:</strong> Payment processing (see <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent-600 dark:text-accent-400 hover:underline">Stripe's Privacy Policy</a>)</li>
              <li><strong>Neon:</strong> Database hosting (see <a href="https://neon.tech/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent-600 dark:text-accent-400 hover:underline">Neon's Privacy Policy</a>)</li>
              <li><strong>Vercel:</strong> Hosting and analytics (see <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent-600 dark:text-accent-400 hover:underline">Vercel's Privacy Policy</a>)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              5. Your Rights
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              To exercise these rights, please contact us at <a href="mailto:support@creatorflow365.com" className="text-accent-600 dark:text-accent-400 hover:underline">support@creatorflow365.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              6. Cookies
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-mono-700 dark:text-mono-300 mb-4 space-y-2">
              <li>Maintain your session and authentication</li>
              <li>Remember your preferences</li>
              <li>Analyze site usage and performance</li>
            </ul>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              7. Children's Privacy
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              8. Changes to This Policy
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-mono-950 dark:text-mono-50 mb-4">
              9. Contact Us
            </h2>
            <p className="text-mono-700 dark:text-mono-300 mb-4">
              If you have questions about this Privacy Policy, please contact us at:
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
