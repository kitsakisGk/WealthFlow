"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import Tutorial from "@/components/Tutorial";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showTutorial, setShowTutorial] = useState(false);

  // Check if user has seen the tutorial
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorial(false);
  };

  return (
    <>
      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
      <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
