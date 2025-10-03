"use client"
import React, { useState } from 'react';
import {useRouter} from "next/navigation"
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import LandingNavbar from '/components/LandingNavbar'
// Main App Component
const About = () => {
  // Mock User ID for demonstration purposes
  const userId = "user_746b1c8a";
  const router=useRouter();
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-indigo-600">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      title: "Real-Time Tracking",
      description: "Log transactions instantly across custom categories. See where every dollar goes the moment you spend it."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-indigo-600">
          <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM2 12s2 2 10 2 10-2 10-2M12 18V6"/>
        </svg>
      ),
      title: "Smart Budget Allocation",
      description: "Set personalized monthly budgets for different categories and receive alerts before you overspend."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-indigo-600">
          <path d="M3 3v18h18M18 17l-4.2-4.2M9 13.8L5 17m11-9V6h2M18 6l-5.2 5.2"/>
        </svg>
      ),
      title: "Visual Data Analytics",
      description: "Understand your habits with interactive charts and reports. Identify leaks and savings opportunities instantly."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-indigo-600">
          <path d="M20.8 13.8L12 20.8 3.2 13.8M12 3v18M12 12l8.8-7.2M12 12l-8.8-7.2"/>
        </svg>
      ),
      title: "Goal Setting & Saving",
      description: "Link expenses to specific savings goals, like a vacation or a new home, and track progress automatically."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-inter"> {/* Changed bg-gray-900 to bg-white, text-white to text-gray-900 */}
      {/* Tailwind CSS Setup Script for aesthetics */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>{`
        /* Global font and subtle scrollbar */
        .font-inter { font-family: 'Inter', sans-serif; }
        .gradient-text {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          background-image: linear-gradient(90deg, #4f46e5, #9333ea); /* Adjusted gradient for better contrast on light background */
        }
        /* Custom card background for depth */
        .card-bg {
            background-color: rgba(243, 244, 246, 0.7); /* Lighter semi-transparent gray-100 */
            backdrop-filter: blur(10px);
            border: 1px solid rgba(167, 139, 250, 0.3); /* Lighter border color */
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-bg:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(79, 70, 229, 0.1); /* Lighter shadow color */
        }
      `}</style>
      
      {/* Header (Simple) */}
     <LandingNavbar/>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">

        {/* 1. Hero Section: What is it? */}
        <section className="text-center mb-20">
          <h2 className="text-6xl md:text-8xl font-extrabold mb-4 leading-tight">
            Financial <span className="text-primary">Clarity.</span>
            <br />
            Total <span className="text-primary">Control.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"> {/* Changed text-gray-400 to text-gray-600 */}
            BudgetFlow is your intuitive, smart expense tracker and budgeting web app. Stop guessing where your money goes and start building a future with confidence.
          </p>
          <Button
            onClick={() => router.push("/sign-in")} 
            className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-full shadow-md transition duration-300 transform hover:scale-105" // Adjusted shadow
          >
            Start Your Financial Journey Now
          </Button>
        </section>
        
        {/* 2. Benefits Section: What is it good for? */}
        <section className="mb-20">
          <h3 className="text-4xl font-bold text-center mb-12">
            Why an Expense Tracker is <span className="text-primary">Essential</span> {/* Adjusted text-purple-400 to text-purple-600 */}
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Benefit 1 */}
            <div className="card-bg p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3 text-emerald-600">💡</span> {/* Adjusted color */}
                <h4 className="text-2xl font-semibold">Gain True Spending Clarity</h4>
              </div>
              <p className="text-gray-700"> {/* Changed text-gray-400 to text-gray-700 */}
                Most people underestimate their spending. An expense tracker gives you an unbiased, consolidated view of every transaction, exposing hidden spending habits and leaks you didn't know existed. It's financial X-ray vision.
              </p>
            </div>
            
            {/* Benefit 2 */}
            <div className="card-bg p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3 text-amber-600">🎯</span> {/* Adjusted color */}
                <h4 className="text-2xl font-semibold">Achieve Financial Goals Faster</h4>
              </div>
              <p className="text-gray-700"> {/* Changed text-gray-400 to text-gray-700 */}
                Whether saving for a deposit, paying off debt, or planning a big trip, an effective budget and tracker ensures you allocate funds correctly, turning abstract goals into concrete, achievable steps.
              </p>
            </div>
            
            {/* Benefit 3 */}
            <div className="card-bg p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3 text-red-600">🧘</span> {/* Adjusted color */}
                <h4 className="text-2xl font-semibold">Reduce Financial Stress</h4>
              </div>
              <p className="text-gray-700"> {/* Changed text-gray-400 to text-gray-700 */}
                Knowledge is power, and with power comes peace. By removing the uncertainty around your money, you eliminate the single largest cause of financial anxiety. You'll always know your standing.
              </p>
            </div>
            
            {/* Benefit 4 */}
            <div className="card-bg p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3 text-sky-600">🚀</span> {/* Adjusted color */}
                <h4 className="text-2xl font-semibold">Make Smarter Life Decisions</h4>
              </div>
              <p className="text-gray-700"> {/* Changed text-gray-400 to text-gray-700 */}
                When you understand your cash flow, decisions about changing jobs, making investments, or taking on a new recurring expense become calculated moves, not fearful risks.
              </p>
            </div>

          </div>
        </section>

        {/* 3. Features Section: How it works */}
        <section className="mb-20">
          <h3 className="text-4xl font-bold text-center mb-12">
            Packed with <span className="text-primary">Powerful Features</span> {/* Adjusted text-indigo-400 to text-indigo-600 */}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-bg p-6 rounded-xl text-center flex flex-col items-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4"> {/* Changed bg-gray-800 to bg-gray-100 */}
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-700 text-sm">{feature.description}</p> {/* Changed text-gray-400 to text-gray-700 */}
              </div>
            ))}
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="text-center pt-10">
            <p className="text-lg text-gray-700 max-w-xl mx-auto mb-6"> {/* Changed text-gray-300 to text-gray-700 */}
              Ready to stop worrying about money? Join the movement toward financial confidence.
            </p>
            <Button
                onClick={() => router.push("/sign-in")}
                className="inline-block px-10  bg-primary text-white font-bold text-lg rounded-full shadow-md transition duration-300 transform hover:scale-105" // Adjusted shadow
            >
              Get Started Free
            </Button>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-200 text-center text-gray-600 text-sm"> {/* Changed border-gray-800/50 to border-gray-200, text-gray-500 to text-gray-600 */}
        <p>&copy; {new Date().getFullYear()} Expense Tracker | All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default About;