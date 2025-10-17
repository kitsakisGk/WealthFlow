# 🗄️ Supabase Database Setup Guide

## Step 1: Create Supabase Account (2 minutes)

1. **Go to** [https://supabase.com](https://supabase.com)
2. **Click** "Start your project"
3. **Sign up** with GitHub (easiest) or email
4. **It's FREE!** No credit card needed

---

## Step 2: Create Your Project (3 minutes)

1. **Click** "New Project"
2. **Fill in:**
   - **Name:** `wealthflow` (or any name you like)
   - **Database Password:** Create a strong password (SAVE THIS!)
   - **Region:** Choose closest to Greece (e.g., "Frankfurt" or "London")
   - **Pricing Plan:** FREE tier (perfect for starting!)

3. **Click** "Create new project"
4. **Wait 2-3 minutes** while Supabase sets up your database

---

## Step 3: Get Your Connection String (1 minute)

Once your project is ready:

1. Go to **Settings** (gear icon on left sidebar)
2. Click **Database**
3. Scroll down to **Connection string**
4. Select **URI** tab
5. **Copy** the connection string (looks like this):
   \`\`\`
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   \`\`\`
6. **Replace `[YOUR-PASSWORD]`** with your actual database password from Step 2

---

## Step 4: Add to Your Project (2 minutes)

1. **Open** your project folder (`D:\\Projects\\Money_Master`)

2. **Create** a file called `.env` (if it doesn't exist)

3. **Add** this line (replace with YOUR connection string):
   \`\`\`
   DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.xxxxx.supabase.co:5432/postgres"

   # Keep these for later
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-this-later"
   STRIPE_SECRET_KEY="get-from-stripe"
   \`\`\`

4. **Save** the file

---

## Step 5: Push Database Schema (1 minute)

Now let's create all the tables in your database!

1. **Open terminal** in your project folder

2. **Run this command:**
   \`\`\`bash
   npx prisma db push
   \`\`\`

3. **You should see:**
   \`\`\`
   Your database is now in sync with your schema.
   ✔ Generated Prisma Client
   \`\`\`

4. **Done!** Your database now has all these tables:
   - users
   - transactions
   - budgets
   - goals
   - categories

---

## Step 6: View Your Database (Optional but Cool!)

You can see your database visually:

### Option A: Supabase Dashboard
1. Go to your Supabase project
2. Click **Table Editor** on left sidebar
3. You'll see all your tables!

### Option B: Prisma Studio (Better!)
1. Run in terminal:
   \`\`\`bash
   npx prisma studio
   \`\`\`
2. Opens at `http://localhost:5555`
3. Beautiful visual database editor!

---

## ✅ YOU'RE DONE!

Your database is ready! Here's what you have:

- ✅ Free PostgreSQL database in the cloud
- ✅ All tables created and ready
- ✅ Connection configured
- ✅ Accessible from anywhere

---

## 🚀 Next Steps

Now your app can connect to a REAL database instead of mock data!

**To make it work with real data, we need to:**
1. ✅ Database setup (DONE!)
2. ⏳ Set up authentication (NextAuth)
3. ⏳ Create API endpoints to save/load data
4. ⏳ Update pages to use real data

**Want me to help with the next step?**

---

## 🛟 Troubleshooting

### Error: "Can't reach database server"
- Check your internet connection
- Make sure password in `.env` is correct (no spaces!)
- Make sure connection string has no line breaks

### Error: "Invalid connection string"
- Open `.env` file
- Make sure `DATABASE_URL` is ONE line
- Make sure password doesn't have special characters that break the URL
- If password has `@` or `:` or `/`, wrap it in URL encoding

### How to reset database password
1. Go to Supabase Dashboard
2. Settings → Database
3. Click "Reset database password"
4. Copy new password
5. Update your `.env` file

---

## 📊 Free Tier Limits

Supabase FREE plan includes:
- ✅ 500MB database storage (plenty for thousands of users!)
- ✅ 50,000 monthly active users
- ✅ 2GB file storage
- ✅ Unlimited API requests
- ✅ Automatic daily backups

**Perfect for launching your product!**

When you grow, you can upgrade anytime.

---

## 🔐 Security Notes

- ✅ Your `.env` file is in `.gitignore` (never shared publicly)
- ✅ Database password is secret (never share it!)
- ✅ Connection is encrypted (SSL/TLS)
- ✅ Supabase has automatic backups

**You're secure!** ✨

---

## Need Help?

If something doesn't work, just let me know:
1. What step you're on
2. What error you see
3. I'll help you fix it!

**Let's go! 🚀**
