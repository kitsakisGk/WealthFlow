"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") || "free";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "PERSONAL",
    plan: planParam.toUpperCase(),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Password strength validation
  const validatePasswordStrength = (password: string) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return {
      hasLetter,
      hasNumber,
      hasSymbol,
      isLongEnough,
      isValid: hasLetter && hasNumber && hasSymbol && isLongEnough,
    };
  };

  const passwordStrength = validatePasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!acceptedTerms) {
      setError("You must accept the Terms & Conditions and Privacy Policy to continue");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordStrength.isValid) {
      setError("Password must contain at least 8 characters, including letters, numbers, and symbols");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          accountType: formData.accountType,
          plan: formData.plan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Registration successful - redirect to check email page
      router.push(`/auth/check-email?email=${encodeURIComponent(formData.email)}`);
    } catch (error: any) {
      setError(error.message || "Failed to create account");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex justify-center mb-8">
            <Image src="/transparent.png" alt="WealthFlow" width={300} height={100} className="h-32 w-auto" />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold text-neutral">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-light">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-negative/10 border border-negative text-negative px-4 py-3 rounded">
              {error}
            </div>
          )}

          {formData.plan !== "FREE" && (
            <div className="bg-primary/10 border border-primary text-primary px-4 py-3 rounded">
              Selected Plan: <strong>{formData.plan}</strong> - You'll be redirected to payment after signup
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-neutral rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-neutral rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="accountType" className="block text-sm font-medium text-neutral mb-1">
                Account Type
              </label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 text-neutral rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="PERSONAL">Personal</option>
                <option value="BUSINESS">Small Business</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-neutral rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Enter strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs">
                    <span className={passwordStrength.isLongEnough ? "text-positive" : "text-neutral-light"}>
                      {passwordStrength.isLongEnough ? "✓" : "○"} At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={passwordStrength.hasLetter ? "text-positive" : "text-neutral-light"}>
                      {passwordStrength.hasLetter ? "✓" : "○"} Contains letters
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={passwordStrength.hasNumber ? "text-positive" : "text-neutral-light"}>
                      {passwordStrength.hasNumber ? "✓" : "○"} Contains numbers
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={passwordStrength.hasSymbol ? "text-positive" : "text-neutral-light"}>
                      {passwordStrength.hasSymbol ? "✓" : "○"} Contains symbols (!@#$%^&*)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-neutral rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-2">
                  {formData.password === formData.confirmPassword ? (
                    <div className="flex items-center text-xs text-positive">
                      <span>✓ Passwords match</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-negative">
                      <span>✗ Passwords do not match</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-4 w-4 mt-1 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-neutral">
              I agree to the{" "}
              <Link href="/terms" target="_blank" className="text-primary hover:text-primary/80 underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" className="text-primary hover:text-primary/80 underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>
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
