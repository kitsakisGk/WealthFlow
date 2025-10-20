"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Link href="/" className="flex justify-center">
            <h1 className="text-4xl font-bold text-primary">WealthFlow</h1>
          </Link>

          {/* Email Icon */}
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <h2 className="mt-6 text-center text-3xl font-bold text-neutral">
            Check Your Email
          </h2>
          <p className="mt-4 text-center text-base text-neutral-light">
            We've sent a verification email to:
          </p>
          <p className="mt-2 text-center text-lg font-semibold text-primary">
            {email}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left space-y-4">
          <h3 className="font-semibold text-neutral">Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-light">
            <li>Check your inbox for an email from WealthFlow</li>
            <li>Click the verification link in the email</li>
            <li>Once verified, you can sign in to your account</li>
          </ol>

          <div className="mt-4 pt-4 border-t border-blue-200">
            <p className="text-xs text-neutral-light">
              <strong>Didn't receive the email?</strong> Check your spam or junk folder.
              The email should arrive within a few minutes.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="block w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
          >
            Go to Login
          </Link>

          <p className="text-sm text-neutral-light">
            Need help?{" "}
            <a href="mailto:support@wealthflow.com" className="text-primary hover:underline">
              Contact Support
            </a>
          </p>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-neutral-light">
            For security reasons, verification links expire after 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
