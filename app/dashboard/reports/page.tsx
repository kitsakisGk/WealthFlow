"use client";

import { useState, useEffect } from "react";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: string;
  date: string;
}

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (response.ok) {
          setTransactions(await response.json());
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Calculate metrics
  const totalIncome = transactions
    .filter((t) => t.type.toLowerCase() === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  // Category breakdown
  const categoryData = transactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryBreakdown = Object.entries(categoryData)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }));

  // Monthly trends (group by month)
  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 };
    }
    if (t.type.toLowerCase() === "income") {
      acc[month].income += t.amount;
    } else {
      acc[month].expenses += t.amount;
    }
    return acc;
  }, {} as Record<string, { income: number; expenses: number }>);

  const monthlyTrends = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      ...data,
      net: data.income - data.expenses,
    }))
    .slice(-6); // Last 6 months

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-neutral">Financial Reports</h1>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button
            onClick={() => alert("PDF export coming soon! 📊")}
            className="bg-white hover:bg-gray-50 border border-gray-300 text-neutral px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            📊 Export PDF
          </button>
          <button
            onClick={() => alert("Excel export coming soon! 📈")}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            📈 Export Excel
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Total Income</p>
          <p className="text-2xl font-bold text-positive mt-2">€{totalIncome.toFixed(2)}</p>
          <p className="text-sm text-neutral-light mt-1">All time</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Total Expenses</p>
          <p className="text-2xl font-bold text-negative mt-2">€{totalExpenses.toFixed(2)}</p>
          <p className="text-sm text-neutral-light mt-1">All time</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Net Income</p>
          <p className={`text-2xl font-bold mt-2 ${netIncome >= 0 ? "text-positive" : "text-negative"}`}>
            €{netIncome.toFixed(2)}
          </p>
          <p className="text-sm text-neutral-light mt-1">Income - Expenses</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Savings Rate</p>
          <p className="text-2xl font-bold text-primary mt-2">{savingsRate.toFixed(1)}%</p>
          <p className="text-sm text-neutral-light mt-1">Of total income</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-neutral mb-4">Spending by Category</h2>
        {categoryBreakdown.length === 0 ? (
          <p className="text-neutral-light text-center py-8">No expense data yet</p>
        ) : (
          <div className="space-y-4">
            {categoryBreakdown.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral">{item.category}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-neutral">€{item.amount.toFixed(2)}</span>
                    <span className="text-xs text-neutral-light ml-2">({item.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Trends */}
      {monthlyTrends.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-neutral mb-4">Monthly Trends</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-light uppercase">Month</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-light uppercase">Income</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-light uppercase">Expenses</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-light uppercase">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {monthlyTrends.map((item) => (
                  <tr key={item.month}>
                    <td className="px-4 py-3 text-sm text-neutral font-medium">{item.month}</td>
                    <td className="px-4 py-3 text-sm text-positive text-right">€{item.income.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-negative text-right">€{item.expenses.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-sm text-right font-semibold ${item.net >= 0 ? "text-positive" : "text-negative"}`}>
                      {item.net >= 0 ? "+" : ""}€{item.net.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transaction Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-neutral mb-4">Transaction Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-neutral-light mb-1">Total Transactions</p>
            <p className="text-3xl font-bold text-primary">{transactions.length}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-neutral-light mb-1">Income Transactions</p>
            <p className="text-3xl font-bold text-positive">
              {transactions.filter((t) => t.type.toLowerCase() === "income").length}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-neutral-light mb-1">Expense Transactions</p>
            <p className="text-3xl font-bold text-negative">
              {transactions.filter((t) => t.type.toLowerCase() === "expense").length}
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary mb-3">💡 Financial Insights</h3>
        <div className="space-y-2 text-sm text-neutral">
          {savingsRate >= 20 && (
            <p>✓ Great job! You're saving {savingsRate.toFixed(1)}% of your income.</p>
          )}
          {savingsRate < 20 && savingsRate > 0 && (
            <p>⚠ Your savings rate is {savingsRate.toFixed(1)}%. Try to aim for at least 20%.</p>
          )}
          {savingsRate < 0 && (
            <p>⚠ You're spending more than you earn. Consider reducing expenses.</p>
          )}
          {categoryBreakdown.length > 0 && (
            <p>
              • Your biggest expense category is <strong>{categoryBreakdown[0].category}</strong> at €
              {categoryBreakdown[0].amount.toFixed(2)} ({categoryBreakdown[0].percentage.toFixed(1)}%)
            </p>
          )}
          {transactions.length >= 10 && (
            <p>✓ Good tracking habits! You've recorded {transactions.length} transactions.</p>
          )}
        </div>
      </div>
    </div>
  );
}
