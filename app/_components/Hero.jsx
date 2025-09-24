import Image from 'next/image'
import React from 'react'

function Hero() {
  return (
    <section className="bg-gray-50 flex flex-col items-center">
  <div className="mx-auto max-w-screen max-w-screen-xl px-4 py-32 lg:flex">
    <div className="mx-auto max-w-prose text-center">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
        Manage Your Expense
        <strong className="text-primary"> Control </strong>
        your Money.
      </h1>

      <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
       Start creating your budget today and save a ton of money.
      </p>

      <div className="mt-4 flex justify-center gap-4 sm:mt-6">
        <a
          className="inline-block rounded border bg-primary px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-gray-900"
          href="/sign-in"
        >
          Get Started
        </a>

        
      </div>
    </div>
  </div>
  <Image src={'/dashboard.png'} alt='dashboard'
  width={1000}
  height={700}
  className='-mt-9 rounded-xl border-2'/>
</section>

  )
}

export default Hero
