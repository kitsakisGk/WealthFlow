"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [accountType, setAccountType] = useState("PERSONAL");
  const [plan, setPlan] = useState("FREE");
  const [currency, setCurrency] = useState("EUR");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const userName = session?.user?.name || "";
  const userEmail = session?.user?.email || "";

  const handleUpgrade = (selectedPlan: string) => {
    setPlan(selectedPlan);
    setShowUpgradeSuccess(true);
    setTimeout(() => setShowUpgradeSuccess(false), 3000);
  };

  const handleCancelSubscription = () => {
    setPlan("FREE");
    setShowCancelConfirm(false);
  };

  const handleSavePreferences = () => {
    alert("Preferences saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-neutral dark:text-gray-200">{t("settings")}</h1>

      {/* Success Message */}
      {showUpgradeSuccess && (
        <div className="bg-positive/10 border border-positive text-positive px-4 py-3 rounded-lg">
          ✓ Plan upgraded successfully! Welcome to {plan}!
        </div>
      )}

      {/* Profile Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-neutral dark:text-gray-200 mb-6">{t("profileInformation")}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">{t("fullName")}</label>
            <input
              type="text"
              value={userName}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral mb-2">Email</label>
            <input
              type="email"
              value={userEmail}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral mb-2">Account Type</label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="PERSONAL">Personal</option>
              <option value="BUSINESS">Small Business</option>
            </select>
          </div>
          <button
            onClick={() => alert("Profile updated successfully!")}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Save Profile Changes
          </button>
        </div>
      </div>

      {/* Subscription Plan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-neutral mb-6">Subscription Plan</h2>
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-semibold text-neutral">Current Plan: <span className="text-primary">{plan}</span></p>
            <p className="text-sm text-neutral-light mt-1">
              {plan === "FREE" && "Upgrade to unlock unlimited features"}
              {plan === "PRO" && "€4.99/month - Next billing date: Nov 17, 2025"}
              {plan === "BUSINESS" && "€19.99/month - Next billing date: Nov 17, 2025"}
            </p>
          </div>
          <div className="flex gap-2">
            {plan === "FREE" ? (
              <button className="bg-positive hover:bg-positive/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Upgrade
              </button>
            ) : (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="bg-negative hover:bg-negative/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Cancel Subscription
              </button>
            )}
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="mb-6 p-4 bg-negative/10 border border-negative rounded-lg">
            <p className="font-semibold text-negative mb-3">Are you sure you want to cancel?</p>
            <p className="text-sm text-neutral mb-4">You'll lose access to premium features at the end of your billing period.</p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelSubscription}
                className="bg-negative hover:bg-negative/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Yes, Cancel
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-neutral px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Keep Subscription
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`border-2 rounded-lg p-4 ${plan === "FREE" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
            <h3 className="font-bold text-neutral mb-2">Free</h3>
            <p className="text-2xl font-bold mb-4">€0<span className="text-sm font-normal text-neutral-light">/mo</span></p>
            <ul className="text-sm space-y-2 text-neutral">
              <li>✓ 1 transaction</li>
              <li>✓ 2 budgets</li>
              <li>✓ 1 goal</li>
              <li className="text-negative">✗ No export</li>
            </ul>
            {plan !== "FREE" && (
              <button
                onClick={() => handleUpgrade("FREE")}
                className="mt-4 w-full border border-neutral hover:bg-gray-50 text-neutral py-2 rounded-lg text-sm font-medium transition-colors">
                Downgrade to Free
              </button>
            )}
          </div>

          <div className={`border-2 rounded-lg p-4 ${plan === "PRO" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
            <div className="bg-positive text-white text-xs font-bold py-1 px-2 rounded-full inline-block mb-2">
              POPULAR
            </div>
            <h3 className="font-bold text-neutral mb-2">Pro</h3>
            <p className="text-2xl font-bold mb-1">€4.99<span className="text-sm font-normal text-neutral-light">/mo</span></p>
            <p className="text-xs text-neutral-light mb-4">or €29.99/year</p>
            <ul className="text-sm space-y-2 text-neutral">
              <li>✓ Unlimited transactions</li>
              <li>✓ Unlimited budgets</li>
              <li>✓ Unlimited goals</li>
              <li>✓ Export reports</li>
            </ul>
            {plan !== "PRO" && (
              <button
                onClick={() => handleUpgrade("PRO")}
                className="mt-4 w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                Upgrade to Pro
              </button>
            )}
          </div>

          <div className={`border-2 rounded-lg p-4 ${plan === "BUSINESS" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
            <h3 className="font-bold text-neutral mb-2">Business</h3>
            <p className="text-2xl font-bold mb-1">€19.99<span className="text-sm font-normal text-neutral-light">/mo</span></p>
            <p className="text-xs text-neutral-light mb-4">or €59.99/year</p>
            <ul className="text-sm space-y-2 text-neutral">
              <li>✓ Everything in Pro</li>
              <li>✓ Business tracking</li>
              <li>✓ Tax categorization</li>
              <li>✓ Multi-user (3)</li>
            </ul>
            {plan !== "BUSINESS" && (
              <button
                onClick={() => handleUpgrade("BUSINESS")}
                className="mt-4 w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                Upgrade to Business
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-neutral mb-6">Security</h2>
        <div className="space-y-4">
          <div>
            <button className="text-primary hover:text-primary/80 font-medium">
              Change Password
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="font-medium text-neutral">Two-Factor Authentication</p>
              <p className="text-sm text-neutral-light">Add an extra layer of security</p>
            </div>
            <button className="bg-gray-200 rounded-full w-12 h-6 relative">
              <div className="absolute left-1 top-1 bg-white rounded-full w-4 h-4"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-neutral dark:text-gray-200 mb-6">Preferences</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "el")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="en">English</option>
              <option value="el">Ελληνικά (Greek)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "light" | "dark")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <p className="text-xs text-neutral-light dark:text-gray-400 mt-1">
              {theme === "dark" ? "Dark theme helps reduce eye strain in low light" : "Light theme is the default appearance"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">Date Format</label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="DD/MM/YYYY">DD/MM/YYYY (European)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              <p className="font-medium text-neutral dark:text-gray-200">Email Notifications</p>
              <p className="text-sm text-neutral-light dark:text-gray-400">Receive budget alerts and updates</p>
            </div>
            <button className="bg-positive rounded-full w-12 h-6 relative">
              <div className="absolute right-1 top-1 bg-white rounded-full w-4 h-4"></div>
            </button>
          </div>
          <button
            onClick={handleSavePreferences}
            className="bg-positive hover:bg-positive/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Save Preferences
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow p-6 border-2 border-negative/20">
        <h2 className="text-xl font-semibold text-negative mb-4">Danger Zone</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-neutral">Export All Data</p>
              <p className="text-sm text-neutral-light">Download all your financial data</p>
            </div>
            <button className="border border-neutral hover:bg-gray-50 text-neutral px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Export
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <div>
              <p className="font-medium text-negative">Delete Account</p>
              <p className="text-sm text-neutral-light">Permanently delete your account and data</p>
            </div>
            <button className="bg-negative hover:bg-negative/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
