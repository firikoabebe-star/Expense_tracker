"use client"

import React from 'react'


const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#047857]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

const BudgetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#047857]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 5H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"></path>
        <path d="M14 15V9"></path>
        <path d="M10 15V9"></path>
        <path d="M12 22a7 7 0 0 0 7-7"></path>
    </svg>
);

const ExpenseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#047857]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

// --- Component Setup (Simulating Tailwind Config for colors/styles) ---

// Define colors used in the original HTML file's style block
const primaryAccent = '#047857'; // A deep teal/forest green
const primaryLight = '#D1FAE5';  // Light green background

const serviceCardStyle = `
.service-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.service-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px -10px rgba(4, 120, 87, 0.15);
}
`;

export default function Features() {
    return (
        <section id="services" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-300 mb-16">
                    Core Features Designed For Financial Freedom
                </h2>

                <div className="grid md:grid-cols-3 gap-10">
                    
                    {/* Service 1: Smart Dashboard */}
                    <div className="service-card  p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-start text-left">
                        <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: primaryLight }}>
                            <DashboardIcon />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Smart Dashboard Overview
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Get an instant, high-level view of your financial health. Compare allocated budgets against actual spending with intuitive charts and real-time activity feeds. Your money, simplified.
                        </p>
                        <ul className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc pl-5">
                            <li>Budget vs. Spending Visualization</li>
                            <li>Total Budget & Spending Metrics</li>
                            <li>Latest Activity Highlights</li>
                        </ul>
                    </div>

                    {/* Service 2: Budget Management */}
                    <div className="service-card  p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-start text-left">
                        <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: primaryLight }}>
                            <BudgetIcon />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-3">
                            Category Budgeting
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Set clear financial boundaries. Easily create, modify, and track budgets for different categories like Food, Clothing, and House, ensuring you stay within your limits.
                        </p>
                        <ul className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc pl-5">
                            <li>Unlimited Budget Creation</li>
                            <li>Real-time Remaining Balance</li>
                            <li>Budget History and Comparison</li>
                        </ul>
                    </div>

                    {/* Service 3: Expense Tracking */}
                    <div className="service-card  p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-start text-left">
                        <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: primaryLight }}>
                            <ExpenseIcon />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-3">
                            Detailed Expense Logging
                        </h3>
                        <p className="">
                            Log every transaction instantly. Keep a meticulous record of all your spending, complete with name, amount, and date, making tax season and reconciliation stress-free.
                        </p>
                        <ul className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-2 list-disc pl-5">
                            <li>Easy Expense Deletion/Management</li>
                            <li>Date and Category Tagging</li>
                            <li>Comprehensive Spending Records</li>
                        </ul>
                    </div>

                </div>
            </section>
    );
}

