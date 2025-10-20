"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  goalId: string;
  goalName: string;
}

export default function AddFundsModal({
  isOpen,
  onClose,
  onSuccess,
  goalId,
  goalName,
}: AddFundsModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/goals", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: goalId, amount: parseFloat(amount) }),
      });

      if (!response.ok) {
        throw new Error("Failed to add funds");
      }

      setAmount("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding funds:", error);
      alert("Failed to add funds. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-neutral dark:text-gray-200">{t("addFunds")}</h2>
          <button
            onClick={onClose}
            className="text-neutral dark:text-gray-400 hover:text-neutral-dark dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-neutral-light dark:text-gray-400 mb-4">
          {t("addFundsTo")}: <span className="font-semibold text-neutral dark:text-gray-200">{goalName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
              {t("amountToAdd")} (€)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="100.00"
              autoFocus
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
              {loading ? t("adding") : t("addFundsButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
