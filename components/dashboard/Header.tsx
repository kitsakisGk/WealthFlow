"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

interface Budget {
  id: string;
  category: string;
  amount: number;
  period: string;
}

interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: string;
  date: string;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Get user initials
  const userName = session?.user?.name || "User";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Get page title based on current route
  const getPageTitle = () => {
    if (pathname === "/dashboard") return t("dashboard");
    if (pathname === "/dashboard/transactions") return t("transactions");
    if (pathname === "/dashboard/budgets") return t("budgets");
    if (pathname === "/dashboard/goals") return t("goals");
    if (pathname === "/dashboard/accounts") return t("accounts");
    if (pathname === "/dashboard/reports") return t("reports");
    if (pathname === "/dashboard/settings") return t("settings");
    return t("dashboard");
  };

  // Fetch data for notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetsRes, transactionsRes, goalsRes] = await Promise.all([
          fetch("/api/budgets"),
          fetch("/api/transactions"),
          fetch("/api/goals"),
        ]);

        if (budgetsRes.ok) setBudgets(await budgetsRes.json());
        if (transactionsRes.ok) setTransactions(await transactionsRes.json());
        if (goalsRes.ok) setGoals(await goalsRes.json());
      } catch (error) {
        console.error("Error fetching notification data:", error);
      }
    };

    fetchData();
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsOpen]);

  // Calculate budget alerts
  const calculateSpent = (budget: Budget) => {
    const spent = transactions
      .filter((t) => t.type.toLowerCase() === "expense" && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    return spent;
  };

  const budgetAlerts = budgets.filter((budget) => {
    const spent = calculateSpent(budget);
    const percentage = (spent / budget.amount) * 100;
    return percentage >= 80; // Alert when 80% or more used
  });

  // Calculate goal alerts (goals close to completion)
  const goalAlerts = goals.filter((goal) => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    return percentage >= 75 && percentage < 100;
  });

  const totalNotifications = budgetAlerts.length + goalAlerts.length;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center">
          <button
            className="md:hidden text-neutral dark:text-gray-300 mr-4"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="text-2xl">☰</span>
          </button>
          <Image src="/transparent.png" alt="WealthFlow" width={150} height={50} className="h-12 w-auto" />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationRef}>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <span className="text-xl">🔔</span>
              {totalNotifications > 0 && (
                <span className="absolute top-1 right-1 bg-negative text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalNotifications}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-neutral dark:text-gray-200">Notifications</h3>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {totalNotifications === 0 ? (
                    <div className="p-6 text-center text-neutral-light">
                      <p>No new notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {budgetAlerts.map((budget) => {
                        const spent = calculateSpent(budget);
                        const percentage = (spent / budget.amount) * 100;
                        const isOver = spent > budget.amount;

                        return (
                          <div key={budget.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-start">
                              <span className="text-2xl mr-3">{isOver ? "⚠️" : "📊"}</span>
                              <div>
                                <p className="text-sm font-semibold text-neutral">
                                  {isOver ? "Budget Exceeded" : "Budget Alert"}
                                </p>
                                <p className="text-xs text-neutral-light mt-1">
                                  {budget.category}: {percentage.toFixed(0)}% used
                                  (€{spent.toFixed(2)} / €{budget.amount.toFixed(2)})
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {goalAlerts.map((goal) => {
                        const percentage = (goal.currentAmount / goal.targetAmount) * 100;

                        return (
                          <div key={goal.id} className="p-4 hover:bg-gray-50">
                            <div className="flex items-start">
                              <span className="text-2xl mr-3">🎯</span>
                              <div>
                                <p className="text-sm font-semibold text-neutral">
                                  Goal Almost Complete!
                                </p>
                                <p className="text-xs text-neutral-light mt-1">
                                  {goal.name}: {percentage.toFixed(0)}% complete
                                  (€{goal.currentAmount.toFixed(2)} / €{goal.targetAmount.toFixed(2)})
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="w-8 h-8 bg-positive rounded-full flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Improved scrolling */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="px-2 pt-2 pb-3 space-y-1">
            <a href="/dashboard" className="block px-3 py-2 rounded-md text-white font-medium">
              📊 {t("dashboard")}
            </a>
            <a href="/dashboard/transactions" className="block px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-primary-light">
              💰 {t("transactions")}
            </a>
            <a href="/dashboard/goals" className="block px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-primary-light">
              🎯 {t("goals")}
            </a>
            <a href="/dashboard/reports" className="block px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-primary-light">
              📄 {t("reports")}
            </a>
            <a href="/dashboard/settings" className="block px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-primary-light">
              ⚙️ {t("settings")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
