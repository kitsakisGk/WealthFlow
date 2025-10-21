"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
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
          setMessage("Email verified successfully! Redirecting to login...");
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification");
      }
    };

    verifyEmail();
  }, [token, router]);

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
          {status === "loading" && (
            <div>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-neutral mb-2">Verifying...</h3>
              <p className="text-neutral-light">Please wait while we verify your email address</p>
            </div>
          )}

          {status === "success" && (
            <div>
              <div className="w-16 h-16 bg-positive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-positive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral mb-2">Email Verified!</h3>
              <p className="text-neutral-light">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div>
              <div className="w-16 h-16 bg-negative/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-negative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral mb-2">Verification Failed</h3>
              <p className="text-neutral-light mb-6">{message}</p>
              <Link
                href="/auth/signup"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </Link>
            </div>
          )}
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
