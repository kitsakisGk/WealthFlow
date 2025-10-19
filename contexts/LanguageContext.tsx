"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "el";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    transactions: "Transactions",
    budgets: "Budgets",
    goals: "Goals",
    accounts: "Accounts",
    reports: "Reports",
    settings: "Settings",

    // Dashboard
    balance: "Balance",
    totalBalance: "Total Balance",
    income: "Income",
    expenses: "Expenses",
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    netIncome: "Net Income",
    goalProgress: "Goal Progress",
    spendingByCategory: "Spending by Category",
    recentTransactions: "Recent Transactions",
    viewAll: "View All",
    totalEarned: "Total earned",
    totalSpent: "Total spent",
    incomeMinusExpenses: "Income - Expenses",
    noExpensesYet: "No expenses yet",
    noTransactionsYet: "No transactions yet",

    // Transactions
    addTransaction: "Add Transaction",
    allTransactions: "All Transactions",
    filter: "Filter",
    description: "Description",
    amount: "Amount",
    category: "Category",
    type: "Type",
    date: "Date",
    actions: "Actions",

    // Budgets
    createBudget: "Create Budget",
    spent: "spent",
    limit: "limit",
    remaining: "remaining",
    over: "over",
    totalAllocated: "Total Allocated",
    totalSpent: "Total Spent",

    // Goals
    createGoal: "Create Goal",
    addFunds: "Add Funds",
    target: "Target",
    current: "Current",
    complete: "Complete",

    // Reports
    financialReports: "Financial Reports",
    exportToExcel: "Export to Excel",
    savingsRate: "Savings Rate",
    ofTotalIncome: "Of total income",

    // Settings
    profile: "Profile Information",
    profileInformation: "Profile Information",
    fullName: "Full Name",
    email: "Email",
    accountType: "Account Type",
    subscriptionPlan: "Subscription Plan",
    currentPlan: "Current Plan",
    preferences: "Preferences",
    language: "Language",
    theme: "Theme",
    currency: "Currency",
    dateFormat: "Date Format",
    savePreferences: "Save Preferences",
    saveProfileChanges: "Save Profile Changes",
    emailNotifications: "Email Notifications",
    receiveAlerts: "Receive budget alerts and updates",

    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    loading: "Loading...",
    noData: "No data available",
  },
  el: {
    // Navigation
    dashboard: "Πίνακας Ελέγχου",
    transactions: "Συναλλαγές",
    budgets: "Προϋπολογισμοί",
    goals: "Στόχοι",
    accounts: "Λογαριασμοί",
    reports: "Αναφορές",
    settings: "Ρυθμίσεις",

    // Dashboard
    balance: "Υπόλοιπο",
    totalBalance: "Συνολικό Υπόλοιπο",
    income: "Έσοδα",
    expenses: "Έξοδα",
    totalIncome: "Συνολικά Έσοδα",
    totalExpenses: "Συνολικά Έξοδα",
    netIncome: "Καθαρά Έσοδα",
    goalProgress: "Πρόοδος Στόχου",
    spendingByCategory: "Δαπάνες ανά Κατηγορία",
    recentTransactions: "Πρόσφατες Συναλλαγές",
    viewAll: "Προβολή Όλων",
    totalEarned: "Συνολικά κερδισμένα",
    totalSpent: "Συνολικά ξοδεμένα",
    incomeMinusExpenses: "Έσοδα - Έξοδα",
    noExpensesYet: "Δεν υπάρχουν έξοδα ακόμα",
    noTransactionsYet: "Δεν υπάρχουν συναλλαγές ακόμα",

    // Transactions
    addTransaction: "Προσθήκη Συναλλαγής",
    allTransactions: "Όλες οι Συναλλαγές",
    filter: "Φίλτρο",
    description: "Περιγραφή",
    amount: "Ποσό",
    category: "Κατηγορία",
    type: "Τύπος",
    date: "Ημερομηνία",
    actions: "Ενέργειες",

    // Budgets
    createBudget: "Δημιουργία Προϋπολογισμού",
    spent: "ξοδεύτηκαν",
    limit: "όριο",
    remaining: "απομένουν",
    over: "υπέρβαση",
    totalAllocated: "Συνολικά Διατεθέντα",
    totalSpent: "Συνολικά Ξοδεμένα",

    // Goals
    createGoal: "Δημιουργία Στόχου",
    addFunds: "Προσθήκη Κεφαλαίων",
    target: "Στόχος",
    current: "Τρέχον",
    complete: "Ολοκληρώθηκε",

    // Reports
    financialReports: "Οικονομικές Αναφορές",
    exportToExcel: "Εξαγωγή σε Excel",
    savingsRate: "Ποσοστό Αποταμίευσης",
    ofTotalIncome: "Του συνολικού εισοδήματος",

    // Settings
    profile: "Πληροφορίες Προφίλ",
    profileInformation: "Πληροφορίες Προφίλ",
    fullName: "Πλήρες Όνομα",
    email: "Email",
    accountType: "Τύπος Λογαριασμού",
    subscriptionPlan: "Πρόγραμμα Συνδρομής",
    currentPlan: "Τρέχον Πρόγραμμα",
    preferences: "Προτιμήσεις",
    language: "Γλώσσα",
    theme: "Θέμα",
    currency: "Νόμισμα",
    dateFormat: "Μορφή Ημερομηνίας",
    savePreferences: "Αποθήκευση Προτιμήσεων",
    saveProfileChanges: "Αποθήκευση Αλλαγών Προφίλ",
    emailNotifications: "Ειδοποιήσεις Email",
    receiveAlerts: "Λάβετε ειδοποιήσεις προϋπολογισμού και ενημερώσεις",

    // Common
    save: "Αποθήκευση",
    cancel: "Ακύρωση",
    delete: "Διαγραφή",
    edit: "Επεξεργασία",
    close: "Κλείσιμο",
    loading: "Φόρτωση...",
    noData: "Δεν υπάρχουν δεδομένα",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
