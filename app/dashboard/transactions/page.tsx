"use client";

import { useState, useEffect } from "react";
import AddTransactionModal from "@/components/dashboard/AddTransactionModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: string;
  date: string;
}

export default function TransactionsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTransactions();
      } else {
        alert("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction");
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.type.toLowerCase() === filter;
  });

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type.toLowerCase() === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const net = totalIncome - totalExpenses;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral dark:text-gray-300">{t("loading")}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-neutral dark:text-gray-200">{t("transactions")}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        >
          + {t("addTransaction")}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("totalIncome")}</p>
          <p className="text-2xl font-bold text-positive mt-2">
            €{totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("totalExpenses")}</p>
          <p className="text-2xl font-bold text-negative mt-2">
            €{totalExpenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("netIncome")}</p>
          <p className={`text-2xl font-bold mt-2 ${net >= 0 ? "text-positive" : "text-negative"}`}>
            {net >= 0 ? "+" : ""}€{net.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Transaction Trends Chart */}
      {transactions.length > 0 && (() => {
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return date.toISOString().split('T')[0];
        });

        const dailyData = last30Days.map(date => {
          const dayTransactions = transactions.filter(t => t.date.startsWith(date));
          const income = dayTransactions.filter(t => t.type.toLowerCase() === 'income').reduce((sum, t) => sum + t.amount, 0);
          const expense = dayTransactions.filter(t => t.type.toLowerCase() === 'expense').reduce((sum, t) => sum + t.amount, 0);

          return {
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            income,
            expense
          };
        });

        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-neutral dark:text-gray-200 mb-4">{t("transactionTrends")} (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                  interval="preserveStartEnd"
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
                  dot={false}
                  name={t("income")}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                  name={t("expenses")}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })()}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm font-medium text-neutral dark:text-gray-300 mr-2">{t("filter")}:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-sm bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">{t("allTransactions")}</option>
              <option value="income">{t("income")}</option>
              <option value="expense">{t("expenses")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-light dark:text-gray-400">{t("noTransactionsYet")}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-primary dark:text-green-400 hover:underline"
            >
              {t("addTransaction")}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light dark:text-gray-300 uppercase tracking-wider">
                    {t("date")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light dark:text-gray-300 uppercase tracking-wider">
                    {t("description")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light dark:text-gray-300 uppercase tracking-wider">
                    {t("category")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light dark:text-gray-300 uppercase tracking-wider">
                    {t("amount")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-light dark:text-gray-300 uppercase tracking-wider">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral dark:text-gray-300">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            transaction.type.toLowerCase() === "income"
                              ? "bg-positive/10"
                              : "bg-neutral/10"
                          }`}
                        >
                          <span className="text-sm">
                            {transaction.type.toLowerCase() === "income" ? "💰" : "💳"}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-neutral dark:text-gray-200">
                          {transaction.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary dark:bg-green-900/30 dark:text-green-400">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-semibold ${
                          transaction.type.toLowerCase() === "income"
                            ? "text-positive"
                            : "text-negative"
                        }`}
                      >
                        {transaction.type.toLowerCase() === "income" ? "+" : "-"}€
                        {transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-negative hover:text-negative/80 cursor-pointer"
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  );
}
