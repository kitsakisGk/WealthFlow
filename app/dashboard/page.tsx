"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: string;
  date: string;
}

interface Budget {
  id: string;
  category: string;
  amount: number;
  period: string;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export default function DashboardPage() {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, budgetRes, goalRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/budgets"),
          fetch("/api/goals"),
        ]);

        if (transRes.ok) setTransactions(await transRes.json());
        if (budgetRes.ok) setBudgets(await budgetRes.json());
        if (goalRes.ok) setGoals(await goalRes.json());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  const totalIncome = transactions
    .filter((t) => t.type.toLowerCase() === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const totalGoalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalGoalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const goalProgress = totalGoalTarget > 0 ? (totalGoalSaved / totalGoalTarget) * 100 : 0;

  // Get recent transactions (last 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Calculate spending by category
  const categorySpending = transactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const maxCategoryAmount = Math.max(...topCategories.map((c) => c[1]), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("balance")}</p>
              <p className={`text-3xl font-bold mt-2 ${balance >= 0 ? "text-positive" : "text-negative"}`}>
                €{balance.toFixed(2)}
              </p>
            </div>
            <div className="text-4xl">💵</div>
          </div>
          <p className="text-sm text-neutral-light dark:text-gray-400 mt-2">{t("incomeMinusExpenses")}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("income")}</p>
              <p className="text-3xl font-bold text-positive mt-2">€{totalIncome.toFixed(2)}</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
          <p className="text-sm text-neutral-light dark:text-gray-400 mt-2">{t("totalEarned")}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("expenses")}</p>
              <p className="text-3xl font-bold text-negative mt-2">€{totalExpenses.toFixed(2)}</p>
            </div>
            <div className="text-4xl">📉</div>
          </div>
          <p className="text-sm text-neutral-light dark:text-gray-400 mt-2">{t("totalSpent")}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("goalProgress")}</p>
              <p className="text-3xl font-bold text-primary dark:text-green-400 mt-2">{goalProgress.toFixed(0)}%</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
          <p className="text-sm text-neutral-light dark:text-gray-400 mt-2">
            €{totalGoalSaved.toFixed(2)} of €{totalGoalTarget.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral dark:text-gray-200">{t("spendingByCategory")}</h3>
            <Link href="/dashboard/transactions" className="text-sm text-primary dark:text-green-400 hover:underline">
              {t("viewAll")}
            </Link>
          </div>
          {topCategories.length === 0 ? (
            <p className="text-neutral-light dark:text-gray-400 text-center py-8">{t("noExpensesYet")}</p>
          ) : (
            <div className="space-y-4">
              {topCategories.map(([category, amount]) => {
                const percent = (amount / maxCategoryAmount) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-neutral dark:text-gray-300">{category}</span>
                      <span className="text-sm font-semibold text-neutral dark:text-gray-200">€{amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary dark:bg-green-500 h-2 rounded-full"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral dark:text-gray-200">{t("recentTransactions")}</h3>
            <Link href="/dashboard/transactions" className="text-sm text-primary dark:text-green-400 hover:underline">
              {t("viewAll")}
            </Link>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="text-neutral-light dark:text-gray-400 text-center py-8">{t("noTransactionsYet")}</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type.toLowerCase() === "income" ? "bg-positive/10 dark:bg-positive/20" : "bg-neutral/10 dark:bg-gray-700"
                      }`}
                    >
                      <span className="text-lg">
                        {transaction.type.toLowerCase() === "income" ? "💰" : "💳"}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-neutral dark:text-gray-200">{transaction.description}</p>
                      <p className="text-xs text-neutral-light dark:text-gray-400">{transaction.category}</p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      transaction.type.toLowerCase() === "income" ? "text-positive" : "text-negative"
                    }`}
                  >
                    {transaction.type.toLowerCase() === "income" ? "+" : "-"}€{transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Budgets & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Budgets */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral">{t("activeBudgets")}</h3>
            <Link href="/dashboard/budgets" className="text-sm text-primary hover:underline">
              {t("viewAll")}
            </Link>
          </div>
          {budgets.length === 0 ? (
            <p className="text-neutral-light text-center py-8">{t("noBudgetsYet")}</p>
          ) : (
            <div className="space-y-3">
              {budgets.slice(0, 3).map((budget) => (
                <div key={budget.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-neutral">{budget.category}</p>
                    <p className="text-xs text-neutral-light capitalize">{budget.period.toLowerCase()}</p>
                  </div>
                  <p className="text-sm font-semibold text-primary">€{budget.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Goals */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral">{t("activeGoals")}</h3>
            <Link href="/dashboard/goals" className="text-sm text-primary hover:underline">
              {t("viewAll")}
            </Link>
          </div>
          {goals.length === 0 ? (
            <p className="text-neutral-light text-center py-8">{t("noGoalsYet")}</p>
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 3).map((goal) => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-neutral">{goal.name}</p>
                      <p className="text-xs text-primary font-semibold">{progress.toFixed(0)}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-positive h-2 rounded-full"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-light mt-1">
                      €{goal.currentAmount.toFixed(2)} / €{goal.targetAmount.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">{t("quickActions")}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/transactions"
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          >
            <span className="text-3xl mb-2">💰</span>
            <span className="text-sm font-medium text-neutral">{t("addTransaction")}</span>
          </Link>
          <Link
            href="/dashboard/budgets"
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          >
            <span className="text-3xl mb-2">📈</span>
            <span className="text-sm font-medium text-neutral">{t("createBudget")}</span>
          </Link>
          <Link
            href="/dashboard/goals"
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          >
            <span className="text-3xl mb-2">🎯</span>
            <span className="text-sm font-medium text-neutral">{t("newGoal")}</span>
          </Link>
          <Link
            href="/dashboard/reports"
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer"
          >
            <span className="text-3xl mb-2">📄</span>
            <span className="text-sm font-medium text-neutral">{t("viewReports")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
