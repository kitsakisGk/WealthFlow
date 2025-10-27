"use client";

import { useState, useEffect } from "react";
import AddTransactionModal from "@/components/dashboard/AddTransactionModal";
import AddRecurringModal from "@/components/dashboard/AddRecurringModal";
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

export default function TransactionsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"expenses" | "recurring">("expenses");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);

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

  // Filter transactions based on active tab
  const oneTimeTransactions = transactions.filter((t) => !t.isRecurring);
  const recurringTransactions = transactions.filter((t) => t.isRecurring);

  // Calculate totals from ALL transactions (one-time + recurring)
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
          data-tutorial="add-transaction-btn"
          onClick={() => activeTab === "expenses" ? setIsExpenseModalOpen(true) : setIsRecurringModalOpen(true)}
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        >
          + {activeTab === "expenses" ? "Add Transaction" : "Add Recurring Payment"}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("expenses")}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "expenses"
                  ? "border-primary text-primary dark:text-green-400"
                  : "border-transparent text-neutral-light dark:text-gray-400 hover:text-neutral dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              Expenses & Income
            </button>
            <button
              onClick={() => setActiveTab("recurring")}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "recurring"
                  ? "border-primary text-primary dark:text-green-400"
                  : "border-transparent text-neutral-light dark:text-gray-400 hover:text-neutral dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              Recurring Payments
            </button>
          </nav>
        </div>
      </div>

      {/* Summary Cards - Only for Expenses tab */}
      {activeTab === "expenses" && (
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
      )}

      {/* Transactions List */}
      {activeTab === "expenses" ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {oneTimeTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-light dark:text-gray-400">{t("noTransactionsYet")}</p>
              <button
                onClick={() => setIsExpenseModalOpen(true)}
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
                      {t("type")}
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
                  {oneTimeTransactions
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((transaction) => (
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
                              {transaction.type.toUpperCase()}
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
      ) : (
        /* Recurring Payments List */
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {recurringTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-light dark:text-gray-400">No recurring payments yet</p>
              <button
                onClick={() => setIsRecurringModalOpen(true)}
                className="mt-4 text-primary dark:text-green-400 hover:underline"
              >
                Add Recurring Payment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light dark:text-gray-300 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light dark:text-gray-300 uppercase tracking-wider">
                      Next Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-light dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recurringTransactions
                    .sort((a, b) => {
                      if (!a.nextDate || !b.nextDate) return 0;
                      return new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime();
                    })
                    .map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-primary/10">
                              <span className="text-sm">🔄</span>
                            </div>
                            <span className="text-sm font-medium text-neutral dark:text-gray-200">
                              {transaction.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {transaction.frequency?.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral dark:text-gray-300">
                          {transaction.nextDate
                            ? new Date(transaction.nextDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-negative">
                            -€{transaction.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="text-negative hover:text-negative/80 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <AddTransactionModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={fetchTransactions}
      />

      <AddRecurringModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  );
}
