import Link from 'next/link'
import React from 'react'

function Hero() {
  return (
    <section className="bg-gray-50 dark:bg-[#1B1B1F] flex flex-col h-[90vh] overflow-hidden">
  <div className="flex-1 flex flex-col items-center justify-center px-4">
    <div className="max-w-prose text-center">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
        Manage Your Expense
        <strong className="text-primary"> Control </strong>
        your Money.
      </h1>

      <p className="mt-4 text-base text-gray-700 sm:text-lg dark:text-white">
        Start creating your budget today and save a ton of money.
      </p>

      <div className="mt-6 flex justify-center gap-4">
        <Link
          className="inline-block rounded bg-primary px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-[#107c73]"
          href="/sign-in"
        >
          Get Started
        </Link>
      </div>
    </div>
  </div>

  <footer className="p-4 border-t border-gray-300 dark:border-gray-700 text-center text-sm text-gray-500">
    © 2025 Budget Tracker. All rights reserved.
  </footer>
</section>

  )
}

export default Hero
