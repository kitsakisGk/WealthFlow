import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-primary text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            WealthFlow System
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-neutral-light">
            Master Your Money, Build Your Wealth
          </p>
          <p className="text-lg mb-10 max-w-2xl mx-auto">
            The complete money management system for individuals and small businesses.
            Track expenses, set budgets, achieve financial goals.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth/signup"
              className="bg-positive hover:bg-positive/90 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/auth/login"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg border border-white/30 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-neutral">
            Everything You Need to Master Your Finances
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-3 text-primary">Track Everything</h3>
              <p className="text-neutral">
                Monitor all your income and expenses in one place.
                Know exactly where your money goes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3 text-primary">Smart Budgets</h3>
              <p className="text-neutral">
                Create budgets that work. Get alerts when you're overspending.
                Stay on track effortlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3 text-primary">Reach Goals</h3>
              <p className="text-neutral">
                Set financial goals and track progress.
                Vacation fund? New car? We'll help you get there.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-bold mb-3 text-primary">Visual Reports</h3>
              <p className="text-neutral">
                Beautiful charts and reports that make sense.
                Understand your financial health at a glance.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold mb-3 text-primary">Business Ready</h3>
              <p className="text-neutral">
                Perfect for freelancers and small businesses.
                Track business expenses separately.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3 text-primary">Secure & Private</h3>
              <p className="text-neutral">
                Bank-level security. Your data is encrypted and safe.
                We never share your information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-neutral">
            Simple, Transparent Pricing
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-6">
                €0<span className="text-lg font-normal text-neutral-light">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>1 transaction</span>
                </li>
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>2 budgets</span>
                </li>
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>1 financial goal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-negative mr-2">✗</span>
                  <span className="text-neutral-light">No report export</span>
                </li>
              </ul>
              <Link
                href="/auth/signup"
                className="block text-center bg-neutral hover:bg-neutral/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Plan - Highlighted */}
            <div className="bg-primary text-white p-8 rounded-lg shadow-xl border-2 border-positive transform md:scale-105">
              <div className="bg-positive text-white text-sm font-bold py-1 px-3 rounded-full inline-block mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-2">
                €4.99<span className="text-lg font-normal">/month</span>
              </div>
              <p className="text-sm mb-6 text-neutral-light">or €29.99/year (save €30!)</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>Unlimited transactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>Unlimited budgets</span>
                </li>
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>Unlimited goals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>Advanced reports & charts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>Export to PDF/Excel</span>
                </li>
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <Link
                href="/auth/signup?plan=pro"
                className="block text-center bg-positive hover:bg-positive/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Go Pro
              </Link>
            </div>

            {/* Business Plan */}
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <div className="text-4xl font-bold mb-2">
                €19.99<span className="text-lg font-normal text-neutral-light">/month</span>
              </div>
              <p className="text-sm text-neutral-light mb-6">or €59.99/year (save €180!)</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>Business expense tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>Tax categorization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>Invoice tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>Multi-user access (up to 3)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-positive mr-2">✓</span>
                  <span>Dedicated support</span>
                </li>
              </ul>
              <Link
                href="/auth/signup?plan=business"
                className="block text-center bg-neutral hover:bg-neutral/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Go Business
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Master Your Money?
          </h2>
          <p className="text-xl mb-8 text-neutral-light">
            Join thousands of people taking control of their financial future.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-positive hover:bg-positive/90 text-white font-semibold py-4 px-10 rounded-lg text-lg transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral text-white py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-neutral-light">
            &copy; 2025 WealthFlow System. All rights reserved.copy; 2025 WealthFlow System. All rights reserved.</p><p className="text-sm text-neutral-light mt-2">Powered by <span className="font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Luminus</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
