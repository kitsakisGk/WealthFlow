export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-light">Total Balance</p>
              <p className="text-3xl font-bold text-positive mt-2">€5,240.00</p>
            </div>
            <div className="text-4xl">💵</div>
          </div>
          <p className="text-sm text-positive mt-2">+12.5% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-light">Income</p>
              <p className="text-3xl font-bold text-positive mt-2">€8,500.00</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
          <p className="text-sm text-neutral-light mt-2">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-light">Expenses</p>
              <p className="text-3xl font-bold text-negative mt-2">€3,260.00</p>
            </div>
            <div className="text-4xl">📉</div>
          </div>
          <p className="text-sm text-negative mt-2">-5.2% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-light">Savings</p>
              <p className="text-3xl font-bold text-neutral mt-2">€5,240.00</p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
          <p className="text-sm text-positive mt-2">62% of goal</p>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-neutral mb-4">Spending by Category</h3>
          <div className="space-y-4">
            {[
              { category: "Food & Dining", amount: 850, percent: 65, color: "bg-positive" },
              { category: "Transportation", amount: 420, percent: 45, color: "bg-primary" },
              { category: "Shopping", amount: 680, percent: 55, color: "bg-neutral" },
              { category: "Entertainment", amount: 310, percent: 35, color: "bg-negative" },
            ].map((item) => (
              <div key={item.category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-neutral">{item.category}</span>
                  <span className="text-sm font-semibold text-neutral">€{item.amount.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`€{item.color} h-2 rounded-full`}
                    style={{ width: `€{item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-neutral mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {[
              { name: "Grocery Store", category: "Food", amount: -85.20, date: "Today", type: "expense" },
              { name: "Salary Deposit", category: "Income", amount: 2500.00, date: "Yesterday", type: "income" },
              { name: "Netflix Subscription", category: "Entertainment", amount: -15.99, date: "2 days ago", type: "expense" },
              { name: "Coffee Shop", category: "Food", amount: -5.80, date: "3 days ago", type: "expense" },
              { name: "Freelance Project", category: "Income", amount: 850.00, date: "4 days ago", type: "income" },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center €{
                    transaction.type === "income" ? "bg-positive/10" : "bg-neutral/10"
                  }`}>
                    <span className="text-xl">{transaction.type === "income" ? "💰" : "💳"}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral">{transaction.name}</p>
                    <p className="text-xs text-neutral-light">{transaction.category} • {transaction.date}</p>
                  </div>
                </div>
                <div className={`text-sm font-semibold €{
                  transaction.type === "income" ? "text-positive" : "text-negative"
                }`}>
                  {transaction.type === "income" ? "+" : ""}€{Math.abs(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Goals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-neutral mb-4">Active Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Emergency Fund", current: 3200, target: 5000, icon: "🚨" },
            { name: "Vacation Fund", current: 1850, target: 3000, icon: "✈️" },
            { name: "New Laptop", current: 680, target: 1500, icon: "💻" },
          ].map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <div key={goal.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <span className="text-sm font-semibold text-positive">{progress.toFixed(0)}%</span>
                </div>
                <h4 className="font-semibold text-neutral mb-2">{goal.name}</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-positive h-2 rounded-full"
                    style={{ width: `€{progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-neutral-light">
                  €{goal.current.toFixed(2)} of €{goal.target.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
