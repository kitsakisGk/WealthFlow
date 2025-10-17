# 🔐 How to Enable Row Level Security (RLS) in Supabase

## Why You Need This

Right now, your tables are marked as "Unrestricted" - this means **ANYONE** with your API URL could access all your data! RLS fixes this by making sure users can ONLY see their own data.

---

## Step-by-Step Guide (3 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **WealthFlow** project
3. Click **SQL Editor** in the left sidebar (icon looks like `</>`)

### Step 2: Copy the SQL Script

1. Open the file `ENABLE_RLS.sql` in your project folder
2. **Select ALL** the text (Ctrl+A)
3. **Copy** it (Ctrl+C)

### Step 3: Run the SQL Script

1. Back in Supabase SQL Editor, click **"+ New query"**
2. **Paste** the entire SQL script (Ctrl+V)
3. Click **"Run"** button (or press Ctrl+Enter)
4. You should see: ✅ **"Success. No rows returned"**

### Step 4: Verify RLS is Enabled

1. Go to **Table Editor** in the left sidebar
2. Click on any table (e.g., "User")
3. Look at the top - you should now see: 🔒 **"RLS enabled"** instead of "Unrestricted"
4. Repeat for all tables (Transaction, Budget, Goal, Category)

---

## ✅ What You Just Did

You enabled security policies that:

- Users can ONLY see their own profile
- Users can ONLY see their own transactions
- Users can ONLY create/edit/delete their own budgets
- Users can ONLY create/edit/delete their own goals
- Users can ONLY create/edit/delete their own categories

**Your data is now SECURE!** 🔒

---

## 🧪 Test Your Security

Try this to confirm it's working:

1. Open **Table Editor** in Supabase
2. Click on "User" table
3. Try to view the data
4. You should see: **"No rows returned"** or **"RLS is blocking this"**

This is GOOD! It means your data is protected.

Your app will still work perfectly because NextAuth will provide the proper user authentication when users log in through your app.

---

## ⚠️ Important Note

If you ever need to manually view/edit data in Supabase Table Editor:

1. Go to **Settings** → **API**
2. Scroll to **"Service Role Key"** (not "Anon Key")
3. Use this key ONLY for admin tasks
4. **NEVER share this key or put it in your frontend code!**

For your app, continue using the **"Anon Key"** - RLS will protect your data automatically.

---

## Need Help?

If you see any errors when running the SQL:
1. Copy the exact error message
2. Let me know
3. I'll help you fix it!

**You're almost done securing your app!** 🚀
