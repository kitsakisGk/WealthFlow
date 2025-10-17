"use client";

import { useState } from "react";

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBudgetModal({
  isOpen,
  onClose,
  onSuccess,
}: AddBudgetModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    limit: "",
    period: "monthly" as "monthly" | "weekly" | "yearly",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create budget");
      }

      // Reset form
      setFormData({
        category: "",
        limit: "",
        period: "monthly",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating budget:", error);
      alert("Failed to create budget. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-neutral-dark">Create Budget</h2>
          <button
            onClick={onClose}
            className="text-neutral hover:text-neutral-dark"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Category
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select category</option>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Transportation">Transportation</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Bills & Utilities">Bills & Utilities</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Budget Limit (€)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.limit}
              onChange={(e) =>
                setFormData({ ...formData, limit: e.target.value })
              }
              className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="500.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Period
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, period: "weekly" })}
                className={`py-2 px-4 rounded-lg ${
                  formData.period === "weekly"
                    ? "bg-primary text-white"
                    : "bg-neutral-light text-neutral-dark"
                }`}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, period: "monthly" })}
                className={`py-2 px-4 rounded-lg ${
                  formData.period === "monthly"
                    ? "bg-primary text-white"
                    : "bg-neutral-light text-neutral-dark"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, period: "yearly" })}
                className={`py-2 px-4 rounded-lg ${
                  formData.period === "yearly"
                    ? "bg-primary text-white"
                    : "bg-neutral-light text-neutral-dark"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-neutral-light text-neutral-dark rounded-lg hover:bg-neutral-light"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
