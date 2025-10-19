"use client";

import { useState } from "react";
import Link from "next/link";
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

      // Registration successful - redirect to login
      router.push("/auth/login?registered=true");
    } catch (error: any) {
      setError(error.message || "Failed to create account");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex justify-center">
            <h1 className="text-4xl font-bold text-primary">WealthFlow</h1>
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
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-neutral rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Enter strong password"
              />
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
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-neutral rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Re-enter password"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-neutral">
              I agree to the{" "}
              <a href="#" className="text-primary hover:text-primary/80">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:text-primary/80">
                Privacy Policy
              </a>
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
    </div>
  );
}
