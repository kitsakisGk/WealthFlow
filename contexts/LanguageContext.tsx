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
    reports: "Reports",
    settings: "Settings",

    // Dashboard
    totalBalance: "Total Balance",
    income: "Income",
    expenses: "Expenses",
    recentTransactions: "Recent Transactions",
    viewAll: "View All",
    budgetOverview: "Budget Overview",
    goalsProgress: "Goals Progress",

    // Transactions
    addTransaction: "Add Transaction",
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

    // Goals
    createGoal: "Create Goal",
    addFunds: "Add Funds",
    target: "Target",
    current: "Current",
    complete: "Complete",

    // Settings
    profile: "Profile Information",
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
    reports: "Αναφορές",
    settings: "Ρυθμίσεις",

    // Dashboard
    totalBalance: "Συνολικό Υπόλοιπο",
    income: "Έσοδα",
    expenses: "Έξοδα",
    recentTransactions: "Πρόσφατες Συναλλαγές",
    viewAll: "Προβολή Όλων",
    budgetOverview: "Επισκόπηση Προϋπολογισμού",
    goalsProgress: "Πρόοδος Στόχων",

    // Transactions
    addTransaction: "Προσθήκη Συναλλαγής",
    description: "Περιγραφή",
    amount: "Ποσό",
    category: "Κατηγορία",
    type: "Τύπος",
    date: "Ημερομηνία",
    actions: "Ενέργειες",

    // Budgets
    createBudget: "Δημιουργία Προϋπολογισμού",
    spent: "ξοδεύτηκε",
    limit: "όριο",
    remaining: "απομένουν",
    over: "υπέρβαση",

    // Goals
    createGoal: "Δημιουργία Στόχου",
    addFunds: "Προσθήκη Χρημάτων",
    target: "Στόχος",
    current: "Τρέχον",
    complete: "Ολοκληρώθηκε",

    // Settings
    profile: "Πληροφορίες Προφίλ",
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
