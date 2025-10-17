"use client";

import { useState } from "react";

export default function ReportsPage() {
  const [period, setPeriod] = useState("monthly");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-neutral">Financial Reports</h1>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button
            onClick={() => alert("Feature coming soon! 🚀")}
            className="bg-white hover:bg-gray-50 border border-gray-300 text-neutral px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            📊 Export PDF
          </button>
          <button
            onClick={() => alert("Feature coming soon! 🚀")}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            📈 Export Excel
          </button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="text-sm font-medium text-neutral mr-4">Report Period:</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
          <option value="quarterly">This Quarter</option>
          <option value="yearly">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Total Income</p>
          <p className="text-2xl font-bold text-positive mt-2">€8,500.00</p>
          <p className="text-sm text-positive mt-1">↑ 12.5% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Total Expenses</p>
          <p className="text-2xl font-bold text-negative mt-2">€3,260.00</p>
          <p className="text-sm text-positive mt-1">↓ 5.2% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Net Savings</p>
          <p className="text-2xl font-bold text-neutral mt-2">€5,240.00</p>
          <p className="text-sm text-positive mt-1">↑ 18.3% vs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Savings Rate</p>
          <p className="text-2xl font-bold text-primary mt-2">61.6%</p>
          <p className="text-sm text-neutral-light mt-1">of income saved</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-neutral mb-4">Income vs Expenses</h3>
          <div className="space-y-4">
            {[
              { month: "January", income: 7200, expenses: 3100 },
              { month: "February", income: 7500, expenses: 3350 },
              { month: "March", income: 8000, expenses: 3200 },
              { month: "April", income: 7800, expenses: 2980 },
              { month: "May", income: 8500, expenses: 3260 },
            ].map((data) => (
              <div key={data.month}>
                <p className="text-sm font-medium text-neutral mb-2">{data.month}</p>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-positive">Income</span>
                      <span className="font-semibold">€{data.income}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-positive h-2 rounded-full"
                        style={{ width: `${(data.income / 9000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-negative">Expenses</span>
                      <span className="font-semibold">€{data.expenses}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-negative h-2 rounded-full"
                        style={{ width: `${(data.expenses / 9000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-neutral mb-4">Expense Breakdown</h3>
          <div className="space-y-4">
            {[
              { category: "Food & Dining", amount: 850, percent: 26, color: "bg-positive" },
              { category: "Transportation", amount: 420, percent: 13, color: "bg-primary" },
              { category: "Shopping", amount: 680, percent: 21, color: "bg-neutral" },
              { category: "Entertainment", amount: 310, percent: 10, color: "bg-yellow-500" },
              { category: "Utilities", amount: 520, percent: 16, color: "bg-blue-500" },
              { category: "Other", amount: 480, percent: 14, color: "bg-gray-400" },
            ].map((item) => (
              <div key={item.category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-neutral">{item.category}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-neutral">€{item.amount}</span>
                    <span className="text-xs text-neutral-light ml-2">({item.percent}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.percent * 3}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spending Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-neutral mb-4">Monthly Spending Trends</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-light">Category</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-light">Jan</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-light">Feb</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-light">Mar</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-light">Apr</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-light">May</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-light">Trend</th>
              </tr>
            </thead>
            <tbody>
              {[
                { category: "Food & Dining", data: [720, 850, 780, 820, 850], trend: "up" },
                { category: "Transportation", data: [380, 420, 390, 410, 420], trend: "up" },
                { category: "Entertainment", data: [450, 380, 320, 290, 310], trend: "down" },
                { category: "Shopping", data: [520, 680, 590, 640, 680], trend: "up" },
                { category: "Utilities", data: [550, 520, 510, 530, 520], trend: "stable" },
              ].map((row) => (
                <tr key={row.category} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-neutral">{row.category}</td>
                  {row.data.map((amount, idx) => (
                    <td key={idx} className="px-4 py-3 text-right text-sm text-neutral">
                      €{amount}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      row.trend === "up" ? "bg-negative/10 text-negative" :
                      row.trend === "down" ? "bg-positive/10 text-positive" :
                      "bg-neutral/10 text-neutral"
                    }`}>
                      {row.trend === "up" ? "↑" : row.trend === "down" ? "↓" : "→"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary mb-3">💡 Financial Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <span className="text-positive text-xl mr-3">✓</span>
            <p className="text-sm text-neutral">
              <strong>Great savings rate!</strong> You're saving 61.6% of your income, which is above the recommended 20%.
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-yellow-500 text-xl mr-3">⚠</span>
            <p className="text-sm text-neutral">
              <strong>Shopping expenses increasing:</strong> Your shopping expenses have increased 30% over the last 3 months.
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-positive text-xl mr-3">✓</span>
            <p className="text-sm text-neutral">
              <strong>Entertainment spending down:</strong> You've reduced entertainment costs by 31% - good job!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
