"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/contexts/LanguageContext";

const navigationKeys = [
  { key: "dashboard", href: "/dashboard", icon: "📊" },
  { key: "transactions", href: "/dashboard/transactions", icon: "💰" },
  { key: "budgets", href: "/dashboard/budgets", icon: "📈" },
  { key: "goals", href: "/dashboard/goals", icon: "🎯" },
  { key: "accounts", href: "/dashboard/accounts", icon: "🏦" },
  { key: "reports", href: "/dashboard/reports", icon: "📄" },
  { key: "settings", href: "/dashboard/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLanguage();

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-primary pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold text-white">WealthFlow</h1>
            </Link>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigationKeys.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-positive text-white"
                      : "text-white/80 hover:bg-primary-light hover:text-white"
                  }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
          <div className="flex-shrink-0 flex border-t border-white/20 p-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-positive rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {initials}
                </div>
                <p className="text-sm font-medium text-white truncate">{userName}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
