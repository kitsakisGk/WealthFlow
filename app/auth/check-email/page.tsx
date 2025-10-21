"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Link href="/" className="flex justify-center">
            <Image src="/luminus-logo.png" alt="Luminus" width={200} height={60} className="h-16 w-auto" />
          </Link>
          <h2 className="mt-8 text-center text-2xl font-bold text-neutral">
            WealthFlow
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary"
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

          <h3 className="text-xl font-bold text-neutral mb-2">Check Your Email</h3>
          <p className="text-neutral-light mb-6">
            We've sent a verification email to <strong>{email}</strong>
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-neutral mb-2">Next Steps:</h4>
            <ol className="text-sm text-neutral-light space-y-2">
              <li>1. Check your inbox for an email from WealthFlow</li>
              <li>2. Click the verification link in the email</li>
              <li>3. Once verified, you can sign in to your account</li>
            </ol>
          </div>

          <p className="text-xs text-neutral-light">
            Didn't receive the email? Check your spam or junk folder. The email should arrive within a few minutes.
          </p>

          <div className="mt-6">
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </Link>
          </div>

          <p className="mt-4 text-xs text-neutral-light">
            Need help?{" "}
            <Link href="/contact" className="text-primary hover:text-primary/80 underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>

      {/* Powered by Luminus footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-neutral-light">
          Powered by{" "}
          <span className="font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            Luminus
          </span>
        </p>
      </div>
    </div>
  );
}
