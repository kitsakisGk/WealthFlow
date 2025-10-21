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
    monthlyBudgetPlanner: "Monthly Budget Planner",
    planIncomeExpenses: "Plan your monthly income and expenses",
    currentMonth: "Current Month",
    createBudgetPlan: "Create Budget Plan",
    plannedIncome: "Planned Income",
    plannedExpenses: "Planned Expenses",
    actualIncome: "Actual Income",
    actualExpenses: "Actual Expenses",
    plannedBalance: "Planned Balance",
    actualBalance: "Actual Balance",
    variance: "Variance",
    noBudgetForMonth: "No budget plan created for this month yet.",
    clickToCreateBudget: "Click 'Create Budget Plan' to get started.",
    recurringPayments: "Recurring Payments & Subscriptions",
    trackSubscriptions: "Track your recurring subscriptions and bills",
    addSubscription: "Add Subscription",
    monthlyTotal: "Monthly Total",
    noSubscriptionsYet: "No subscriptions added yet",
    subscriptionName: "Subscription Name",
    billingCycle: "Billing Cycle",
    nextBillingDate: "Next Billing Date",
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
    newBudgetPlan: "New Budget Plan",
    month: "Month",
    newSubscription: "New Subscription",

    // Goals
    createGoal: "Create Goal",
    addFunds: "Add Funds",
    target: "Target",
    current: "Current",
    complete: "Complete",
    totalGoalAmount: "Total Goal Amount",
    totalSaved: "Total Saved",
    overallProgress: "Overall Progress",
    deadline: "Deadline",
    timeRemaining: "Time Remaining",
    days: "days",
    toGo: "to go",
    goalAchievementTips: "Goal Achievement Tips",
    automateSavings: "Automate savings",
    automateSavingsDesc: "Set up automatic transfers to your goal funds",
    breakItDown: "Break it down",
    breakItDownDesc: "Calculate monthly/weekly savings needed",
    stayMotivated: "Stay motivated",
    stayMotivatedDesc: "Visualize your goal and celebrate milestones",
    beRealistic: "Be realistic",
    beRealisticDesc: "Set achievable deadlines to avoid frustration",

    // Reports
    financialReports: "Financial Reports",
    exportToExcel: "Export to Excel",
    savingsRate: "Savings Rate",
    ofTotalIncome: "Of total income",
    allTime: "All time",
    noAccountsYet: "No accounts yet",

    // Chart labels
    transactionTrends: "Transaction Trends",
    budgetOverview: "Budget Overview",
    goalsBreakdown: "Goals Breakdown",

    // Budget Spending
    recordSpending: "Record Spending",
    recordExpense: "Record Expense",
    recording: "Recording...",
    optionalDescription: "Optional description",
    spendMoney: "Record Expense",

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
    security: "Security",
    changePassword: "Change Password",
    twoFactorAuth: "Two-Factor Authentication",
    addExtraSecurity: "Add an extra layer of security",
    personal: "Personal",
    smallBusiness: "Small Business",
    upgrade: "Upgrade",
    cancelSubscription: "Cancel Subscription",
    areYouSureCancelSubscription: "Are you sure you want to cancel?",
    loseAccessPremium: "You'll lose access to premium features at the end of your billing period.",
    yesCancel: "Yes, Cancel",
    keepSubscription: "Keep Subscription",
    free: "Free",
    pro: "Pro",
    business: "Business",
    popular: "POPULAR",
    perMonth: "/mo",
    perYear: "/year",
    or: "or",
    upgradeUnlimited: "Upgrade to unlock unlimited features",
    downgradeToFree: "Downgrade to Free",
    upgradeToPro: "Upgrade to Pro",
    upgradeToBusiness: "Upgrade to Business",
    planUpgradeSuccess: "Plan upgraded successfully! Welcome to",
    unlimitedTransactions: "Unlimited transactions",
    unlimitedBudgets: "Unlimited budgets",
    unlimitedGoals: "Unlimited goals",
    exportReports: "Export reports",
    oneTransaction: "1 transaction",
    twoBudgets: "2 budgets",
    oneGoal: "1 goal",
    noExport: "No export",
    everythingInPro: "Everything in Pro",
    businessTracking: "Business tracking",
    taxCategorization: "Tax categorization",
    multiUser: "Multi-user (3)",
    light: "Light",
    dark: "Dark",
    lightThemeDefault: "Light theme is the default appearance",
    darkThemeEyeStrain: "Dark theme helps reduce eye strain in low light",
    dangerZone: "Danger Zone",
    exportAllData: "Export All Data",
    downloadAllData: "Download all your financial data",
    export: "Export",
    deleteAccount: "Delete Account",
    permanentlyDelete: "Permanently delete your account and data",
    preferencesSaved: "Preferences saved successfully!",
    deleteAccountConfirm: "Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.",
    deleteAccountFinalWarning: "This is your last warning. Type your email to confirm deletion.",
    accountDeleted: "Your account has been deleted. You will be logged out.",
    deleteAccountFailed: "Failed to delete account. Please contact support.",
    exportDataFailed: "Failed to export data. Please try again.",
    errorOccurred: "An error occurred. Please try again.",

    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    loading: "Loading...",
    noData: "No data available",

    // Transaction Modal
    selectCategory: "Select category",
    foodDining: "Food & Dining",
    transportation: "Transportation",
    shopping: "Shopping",
    entertainment: "Entertainment",
    billsUtilities: "Bills & Utilities",
    healthcare: "Healthcare",
    salary: "Salary",
    businessCategory: "Business",
    other: "Other",
    adding: "Adding...",

    // Goal Modal
    goalName: "Goal Name",
    goalNamePlaceholder: "e.g., Emergency Fund, Vacation",
    targetAmount: "Target Amount",
    deadlineOptional: "Deadline (Optional)",
    createGoalButton: "Create Goal",
    creating: "Creating...",

    // Add Funds Modal
    addFundsTo: "Add Funds to",
    amountToAdd: "Amount to Add",
    addFundsButton: "Add Funds",

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
    monthlyBudgetPlanner: "Μηνιαίος Προϋπολογισμός",
    planIncomeExpenses: "Σχεδιάστε τα μηνιαία έσοδα και έξοδά σας",
    currentMonth: "Τρέχων Μήνας",
    createBudgetPlan: "Δημιουργία Προϋπολογισμού",
    plannedIncome: "Προγραμματισμένα Έσοδα",
    plannedExpenses: "Προγραμματισμένα Έξοδα",
    actualIncome: "Πραγματικά Έσοδα",
    actualExpenses: "Πραγματικά Έξοδα",
    plannedBalance: "Προγραμματισμένο Υπόλοιπο",
    actualBalance: "Πραγματικό Υπόλοιπο",
    variance: "Απόκλιση",
    noBudgetForMonth: "Δεν έχει δημιουργηθεί προϋπολογισμός για αυτόν τον μήνα ακόμα.",
    clickToCreateBudget: "Κάντε κλικ στο 'Δημιουργία Προϋπολογισμού' για να ξεκινήσετε.",
    recurringPayments: "Επαναλαμβανόμενες Πληρωμές & Συνδρομές",
    trackSubscriptions: "Παρακολουθήστε τις επαναλαμβανόμενες συνδρομές και λογαριασμούς σας",
    addSubscription: "Προσθήκη Συνδρομής",
    monthlyTotal: "Μηνιαίο Σύνολο",
    noSubscriptionsYet: "Δεν έχουν προστεθεί συνδρομές ακόμα",
    subscriptionName: "Όνομα Συνδρομής",
    billingCycle: "Κύκλος Χρέωσης",
    nextBillingDate: "Επόμενη Ημερομηνία Χρέωσης",
    weekly: "Εβδομαδιαία",
    monthly: "Μηνιαία",
    yearly: "Ετήσια",
    newBudgetPlan: "Νέος Προϋπολογισμός",
    month: "Μήνας",
    newSubscription: "Νέα Συνδρομή",

    // Goals
    createGoal: "Δημιουργία Στόχου",
    addFunds: "Προσθήκη Κεφαλαίων",
    target: "Στόχος",
    current: "Τρέχον",
    complete: "Ολοκληρώθηκε",
    totalGoalAmount: "Συνολικό Ποσό Στόχου",
    totalSaved: "Συνολικά Αποταμιευμένα",
    overallProgress: "Συνολική Πρόοδος",
    deadline: "Προθεσμία",
    timeRemaining: "Υπολειπόμενος Χρόνος",
    days: "ημέρες",
    toGo: "ακόμα",
    goalAchievementTips: "Συμβουλές για Επίτευξη Στόχων",
    automateSavings: "Αυτοματοποιήστε την αποταμίευση",
    automateSavingsDesc: "Ρυθμίστε αυτόματες μεταφορές στα κεφάλαια των στόχων σας",
    breakItDown: "Χωρίστε το",
    breakItDownDesc: "Υπολογίστε τις μηνιαίες/εβδομαδιαίες αποταμιεύσεις που χρειάζονται",
    stayMotivated: "Μείνετε παρακινημένοι",
    stayMotivatedDesc: "Οραματιστείτε τον στόχο σας και γιορτάστε τα ορόσημα",
    beRealistic: "Να είστε ρεαλιστικοί",
    beRealisticDesc: "Θέστε εφικτές προθεσμίες για να αποφύγετε την απογοήτευση",

    // Reports
    financialReports: "Οικονομικές Αναφορές",
    exportToExcel: "Εξαγωγή σε Excel",
    savingsRate: "Ποσοστό Αποταμίευσης",
    ofTotalIncome: "Του συνολικού εισοδήματος",
    allTime: "Όλοι οι χρόνοι",
    noAccountsYet: "Δεν υπάρχουν λογαριασμοί ακόμα",

    // Chart labels
    transactionTrends: "Τάσεις Συναλλαγών",
    budgetOverview: "Επισκόπηση Προϋπολογισμού",
    goalsBreakdown: "Ανάλυση Στόχων",

    // Budget Spending
    recordSpending: "Καταγραφή Δαπάνης",
    recordExpense: "Καταγραφή Εξόδου",
    recording: "Καταγραφή...",
    optionalDescription: "Προαιρετική περιγραφή",
    spendMoney: "Καταγραφή Εξόδου",

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
    security: "Ασφάλεια",
    changePassword: "Αλλαγή Κωδικού",
    twoFactorAuth: "Έλεγχος Ταυτότητας Δύο Παραγόντων",
    addExtraSecurity: "Προσθέστε ένα επιπλέον επίπεδο ασφάλειας",
    personal: "Προσωπικός",
    smallBusiness: "Μικρή Επιχείρηση",
    upgrade: "Αναβάθμιση",
    cancelSubscription: "Ακύρωση Συνδρομής",
    areYouSureCancelSubscription: "Είστε σίγουροι ότι θέλετε να ακυρώσετε;",
    loseAccessPremium: "Θα χάσετε την πρόσβαση στις premium λειτουργίες στο τέλος της περιόδου χρέωσής σας.",
    yesCancel: "Ναι, Ακύρωση",
    keepSubscription: "Διατήρηση Συνδρομής",
    free: "Δωρεάν",
    pro: "Pro",
    business: "Επιχείρηση",
    popular: "ΔΗΜΟΦΙΛΗΣ",
    perMonth: "/μήνα",
    perYear: "/έτος",
    or: "ή",
    upgradeUnlimited: "Αναβαθμίστε για απεριόριστες λειτουργίες",
    downgradeToFree: "Υποβάθμιση σε Δωρεάν",
    upgradeToPro: "Αναβάθμιση σε Pro",
    upgradeToBusiness: "Αναβάθμιση σε Επιχείρηση",
    planUpgradeSuccess: "Η αναβάθμιση ολοκληρώθηκε! Καλώς ήρθατε στο",
    unlimitedTransactions: "Απεριόριστες συναλλαγές",
    unlimitedBudgets: "Απεριόριστοι προϋπολογισμοί",
    unlimitedGoals: "Απεριόριστοι στόχοι",
    exportReports: "Εξαγωγή αναφορών",
    oneTransaction: "1 συναλλαγή",
    twoBudgets: "2 προϋπολογισμοί",
    oneGoal: "1 στόχος",
    noExport: "Χωρίς εξαγωγή",
    everythingInPro: "Όλα του Pro",
    businessTracking: "Παρακολούθηση επιχείρησης",
    taxCategorization: "Κατηγοριοποίηση φόρων",
    multiUser: "Πολλαπλοί χρήστες (3)",
    light: "Φωτεινό",
    dark: "Σκοτεινό",
    lightThemeDefault: "Το φωτεινό θέμα είναι η προεπιλεγμένη εμφάνιση",
    darkThemeEyeStrain: "Το σκοτεινό θέμα μειώνει την κούραση των ματιών σε χαμηλό φωτισμό",
    dangerZone: "Ζώνη Κινδύνου",
    exportAllData: "Εξαγωγή Όλων των Δεδομένων",
    downloadAllData: "Κατεβάστε όλα τα οικονομικά σας δεδομένα",
    export: "Εξαγωγή",
    deleteAccount: "Διαγραφή Λογαριασμού",
    permanentlyDelete: "Μόνιμη διαγραφή του λογαριασμού και των δεδομένων σας",
    preferencesSaved: "Οι προτιμήσεις αποθηκεύτηκαν επιτυχώς!",
    deleteAccountConfirm: "Είστε σίγουροι ότι θέλετε να διαγράψετε τον λογαριασμό σας; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί. Όλα τα δεδομένα σας θα διαγραφούν οριστικά.",
    deleteAccountFinalWarning: "Αυτή είναι η τελευταία προειδοποίηση. Πληκτρολογήστε το email σας για επιβεβαίωση διαγραφής.",
    accountDeleted: "Ο λογαριασμός σας έχει διαγραφεί. Θα αποσυνδεθείτε.",
    deleteAccountFailed: "Αποτυχία διαγραφής λογαριασμού. Επικοινωνήστε με την υποστήριξη.",
    exportDataFailed: "Αποτυχία εξαγωγής δεδομένων. Δοκιμάστε ξανά.",
    errorOccurred: "Παρουσιάστηκε σφάλμα. Δοκιμάστε ξανά.",

    // Common
    save: "Αποθήκευση",
    cancel: "Ακύρωση",
    delete: "Διαγραφή",
    edit: "Επεξεργασία",
    close: "Κλείσιμο",
    loading: "Φόρτωση...",
    noData: "Δεν υπάρχουν δεδομένα",

    // Transaction Modal
    selectCategory: "Επιλέξτε κατηγορία",
    foodDining: "Φαγητό & Εστίαση",
    transportation: "Μεταφορές",
    shopping: "Αγορές",
    entertainment: "Ψυχαγωγία",
    billsUtilities: "Λογαριασμοί & Κοινόχρηστα",
    healthcare: "Υγεία",
    salary: "Μισθός",
    businessCategory: "Επιχείρηση",
    other: "Άλλο",
    adding: "Προσθήκη...",

    // Goal Modal
    goalName: "Όνομα Στόχου",
    goalNamePlaceholder: "π.χ., Ταμείο Έκτακτης Ανάγκης, Διακοπές",
    targetAmount: "Ποσό Στόχου",
    deadlineOptional: "Προθεσμία (Προαιρετικό)",
    createGoalButton: "Δημιουργία Στόχου",
    creating: "Δημιουργία...",

    // Add Funds Modal
    addFundsTo: "Προσθήκη Κεφαλαίων σε",
    amountToAdd: "Ποσό προς Προσθήκη",
    addFundsButton: "Προσθήκη Κεφαλαίων",

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
