"use client";

import { useState } from "react";

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
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-neutral-dark">Add Transaction</h2>
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
              Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "expense" })}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  formData.type === "expense"
                    ? "bg-negative text-white"
                    : "bg-neutral-light text-neutral-dark"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "income" })}
                className={`flex-1 py-2 px-4 rounded-lg ${
                  formData.type === "income"
                    ? "bg-positive text-white"
                    : "bg-neutral-light text-neutral-dark"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Amount (€)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Description
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Groceries, Salary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Category
            </label>
            <select
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
              <option value="Salary">Salary</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
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
              {loading ? "Adding..." : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
