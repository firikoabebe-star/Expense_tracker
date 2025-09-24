"use client";
import React from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image'
function Header() {
    const { user, isSignedIn } = useUser();
    const router = useRouter();

  const handleSignInClick = () => {
    router.push('/signin');
  };
    return (
        <div className='p-5 justify-between flex items-center border shadow-sm'>
            <Image src='./logo.svg' alt='logo' width={100} height={50} />
            {isSignedIn ? <UserButton /> : <a
          className="inline-block rounded border bg-primary px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-gray-900"
          href="/sign-in"
        >
          Get Started
        </a>}
        </div>
    );
}

export default Header;
