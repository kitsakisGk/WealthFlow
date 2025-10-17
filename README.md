# WealthFlow System 💰

A modern, full-featured money management system for individuals and small businesses. Track expenses, create budgets, set financial goals, and gain insights into your financial health.

## Features

- **Dashboard Overview** - Real-time financial snapshot with key metrics
- **Transaction Management** - Track all income and expenses
- **Smart Budgeting** - Create and monitor budgets with visual progress
- **Financial Goals** - Set and achieve savings goals
- **Reports & Analytics** - Detailed charts and spending insights
- **Multi-Plan Support** - Free, Pro, and Business plans
- **Secure Payments** - Stripe integration for subscriptions
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js (to be configured)
- **Payments:** Stripe
- **Deployment:** Vercel-ready

## Color Scheme

- **Primary (Phthalo Green):** `#123524`
- **Positive (Green):** `#097969`
- **Negative (Red):** `#880808`
- **Neutral Light (Grey):** `#b1bac4`
- **Neutral Dark (Grey):** `#374151`

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account (for payments)

### Installation

1. **Clone and install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

   Edit `.env` and add your credentials:
   \`\`\`
   DATABASE_URL="postgresql://username:password@localhost:5432/wealthflow"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   \`\`\`

3. **Set up the database:**
   \`\`\`bash
   npx prisma generate
   npx prisma db push
   \`\`\`

4. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
wealthflow-system/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── dashboard/
│   │   ├── transactions/   # Transaction management
│   │   ├── budgets/        # Budget tracking
│   │   ├── goals/          # Financial goals
│   │   ├── reports/        # Analytics & reports
│   │   ├── settings/       # User settings
│   │   └── page.tsx        # Main dashboard
│   ├── api/
│   │   └── stripe/         # Stripe payment routes
│   ├── layout.tsx
│   └── page.tsx            # Landing page
├── components/
│   └── dashboard/          # Dashboard components
├── lib/
│   ├── prisma.ts          # Prisma client
│   └── stripe/            # Stripe configuration
├── prisma/
│   └── schema.prisma      # Database schema
└── public/
\`\`\`

## Database Schema

- **Users** - User accounts with plan and account type
- **Transactions** - Income and expense records
- **Budgets** - Budget allocations by category
- **Goals** - Financial savings goals
- **Categories** - Custom transaction categories

## Subscription Plans

### Free Plan (€0/month)
- 1 transaction per month
- 2 budgets
- 1 financial goal
- Basic reports

### Pro Plan (€4.99/month or €29.99/year)
- Unlimited transactions
- Unlimited budgets
- Unlimited goals
- Advanced reports & charts
- Export to PDF/Excel
- Priority support

### Business Plan (€19.99/month or €59.99/year)
- Everything in Pro
- Business expense tracking
- Custom categories
- Priority support
- Advanced reporting

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Create two products with monthly subscriptions:
   - Pro Plan ($9.99/month)
   - Business Plan ($19.99/month)
4. Add the price IDs to your `.env` file
5. Set up webhook endpoint: `/api/stripe/webhook`

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy!

The app is optimized for Vercel with automatic deployments.

## What's Working Now

- [x] NextAuth.js authentication (credentials provider)
- [x] PostgreSQL database connected (Supabase)
- [x] User registration and login
- [x] Real transaction creation with API
- [x] Transaction list with real-time data
- [x] Transaction deletion
- [x] User profile in sidebar
- [x] Session management

## Next Steps

- [ ] Enable Row Level Security in Supabase (SQL provided in ENABLE_RLS.sql)
- [ ] Implement budget CRUD operations
- [ ] Implement goal CRUD operations
- [ ] Set up Stripe products and test payments
- [ ] Add PDF/Excel export functionality
- [ ] Add data visualization charts
- [ ] Add recurring transaction support
- [ ] Implement search and filters

## Contributing

This is a private project. For questions or support, contact the developer.

## License

All rights reserved © 2025 WealthFlow System
