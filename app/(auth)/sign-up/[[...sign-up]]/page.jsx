"use client"
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex place-content-center justify-center items-center flex-col h-screen">
  <SignUp/>
  </div>
  );
}