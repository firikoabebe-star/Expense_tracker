"use client";
import React from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import {ModeToggle}  from "/components/ModeToggle"
function Header() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();

  const handleSignInClick = () => {
    router.push('/signin');
  };
    return (
        <div className='p-5 flex justify-between items-center border shadow-sm'>
  {/* Left: Logo */}
  <Image src='./logoipsum-247.svg' alt='logo' width={50} height={50} />

  {/* Right: Mode toggle + user/signin button */}
  <div className="flex items-center gap-3">
    <ModeToggle />
    {isSignedIn ? <UserButton /> : (
      <a
        className="inline-block rounded border bg-primary px-5 py-3 font-medium text-white shadow-sm"
        href="/sign-in"
      >
        Get Started
      </a>
    )}
  </div>
</div>

    );
}

export default Header;
