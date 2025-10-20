"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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
  nextBillingDate: string;
  category: string;
  isActive: boolean;
}

export default function BudgetsPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [currentBudget, setCurrentBudget] = useState<MonthlyBudget | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    plannedIncome: "",
    plannedExpenses: "",
  });
  const [subForm, setSubForm] = useState({
    name: "",
    amount: "",
    billingCycle: "MONTHLY",
    nextBillingDate: "",
    category: "Entertainment",
  });

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const budgetRes = await fetch(`/api/budgets?month=${currentMonth}`);
      if (budgetRes.ok) {
        const data = await budgetRes.json();
        setCurrentBudget(data);
      }

      const subsRes = await fetch("/api/subscriptions");
      if (subsRes.ok) {
        const data = await subsRes.json();
        setSubscriptions(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async () => {
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: currentMonth,
          plannedIncome: parseFloat(budgetForm.plannedIncome),
          plannedExpenses: parseFloat(budgetForm.plannedExpenses),
        }),
      });

      if (res.ok) {
        await fetchData();
        setShowBudgetModal(false);
        setBudgetForm({ plannedIncome: "", plannedExpenses: "" });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateSubscription = async () => {
    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...subForm,
          amount: parseFloat(subForm.amount),
        }),
      });

      if (res.ok) {
        await fetchData();
        setShowSubscriptionModal(false);
        setSubForm({
          name: "",
          amount: "",
          billingCycle: "MONTHLY",
          nextBillingDate: "",
          category: "Entertainment",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm("Delete this subscription?")) return;
    try {
      await fetch(`/api/subscriptions?id=${id}`, { method: "DELETE" });
      await fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const totalSubscriptionsMonthly = subscriptions
    .filter((s) => s.isActive)
    .reduce((sum, s) => {
      if (s.billingCycle === "MONTHLY") return sum + s.amount;
      if (s.billingCycle === "YEARLY") return sum + s.amount / 12;
      if (s.billingCycle === "WEEKLY") return sum + s.amount * 4;
      return sum;
    }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral dark:text-gray-300">{t("loading")}</p>
      </div>
    );
  }

  const plannedBalance = currentBudget ? currentBudget.plannedIncome - currentBudget.plannedExpenses : 0;
  const actualBalance = currentBudget ? currentBudget.actualIncome - currentBudget.actualExpenses : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral dark:text-gray-200">{t("monthlyBudgetPlanner")}</h1>
          <p className="text-sm text-neutral-light dark:text-gray-400 mt-1">
            {t("planIncomeExpenses")}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary to-positive dark:from-green-700 dark:to-green-500 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">
          {new Date(currentMonth + "-01").toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        {!currentBudget ? (
          <div>
            <p className="mb-4">{t("noBudgetForMonth")}</p>
            <button
              onClick={() => setShowBudgetModal(true)}
              className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              + {t("createBudgetPlan")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm opacity-90">{t("plannedBalance")}</p>
              <p className="text-4xl font-bold mt-1">€{plannedBalance.toFixed(2)}</p>
              <p className="text-sm opacity-75 mt-1">
                €{currentBudget.plannedIncome.toFixed(2)} - €{currentBudget.plannedExpenses.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90">{t("actualBalance")}</p>
              <p className="text-4xl font-bold mt-1">€{actualBalance.toFixed(2)}</p>
              <p className="text-sm opacity-75 mt-1">
                €{currentBudget.actualIncome.toFixed(2)} - €{currentBudget.actualExpenses.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90">{t("variance")}</p>
              <p className={`text-4xl font-bold mt-1 ${actualBalance - plannedBalance >= 0 ? "" : "text-red-300"}`}>
                €{(actualBalance - plannedBalance).toFixed(2)}
              </p>
              <p className="text-sm opacity-75 mt-1">
                {actualBalance >= plannedBalance ? "On track!" : "Over budget"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Budget Visualization */}
      {currentBudget && (() => {
        const budgetChartData = [
          {
            category: t("plannedIncome"),
            amount: currentBudget.plannedIncome,
            color: "#10B981"
          },
          {
            category: t("plannedExpenses"),
            amount: currentBudget.plannedExpenses,
            color: "#EF4444"
          },
          {
            category: t("actualIncome"),
            amount: currentBudget.actualIncome,
            color: "#3B82F6"
          },
          {
            category: t("actualExpenses"),
            amount: currentBudget.actualExpenses,
            color: "#F59E0B"
          }
        ];

        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-neutral dark:text-gray-200 mb-4">{t("budgetOverview")}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="category"
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
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {budgetChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      })()}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral dark:text-gray-200">{t("recurringPayments")}</h2>
            <p className="text-sm text-neutral-light dark:text-gray-400 mt-1">
              {t("monthlyTotal")}: €{totalSubscriptionsMonthly.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            + {t("addSubscription")}
          </button>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-light dark:text-gray-400 mb-4">{t("noSubscriptionsYet")}</p>
            <p className="text-sm text-neutral-light dark:text-gray-500">
              {t("trackSubscriptions")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className={`border-2 rounded-lg p-4 ${
                  sub.isActive
                    ? "border-primary dark:border-green-600 bg-primary/5 dark:bg-green-900/10"
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-neutral dark:text-gray-200">{sub.name}</h3>
                    <p className="text-xs text-neutral-light dark:text-gray-400">{sub.category}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSubscription(sub.id)}
                    className="text-negative hover:text-negative/80 text-sm"
                  >
                    {t("delete")}
                  </button>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-primary dark:text-green-400">€{sub.amount.toFixed(2)}</p>
                  <p className="text-sm text-neutral-light dark:text-gray-400">
                    per {sub.billingCycle.toLowerCase()}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs text-neutral-light dark:text-gray-400">
                    Next billing: {new Date(sub.nextBillingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-neutral dark:text-gray-200 mb-4">{t("newBudgetPlan")}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
                  {t("plannedIncome")} (€)
                </label>
                <input
                  type="number"
                  value={budgetForm.plannedIncome}
                  onChange={(e) => setBudgetForm({ ...budgetForm, plannedIncome: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200"
                  placeholder="3000.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">
                  {t("plannedExpenses")} (€)
                </label>
                <input
                  type="number"
                  value={budgetForm.plannedExpenses}
                  onChange={(e) => setBudgetForm({ ...budgetForm, plannedExpenses: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200"
                  placeholder="2500.00"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowBudgetModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-neutral dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleCreateBudget}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  {t("save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-neutral dark:text-gray-200 mb-4">{t("newSubscription")}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">{t("subscriptionName")}</label>
                <input
                  type="text"
                  value={subForm.name}
                  onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200"
                  placeholder="Netflix"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">{t("amount")} (€)</label>
                <input
                  type="number"
                  value={subForm.amount}
                  onChange={(e) => setSubForm({ ...subForm, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200"
                  placeholder="12.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">{t("billingCycle")}</label>
                <select
                  value={subForm.billingCycle}
                  onChange={(e) => setSubForm({ ...subForm, billingCycle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200"
                >
                  <option value="WEEKLY">{t("weekly")}</option>
                  <option value="MONTHLY">{t("monthly")}</option>
                  <option value="YEARLY">{t("yearly")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">{t("nextBillingDate")}</label>
                <input
                  type="date"
                  value={subForm.nextBillingDate}
                  onChange={(e) => setSubForm({ ...subForm, nextBillingDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-1">{t("category")}</label>
                <select
                  value={subForm.category}
                  onChange={(e) => setSubForm({ ...subForm, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-neutral dark:text-gray-200"
                >
                  <option value="Entertainment">Entertainment</option>
                  <option value="Software">Software</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Bills & Utilities">Bills & Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-neutral dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleCreateSubscription}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  {t("save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
