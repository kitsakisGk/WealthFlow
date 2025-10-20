"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: string;
  date: string;
}

interface MonthlyBudget {
  id: string;
  month: string;
  plannedIncome: number;
  plannedExpenses: number;
  actualIncome: number;
  actualExpenses: number;
}

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: string;
  category: string;
  isActive: boolean;
}

interface BankAccount {
  id: string;
  bankName: string;
  balance: number;
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
  const [monthlyBudget, setMonthlyBudget] = useState<MonthlyBudget | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, budgetRes, subsRes, accountsRes, goalRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch(`/api/budgets?month=${currentMonth}`),
          fetch("/api/subscriptions"),
          fetch("/api/accounts"),
          fetch("/api/goals"),
        ]);

        if (transRes.ok) setTransactions(await transRes.json());
        if (budgetRes.ok) {
          const data = await budgetRes.json();
          if (data) setMonthlyBudget(data);
        }
        if (subsRes.ok) setSubscriptions(await subsRes.json());
        if (accountsRes.ok) setAccounts(await accountsRes.json());
        if (goalRes.ok) setGoals(await goalRes.json());
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMonth]);

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

  // Prepare data for Pie Chart
  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
  const pieChartData = topCategories.map(([category, amount], index) => ({
    name: category,
    value: amount,
    color: COLORS[index % COLORS.length]
  }));

  // Prepare data for Line Chart (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const lineChartData = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => t.date.startsWith(date));
    const income = dayTransactions.filter(t => t.type.toLowerCase() === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTransactions.filter(t => t.type.toLowerCase() === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      income,
      expense
    };
  });

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
          {pieChartData.length === 0 ? (
            <p className="text-neutral-light dark:text-gray-400 text-center py-8">{t("noExpensesYet")}</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `€${Number(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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

      {/* Income vs Expenses Trend (Last 7 Days) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-neutral dark:text-gray-200 mb-4">Income vs Expenses (Last 7 Days)</h3>
        {lineChartData.every(d => d.income === 0 && d.expense === 0) ? (
          <p className="text-neutral-light dark:text-gray-400 text-center py-8">{t("noTransactionsYet")}</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="date"
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
                formatter={(value) => [`€${Number(value).toFixed(2)}`, '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
                activeDot={{ r: 6 }}
                name={t("income")}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: '#EF4444', r: 4 }}
                activeDot={{ r: 6 }}
                name={t("expenses")}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Monthly Budget & Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Budget Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral dark:text-gray-200">{t("monthlyBudgetPlanner")}</h3>
            <Link href="/dashboard/budgets" className="text-sm text-primary dark:text-green-400 hover:underline">
              {t("viewAll")}
            </Link>
          </div>
          {!monthlyBudget ? (
            <p className="text-neutral-light dark:text-gray-400 text-center py-8">{t("noBudgetForMonth")}</p>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-primary/5 dark:bg-green-900/10 border border-primary/20 dark:border-green-600/20 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-neutral-light dark:text-gray-400">{t("plannedBalance")}</p>
                  <p className="text-sm font-bold text-primary dark:text-green-400">
                    €{(monthlyBudget.plannedIncome - monthlyBudget.plannedExpenses).toFixed(2)}
                  </p>
                </div>
                <div className="text-xs text-neutral-light dark:text-gray-500">
                  €{monthlyBudget.plannedIncome.toFixed(2)} - €{monthlyBudget.plannedExpenses.toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-neutral-light dark:text-gray-400">{t("actualBalance")}</p>
                  <p className={`text-sm font-bold ${
                    monthlyBudget.actualIncome - monthlyBudget.actualExpenses >= 0
                      ? "text-positive"
                      : "text-negative"
                  }`}>
                    €{(monthlyBudget.actualIncome - monthlyBudget.actualExpenses).toFixed(2)}
                  </p>
                </div>
                <div className="text-xs text-neutral-light dark:text-gray-500">
                  €{monthlyBudget.actualIncome.toFixed(2)} - €{monthlyBudget.actualExpenses.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="text-xs font-medium text-neutral dark:text-gray-300">{t("variance")}</span>
                <span className={`text-xs font-bold ${
                  (monthlyBudget.actualIncome - monthlyBudget.actualExpenses) - (monthlyBudget.plannedIncome - monthlyBudget.plannedExpenses) >= 0
                    ? "text-positive"
                    : "text-negative"
                }`}>
                  €{((monthlyBudget.actualIncome - monthlyBudget.actualExpenses) - (monthlyBudget.plannedIncome - monthlyBudget.plannedExpenses)).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral dark:text-gray-200">{t("recurringPayments")}</h3>
            <Link href="/dashboard/budgets" className="text-sm text-primary dark:text-green-400 hover:underline">
              {t("viewAll")}
            </Link>
          </div>
          {subscriptions.length === 0 ? (
            <p className="text-neutral-light dark:text-gray-400 text-center py-8">{t("noSubscriptionsYet")}</p>
          ) : (
            <div className="space-y-3">
              {subscriptions.filter(s => s.isActive).slice(0, 4).map((sub) => {
                const monthlyAmount =
                  sub.billingCycle === "MONTHLY" ? sub.amount :
                  sub.billingCycle === "YEARLY" ? sub.amount / 12 :
                  sub.billingCycle === "WEEKLY" ? sub.amount * 4 :
                  sub.amount;

                return (
                  <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-neutral dark:text-gray-200">{sub.name}</p>
                      <p className="text-xs text-neutral-light dark:text-gray-400">{sub.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-negative dark:text-red-400">€{sub.amount.toFixed(2)}</p>
                      <p className="text-xs text-neutral-light dark:text-gray-500 capitalize">{sub.billingCycle.toLowerCase()}</p>
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral dark:text-gray-300">{t("monthlyTotal")}</span>
                  <span className="text-sm font-bold text-negative dark:text-red-400">
                    €{subscriptions
                      .filter(s => s.isActive)
                      .reduce((sum, s) => {
                        if (s.billingCycle === "MONTHLY") return sum + s.amount;
                        if (s.billingCycle === "YEARLY") return sum + s.amount / 12;
                        if (s.billingCycle === "WEEKLY") return sum + s.amount * 4;
                        return sum;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
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
