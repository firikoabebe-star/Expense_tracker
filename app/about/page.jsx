"use client"
import React from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Button } from '/components/ui/button';
import LandingNavbar from '/components/LandingNavbar'; // Assuming relative path fix
import FooterSection from '/components/footer';

// Main App Component
const About = () => {
  // Mock User ID for demonstration purposes
  const userId = "user_746b1c8a";
  const router = useRouter();

  // Define a reusable class for primary color text, adjusting for dark mode
  // This assumes 'text-indigo-600' is your primary color in light mode, and 'text-indigo-400' in dark mode.
  const primaryText = "text-primary dark:text-primary";
  // Define a reusable class for card background, adjusting for dark mode
  const cardBackground = "bg-gray-100 dark:bg-gray-800 transition duration-300 transform hover:scale-[1.01] hover:shadow-lg dark:hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/50";

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-8 h-8 ${primaryText}`}>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: "Real-Time Tracking",
      description: "Log transactions instantly across custom categories. See where every dollar goes the moment you spend it."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-8 h-8 ${primaryText}`}>
          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM2 12s2 2 10 2 10-2 10-2M12 18V6" />
        </svg>
      ),
      title: "Smart Budget Allocation",
      description: "Set personalized monthly budgets for different categories and receive alerts before you overspend."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-8 h-8 ${primaryText}`}>
          <path d="M3 3v18h18M18 17l-4.2-4.2M9 13.8L5 17m11-9V6h2M18 6l-5.2 5.2" />
        </svg>
      ),
      title: "Visual Data Analytics",
      description: "Understand your habits with interactive charts and reports. Identify leaks and savings opportunities instantly."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-8 h-8 ${primaryText}`}>
          <path d="M20.8 13.8L12 20.8 3.2 13.8M12 3v18M12 12l8.8-7.2M12 12l-8.8-7.2" />
        </svg>
      ),
      title: "Goal Setting & Saving",
      description: "Link expenses to specific savings goals, like a vacation or a new home, and track progress automatically."
    }
  ];

  return (
    <>
      <LandingNavbar />

      {/* Main Container - Full dark/light theme support */}
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 font-inter">
        
        {/* Main Content Container */}
        <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">

          {/* 1. Hero Section: What is it? */}
          <section className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight pt-6">
              Financial <span className={primaryText}>Clarity.</span>
              <br />
              Total <span className={primaryText}>Control.</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              BudgetFlow is your intuitive, smart expense tracker and budgeting web app. Stop guessing where your money goes and start building a future with confidence.
            </p>
            <Button
              onClick={() => router.push("/sign-up")}
              // Assuming Button component uses 'bg-primary' which should be themeable.
              className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-full shadow-lg transition duration-300 transform hover:scale-[1.05]"
            >
              Start Your Financial Journey Now 
            </Button>
          </section>

          <hr className="my-10 border-gray-200 dark:border-gray-800" />

          {/* 2. Benefits Section: What is it good for? */}
          <section className="mb-20">
            <h3 className="text-4xl font-bold text-center mb-12">
              Why an Expense Tracker is <span className={primaryText}>Essential</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-8">

              {/* Benefit 1 */}
              <div className={`p-8 rounded-xl border border-gray-200 dark:border-gray-700 ${cardBackground}`}>
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3 text-emerald-600 dark:text-emerald-400">💡</span>
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Gain True Spending Clarity</h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Most people underestimate their spending. An expense tracker gives you an unbiased, consolidated view of every transaction, exposing hidden spending habits and leaks you didn't know existed. It's financial X-ray vision.
                </p>
              </div>

              {/* Benefit 2 */}
              <div className={`p-8 rounded-xl border border-gray-200 dark:border-gray-700 ${cardBackground}`}>
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3 text-amber-600 dark:text-amber-400">🎯</span>
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Achieve Financial Goals Faster</h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Whether saving for a deposit, paying off debt, or planning a big trip, an effective budget and tracker ensures you allocate funds correctly, turning abstract goals into concrete, achievable steps.
                </p>
              </div>

              {/* Benefit 3 */}
              <div className={`p-8 rounded-xl border border-gray-200 dark:border-gray-700 ${cardBackground}`}>
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3 text-red-600 dark:text-red-400">🧘</span>
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Reduce Financial Stress</h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Knowledge is power, and with power comes peace. By removing the uncertainty around your money, you eliminate the single largest cause of financial anxiety. You'll always know your standing.
                </p>
              </div>

              {/* Benefit 4 */}
              <div className={`p-8 rounded-xl border border-gray-200 dark:border-gray-700 ${cardBackground}`}>
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3 text-sky-600 dark:text-sky-400">🚀</span>
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Make Smarter Life Decisions</h4>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  When you understand your cash flow, decisions about changing jobs, making investments, or taking on a new recurring expense become calculated moves, not fearful risks.
                </p>
              </div>

            </div>
          </section>

          <hr className="my-10 border-gray-200 dark:border-gray-800" />

          {/* 3. Features Section: How it works */}
          <section className="mb-20">
            <h3 className="text-4xl font-bold text-center mb-12">
              Packed with <span className={primaryText}>Powerful Features</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className={`p-6 rounded-xl text-center flex flex-col items-center border border-gray-200 dark:border-gray-700 ${cardBackground}`}>
                  <div className={`p-4 rounded-full mb-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-700`}>
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{feature.title}</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="my-10 border-gray-200 dark:border-gray-800" />
          
          {/* Call to Action */}
          <section className="text-center pt-10">
            <h3 className="text-3xl font-bold mb-4">Take Control of Your Money Today.</h3>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto mb-6">
              Ready to stop worrying about money? Join the movement toward financial confidence.
            </p>
            <Button
              onClick={() => router.push("/sign-up")}
              className="inline-block px-10 bg-primary text-white font-bold text-lg rounded-full shadow-lg transition duration-300 transform hover:scale-[1.05]"
            >
              Get Started Free 💰
            </Button>
          </section>

        </main>

      </div>
      <FooterSection/>
    </>
  );
};

export default About;