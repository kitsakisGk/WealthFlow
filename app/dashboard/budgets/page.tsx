"use client";

import { useState, useEffect } from "react";
import AddBudgetModal from "@/components/dashboard/AddBudgetModal";

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: string;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBudgets = async () => {
    try {
      const response = await fetch("/api/budgets");
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;

    try {
      const response = await fetch(`/api/budgets?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBudgets();
      } else {
        alert("Failed to delete budget");
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Failed to delete budget");
    }
  };

  const totalAllocated = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral">Loading budgets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-neutral">Budgets</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        >
          + Create Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-neutral-light mb-4">No budgets yet.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-primary hover:underline"
          >
            Create your first budget
          </button>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-neutral-light">Total Allocated</p>
              <p className="text-2xl font-bold text-neutral mt-2">€{totalAllocated.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-neutral-light">Total Spent</p>
              <p className="text-2xl font-bold text-negative mt-2">€{totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-neutral-light">Remaining</p>
              <p className={`text-2xl font-bold mt-2 ${totalRemaining >= 0 ? "text-positive" : "text-negative"}`}>
                €{totalRemaining.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Overall Progress */}
          {totalAllocated > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-neutral mb-4">Overall Budget Progress</h2>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-light">Total Budget Usage</span>
                  <span className="font-semibold text-neutral">
                    €{totalSpent.toFixed(2)} / €{totalAllocated.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      (totalSpent / totalAllocated) * 100 > 90 ? "bg-negative" : "bg-positive"
                    }`}
                    style={{ width: `${Math.min((totalSpent / totalAllocated) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-neutral-light mt-2">
                {((totalSpent / totalAllocated) * 100).toFixed(1)}% of total budget used
              </p>
            </div>
          )}

          {/* Budget Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {budgets.map((budget) => {
              const percentUsed = (budget.spent / budget.limit) * 100;
              const remaining = budget.limit - budget.spent;
              const isOverBudget = budget.spent > budget.limit;

              return (
                <div key={budget.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral">{budget.category}</h3>
                      <p className="text-sm text-neutral-light capitalize">{budget.period.toLowerCase()}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-negative hover:text-negative/80 text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-light">Spent</span>
                        <span className="font-semibold text-neutral">
                          €{budget.spent.toFixed(2)} / €{budget.limit.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            isOverBudget
                              ? "bg-negative"
                              : percentUsed > 80
                              ? "bg-yellow-500"
                              : "bg-positive"
                          }`}
                          style={{ width: `${Math.min(percentUsed, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-neutral-light">Remaining</p>
                        <p className={`text-lg font-bold ${remaining >= 0 ? "text-positive" : "text-negative"}`}>
                          €{Math.abs(remaining).toFixed(2)}
                          {isOverBudget && <span className="text-sm"> over</span>}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-light">Used</p>
                        <p className="text-lg font-bold text-neutral">{percentUsed.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>

                  {isOverBudget && (
                    <div className="mt-4 bg-negative/10 border border-negative/20 rounded-lg p-3">
                      <p className="text-sm text-negative font-medium">
                        ⚠️ Over budget by €{Math.abs(remaining).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">💡 Budget Tips</h3>
            <ul className="space-y-2 text-sm text-neutral">
              <li>• Review your budgets weekly to stay on track</li>
              <li>• Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
              <li>• Adjust budgets based on your actual spending patterns</li>
              <li>• Track expenses in real-time to avoid overspending</li>
            </ul>
          </div>
        </>
      )}

      <AddBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchBudgets}
      />
    </div>
  );
}
