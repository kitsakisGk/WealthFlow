# 🚀 DEPLOYMENT & SECURITY GUIDE

## ✅ PRICING UPDATED!

**New Pricing:**
- **Pro:** €4.99/month or €29.99/year (save €30!)
- **Business:** €19.99/month or €59.99/year (save €180!)

---

## 🔒 SECRETS & SECURITY - YOUR QUESTIONS ANSWERED

### ❌ **NEVER PUT IN GITHUB:**

```
.env                    ← Your passwords (already in .gitignore!)
DATABASE_URL           ← Has your database password
NEXTAUTH_SECRET        ← Secret key
Stripe keys            ← Payment API keys
Any passwords/tokens   ← Never!
```

### ✅ **SAFE TO PUT IN GITHUB:**

```
All your code (.tsx, .ts, .css files)
package.json
prisma/schema.prisma
.env.example (template with NO real values)
Everything else!
```

---

## 🌐 WHERE TO DEPLOY: VERCEL (FREE & EASIEST!)

### **Why Vercel?**
- ✅ **FREE** for your use case (unlimited hobby projects)
- ✅ Made by Next.js creators (perfect compatibility!)
- ✅ **NO DOCKER NEEDED** - Just push code!
- ✅ Automatic SSL (HTTPS)
- ✅ Custom domains (wealthflow.com)
- ✅ Auto-deploys when you push to GitHub
- ✅ Environment variables (secure secrets)
- ✅ CDN (fast worldwide)

### **How It Works:**

```
1. You push code to GitHub (NO secrets!)
   ↓
2. Connect Vercel to your GitHub repo
   ↓
3. Add environment variables in Vercel dashboard
   ↓
4. Vercel deploys automatically
   ↓
5. You get: https://wealthflow.vercel.app
   ↓
6. Every GitHub push = Auto redeploy!
```

**NO DOCKER! NO SERVERS! NO COMPLEXITY!**

---

## 🔑 API KEYS - WHERE TO GET THEM

### **1. Supabase (Database)** ✅ Already Have!

**Where:** Supabase Dashboard → Project Settings → Database → Connection string
**What you need:**
```
DATABASE_URL="postgresql://postgres:YourPassword@db.xxx.supabase.co:5432/postgres"
```

**Where to add in Vercel:**
- Environment Variable name: `DATABASE_URL`
- Value: Your full connection string
- Environments: Production, Preview, Development

---

### **2. NextAuth Secret** ✅ Already Generated!

**What you have:**
```
NEXTAUTH_SECRET="UPNnztTyof0Zl1QlZQ3MEVrVW7TV4Sj2to4bI/KtMyk="
```

**Where to add in Vercel:**
- Variable name: `NEXTAUTH_SECRET`
- Value: Copy from your `.env` file
- Environments: Production, Preview, Development

---

### **3. NextAuth URL**

**For Vercel deployment:**
```
NEXTAUTH_URL="https://YOUR-APP.vercel.app"
```

**You'll get this URL AFTER first deployment!**
Then update it in Vercel environment variables.

---

### **4. Stripe (When You Set It Up)**

**Where to get:**
1. Go to [stripe.com](https://stripe.com)
2. Create account (FREE)
3. Dashboard → Developers → API keys
4. Copy keys:
   - **Publishable key:** `pk_test_...` (safe to expose)
   - **Secret key:** `sk_test_...` (NEVER expose!)

**Add to Vercel:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx  (PUBLIC - OK)
STRIPE_SECRET_KEY=sk_test_xxx                   (SECRET!)
STRIPE_WEBHOOK_SECRET=whsec_xxx                 (SECRET!)
```

---

## 🛡️ RLS (ROW LEVEL SECURITY) - IMPORTANT!

### **What "Unrestricted" Means:**

Your tables currently say **"Unrestricted"** in Supabase = **DANGEROUS!** 😱

**Problem:**
- Anyone with your Supabase URL could read ALL data
- Users could see OTHER users' transactions
- No privacy protection
- Public API access

### **What RLS Does:**

**Row Level Security** = Users can ONLY see/modify THEIR OWN data!

**Example:**
```
User A (email: alice@example.com)
  → Can ONLY see Alice's transactions
  → Cannot see Bob's data

User B (email: bob@example.com)
  → Can ONLY see Bob's transactions
  → Cannot see Alice's data
```

### **How to Enable RLS (5 minutes):**

**Option 1: Supabase Dashboard (EASIEST)**

1. Go to Supabase → Authentication → Policies
2. For each table (`users`, `transactions`, `budgets`, `goals`, `categories`):
   - Click table
   - Click "Enable RLS"
   - Add policy: "Users can only access their own data"
   - Template: `auth.uid() = user_id`

**Option 2: SQL Editor (FASTER - I'll give you the commands!)**

Go to Supabase → SQL Editor → New Query → Paste this:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid()::text = "userId");

-- Budgets policies
CREATE POLICY "Users can view own budgets" ON budgets
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own budgets" ON budgets
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own budgets" ON budgets
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own budgets" ON budgets
  FOR DELETE USING (auth.uid()::text = "userId");

-- Goals policies
CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE USING (auth.uid()::text = "userId");

-- Categories policies
CREATE POLICY "Users can view own categories" ON categories
  FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own categories" ON categories
  FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own categories" ON categories
  FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own categories" ON categories
  FOR DELETE USING (auth.uid()::text = "userId");
```

**Click "RUN"** - Done! Your data is now protected! 🔒

---

## 📦 NO DOCKER NEEDED!

**You asked about Docker - you DON'T need it!**

**Docker is for:**
- Running your own servers
- Complex multi-service setups
- Self-hosting

**Vercel handles everything:**
- ✅ Automatic builds
- ✅ Server management
- ✅ Scaling
- ✅ CDN
- ✅ SSL certificates
- ✅ Environment variables

**You just push code → Vercel does the rest!**

---

## 🚀 DEPLOYMENT STEPS (15 MINUTES)

### **Step 1: Prepare GitHub**

1. Your repo: `https://github.com/kitsakisGk/WealthFlow`
2. Make sure `.env` is in `.gitignore` (it already is!)
3. Push all your code:
   ```bash
   git add .
   git commit -m "Initial commit - WealthFlow System"
   git push origin main
   ```

### **Step 2: Deploy to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" (use GitHub account - easiest!)
3. Click "Import Project"
4. Select your repo: `kitsakisGk/WealthFlow`
5. Vercel auto-detects Next.js! Click "Deploy"
6. **WAIT** - First deploy takes ~2-3 minutes

### **Step 3: Add Environment Variables**

**AFTER first deployment:**

1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Add these ONE BY ONE:

```
DATABASE_URL
Value: postgresql://postgres:MoneyFlowSt@rted2025@db.mpvddfipjcjzepfzxvki.supabase.co:5432/postgres
Environments: ✅ Production ✅ Preview ✅ Development

NEXTAUTH_SECRET
Value: UPNnztTyof0Zl1QlZQ3MEVrVW7TV4Sj2to4bI/KtMyk=
Environments: ✅ Production ✅ Preview ✅ Development

NEXTAUTH_URL
Value: https://YOUR-APP.vercel.app (copy from Vercel dashboard)
Environments: ✅ Production ✅ Preview ✅ Development
```

4. Click "Save"
5. Go to "Deployments" tab
6. Click "..." on latest deployment → "Redeploy"

### **Step 4: Test Live Site!**

Go to: `https://your-app.vercel.app`

**Test:**
1. ✅ Landing page loads
2. ✅ Sign up works
3. ✅ Login works
4. ✅ Dashboard loads
5. ✅ Check Supabase - user is saved!

**IT'S LIVE!** 🎉

---

## 🔄 AUTO-DEPLOYMENT

**From now on:**
1. Make changes in your code
2. Push to GitHub: `git push`
3. Vercel automatically detects changes
4. Rebuilds and deploys
5. Live in ~2 minutes!

**NO manual steps needed!**

---

## 🌍 CUSTOM DOMAIN (OPTIONAL)

**Want: `wealthflow.com` instead of `.vercel.app`?**

1. Buy domain from:
   - Namecheap (~€10/year)
   - GoDaddy (~€12/year)
   - Google Domains (~€12/year)

2. In Vercel:
   - Settings → Domains
   - Add `wealthflow.com`
   - Follow DNS instructions
   - **Automatic SSL!**

3. Update `NEXTAUTH_URL` to `https://wealthflow.com`

---

## 🐛 TROUBLESHOOTING

### "Build failed"
- Check Vercel build logs
- Usually missing environment variables
- Make sure all variables are added

### "Application error"
- Check Vercel runtime logs
- Usually wrong `NEXTAUTH_URL`
- Should match your domain exactly

### "Can't login on live site"
- Check `NEXTAUTH_URL` is correct
- Should be `https://your-app.vercel.app`
- NOT `http://localhost:3000`!

### "Database connection failed"
- Check `DATABASE_URL` in Vercel
- Make sure no extra spaces
- Test connection from local first

---

## 📊 WHAT YOU GET

**Free Vercel plan includes:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month (plenty!)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Analytics
- ✅ Preview deployments (for testing)

**This is MORE than enough for:**
- Thousands of users
- Millions of page views
- Professional business use

---

## 🎯 SUMMARY

**Your Questions Answered:**

1. **GitHub secrets?** → Never commit `.env`, add in Vercel instead
2. **Where to deploy?** → Vercel (FREE, easy, automatic)
3. **Docker needed?** → NO! Vercel handles everything
4. **API keys?** → Supabase (have it), NextAuth (have it), Stripe (get when ready)
5. **RLS unrestricted?** → Enable RLS with SQL commands above (5 min)

**You're ready to deploy!** 🚀

---

## 💡 NEXT STEPS

**Choose your path:**

**Path A: Deploy NOW** (15 min)
- Push to GitHub
- Deploy to Vercel
- Add environment variables
- **GO LIVE!**

**Path B: Enable RLS first** (5 min)
- Run SQL commands in Supabase
- Secure your database
- THEN deploy

**Path C: Add Stripe payments** (30 min)
- Set up Stripe account
- Create products (€4.99 Pro, €19.99 Business)
- Integrate payment flow
- THEN deploy

**What do you want to do?** Tell me and I'll guide you! 😊
