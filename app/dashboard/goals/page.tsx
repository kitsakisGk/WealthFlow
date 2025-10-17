"use client";

import { useState, useEffect } from "react";
import AddGoalModal from "@/components/dashboard/AddGoalModal";
import AddFundsModal from "@/components/dashboard/AddFundsModal";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [addFundsModal, setAddFundsModal] = useState<{
    isOpen: boolean;
    goalId: string;
    goalName: string;
  }>({ isOpen: false, goalId: "", goalName: "" });

  const fetchGoals = async () => {
    try {
      const response = await fetch("/api/goals");
      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      const response = await fetch(`/api/goals?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchGoals();
      } else {
        alert("Failed to delete goal");
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      alert("Failed to delete goal");
    }
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral">Loading goals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-neutral">Financial Goals</h1>
        <button
          onClick={() => setIsAddGoalModalOpen(true)}
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        >
          + New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-neutral-light mb-4">No goals yet.</p>
          <button
            onClick={() => setIsAddGoalModalOpen(true)}
            className="text-primary hover:underline"
          >
            Create your first goal
          </button>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-neutral-light">Total Goal Amount</p>
              <p className="text-2xl font-bold text-neutral mt-2">€{totalTarget.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-neutral-light">Total Saved</p>
              <p className="text-2xl font-bold text-positive mt-2">€{totalSaved.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm font-medium text-neutral-light">Overall Progress</p>
              <p className="text-2xl font-bold text-primary mt-2">
                {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              const daysUntilDeadline = goal.deadline
                ? Math.ceil(
                    (new Date(goal.deadline).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                : null;

              return (
                <div key={goal.id} className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-primary">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-neutral">{goal.name}</h3>
                    </div>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-negative hover:text-negative/80 text-sm"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-positive">
                        €{goal.currentAmount.toFixed(2)}
                      </span>
                      <span className="font-semibold text-neutral">
                        €{goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-positive h-4 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-semibold text-primary">
                        {progress.toFixed(1)}% Complete
                      </span>
                      <span className="text-sm text-neutral-light">
                        €{remaining.toFixed(2)} to go
                      </span>
                    </div>
                  </div>

                  {/* Deadline */}
                  {goal.deadline && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                      <div>
                        <p className="text-xs text-neutral-light">Deadline</p>
                        <p className="text-sm font-semibold text-neutral">
                          {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      {daysUntilDeadline !== null && (
                        <div className="text-right">
                          <p className="text-xs text-neutral-light">Time Remaining</p>
                          <p
                            className={`text-sm font-semibold ${
                              daysUntilDeadline < 30 ? "text-negative" : "text-neutral"
                            }`}
                          >
                            {daysUntilDeadline} days
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        setAddFundsModal({ isOpen: true, goalId: goal.id, goalName: goal.name })
                      }
                      className="flex-1 bg-positive hover:bg-positive/90 text-white py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      Add Funds
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Savings Tips */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-3">🎯 Goal Achievement Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-positive font-bold mr-2">✓</span>
                <p className="text-sm text-neutral">
                  <strong>Automate savings:</strong> Set up automatic transfers to your goal funds
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-positive font-bold mr-2">✓</span>
                <p className="text-sm text-neutral">
                  <strong>Break it down:</strong> Calculate monthly/weekly savings needed
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-positive font-bold mr-2">✓</span>
                <p className="text-sm text-neutral">
                  <strong>Stay motivated:</strong> Visualize your goal and celebrate milestones
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-positive font-bold mr-2">✓</span>
                <p className="text-sm text-neutral">
                  <strong>Be realistic:</strong> Set achievable deadlines to avoid frustration
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => setIsAddGoalModalOpen(false)}
        onSuccess={fetchGoals}
      />

      <AddFundsModal
        isOpen={addFundsModal.isOpen}
        onClose={() => setAddFundsModal({ isOpen: false, goalId: "", goalName: "" })}
        onSuccess={fetchGoals}
        goalId={addFundsModal.goalId}
        goalName={addFundsModal.goalName}
      />
    </div>
  );
}
