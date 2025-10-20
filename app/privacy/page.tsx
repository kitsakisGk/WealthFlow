"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-dark-card rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <Link href="/auth/signup" className="text-primary hover:text-primary/80 text-sm">
            ← Back to Sign Up
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-neutral dark:text-dark-text mb-2">Privacy Policy</h1>
        <p className="text-neutral-light dark:text-dark-text-secondary mb-8">Last updated: January 2025</p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-neutral dark:text-dark-text">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to WealthFlow. We respect your privacy and are committed to protecting your personal data. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our financial management service.
            </p>
            <p className="mt-4">
              By using WealthFlow, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-2">2.1 Personal Information</h3>
            <p>When you create an account, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address (required)</li>
              <li>Name (optional)</li>
              <li>Password (encrypted)</li>
              <li>Account type (Personal or Business)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Financial Data</h3>
            <p>When you use the Service, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Transaction information (amount, date, category, description)</li>
              <li>Budget data</li>
              <li>Financial goals</li>
              <li>Bank account information (names and types only - no credentials)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">2.3 Usage Data</h3>
            <p>We automatically collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Pages visited and features used</li>
              <li>Time and date of visits</li>
              <li>Device information</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">2.4 Cookies and Tracking</h3>
            <p>
              We use cookies and similar tracking technologies to track activity on our Service and store certain information.
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use the collected data for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Provide and maintain the Service:</strong> Process transactions, budgets, and generate reports</li>
              <li><strong>Account management:</strong> Manage your registration and subscription</li>
              <li><strong>Communication:</strong> Send verification emails, password resets, and service updates</li>
              <li><strong>Improve the Service:</strong> Analyze usage patterns to enhance features</li>
              <li><strong>Security:</strong> Monitor for suspicious activity and prevent fraud</li>
              <li><strong>Legal compliance:</strong> Comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>

            <h3 className="text-xl font-semibold mb-2">4.1 Where We Store Your Data</h3>
            <p>
              Your data is stored securely on Supabase (PostgreSQL) servers. We use industry-leading cloud infrastructure with
              data centers that comply with international security standards.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Security Measures</h3>
            <p>We implement multiple security measures to protect your data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Password encryption using bcrypt hashing</li>
              <li>HTTPS/SSL encryption for all data transmission</li>
              <li>Row-Level Security (RLS) policies on database</li>
              <li>Regular security audits and updates</li>
              <li>Secure authentication with NextAuth.js</li>
              <li>Token-based email verification and password reset</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">4.3 Data Retention</h3>
            <p>
              We retain your personal data only for as long as necessary for the purposes set out in this Privacy Policy.
              When you delete your account, all associated data is permanently removed from our systems within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. How We Share Your Information</h2>
            <p>We do not sell your personal data. We may share your information only in the following circumstances:</p>

            <h3 className="text-xl font-semibold mb-2 mt-4">5.1 Service Providers</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase:</strong> Database hosting and authentication</li>
              <li><strong>Resend:</strong> Transactional email delivery</li>
              <li><strong>Stripe:</strong> Payment processing for subscriptions</li>
              <li><strong>Vercel:</strong> Application hosting and deployment</li>
            </ul>
            <p className="mt-2">
              These third parties have access to your data only to perform tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">5.2 Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities.</p>

            <h3 className="text-xl font-semibold mb-2 mt-4">5.3 Business Transfers</h3>
            <p>
              If WealthFlow is involved in a merger, acquisition, or asset sale, your personal data may be transferred.
              We will provide notice before your data is transferred and becomes subject to a different Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Data Rights</h2>
            <p>You have the following rights regarding your personal data:</p>

            <h3 className="text-xl font-semibold mb-2 mt-4">6.1 Access and Portability</h3>
            <p>
              You can access your data at any time through your account dashboard. You can also export all your data
              in JSON format using the "Export All Data" feature in Settings.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">6.2 Correction</h3>
            <p>
              You can update your personal information (name, email, account type) directly in the Settings page.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">6.3 Deletion</h3>
            <p>
              You have the right to delete your account at any time using the "Delete Account" feature in Settings.
              This action is permanent and will remove all your data from our systems.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">6.4 Withdraw Consent</h3>
            <p>
              You can withdraw your consent to data processing by deleting your account. Note that this may prevent you from using the Service.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">6.5 Opt-Out of Communications</h3>
            <p>
              You can opt-out of marketing emails at any time. However, we may still send you transactional emails
              (account verification, password resets, security alerts) that are necessary for the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
            <p>
              WealthFlow is not intended for users under the age of 18. We do not knowingly collect personal information from children.
              If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
            <p>
              Your information may be transferred to and maintained on servers located outside of your state, province, country,
              or other governmental jurisdiction where data protection laws may differ. We take steps to ensure that your data
              receives adequate protection in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Third-Party Links</h2>
            <p>
              Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
              We encourage you to read their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending you an email notification for material changes</li>
            </ul>
            <p className="mt-4">
              You are advised to review this Privacy Policy periodically for any changes. Changes are effective when posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. GDPR Compliance (EU Users)</h2>
            <p>If you are in the European Economic Area (EEA), you have additional rights under GDPR:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="mt-4 space-y-2">
              <p>Email: <a href="mailto:privacy@wealthflow.com" className="text-primary hover:underline">privacy@wealthflow.com</a></p>
              <p>Support: <a href="mailto:support@wealthflow.com" className="text-primary hover:underline">support@wealthflow.com</a></p>
            </div>
          </section>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
            <p className="text-sm text-neutral-light dark:text-dark-text-secondary">
              By using WealthFlow, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/auth/signup"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
          >
            Back to Sign Up
          </Link>
          <Link
            href="/terms"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-neutral dark:text-dark-text rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
          >
            View Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
