"use client";

import { useState, useEffect } from "react";
import AddGoalModal from "@/components/dashboard/AddGoalModal";
import AddFundsModal from "@/components/dashboard/AddFundsModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
}

export default function GoalsPage() {
  const { t } = useLanguage();
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
        <p className="text-neutral dark:text-gray-300">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-neutral dark:text-gray-200">{t("goals")}</h1>
        <button
          onClick={() => setIsAddGoalModalOpen(true)}
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        >
          + {t("newGoal")}
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <p className="text-neutral-light dark:text-gray-400 mb-4">{t("noGoalsYet")}</p>
          <button
            onClick={() => setIsAddGoalModalOpen(true)}
            className="text-primary dark:text-green-400 hover:underline"
          >
            {t("createGoal")}
          </button>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("totalGoalAmount")}</p>
              <p className="text-2xl font-bold text-neutral dark:text-gray-200 mt-2">€{totalTarget.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("totalSaved")}</p>
              <p className="text-2xl font-bold text-positive mt-2">€{totalSaved.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("overallProgress")}</p>
              <p className="text-2xl font-bold text-primary dark:text-green-400 mt-2">
                {totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>

          {/* Goals Progress Visualization */}
          {(() => {
            const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

            // Create data showing saved vs remaining for each goal
            const goalsChartData = goals.flatMap((goal, index) => {
              const saved = goal.currentAmount;
              const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
              const percentage = ((saved / goal.targetAmount) * 100).toFixed(1);

              return [
                {
                  name: `${goal.name} (Saved)`,
                  value: saved,
                  color: COLORS[index % COLORS.length],
                  percentage: percentage + '%',
                  goalName: goal.name
                },
                {
                  name: `${goal.name} (Remaining)`,
                  value: remaining,
                  color: COLORS[index % COLORS.length] + '40', // Add transparency
                  percentage: (100 - parseFloat(percentage)).toFixed(1) + '%',
                  goalName: goal.name
                }
              ];
            });

            return (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-neutral dark:text-gray-200 mb-4">{t("goalsBreakdown")}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={goalsChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => {
                        if (name.includes('Remaining')) return ''; // Don't show label for remaining
                        return `${percentage}`;
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {goalsChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => {
                        const goalName = props.payload.goalName;
                        const isSaved = name.toString().includes('Saved');
                        return [`€${Number(value).toFixed(2)}`, isSaved ? `${goalName} (Saved)` : `${goalName} (Remaining)`];
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            );
          })()}

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
                <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-t-4 border-primary dark:border-green-500">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-neutral dark:text-gray-200">{goal.name}</h3>
                    </div>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-negative hover:text-negative/80 text-sm"
                    >
                      {t("delete")}
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-positive">
                        €{goal.currentAmount.toFixed(2)}
                      </span>
                      <span className="font-semibold text-neutral dark:text-gray-200">
                        €{goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-positive h-4 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-semibold text-primary dark:text-green-400">
                        {progress.toFixed(1)}% {t("complete")}
                      </span>
                      <span className="text-sm text-neutral-light dark:text-gray-400">
                        €{remaining.toFixed(2)} {t("toGo")}
                      </span>
                    </div>
                  </div>

                  {/* Deadline */}
                  {goal.deadline && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mb-4">
                      <div>
                        <p className="text-xs text-neutral-light dark:text-gray-400">{t("deadline")}</p>
                        <p className="text-sm font-semibold text-neutral dark:text-gray-200">
                          {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      {daysUntilDeadline !== null && (
                        <div className="text-right">
                          <p className="text-xs text-neutral-light dark:text-gray-400">{t("timeRemaining")}</p>
                          <p
                            className={`text-sm font-semibold ${
                              daysUntilDeadline < 30 ? "text-negative" : "text-neutral dark:text-gray-200"
                            }`}
                          >
                            {daysUntilDeadline} {t("days")}
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
                      {t("addFunds")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Savings Tips */}
          <div className="bg-primary/5 dark:bg-green-900/20 border border-primary/20 dark:border-green-500/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary dark:text-green-400 mb-3">🎯 {t("goalAchievementTips")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <span className="text-positive font-bold mr-2">✓</span>
                <p className="text-sm text-neutral dark:text-gray-300">
                  <strong>{t("automateSavings")}:</strong> {t("automateSavingsDesc")}
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-positive font-bold mr-2">✓</span>
                <p className="text-sm text-neutral dark:text-gray-300">
                  <strong>{t("breakItDown")}:</strong> {t("breakItDownDesc")}
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-positive font-bold mr-2">✓</span>
                <p className="text-sm text-neutral dark:text-gray-300">
                  <strong>{t("stayMotivated")}:</strong> {t("stayMotivatedDesc")}
                </p>
              </div>
              <div className="flex items-start">
                <span className="text-positive font-bold mr-2">✓</span>
                <p className="text-sm text-neutral dark:text-gray-300">
                  <strong>{t("beRealistic")}:</strong> {t("beRealisticDesc")}
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
