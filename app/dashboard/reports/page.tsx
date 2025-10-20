"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useLanguage } from "@/contexts/LanguageContext";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: string;
  date: string;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  balance: number;
  accountNumber: string | null;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export default function ReportsPage() {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, accountsRes, goalsRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/accounts"),
          fetch("/api/goals"),
        ]);

        if (transRes.ok) setTransactions(await transRes.json());
        if (accountsRes.ok) setAccounts(await accountsRes.json());
        if (goalsRes.ok) setGoals(await goalsRes.json());
      } catch (error) {
        console.error("Error fetching reports data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Calculate accounts total
  const totalAccountBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Calculate goals progress
  const totalGoalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalGoalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const goalProgressPercentage = totalGoalTarget > 0 ? (totalGoalSaved / totalGoalTarget) * 100 : 0;

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

  // Excel export function
  const handleExportExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: Summary
    const summaryData = [
      ["Financial Summary Report"],
      ["Generated on:", new Date().toLocaleDateString()],
      [],
      ["Metric", "Amount"],
      ["Total Income", `€${totalIncome.toFixed(2)}`],
      ["Total Expenses", `€${totalExpenses.toFixed(2)}`],
      ["Net Income", `€${netIncome.toFixed(2)}`],
      ["Savings Rate", `${savingsRate.toFixed(1)}%`],
      [],
      ["Transaction Count", transactions.length],
      ["Income Transactions", transactions.filter((t) => t.type.toLowerCase() === "income").length],
      ["Expense Transactions", transactions.filter((t) => t.type.toLowerCase() === "expense").length],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, "Summary");

    // Sheet 2: All Transactions
    const transactionsData = [
      ["Date", "Description", "Category", "Type", "Amount"],
      ...transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.category,
        t.type,
        `€${t.amount.toFixed(2)}`,
      ]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(transactionsData);
    XLSX.utils.book_append_sheet(wb, ws2, "Transactions");

    // Sheet 3: Category Breakdown
    if (categoryBreakdown.length > 0) {
      const categoryData = [
        ["Category", "Amount", "Percentage"],
        ...categoryBreakdown.map((item) => [
          item.category,
          `€${item.amount.toFixed(2)}`,
          `${item.percentage.toFixed(1)}%`,
        ]),
      ];
      const ws3 = XLSX.utils.aoa_to_sheet(categoryData);
      XLSX.utils.book_append_sheet(wb, ws3, "Categories");
    }

    // Sheet 4: Monthly Trends
    if (monthlyTrends.length > 0) {
      const monthlyData = [
        ["Month", "Income", "Expenses", "Net"],
        ...monthlyTrends.map((item) => [
          item.month,
          `€${item.income.toFixed(2)}`,
          `€${item.expenses.toFixed(2)}`,
          `€${item.net.toFixed(2)}`,
        ]),
      ];
      const ws4 = XLSX.utils.aoa_to_sheet(monthlyData);
      XLSX.utils.book_append_sheet(wb, ws4, "Monthly Trends");
    }

    // Sheet 5: Bank Accounts
    if (accounts.length > 0) {
      const accountsData = [
        ["Bank Name", "Account Type", "Balance"],
        ...accounts.map((acc) => [
          acc.bankName,
          acc.accountType,
          `€${acc.balance.toFixed(2)}`,
        ]),
        [],
        ["Total Balance", "", `€${totalAccountBalance.toFixed(2)}`],
      ];
      const ws5 = XLSX.utils.aoa_to_sheet(accountsData);
      XLSX.utils.book_append_sheet(wb, ws5, "Bank Accounts");
    }

    // Sheet 6: Savings Goals
    if (goals.length > 0) {
      const goalsData = [
        ["Goal Name", "Target Amount", "Current Amount", "Progress %"],
        ...goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          return [
            goal.name,
            `€${goal.targetAmount.toFixed(2)}`,
            `€${goal.currentAmount.toFixed(2)}`,
            `${progress.toFixed(1)}%`,
          ];
        }),
        [],
        ["Total Target", `€${totalGoalTarget.toFixed(2)}`, `€${totalGoalSaved.toFixed(2)}`, `${goalProgressPercentage.toFixed(1)}%`],
      ];
      const ws6 = XLSX.utils.aoa_to_sheet(goalsData);
      XLSX.utils.book_append_sheet(wb, ws6, "Savings Goals");
    }

    // Generate file name with date
    const fileName = `WealthFlow_Report_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Export
    XLSX.writeFile(wb, fileName);
  };

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
        <h1 className="text-3xl font-bold text-neutral">{t("financialReports")}</h1>
        <button
          onClick={handleExportExcel}
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        >
          📊 {t("exportToExcel")}
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">{t("totalIncome")}</p>
          <p className="text-2xl font-bold text-positive mt-2">€{totalIncome.toFixed(2)}</p>
          <p className="text-sm text-neutral-light mt-1">{t("allTime")}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">{t("totalExpenses")}</p>
          <p className="text-2xl font-bold text-negative mt-2">€{totalExpenses.toFixed(2)}</p>
          <p className="text-sm text-neutral-light mt-1">{t("allTime")}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">{t("netIncome")}</p>
          <p className={`text-2xl font-bold mt-2 ${netIncome >= 0 ? "text-positive" : "text-negative"}`}>
            €{netIncome.toFixed(2)}
          </p>
          <p className="text-sm text-neutral-light mt-1">{t("incomeMinusExpenses")}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">{t("savingsRate")}</p>
          <p className="text-2xl font-bold text-primary mt-2">{savingsRate.toFixed(1)}%</p>
          <p className="text-sm text-neutral-light mt-1">{t("ofTotalIncome")}</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-neutral mb-4">{t("spendingByCategory")}</h2>
        {categoryBreakdown.length === 0 ? (
          <p className="text-neutral-light text-center py-8">{t("noExpensesYet")}</p>
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

      {/* Accounts & Goals Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Accounts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-neutral dark:text-gray-200 mb-4">{t("bankAccounts")}</h2>
          {accounts.length === 0 ? (
            <p className="text-neutral-light dark:text-gray-400 text-center py-8">{t("noAccountsYet")}</p>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-primary/10 dark:bg-green-900/20 border border-primary/30 dark:border-green-600/30 rounded-lg">
                <p className="text-sm text-neutral-light dark:text-gray-400 mb-1">Total Balance Across All Accounts</p>
                <p className="text-3xl font-bold text-primary dark:text-green-400">€{totalAccountBalance.toFixed(2)}</p>
                <p className="text-xs text-neutral-light dark:text-gray-500 mt-1">{accounts.length} account(s)</p>
              </div>
              <div className="space-y-2">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-neutral dark:text-gray-200">{account.bankName}</p>
                      <p className="text-xs text-neutral-light dark:text-gray-400 capitalize">{account.accountType.toLowerCase()}</p>
                    </div>
                    <p className="text-sm font-bold text-primary dark:text-green-400">€{account.balance.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Goals Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-neutral dark:text-gray-200 mb-4">{t("savingsGoals")}</h2>
          {goals.length === 0 ? (
            <p className="text-neutral-light dark:text-gray-400 text-center py-8">{t("noGoalsYet")}</p>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-primary/10 dark:bg-green-900/20 border border-primary/30 dark:border-green-600/30 rounded-lg">
                <p className="text-sm text-neutral-light dark:text-gray-400 mb-1">Overall Goal Progress</p>
                <p className="text-3xl font-bold text-primary dark:text-green-400">{goalProgressPercentage.toFixed(0)}%</p>
                <p className="text-xs text-neutral-light dark:text-gray-500 mt-1">
                  €{totalGoalSaved.toFixed(2)} of €{totalGoalTarget.toFixed(2)}
                </p>
              </div>
              <div className="space-y-2">
                {goals.map((goal) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100;
                  return (
                    <div key={goal.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-neutral dark:text-gray-200">{goal.name}</p>
                        <p className="text-xs font-semibold text-primary dark:text-green-400">{progress.toFixed(0)}%</p>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-1">
                        <div
                          className="bg-primary dark:bg-green-500 h-2 rounded-full"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-neutral-light dark:text-gray-400">
                        €{goal.currentAmount.toFixed(2)} / €{goal.targetAmount.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-neutral dark:text-gray-200 mb-4">Transaction Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-neutral-light dark:text-gray-400 mb-1">Total Transactions</p>
            <p className="text-3xl font-bold text-primary dark:text-green-400">{transactions.length}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-neutral-light dark:text-gray-400 mb-1">Income Transactions</p>
            <p className="text-3xl font-bold text-positive">
              {transactions.filter((t) => t.type.toLowerCase() === "income").length}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-neutral-light dark:text-gray-400 mb-1">Expense Transactions</p>
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
