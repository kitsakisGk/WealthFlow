"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTransactionModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    type: "expense" as "income" | "expense",
    date: new Date().toISOString().split("T")[0],
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      // Reset form
      setFormData({
        amount: "",
        description: "",
        category: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Failed to create transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-neutral dark:text-gray-200">{t("addTransaction")}</h2>
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
              {t("type")}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "expense" })}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  formData.type === "expense"
                    ? "bg-negative text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-neutral dark:text-gray-300"
                }`}
              >
                {t("expenses")}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "income" })}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  formData.type === "income"
                    ? "bg-positive text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-neutral dark:text-gray-300"
                }`}
              >
                {t("income")}
              </button>
            </div>
          </div>

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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
              {t("description")}
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Groceries, Salary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
              {t("category")}
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">{t("selectCategory")}</option>
              <option value="Food & Dining">{t("foodDining")}</option>
              <option value="Transportation">{t("transportation")}</option>
              <option value="Shopping">{t("shopping")}</option>
              <option value="Entertainment">{t("entertainment")}</option>
              <option value="Bills & Utilities">{t("billsUtilities")}</option>
              <option value="Healthcare">{t("healthcare")}</option>
              <option value="Salary">{t("salary")}</option>
              <option value="Business">{t("businessCategory")}</option>
              <option value="Other">{t("other")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
              {t("date")}
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
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
              {loading ? t("adding") : t("addTransaction")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
