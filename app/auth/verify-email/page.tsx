"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link. No token provided.");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed. Please try again.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Link href="/" className="flex justify-center">
            <h1 className="text-4xl font-bold text-primary">WealthFlow</h1>
          </Link>

          {/* Status Icon */}
          <div className="mt-8 flex justify-center">
            {status === "loading" && (
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-blue-600 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
            )}

            {status === "success" && (
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}

            {status === "error" && (
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>

          <h2 className="mt-6 text-center text-3xl font-bold text-neutral">
            {status === "loading" && "Verifying Your Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </h2>

          <p className="mt-4 text-center text-base text-neutral-light">
            {message}
          </p>
        </div>

        {status === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left space-y-4">
            <h3 className="font-semibold text-neutral">Your account is now active!</h3>
            <p className="text-sm text-neutral-light">
              You can now sign in to WealthFlow and start managing your finances.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-left space-y-4">
            <h3 className="font-semibold text-neutral">Common Issues:</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-neutral-light">
              <li>The verification link may have expired (links are valid for 24 hours)</li>
              <li>The link may have already been used</li>
              <li>The link may be incomplete or corrupted</li>
            </ul>
            <p className="text-sm text-neutral-light mt-4">
              Please try signing up again or contact support if the problem persists.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {status === "success" && (
            <Link
              href="/auth/login"
              className="block w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
            >
              Sign In to Your Account
            </Link>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <Link
                href="/auth/signup"
                className="block w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
              >
                Sign Up Again
              </Link>
              <Link
                href="/auth/login"
                className="block w-full px-6 py-3 border border-gray-300 text-neutral rounded-lg hover:bg-gray-50 font-medium"
              >
                Try to Sign In
              </Link>
            </div>
          )}

          {status === "loading" && (
            <p className="text-sm text-neutral-light animate-pulse">
              Please wait while we verify your email...
            </p>
          )}
        </div>

        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-neutral-light">
            Need help?{" "}
            <a href="mailto:support@wealthflow.com" className="text-primary hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
