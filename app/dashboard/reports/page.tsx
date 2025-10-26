"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: string;
  date: string;
  isRecurring: boolean;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

const CHART_COLORS = [
  "#10b981", // green
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

export default function ReportsPage() {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transRes, goalsRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/goals"),
        ]);

        if (transRes.ok) setTransactions(await transRes.json());
        if (goalsRes.ok) setGoals(await goalsRes.json());
      } catch (error) {
        console.error("Error fetching reports data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics using ALL transactions (including recurring)
  const totalIncome = transactions
    .filter((t) => t.type.toLowerCase() === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  // ALL expenses (one-time + recurring)
  const totalExpenses = transactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  // Category breakdown for PIE CHART - Include ALL expenses (recurring too!)
  const categoryData = transactions
    .filter((t) => t.type.toLowerCase() === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const categoryBreakdown = Object.entries(categoryData)
    .sort((a, b) => b[1] - a[1])
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
    }));

  // Monthly trends for LINE CHART - Include ALL transactions (including current month)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      month: date.getMonth(),
      year: date.getFullYear()
    };
  });

  const monthlyData = last6Months.map((monthInfo) => {
    const monthTransactions = transactions.filter((t) => {
      const transDate = new Date(t.date);
      return transDate.getMonth() === monthInfo.month && transDate.getFullYear() === monthInfo.year;
    });

    const income = monthTransactions
      .filter((t) => t.type.toLowerCase() === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter((t) => t.type.toLowerCase() === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: monthInfo.label,
      income,
      expenses,
      net: income - expenses,
    };
  });

  // Income vs Expenses for BAR CHART
  const incomeVsExpenses = [
    { name: "Income", amount: totalIncome },
    { name: "Expenses", amount: totalExpenses },
  ];

  // Excel export function with improved formatting
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    // Summary Sheet with better structure
    const summaryData = [
      ["WEALTHFLOW FINANCIAL REPORT"],
      [`Generated: ${today}`],
      [],
      ["FINANCIAL SUMMARY"],
      ["Metric", "Amount (€)"],
      ["Total Income", totalIncome.toFixed(2)],
      ["Total Expenses", totalExpenses.toFixed(2)],
      ["Net Income", netIncome.toFixed(2)],
      ["Savings Rate", `${savingsRate.toFixed(1)}%`],
      [],
      ["EXPENSE BREAKDOWN BY CATEGORY"],
      ["Category", "Amount (€)", "% of Total"],
      ...categoryBreakdown.map((cat) => [
        cat.name,
        cat.value.toFixed(2),
        `${cat.percentage.toFixed(1)}%`,
      ]),
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);

    // Set column widths
    ws1['!cols'] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 12 },
    ];

    XLSX.utils.book_append_sheet(wb, ws1, "Summary");

    // Transactions Sheet with better formatting
    const transactionsData = [
      ["TRANSACTION HISTORY"],
      [`Report Date: ${today}`],
      [],
      ["Date", "Category", "Type", "Amount (€)", "Recurring"],
      ...transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((t) => [
          new Date(t.date).toLocaleDateString('en-GB'),
          t.category,
          t.type,
          t.amount.toFixed(2),
          t.isRecurring ? "Yes" : "No",
        ]),
      [],
      ["TOTALS"],
      ["Total Income", "", "", totalIncome.toFixed(2), ""],
      ["Total Expenses", "", "", totalExpenses.toFixed(2), ""],
      ["Net Balance", "", "", netIncome.toFixed(2), ""],
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(transactionsData);

    // Set column widths
    ws2['!cols'] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 10 },
      { wch: 12 },
      { wch: 10 },
    ];

    XLSX.utils.book_append_sheet(wb, ws2, "Transactions");

    // Monthly Trends Sheet
    const monthlyTrendsData = [
      ["MONTHLY TRENDS (Last 6 Months)"],
      [`Report Date: ${today}`],
      [],
      ["Month", "Income (€)", "Expenses (€)", "Net (€)"],
      ...monthlyData.map((m) => [
        m.month,
        m.income.toFixed(2),
        m.expenses.toFixed(2),
        m.net.toFixed(2),
      ]),
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(monthlyTrendsData);

    // Set column widths
    ws3['!cols'] = [
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
    ];

    XLSX.utils.book_append_sheet(wb, ws3, "Monthly Trends");

    const fileName = `WealthFlow_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // PDF export function
  const handleExportPDF = () => {
    const today = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    let pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>WealthFlow Financial Report</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #10b981;
            padding-bottom: 15px;
          }
          .header h1 {
            color: #10b981;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: #666;
            margin: 5px 0;
            font-size: 12px;
          }
          .section {
            margin: 25px 0;
            page-break-inside: avoid;
          }
          .section h2 {
            color: #10b981;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .metrics {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
          }
          .metric-card {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #10b981;
          }
          .metric-card .label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          .metric-card .value {
            font-size: 22px;
            font-weight: bold;
            color: #1f2937;
          }
          .metric-card.positive .value { color: #10b981; }
          .metric-card.negative .value { color: #ef4444; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 11px;
          }
          th {
            background: #10b981;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 8px 10px;
            border-bottom: 1px solid #e5e7eb;
          }
          tr:hover { background: #f9fafb; }
          .category-row td:first-child { font-weight: 600; }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #e5e7eb;
            padding-top: 15px;
          }
          .insight-box {
            background: #ecfdf5;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
          }
          .insight-box h3 {
            color: #10b981;
            margin: 0 0 10px 0;
            font-size: 14px;
          }
          .insight-box p {
            margin: 5px 0;
            font-size: 11px;
            color: #1f2937;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💰 WEALTHFLOW FINANCIAL REPORT</h1>
          <p>Generated on ${today}</p>
        </div>

        <div class="section">
          <h2>📊 Financial Summary</h2>
          <div class="metrics">
            <div class="metric-card positive">
              <div class="label">Total Income</div>
              <div class="value">€${totalIncome.toFixed(2)}</div>
            </div>
            <div class="metric-card negative">
              <div class="label">Total Expenses</div>
              <div class="value">€${totalExpenses.toFixed(2)}</div>
            </div>
            <div class="metric-card ${netIncome >= 0 ? 'positive' : 'negative'}">
              <div class="label">Net Income</div>
              <div class="value">€${netIncome.toFixed(2)}</div>
            </div>
            <div class="metric-card">
              <div class="label">Savings Rate</div>
              <div class="value">${savingsRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        ${categoryBreakdown.length > 0 ? `
        <div class="section">
          <h2>🎯 Expense Breakdown by Category</h2>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>% of Total</th>
              </tr>
            </thead>
            <tbody>
              ${categoryBreakdown.map(cat => `
                <tr class="category-row">
                  <td>${cat.name}</td>
                  <td>€${cat.value.toFixed(2)}</td>
                  <td>${cat.percentage.toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${transactions.length > 0 ? `
        <div class="section">
          <h2>📝 Recent Transactions</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Recurring</th>
              </tr>
            </thead>
            <tbody>
              ${transactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 20)
                .map(t => `
                  <tr>
                    <td>${new Date(t.date).toLocaleDateString('en-GB')}</td>
                    <td>${t.category}</td>
                    <td>${t.type}</td>
                    <td style="color: ${t.type.toLowerCase() === 'income' ? '#10b981' : '#ef4444'}; font-weight: 600;">
                      €${t.amount.toFixed(2)}
                    </td>
                    <td>${t.isRecurring ? '✓ Yes' : '✗ No'}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
          ${transactions.length > 20 ? '<p style="font-size: 10px; color: #666; margin-top: 5px;">Showing 20 most recent transactions</p>' : ''}
        </div>
        ` : ''}

        <div class="section">
          <h2>📈 Monthly Trends (Last 6 Months)</h2>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Income</th>
                <th>Expenses</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              ${monthlyData.map(m => `
                <tr>
                  <td>${m.month}</td>
                  <td style="color: #10b981;">€${m.income.toFixed(2)}</td>
                  <td style="color: #ef4444;">€${m.expenses.toFixed(2)}</td>
                  <td style="color: ${m.net >= 0 ? '#10b981' : '#ef4444'}; font-weight: 600;">
                    €${m.net.toFixed(2)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        ${savingsRate !== 0 || categoryBreakdown.length > 0 ? `
        <div class="section">
          <div class="insight-box">
            <h3>💡 Financial Insights</h3>
            ${savingsRate >= 20 ? `<p>✓ Excellent! You're saving ${savingsRate.toFixed(1)}% of your income.</p>` : ''}
            ${savingsRate < 20 && savingsRate > 0 ? `<p>⚠ Your savings rate is ${savingsRate.toFixed(1)}%. Try to aim for at least 20%.</p>` : ''}
            ${savingsRate < 0 ? `<p>⚠ You're spending more than you earn. Consider reducing expenses.</p>` : ''}
            ${categoryBreakdown.length > 0 ? `
              <p>• Your biggest expense category is <strong>${categoryBreakdown[0].name}</strong> at €${categoryBreakdown[0].value.toFixed(2)} (${categoryBreakdown[0].percentage.toFixed(1)}% of total expenses)</p>
            ` : ''}
            ${transactions.length >= 10 ? `<p>✓ Great tracking habits! You've recorded ${transactions.length} transactions.</p>` : ''}
          </div>
        </div>
        ` : ''}

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} WealthFlow System - Powered by Luminus</p>
          <p>This report is confidential and intended for personal use only.</p>
        </div>
      </body>
      </html>
    `;

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral dark:text-white">{t("financialReports")}</h1>
          <p className="text-neutral-light dark:text-gray-400 mt-1">Visual insights into your finances</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={handleExportPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            📄 Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            📊 {t("exportToExcel")}
          </button>
        </div>
      </div>

      {/* Spending Alert - Highest Category */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-400 dark:border-orange-500 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-neutral dark:text-white mb-2">
                {t("spendingAlert")}
              </h3>
              <p className="text-neutral dark:text-gray-300 mb-3">
                {t("youreSpendingMostOn")}{" "}
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {categoryBreakdown[0].name}
                </span>{" "}
                {t("at")}{" "}
                <span className="font-bold text-negative">
                  €{categoryBreakdown[0].value.toFixed(2)}
                </span>{" "}
                ({categoryBreakdown[0].percentage.toFixed(1)}% {t("ofTotalExpenses")})
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-full"
                  style={{ width: `${categoryBreakdown[0].percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("totalIncome")}</p>
          <p className="text-2xl font-bold text-positive mt-2">€{totalIncome.toFixed(2)}</p>
          <p className="text-sm text-neutral-light dark:text-gray-500 mt-1">{t("allTime")}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("totalExpenses")}</p>
          <p className="text-2xl font-bold text-negative mt-2">€{totalExpenses.toFixed(2)}</p>
          <p className="text-sm text-neutral-light dark:text-gray-500 mt-1">{t("allTime")}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("netIncome")}</p>
          <p className={`text-2xl font-bold mt-2 ${netIncome >= 0 ? "text-positive" : "text-negative"}`}>
            €{netIncome.toFixed(2)}
          </p>
          <p className="text-sm text-neutral-light dark:text-gray-500 mt-1">{t("incomeMinusExpenses")}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light dark:text-gray-400">{t("savingsRate")}</p>
          <p className="text-2xl font-bold text-primary dark:text-green-400 mt-2">{savingsRate.toFixed(1)}%</p>
          <p className="text-sm text-neutral-light dark:text-gray-500 mt-1">{t("ofTotalIncome")}</p>
        </div>
      </div>

      {/* Monthly Trends - LINE CHART */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-neutral dark:text-white mb-4">📈 Monthly Trends (Last 6 Months)</h2>
        {monthlyData.every((m) => m.income === 0 && m.expenses === 0) ? (
          <p className="text-center py-12 text-neutral-light dark:text-gray-400">No transaction data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis
                dataKey="month"
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
                  color: '#F3F4F6',
                }}
                formatter={(value) => [`€${Number(value).toFixed(2)}`, '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={3}
                name="Income"
                dot={{ fill: '#10B981', r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#EF4444"
                strokeWidth={3}
                name="Expenses"
                dot={{ fill: '#EF4444', r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Net"
                dot={{ fill: '#3B82F6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses - BAR CHART */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-neutral dark:text-white mb-4">📊 Income vs Expenses</h2>
          {totalIncome === 0 && totalExpenses === 0 ? (
            <p className="text-center py-12 text-neutral-light dark:text-gray-400">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={incomeVsExpenses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="name"
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
                    color: '#F3F4F6',
                  }}
                  formatter={(value) => `€${Number(value).toFixed(2)}`}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {incomeVsExpenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#10B981" : "#EF4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Spending by Category - PIE CHART */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-neutral dark:text-white mb-4">🎯 Spending by Category</h2>
          {categoryBreakdown.length === 0 ? (
            <p className="text-center py-12 text-neutral-light dark:text-gray-400">No expense data yet</p>
          ) : (
            <div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage.toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `€${Number(value).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {categoryBreakdown.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <span className="text-xs text-neutral dark:text-gray-300">
                      {item.name}: €{item.value.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown - Progress Bars */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-neutral dark:text-white mb-4">{t("spendingByCategory")}</h2>
        {categoryBreakdown.length === 0 ? (
          <p className="text-neutral-light dark:text-gray-400 text-center py-8">{t("noExpensesYet")}</p>
        ) : (
          <div className="space-y-4">
            {categoryBreakdown.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral dark:text-white">{item.name}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-neutral dark:text-white">€{item.value.toFixed(2)}</span>
                    <span className="text-xs text-neutral-light dark:text-gray-400 ml-2">({item.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-primary dark:bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="bg-primary/5 dark:bg-green-900/10 border border-primary/20 dark:border-green-600/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary dark:text-green-400 mb-3">💡 Financial Insights</h3>
        <div className="space-y-2 text-sm text-neutral dark:text-gray-300">
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
              • Your biggest expense category is <strong>{categoryBreakdown[0].name}</strong> at €
              {categoryBreakdown[0].value.toFixed(2)} ({categoryBreakdown[0].percentage.toFixed(1)}%)
            </p>
          )}
          {transactions.length >= 10 && (
            <p>✓ Good tracking habits! You've recorded {transactions.length} transactions.</p>
          )}
          {transactions.length === 0 && (
            <p>ℹ️ Start adding transactions to see detailed insights and charts!</p>
          )}
        </div>
      </div>
    </div>
  );
}
