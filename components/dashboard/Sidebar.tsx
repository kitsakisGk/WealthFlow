"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Transactions", href: "/dashboard/transactions", icon: "💰" },
  { name: "Budgets", href: "/dashboard/budgets", icon: "📈" },
  { name: "Goals", href: "/dashboard/goals", icon: "🎯" },
  { name: "Reports", href: "/dashboard/reports", icon: "📄" },
  { name: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

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
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-positive text-white"
                      : "text-white/80 hover:bg-primary-light hover:text-white"
                  }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex-shrink-0 flex border-t border-white/20 p-4">
            <div className="flex items-center w-full">
              <div className="w-10 h-10 bg-positive rounded-full flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white truncate">{userName}</p>
                <p className="text-xs text-white/70 truncate">{userEmail}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-white/70 hover:text-white transition-colors"
                title="Logout"
              >
                <span className="text-xl">⏻</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
