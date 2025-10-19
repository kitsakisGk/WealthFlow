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

    // Dashboard Additional
    activeBudgets: "Active Budgets",
    activeGoals: "Active Goals",
    noBudgetsYet: "No budgets yet",
    noGoalsYet: "No goals yet",
    quickActions: "Quick Actions",
    newGoal: "New Goal",
    viewReports: "View Reports",

    // Accounts
    bankAccounts: "Bank Accounts",
    trackAllAccounts: "Track all your bank accounts in one place",
    addAccount: "Add Account",
    totalBalanceAcrossAll: "Total Balance Across All Accounts",
    account: "Account",
    accountsPlural: "Accounts",
    remove: "Remove",
    currentBalance: "Current Balance",
    addNewAccount: "Add New Account",
    clickToAdd: "Click to add",
    addBankAccount: "Add Bank Account",
    bankName: "Bank Name",
    checking: "Checking",
    savings: "Savings",
    creditCard: "Credit Card",
    investment: "Investment",
    last4Digits: "Last 4 Digits (Optional)",
    cardColor: "Card Color",
    privacySecurity: "Privacy & Security",
    privacyNote: "This information is stored locally on your device only. We never ask for full account numbers or sensitive banking credentials. This feature is designed to help you track your accounts visually in one place.",
    removeAccountConfirm: "Are you sure you want to remove this account?",
    blue: "Blue",
    green: "Green",
    purple: "Purple",
    red: "Red",
    yellow: "Yellow",
    pink: "Pink",
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

    // Dashboard Additional
    activeBudgets: "Ενεργοί Προϋπολογισμοί",
    activeGoals: "Ενεργοί Στόχοι",
    noBudgetsYet: "Δεν υπάρχουν προϋπολογισμοί ακόμα",
    noGoalsYet: "Δεν υπάρχουν στόχοι ακόμα",
    quickActions: "Γρήγορες Ενέργειες",
    newGoal: "Νέος Στόχος",
    viewReports: "Προβολή Αναφορών",

    // Accounts
    bankAccounts: "Τραπεζικοί Λογαριασμοί",
    trackAllAccounts: "Παρακολουθήστε όλους τους τραπεζικούς σας λογαριασμούς σε ένα μέρος",
    addAccount: "Προσθήκη Λογαριασμού",
    totalBalanceAcrossAll: "Συνολικό Υπόλοιπο Όλων των Λογαριασμών",
    account: "Λογαριασμός",
    accountsPlural: "Λογαριασμοί",
    remove: "Αφαίρεση",
    currentBalance: "Τρέχον Υπόλοιπο",
    addNewAccount: "Προσθήκη Νέου Λογαριασμού",
    clickToAdd: "Κάντε κλικ για προσθήκη",
    addBankAccount: "Προσθήκη Τραπεζικού Λογαριασμού",
    bankName: "Όνομα Τράπεζας",
    checking: "Τρεχούμενος",
    savings: "Ταμιευτηρίου",
    creditCard: "Πιστωτική Κάρτα",
    investment: "Επενδυτικός",
    last4Digits: "Τελευταία 4 Ψηφία (Προαιρετικό)",
    cardColor: "Χρώμα Κάρτας",
    privacySecurity: "Απόρρητο & Ασφάλεια",
    privacyNote: "Αυτές οι πληροφορίες αποθηκεύονται τοπικά στη συσκευή σας μόνο. Δεν ζητάμε ποτέ πλήρεις αριθμούς λογαριασμών ή ευαίσθητα τραπεζικά διαπιστευτήρια. Αυτή η λειτουργία έχει σχεδιαστεί για να σας βοηθήσει να παρακολουθείτε τους λογαριασμούς σας οπτικά σε ένα μέρος.",
    removeAccountConfirm: "Είστε σίγουροι ότι θέλετε να αφαιρέσετε αυτόν τον λογαριασμό;",
    blue: "Μπλε",
    green: "Πράσινο",
    purple: "Μωβ",
    red: "Κόκκινο",
    yellow: "Κίτρινο",
    pink: "Ροζ",
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
