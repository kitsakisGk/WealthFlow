"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RecordSpendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  budgetId: string;
  currentMonth: string;
}

export default function RecordSpendingModal({
  isOpen,
  onClose,
  onSuccess,
  budgetId,
  currentMonth,
}: RecordSpendingModalProps) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      // Create an expense transaction
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: description || `Budget expense - ${category}`,
          category,
          type: "EXPENSE",
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setAmount("");
        setDescription("");
        setCategory("Food & Dining");
        onSuccess();
        onClose();
      } else {
        alert("Failed to record spending");
      }
    } catch (error) {
      console.error("Error recording spending:", error);
      alert("Failed to record spending");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-neutral dark:text-gray-200 mb-4">
          {t("recordSpending")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
              {t("amount")} (€)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="50.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
              {t("description")}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={t("optionalDescription")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
              {t("category")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Food & Dining">{t("foodDining")}</option>
              <option value="Transportation">{t("transportation")}</option>
              <option value="Shopping">{t("shopping")}</option>
              <option value="Entertainment">{t("entertainment")}</option>
              <option value="Bills & Utilities">{t("billsUtilities")}</option>
              <option value="Healthcare">{t("healthcare")}</option>
              <option value="Other">{t("other")}</option>
            </select>
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
              className="flex-1 px-4 py-2 bg-negative hover:bg-negative/90 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? t("recording") : t("recordExpense")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
