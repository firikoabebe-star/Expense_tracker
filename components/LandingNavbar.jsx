'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react' // 1. Import useState
import { Button } from './ui/button'
import { ModeToggle } from './ModeToggle'
// 2. Import icons for the toggle button (assuming lucide-react)
import { Menu, X } from 'lucide-react' 

const MENU_ITEMS = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Developers', href: '#Developers' },
    
]

const LandingNavbar = () => {
    // 3. State to control the mobile menu open/close
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Helper function to close menu after a link click
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    }

    return (
        <header className='fixed w-full flex items-center justify-between z-40 px-6 sm:px-10 lg:px-20 py-4 border-b bg-background'>
            {/* Logo/Home Link */}
            <Link href='/' aria-label='Go to homepage'>
                <Image
                    src='/logoipsum-247.svg'
                    alt='Company Logo'
                    width={40}
                    height={40}
                    priority
                />
            </Link>

            {/* Desktop Navigation Links - HIDDEN on small screens */}
            <nav className="hidden md:block">
                <ul className="flex gap-6 text-lg">
                    {MENU_ITEMS.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className="transition-colors text-foreground/80 hover:text-foreground">
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Menu Toggle and Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* 4. Desktop Actions */}
                <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                    <Link href='/sign-in'>Login</Link>
                </Button>

                <Button asChild className='bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 py-2 text-sm font-medium hidden md:inline-flex'>
                    <Link href='/sign-up'>Sign Up</Link>
                </Button>
                
                <ModeToggle />

                {/* 5. Mobile Menu Button - ONLY VISIBLE on small screens */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* 6. Mobile Menu Dropdown Panel */}
            <nav className={`
                md:hidden // Hide on desktop
                fixed top-[65px] left-0 h-screen w-full p-4 z-30 // Full screen overlay below the header
                bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 // Themed background
                transition-transform duration-300 ease-in-out
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} // Slide in/out animation
            `}>
                <ul className="flex flex-col gap-6 text-lg mt-4">
                    {MENU_ITEMS.map((item) => (
                        <li key={item.name} className='border-b pb-2'>
                            <Link
                                href={item.href}
                                onClick={handleLinkClick} // Close menu on click
                                className="block font-semibold text-foreground/90 hover:text-primary py-2">
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                
                {/* Mobile Login/Signup Buttons */}
                <div className="flex flex-col gap-4 mt-8">
                    <Button asChild className='w-full'>
                        <Link href='/sign-up' onClick={handleLinkClick}>Sign Up</Link>
                    </Button>
                    <Button asChild variant="outline" className='w-full'>
                        <Link href='/sign-in' onClick={handleLinkClick}>Login</Link>
                    </Button>
                </div>
            </nav>
        </header>
    )
}

export default LandingNavbar