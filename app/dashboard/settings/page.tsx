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
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPreferencesSaved, setShowPreferencesSaved] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const userName = session?.user?.name || "";
  const userEmail = session?.user?.email || "";

  const handleUpgrade = async (selectedPlan: "PRO" | "BUSINESS") => {
    setUpgradingPlan(selectedPlan);

    try {
      // Get the correct price ID based on plan and billing period
      const priceIds = {
        PRO: {
          monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || "price_1SKL3bF06obS6ynQWKJPUzjS",
          yearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || "price_1SKL7ZF06obS6ynQDveO8cFb",
        },
        BUSINESS: {
          monthly: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID || "price_1SKL9WF06obS6ynQ43YIce8T",
          yearly: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID || "price_1SKLB6F06obS6ynQwZVSiKsQ",
        },
      };

      const priceId = priceIds[selectedPlan][billingPeriod];

      // Call Stripe checkout API
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, plan: selectedPlan }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        alert("Failed to start checkout. Please try again.");
        setUpgradingPlan(null);
      }
    } catch (error) {
      console.error("Error upgrading:", error);
      alert("An error occurred. Please try again.");
      setUpgradingPlan(null);
    }
  };

  const handleCancelSubscription = () => {
    setPlan("FREE");
    setShowCancelConfirm(false);
  };

  const handleSavePreferences = () => {
    setShowPreferencesSaved(true);
    setTimeout(() => setShowPreferencesSaved(false), 3000);
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        setPasswordSuccess(true);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          setShowChangePasswordModal(false);
          setPasswordSuccess(false);
        }, 2000);
      } else {
        const data = await response.json();
        setPasswordError(data.error || "Failed to change password");
      }
    } catch (error) {
      setPasswordError("An error occurred. Please try again.");
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/user/export-data");
      const data = await response.json();

      if (response.ok) {
        // Create a blob from the data
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `wealthflow-data-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert(t("exportDataFailed"));
      }
    } catch (error) {
      alert(t("exportDataFailed"));
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(t("deleteAccountConfirm"));

    if (!confirmed) return;

    const doubleConfirm = window.confirm(t("deleteAccountFinalWarning"));

    if (!doubleConfirm) return;

    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
      });

      if (response.ok) {
        alert(t("accountDeleted"));
        window.location.href = "/";
      } else {
        alert(t("deleteAccountFailed"));
      }
    } catch (error) {
      alert(t("errorOccurred"));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-neutral dark:text-gray-200">{t("settings")}</h1>

      {/* Success Message */}
      {showUpgradeSuccess && (
        <div className="bg-positive/10 border border-positive text-positive px-4 py-3 rounded-lg">
          ✓ {t("planUpgradeSuccess")} {plan}!
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">{t("email")}</label>
            <input
              type="email"
              value={userEmail}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">{t("accountType")}</label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="PERSONAL">{t("personal")}</option>
              <option value="BUSINESS">{t("smallBusiness")}</option>
            </select>
          </div>
          <button
            onClick={() => alert(t("preferencesSaved"))}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            {t("saveProfileChanges")}
          </button>
        </div>
      </div>

      {/* Subscription Plan */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-neutral dark:text-gray-200 mb-6">{t("subscriptionPlan")}</h2>
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <p className="font-semibold text-neutral dark:text-gray-200">
              {t("currentPlan")}: <span className="text-primary dark:text-green-400">{plan}</span>
            </p>
            <p className="text-sm text-neutral-light dark:text-gray-400 mt-1">
              {plan === "FREE" && t("upgradeUnlimited")}
              {plan === "PRO" && `€4.99${t("perMonth")} - ${t("nextBillingDate")}: Nov 17, 2025`}
              {plan === "BUSINESS" && `€19.99${t("perMonth")} - ${t("nextBillingDate")}: Nov 17, 2025`}
            </p>
          </div>
          <div className="flex gap-2">
            {plan === "FREE" ? (
              <button className="bg-positive hover:bg-positive/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                {t("upgrade")}
              </button>
            ) : (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="bg-negative hover:bg-negative/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                {t("cancelSubscription")}
              </button>
            )}
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="mb-6 p-4 bg-negative/10 dark:bg-red-900/20 border border-negative rounded-lg">
            <p className="font-semibold text-negative mb-3">{t("areYouSureCancelSubscription")}</p>
            <p className="text-sm text-neutral dark:text-gray-300 mb-4">{t("loseAccessPremium")}</p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelSubscription}
                className="bg-negative hover:bg-negative/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                {t("yesCancel")}
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-neutral dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                {t("keepSubscription")}
              </button>
            </div>
          </div>
        )}

        {/* Billing Period Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingPeriod === "monthly"
                  ? "bg-white dark:bg-gray-600 text-primary shadow-sm"
                  : "text-neutral-light dark:text-gray-400"
              }`}
            >
              {t("monthly")}
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingPeriod === "yearly"
                  ? "bg-white dark:bg-gray-600 text-primary shadow-sm"
                  : "text-neutral-light dark:text-gray-400"
              }`}
            >
              {t("yearly")}
              <span className="ml-2 text-xs bg-positive text-white px-2 py-0.5 rounded-full">
                Save up to 75%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`border-2 rounded-lg p-4 ${plan === "FREE" ? "border-primary bg-primary/5 dark:bg-green-900/10" : "border-gray-200 dark:border-gray-600"}`}>
            <h3 className="font-bold text-neutral dark:text-gray-200 mb-2">{t("free")}</h3>
            <p className="text-2xl font-bold text-neutral dark:text-gray-200 mb-4">€0<span className="text-sm font-normal text-neutral-light dark:text-gray-400">{t("perMonth")}</span></p>
            <ul className="text-sm space-y-2 text-neutral dark:text-gray-300">
              <li>✓ {t("oneTransaction")}</li>
              <li>✓ {t("twoBudgets")}</li>
              <li>✓ {t("oneGoal")}</li>
              <li className="text-negative">✗ {t("noExport")}</li>
            </ul>
            {plan !== "FREE" && (
              <button
                onClick={() => handleUpgrade("FREE")}
                className="mt-4 w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-neutral dark:text-gray-300 py-2 rounded-lg text-sm font-medium transition-colors">
                {t("downgradeToFree")}
              </button>
            )}
          </div>

          <div className={`border-2 rounded-lg p-4 ${plan === "PRO" ? "border-primary bg-primary/5 dark:bg-green-900/10" : "border-gray-200 dark:border-gray-600"}`}>
            <div className="bg-positive text-white text-xs font-bold py-1 px-2 rounded-full inline-block mb-2">
              {t("popular")}
            </div>
            <h3 className="font-bold text-neutral dark:text-gray-200 mb-2">{t("pro")}</h3>
            {billingPeriod === "monthly" ? (
              <p className="text-2xl font-bold text-neutral dark:text-gray-200 mb-4">
                €4.99<span className="text-sm font-normal text-neutral-light dark:text-gray-400">{t("perMonth")}</span>
              </p>
            ) : (
              <p className="text-2xl font-bold text-neutral dark:text-gray-200 mb-4">
                €29.99<span className="text-sm font-normal text-neutral-light dark:text-gray-400">{t("perYear")}</span>
              </p>
            )}
            <ul className="text-sm space-y-2 text-neutral dark:text-gray-300">
              <li>✓ {t("unlimitedTransactions")}</li>
              <li>✓ {t("unlimitedBudgets")}</li>
              <li>✓ {t("unlimitedGoals")}</li>
              <li>✓ {t("exportReports")}</li>
            </ul>
            {plan !== "PRO" && (
              <button
                onClick={() => handleUpgrade("PRO")}
                disabled={upgradingPlan !== null}
                className="mt-4 w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {upgradingPlan === "PRO" ? "Loading..." : t("upgradeToPro")}
              </button>
            )}
          </div>

          <div className={`border-2 rounded-lg p-4 ${plan === "BUSINESS" ? "border-primary bg-primary/5 dark:bg-green-900/10" : "border-gray-200 dark:border-gray-600"}`}>
            <h3 className="font-bold text-neutral dark:text-gray-200 mb-2">{t("business")}</h3>
            {billingPeriod === "monthly" ? (
              <p className="text-2xl font-bold text-neutral dark:text-gray-200 mb-4">
                €19.99<span className="text-sm font-normal text-neutral-light dark:text-gray-400">{t("perMonth")}</span>
              </p>
            ) : (
              <p className="text-2xl font-bold text-neutral dark:text-gray-200 mb-4">
                €59.99<span className="text-sm font-normal text-neutral-light dark:text-gray-400">{t("perYear")}</span>
              </p>
            )}
            <ul className="text-sm space-y-2 text-neutral dark:text-gray-300">
              <li>✓ {t("everythingInPro")}</li>
              <li>✓ {t("businessTracking")}</li>
              <li>✓ {t("taxCategorization")}</li>
              <li>✓ {t("multiUser")}</li>
            </ul>
            {plan !== "BUSINESS" && (
              <button
                onClick={() => handleUpgrade("BUSINESS")}
                disabled={upgradingPlan !== null}
                className="mt-4 w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {upgradingPlan === "BUSINESS" ? "Loading..." : t("upgradeToBusiness")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-neutral dark:text-gray-200 mb-6">{t("security")}</h2>
        <div className="space-y-4">
          <div>
            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="text-primary dark:text-green-400 hover:text-primary/80 dark:hover:text-green-300 font-medium">
              {t("changePassword")}
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-neutral dark:text-gray-200 mb-4">{t("changePassword")}</h2>

            {passwordError && (
              <div className="bg-negative/10 border border-negative text-negative px-4 py-2 rounded-lg mb-4 text-sm">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-positive/10 border border-positive text-positive px-4 py-2 rounded-lg mb-4 text-sm">
                ✓ Password changed successfully!
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setPasswordError("");
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-neutral dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  {t("cancel")}
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                  {t("save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-neutral dark:text-gray-200 mb-6">{t("preferences")}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">{t("language")}</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "el")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="en">English</option>
              <option value="el">Ελληνικά (Greek)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">{t("theme")}</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "light" | "dark")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="light">{t("light")}</option>
              <option value="dark">{t("dark")}</option>
            </select>
            <p className="text-xs text-neutral-light dark:text-gray-400 mt-1">
              {theme === "dark" ? t("darkThemeEyeStrain") : t("lightThemeDefault")}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">{t("currency")}</label>
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
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">{t("dateFormat")}</label>
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
              <p className="font-medium text-neutral dark:text-gray-200">{t("emailNotifications")}</p>
              <p className="text-sm text-neutral-light dark:text-gray-400">{t("receiveAlerts")}</p>
            </div>
            <button className="bg-positive rounded-full w-12 h-6 relative">
              <div className="absolute right-1 top-1 bg-white rounded-full w-4 h-4"></div>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSavePreferences}
              className="bg-positive hover:bg-positive/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              {t("savePreferences")}
            </button>
            {showPreferencesSaved && (
              <span className="text-positive dark:text-green-400 text-sm font-medium">
                ✓ {t("preferencesSaved")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-2 border-negative/20">
        <h2 className="text-xl font-semibold text-negative mb-4">{t("dangerZone")}</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-neutral dark:text-gray-200">{t("exportAllData")}</p>
              <p className="text-sm text-neutral-light dark:text-gray-400">{t("downloadAllData")}</p>
            </div>
            <button
              onClick={handleExportData}
              className="border border-neutral dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-neutral dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t("export")}
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              <p className="font-medium text-negative">{t("deleteAccount")}</p>
              <p className="text-sm text-neutral-light dark:text-gray-400">{t("permanentlyDelete")}</p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="bg-negative hover:bg-negative/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t("delete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
