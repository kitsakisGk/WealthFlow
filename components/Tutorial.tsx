"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface TutorialProps {
  onComplete: () => void;
}

export default function Tutorial({ onComplete }: TutorialProps) {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const steps = [
    {
      title: "Welcome to WealthFlow! 💰",
      description: "Let's take a quick tour to help you get started with managing your finances. We'll guide you through each section!",
      action: "Start Tour",
      route: "/dashboard",
      highlight: null,
    },
    {
      title: "Dashboard Overview 📊",
      description: "This is your financial command center. Here you can see your balance, income, and expenses at a glance. Your available balance updates automatically!",
      action: "Next",
      route: "/dashboard",
      highlight: null,
    },
    {
      title: "Add Transactions 💸",
      description: "Let's go to the Transactions page where you can add income or expenses. Click 'Next' and we'll take you there!",
      action: "Go to Transactions",
      route: "/dashboard/transactions",
      highlight: "add-transaction-btn",
    },
    {
      title: "Set Financial Goals 🎯",
      description: "Now let's check out Goals! Here you can create savings targets that automatically track against your real balance.",
      action: "Go to Goals",
      route: "/dashboard/goals",
      highlight: "add-goal-btn",
    },
    {
      title: "View Reports 📈",
      description: "The Reports page shows beautiful charts of your spending patterns and financial trends. Pro users can export to PDF and Excel!",
      action: "Go to Reports",
      route: "/dashboard/reports",
      highlight: null,
    },
    {
      title: "Customize Settings ⚙️",
      description: "In Settings you can change your language, currency, theme, and manage your subscription. Let's take a quick look!",
      action: "Go to Settings",
      route: "/dashboard/settings",
      highlight: null,
    },
    {
      title: "You're All Set! 🚀",
      description: "You're ready to take control of your finances! Start by adding your first transaction or setting a financial goal. The sidebar will always help you navigate.",
      action: "Get Started",
      route: "/dashboard",
      highlight: null,
    },
  ];

  const currentStep = steps[step];

  // Navigate to the route when step changes
  useEffect(() => {
    if (currentStep.route && currentStep.route !== pathname) {
      router.push(currentStep.route);
    }
  }, [step, currentStep.route, pathname, router]);

  // Add highlight effect to elements
  useEffect(() => {
    if (currentStep.highlight) {
      // Add a pulsing highlight class to the element
      const element = document.querySelector(`[data-tutorial="${currentStep.highlight}"]`);
      if (element) {
        element.classList.add("tutorial-highlight");
      }

      // Cleanup
      return () => {
        const element = document.querySelector(`[data-tutorial="${currentStep.highlight}"]`);
        if (element) {
          element.classList.remove("tutorial-highlight");
        }
      };
    }
  }, [currentStep.highlight]);

  const handleNext = () => {
    if (step === steps.length - 1) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <>
      {/* Add CSS for tutorial highlight effect */}
      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 40;
        }

        .tutorial-highlight::before {
          content: '';
          position: absolute;
          inset: -8px;
          border: 3px solid #10b981;
          border-radius: 12px;
          animation: tutorial-pulse 2s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes tutorial-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
      `}</style>

      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-light dark:text-gray-400">
                Step {step + 1} of {steps.length}
              </span>
              <button
                onClick={handleSkip}
                className="text-sm text-neutral-light dark:text-gray-400 hover:text-neutral dark:hover:text-white transition-colors"
              >
                Skip Tour
              </button>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary dark:bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-neutral dark:text-white mb-4">
              {currentStep.title}
            </h2>
            <p className="text-lg text-neutral-light dark:text-gray-300 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Illustration/Icon based on step */}
          <div className="flex justify-center mb-8">
            <div className="text-8xl">
              {step === 0 && "👋"}
              {step === 1 && "📊"}
              {step === 2 && "💸"}
              {step === 3 && "🎯"}
              {step === 4 && "📈"}
              {step === 5 && "⚙️"}
              {step === 6 && "🚀"}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            {step > 0 && step < steps.length - 1 && (
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-neutral dark:text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleNext}
              className={`${
                step === 0 || step === steps.length - 1 ? "w-full" : "flex-1"
              } bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-semibold transition-colors`}
            >
              {currentStep.action}
            </button>
          </div>

          {/* Helper Text */}
          {step === steps.length - 1 && (
            <p className="text-center text-sm text-neutral-light dark:text-gray-400 mt-4">
              You can always access help and settings from the sidebar
            </p>
          )}
        </div>
      </div>
    </>
  );
}
