"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-dark-card rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <Link href="/auth/signup" className="text-primary hover:text-primary/80 text-sm">
            ← Back to Sign Up
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-neutral dark:text-dark-text mb-2">Terms & Conditions</h1>
        <p className="text-neutral-light dark:text-dark-text-secondary mb-8">Last updated: January 2025</p>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-neutral dark:text-dark-text">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using WealthFlow ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
              If you do not agree to these Terms & Conditions, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              WealthFlow is a financial management platform that helps users track transactions, manage budgets, set financial goals,
              and generate reports. The Service is provided on a subscription basis with Free, Pro, and Business tiers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p>
              To use WealthFlow, you must create an account by providing accurate and complete information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your email address is valid and monitored</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Subscription Plans</h2>
            <h3 className="text-xl font-semibold mb-2">4.1 Free Plan</h3>
            <p>The Free plan includes limited access to the Service:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>1 transaction per month</li>
              <li>2 budgets per month</li>
              <li>1 goal per month</li>
              <li>Basic reporting features</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Pro & Business Plans</h3>
            <p>Paid plans offer unlimited access to all features and are billed monthly or yearly. You may cancel at any time.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
            <p>
              For paid subscriptions:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payments are processed securely through Stripe</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>No refunds for partial months</li>
              <li>Prices may change with 30 days notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. User Data and Privacy</h2>
            <p>
              Your use of WealthFlow is also governed by our Privacy Policy. We take data security seriously and use industry-standard
              encryption to protect your financial information. By using the Service, you consent to our data practices as described
              in our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Upload malicious code or viruses</li>
              <li>Interfere with other users' access to the Service</li>
              <li>Scrape, copy, or distribute content without permission</li>
              <li>Create multiple accounts to circumvent usage limits</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <p>
              All content, features, and functionality of WealthFlow are owned by us and are protected by international copyright,
              trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
            <p>
              WealthFlow is provided "AS IS" and "AS AVAILABLE" without warranties of any kind. We do not guarantee that the Service will be:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Uninterrupted or error-free</li>
              <li>Free of viruses or harmful components</li>
              <li>Completely secure from unauthorized access</li>
            </ul>
            <p className="mt-4">
              <strong>Important:</strong> WealthFlow is a financial tracking tool, not financial advice. We are not financial advisors.
              You should consult with qualified professionals for financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, WealthFlow shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages resulting from your use or inability to use the Service, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Loss of profits or revenue</li>
              <li>Loss of data</li>
              <li>Business interruption</li>
              <li>Financial losses based on Service data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Account Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at our discretion, without notice, for conduct that we believe:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violates these Terms & Conditions</li>
              <li>Is harmful to other users or the Service</li>
              <li>Exposes us or other users to legal liability</li>
            </ul>
            <p className="mt-4">
              You may delete your account at any time from the Settings page. Account deletion is permanent and cannot be reversed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms & Conditions at any time. We will notify users of material changes via email
              or through the Service. Your continued use of WealthFlow after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
            <p>
              These Terms & Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which
              WealthFlow operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <p className="mt-2">
              Email: <a href="mailto:support@wealthflow.com" className="text-primary hover:underline">support@wealthflow.com</a>
            </p>
          </section>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
            <p className="text-sm text-neutral-light dark:text-dark-text-secondary">
              By creating a WealthFlow account, you acknowledge that you have read, understood, and agree to be bound by these
              Terms & Conditions and our Privacy Policy.
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
            href="/privacy"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-neutral dark:text-dark-text rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
          >
            View Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
