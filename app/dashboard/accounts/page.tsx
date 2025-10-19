"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  balance: number;
  accountNumber: string;
  color: string;
}

export default function AccountsPage() {
  const { t } = useLanguage();
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      bankName: "National Bank",
      accountType: "Checking",
      balance: 5420.50,
      accountNumber: "****1234",
      color: "bg-blue-500",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    bankName: "",
    accountType: "Checking",
    balance: 0,
    accountNumber: "",
    color: "bg-blue-500",
  });

  const handleAddAccount = () => {
    const account: BankAccount = {
      id: Date.now().toString(),
      ...newAccount,
    };
    setAccounts([...accounts, account]);
    setIsModalOpen(false);
    setNewAccount({
      bankName: "",
      accountType: "Checking",
      balance: 0,
      accountNumber: "",
      color: "bg-blue-500",
    });
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm(t("removeAccountConfirm"))) {
      setAccounts(accounts.filter((acc) => acc.id !== id));
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const colorOptions = [
    { value: "bg-blue-500", label: t("blue") },
    { value: "bg-green-500", label: t("green") },
    { value: "bg-purple-500", label: t("purple") },
    { value: "bg-red-500", label: t("red") },
    { value: "bg-yellow-500", label: t("yellow") },
    { value: "bg-pink-500", label: t("pink") },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral dark:text-gray-200">{t("bankAccounts")}</h1>
          <p className="text-sm text-neutral-light dark:text-gray-400 mt-1">
            {t("trackAllAccounts")}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          + {t("addAccount")}
        </button>
      </div>

      {/* Total Balance Card */}
      <div className="bg-gradient-to-r from-primary to-positive dark:from-green-700 dark:to-green-500 rounded-lg shadow-lg p-8 text-white">
        <p className="text-sm opacity-90">{t("totalBalanceAcrossAll")}</p>
        <p className="text-5xl font-bold mt-2">€{totalBalance.toFixed(2)}</p>
        <p className="text-sm opacity-90 mt-2">{accounts.length} {accounts.length === 1 ? t("account") : t("accountsPlural")}</p>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div key={account.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={`${account.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl`}>
                🏦
              </div>
              <button
                onClick={() => handleDeleteAccount(account.id)}
                className="text-negative hover:text-negative/80 text-sm"
              >
                {t("remove")}
              </button>
            </div>

            <h3 className="text-lg font-semibold text-neutral dark:text-gray-200 mb-1">
              {account.bankName}
            </h3>
            <p className="text-sm text-neutral-light dark:text-gray-400 mb-4">
              {account.accountType} • {account.accountNumber}
            </p>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-neutral-light dark:text-gray-400">{t("currentBalance")}</p>
              <p className="text-2xl font-bold text-neutral dark:text-gray-200 mt-1">
                €{account.balance.toFixed(2)}
              </p>
            </div>
          </div>
        ))}

        {/* Add Account Card */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-green-500 transition-colors flex flex-col items-center justify-center min-h-[200px] group"
        >
          <div className="text-6xl mb-3 opacity-50 group-hover:opacity-100 transition-opacity">+</div>
          <p className="text-neutral dark:text-gray-300 font-medium">{t("addNewAccount")}</p>
          <p className="text-sm text-neutral-light dark:text-gray-400 mt-1">{t("clickToAdd")}</p>
        </button>
      </div>

      {/* Add Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral dark:text-gray-200">{t("addBankAccount")}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-light dark:text-gray-400 hover:text-neutral dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">
                  {t("bankName")}
                </label>
                <input
                  type="text"
                  value={newAccount.bankName}
                  onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                  placeholder="e.g., National Bank"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">
                  {t("accountType")}
                </label>
                <select
                  value={newAccount.accountType}
                  onChange={(e) => setNewAccount({ ...newAccount, accountType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Checking">{t("checking")}</option>
                  <option value="Savings">{t("savings")}</option>
                  <option value="Credit Card">{t("creditCard")}</option>
                  <option value="Investment">{t("investment")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">
                  {t("currentBalance")}
                </label>
                <input
                  type="number"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">
                  {t("last4Digits")}
                </label>
                <input
                  type="text"
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                  placeholder="****1234"
                  maxLength={8}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-neutral dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral dark:text-gray-300 mb-2">
                  {t("cardColor")}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewAccount({ ...newAccount, color: color.value })}
                      className={`${color.value} ${
                        newAccount.color === color.value ? "ring-4 ring-offset-2 ring-gray-400" : ""
                      } h-12 rounded-md transition-all flex items-center justify-center text-white font-medium`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-neutral dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleAddAccount}
                disabled={!newAccount.bankName}
                className="flex-1 px-4 py-2 bg-positive hover:bg-positive/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("addAccount")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-primary/5 dark:bg-green-900/20 border border-primary/20 dark:border-green-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary dark:text-green-400 mb-2">💡 {t("privacySecurity")}</h3>
        <p className="text-sm text-neutral dark:text-gray-300">
          {t("privacyNote")}
        </p>
      </div>
    </div>
  );
}
