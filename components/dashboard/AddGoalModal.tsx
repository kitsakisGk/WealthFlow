"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddGoalModal({
  isOpen,
  onClose,
  onSuccess,
}: AddGoalModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create goal");
      }

      // Reset form
      setFormData({
        name: "",
        targetAmount: "",
        deadline: "",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating goal:", error);
      alert("Failed to create goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-neutral dark:text-gray-200">{t("newGoal")}</h2>
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
              {t("goalName")}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={t("goalNamePlaceholder")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
              {t("targetAmount")} (€)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.targetAmount}
              onChange={(e) =>
                setFormData({ ...formData, targetAmount: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="5000.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
              {t("deadlineOptional")}
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
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
              {loading ? t("creating") : t("createGoalButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
