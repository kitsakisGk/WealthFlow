"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddRecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddRecurringModal({
  isOpen,
  onClose,
  onSuccess,
}: AddRecurringModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    customCategory: "",
    frequency: "monthly",
    nextDate: new Date().toISOString().split("T")[0],
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalCategory = showCustomCategory ? formData.customCategory : formData.category;

    if (!finalCategory) {
      alert("Please select or enter a category");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: formData.amount,
          category: finalCategory,
          type: "expense",
          date: formData.nextDate,
          isRecurring: true,
          frequency: formData.frequency,
          nextDate: formData.nextDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create recurring payment");
      }

      // Reset form
      setFormData({
        amount: "",
        category: "",
        customCategory: "",
        frequency: "monthly",
        nextDate: new Date().toISOString().split("T")[0],
      });
      setShowCustomCategory(false);

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating recurring payment:", error);
      alert("Failed to create recurring payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-neutral dark:text-gray-200">Add Recurring Payment</h2>
          <button
            onClick={onClose}
            className="text-neutral dark:text-gray-400 hover:text-neutral-dark dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
              {t("amount")} (€)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              onBlur={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) {
                  setFormData({ ...formData, amount: val.toFixed(2) });
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
              {t("category")}
            </label>
            {!showCustomCategory ? (
              <div className="space-y-2">
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">{t("selectCategory")}</option>
                  <option value="Rent">Rent</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Internet">Internet</option>
                  <option value="Phone">Phone</option>
                  <option value="Subscriptions">Subscriptions</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Loan Payment">Loan Payment</option>
                  <option value="Gym Membership">Gym Membership</option>
                  <option value="Streaming Services">Streaming Services</option>
                  <option value="Other">{t("other")}</option>
                </select>
                <button
                  type="button"
                  onClick={() => setShowCustomCategory(true)}
                  className="text-sm text-primary dark:text-green-400 hover:underline"
                >
                  + Enter custom category
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.customCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, customCategory: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter custom category"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomCategory(false);
                    setFormData({ ...formData, customCategory: "" });
                  }}
                  className="text-sm text-primary dark:text-green-400 hover:underline"
                >
                  ← Back to predefined categories
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) =>
                setFormData({ ...formData, frequency: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
              Next Payment Date
            </label>
            <input
              type="date"
              required
              value={formData.nextDate}
              onChange={(e) =>
                setFormData({ ...formData, nextDate: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-neutral dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Recurring Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
