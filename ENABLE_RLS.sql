-- 🔐 Row Level Security (RLS) Setup for WealthFlow
-- Copy and paste this entire file into Supabase SQL Editor

-- STEP 1: Enable Row Level Security on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Budget" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Goal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;

-- STEP 2: Create policies for User table
-- Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON "User"
  FOR SELECT
  USING (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON "User"
  FOR UPDATE
  USING (auth.uid()::text = id);

-- STEP 3: Create policies for Transaction table
-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
  ON "Transaction"
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can insert their own transactions
CREATE POLICY "Users can create own transactions"
  ON "Transaction"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own transactions
CREATE POLICY "Users can update own transactions"
  ON "Transaction"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Users can delete their own transactions
CREATE POLICY "Users can delete own transactions"
  ON "Transaction"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- STEP 4: Create policies for Budget table
-- Users can view their own budgets
CREATE POLICY "Users can view own budgets"
  ON "Budget"
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can create their own budgets
CREATE POLICY "Users can create own budgets"
  ON "Budget"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own budgets
CREATE POLICY "Users can update own budgets"
  ON "Budget"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Users can delete their own budgets
CREATE POLICY "Users can delete own budgets"
  ON "Budget"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- STEP 5: Create policies for Goal table
-- Users can view their own goals
CREATE POLICY "Users can view own goals"
  ON "Goal"
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can create their own goals
CREATE POLICY "Users can create own goals"
  ON "Goal"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own goals
CREATE POLICY "Users can update own goals"
  ON "Goal"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Users can delete their own goals
CREATE POLICY "Users can delete own goals"
  ON "Goal"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- STEP 6: Create policies for Category table
-- Users can view their own categories
CREATE POLICY "Users can view own categories"
  ON "Category"
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can create their own categories
CREATE POLICY "Users can create own categories"
  ON "Category"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own categories
CREATE POLICY "Users can update own categories"
  ON "Category"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Users can delete their own categories
CREATE POLICY "Users can delete own categories"
  ON "Category"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ✅ ALL DONE!
-- Your database is now secure with Row Level Security enabled
