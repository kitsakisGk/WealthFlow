"use client";

import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center">
          <button
            className="md:hidden text-neutral mr-4"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="text-2xl">☰</span>
          </button>
          <h2 className="text-2xl font-semibold text-neutral">Dashboard</h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="text-xl">🔔</span>
          </button>
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-positive rounded-full flex items-center justify-center text-white font-bold text-sm">
              U
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary">
          <nav className="px-2 pt-2 pb-3 space-y-1">
            <a href="/dashboard" className="block px-3 py-2 rounded-md text-white font-medium">
              📊 Dashboard
            </a>
            <a href="/dashboard/transactions" className="block px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-primary-light">
              💰 Transactions
            </a>
            <a href="/dashboard/budgets" className="block px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-primary-light">
              📈 Budgets
            </a>
            <a href="/dashboard/goals" className="block px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-primary-light">
              🎯 Goals
            </a>
            <a href="/dashboard/reports" className="block px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-primary-light">
              📄 Reports
            </a>
            <a href="/dashboard/settings" className="block px-3 py-2 rounded-md text-white/80 hover:text-white hover:bg-primary-light">
              ⚙️ Settings
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
