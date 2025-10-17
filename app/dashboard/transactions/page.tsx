"use client";

import { useState } from "react";

export default function TransactionsPage() {
  const [filter, setFilter] = useState("all");

  const transactions = [
    { id: 1, name: "Grocery Store", category: "Food & Dining", amount: -85.20, date: "2025-10-17", type: "expense" },
    { id: 2, name: "Salary Deposit", category: "Income", amount: 2500.00, date: "2025-10-16", type: "income" },
    { id: 3, name: "Electric Bill", category: "Utilities", amount: -120.50, date: "2025-10-15", type: "expense" },
    { id: 4, name: "Netflix Subscription", category: "Entertainment", amount: -15.99, date: "2025-10-15", type: "expense" },
    { id: 5, name: "Coffee Shop", category: "Food & Dining", amount: -5.80, date: "2025-10-14", type: "expense" },
    { id: 6, name: "Freelance Project", category: "Income", amount: 850.00, date: "2025-10-13", type: "income" },
    { id: 7, name: "Gas Station", category: "Transportation", amount: -45.00, date: "2025-10-12", type: "expense" },
    { id: 8, name: "Online Shopping", category: "Shopping", amount: -135.99, date: "2025-10-11", type: "expense" },
  ];

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-neutral">Transactions</h1>
        <button
          onClick={() => alert("Feature coming soon! 🚀")}
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        >
          + Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Total Income</p>
          <p className="text-2xl font-bold text-positive mt-2">€3,350.00</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Total Expenses</p>
          <p className="text-2xl font-bold text-negative mt-2">€408.48</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Net</p>
          <p className="text-2xl font-bold text-positive mt-2">+€2,941.52</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-sm font-medium text-neutral mr-2">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            className="flex-1 min-w-[200px] border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-light uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 €{
                        transaction.type === "income" ? "bg-positive/10" : "bg-neutral/10"
                      }`}>
                        <span className="text-sm">{transaction.type === "income" ? "💰" : "💳"}</span>
                      </div>
                      <span className="text-sm font-medium text-neutral">{transaction.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold €{
                      transaction.type === "income" ? "text-positive" : "text-negative"
                    }`}>
                      {transaction.type === "income" ? "+" : ""}€{Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => alert("Feature coming soon! 🚀")}
                      className="text-primary hover:text-primary/80 mr-3 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => alert("Feature coming soon! 🚀")}
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
      </div>
    </div>
  );
}
