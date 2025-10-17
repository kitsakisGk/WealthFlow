-- Row Level Security (RLS) for WealthFlow Database
-- Run this in Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "budgets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "goals" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;

-- User table policies
CREATE POLICY "users_select_own" ON "users" FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "users_update_own" ON "users" FOR UPDATE USING (auth.uid()::text = id);

-- Transaction table policies
CREATE POLICY "transactions_select_own" ON "transactions" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "transactions_insert_own" ON "transactions" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "transactions_update_own" ON "transactions" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "transactions_delete_own" ON "transactions" FOR DELETE USING (auth.uid()::text = "userId");

-- Budget table policies
CREATE POLICY "budgets_select_own" ON "budgets" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "budgets_insert_own" ON "budgets" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "budgets_update_own" ON "budgets" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "budgets_delete_own" ON "budgets" FOR DELETE USING (auth.uid()::text = "userId");

-- Goal table policies
CREATE POLICY "goals_select_own" ON "goals" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "goals_insert_own" ON "goals" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "goals_update_own" ON "goals" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "goals_delete_own" ON "goals" FOR DELETE USING (auth.uid()::text = "userId");

-- Category table policies
CREATE POLICY "categories_select_own" ON "categories" FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "categories_insert_own" ON "categories" FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "categories_update_own" ON "categories" FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "categories_delete_own" ON "categories" FOR DELETE USING (auth.uid()::text = "userId");
