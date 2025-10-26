"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: string;
  date: string;
  isRecurring: boolean;
  frequency?: string;
  nextDate?: string;
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
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, goalRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/goals"),
        ]);

        if (transRes.ok) setTransactions(await transRes.json());
        if (goalRes.ok) {
          const goalsData = await goalRes.json();
          setGoals(goalsData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter one-time and recurring transactions
  const oneTimeTransactions = transactions.filter((t) => !t.isRecurring);
  const recurringPayments = transactions.filter((t) => t.isRecurring);

  // Calculate income and expenses from ALL transactions (one-time + recurring)
  const totalIncome = transactions
    .filter((t) => t.type.toLowerCase() === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate monthly recurring income and expenses separately (for display)
  const monthlyRecurringIncome = recurringPayments
    .filter((t) => t.type.toLowerCase() === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyRecurringExpenses = recurringPayments
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Real available balance = Total Income - Total Expenses (already includes recurring)
  const balance = totalIncome - totalExpenses;

  // Get recent transactions (last 5 one-time transactions)
  const recentTransactions = oneTimeTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get upcoming recurring payments (next 3 by nextDate)
  const upcomingPayments = recurringPayments
    .filter((p) => p.nextDate)
    .sort((a, b) => new Date(a.nextDate!).getTime() - new Date(b.nextDate!).getTime())
    .slice(0, 3);

  // Auto-update goals based on current balance
  const totalGoalsTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallGoalProgress = totalGoalsTarget > 0 ? Math.min((balance / totalGoalsTarget) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral dark:text-white mb-2">{t("dashboard")}</h1>
        <p className="text-neutral-light dark:text-gray-400">Your financial overview at a glance</p>
      </div>

      {/* Balance Cards - PocketGuard Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm opacity-90">Available Balance</p>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-4xl font-bold">€{balance.toFixed(2)}</p>
          <p className="text-xs opacity-75 mt-2">
            After recurring (€{(monthlyRecurringIncome - monthlyRecurringExpenses).toFixed(2)}/mo net)
          </p>
        </div>

        {/* Income */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-light dark:text-gray-400">Income</p>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-3xl font-bold text-positive">+€{totalIncome.toFixed(2)}</p>
          <p className="text-xs text-neutral-light dark:text-gray-500 mt-2">This month</p>
        </div>

        {/* Expenses */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-neutral-light dark:text-gray-400">Expenses</p>
            <span className="text-2xl">📉</span>
          </div>
          <p className="text-3xl font-bold text-negative">-€{totalExpenses.toFixed(2)}</p>
          <p className="text-xs text-neutral-light dark:text-gray-500 mt-2">This month</p>
        </div>
      </div>

      {/* Recent Transactions & Upcoming Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral dark:text-white">Recent Transactions</h2>
            <Link
              href="/dashboard/transactions"
              className="text-sm text-primary dark:text-green-400 hover:underline"
            >
              View All →
            </Link>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="text-center py-8 text-neutral-light dark:text-gray-400">
              No transactions yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type.toLowerCase() === "income"
                          ? "bg-positive/10"
                          : "bg-neutral/10"
                      }`}
                    >
                      <span className="text-lg">
                        {transaction.type.toLowerCase() === "income" ? "💰" : "💳"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral dark:text-white">
                        {transaction.category}
                      </p>
                      <p className="text-xs text-neutral-light dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.type.toLowerCase() === "income"
                        ? "text-positive"
                        : "text-negative"
                    }`}
                  >
                    {transaction.type.toLowerCase() === "income" ? "+" : "-"}€
                    {transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral dark:text-white">Upcoming Payments</h2>
            <Link
              href="/dashboard/transactions?tab=recurring"
              className="text-sm text-primary dark:text-green-400 hover:underline"
            >
              Manage →
            </Link>
          </div>
          {upcomingPayments.length === 0 ? (
            <p className="text-center py-8 text-neutral-light dark:text-gray-400">
              No upcoming payments
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                      <span className="text-lg">🔄</span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral dark:text-white">
                        {payment.category}
                      </p>
                      <p className="text-xs text-neutral-light dark:text-gray-400">
                        {payment.frequency?.toUpperCase()} • Next: {payment.nextDate ? new Date(payment.nextDate).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-negative">
                    €{payment.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Goals Progress */}
      {goals.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral dark:text-white">Financial Goals</h2>
            <Link
              href="/dashboard/goals"
              className="text-sm text-primary dark:text-green-400 hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {goals.slice(0, 3).map((goal) => {
              // Auto-calculate progress based on current balance
              const autoProgress = Math.min((balance / goal.targetAmount) * 100, 100);
              return (
                <div key={goal.id}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-neutral dark:text-white">{goal.name}</p>
                    <p className="text-sm font-semibold text-primary dark:text-green-400">
                      {autoProgress.toFixed(0)}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-300"
                      style={{ width: `${autoProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-light dark:text-gray-400 mt-1">
                    €{balance.toFixed(2)} / €{goal.targetAmount.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-neutral dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/transactions"
            className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-green-400 transition-colors"
          >
            <span className="text-3xl mb-2">💰</span>
            <span className="text-sm font-medium text-neutral dark:text-white">Add Transaction</span>
          </Link>
          <Link
            href="/dashboard/goals"
            className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-green-400 transition-colors"
          >
            <span className="text-3xl mb-2">🎯</span>
            <span className="text-sm font-medium text-neutral dark:text-white">Set Goal</span>
          </Link>
          <Link
            href="/dashboard/reports"
            className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-green-400 transition-colors"
          >
            <span className="text-3xl mb-2">📊</span>
            <span className="text-sm font-medium text-neutral dark:text-white">View Reports</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-green-400 transition-colors"
          >
            <span className="text-3xl mb-2">⚙️</span>
            <span className="text-sm font-medium text-neutral dark:text-white">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
