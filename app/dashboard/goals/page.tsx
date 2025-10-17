"use client";

export default function GoalsPage() {
  const goals = [
    {
      id: 1,
      name: "Emergency Fund",
      target: 5000,
      current: 3200,
      deadline: "2025-12-31",
      icon: "🚨",
      description: "6 months of expenses for peace of mind",
    },
    {
      id: 2,
      name: "Vacation to Europe",
      target: 3000,
      current: 1850,
      deadline: "2026-06-15",
      icon: "✈️",
      description: "Summer trip to France and Italy",
    },
    {
      id: 3,
      name: "New Laptop",
      target: 1500,
      current: 680,
      deadline: "2026-03-01",
      icon: "💻",
      description: "MacBook Pro for work",
    },
    {
      id: 4,
      name: "Car Down Payment",
      target: 8000,
      current: 2100,
      deadline: "2026-12-31",
      icon: "🚗",
      description: "20% down payment for new car",
    },
  ];

  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-neutral">Financial Goals</h1>
        <button
          onClick={() => alert("Feature coming soon! 🚀")}
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
        >
          + New Goal
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Total Goal Amount</p>
          <p className="text-2xl font-bold text-neutral mt-2">€{totalTarget.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Total Saved</p>
          <p className="text-2xl font-bold text-positive mt-2">€{totalSaved.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-neutral-light">Overall Progress</p>
          <p className="text-2xl font-bold text-primary mt-2">
            {((totalSaved / totalTarget) * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = (goal.current / goal.target) * 100;
          const remaining = goal.target - goal.current;
          const daysUntilDeadline = Math.ceil(
            (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div key={goal.id} className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-primary">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-4xl mr-4">{goal.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral">{goal.name}</h3>
                    <p className="text-sm text-neutral-light mt-1">{goal.description}</p>
                  </div>
                </div>
                <button className="text-neutral-light hover:text-neutral">
                  <span className="text-xl">⋮</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-positive">€{goal.current.toFixed(2)}</span>
                  <span className="font-semibold text-neutral">€{goal.target.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-positive h-4 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-semibold text-primary">{progress.toFixed(1)}% Complete</span>
                  <span className="text-sm text-neutral-light">€{remaining.toFixed(2)} to go</span>
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-neutral-light">Deadline</p>
                  <p className="text-sm font-semibold text-neutral">
                    {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-light">Time Remaining</p>
                  <p className={`text-sm font-semibold ${
                    daysUntilDeadline < 30 ? "text-negative" : "text-neutral"
                  }`}>
                    {daysUntilDeadline} days
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => alert("Feature coming soon! 🚀")}
                  className="flex-1 bg-positive hover:bg-positive/90 text-white py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Add Funds
                </button>
                <button
                  onClick={() => alert("Feature coming soon! 🚀")}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-neutral py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                >
                  Edit Goal
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Savings Tips */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary mb-3">🎯 Goal Achievement Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <span className="text-positive font-bold mr-2">✓</span>
            <p className="text-sm text-neutral">
              <strong>Automate savings:</strong> Set up automatic transfers to your goal funds
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-positive font-bold mr-2">✓</span>
            <p className="text-sm text-neutral">
              <strong>Break it down:</strong> Calculate monthly/weekly savings needed
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-positive font-bold mr-2">✓</span>
            <p className="text-sm text-neutral">
              <strong>Stay motivated:</strong> Visualize your goal and celebrate milestones
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-positive font-bold mr-2">✓</span>
            <p className="text-sm text-neutral">
              <strong>Be realistic:</strong> Set achievable deadlines to avoid frustration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
