'use client'
import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Play } from 'lucide-react';
import { Button } from '/components/ui/button';
import Image from 'next/image';
import { TextEffect } from '/components/ui/text-effect';
import { AnimatedGroup } from '/components/ui/animated-group';
import Autoplay from "embla-carousel-autoplay"; // Keep Autoplay import

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "/components/ui/carousel";
import LandingNavbar from './LandingNavbar';

// Standardized animation variants for the main content group
const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
};

const Images = [
    '/Happy_family3.jpg', '/stacks-coins.jpg', '/Birr.jpg',
];

export default function HeroSection() {
    // 1. Activate Autoplay functionality
    const carouselPlugins = React.useMemo(() => [
        Autoplay({
            delay: 4000, // Increased delay to 4 seconds for better viewing
            stopOnInteraction: true,
            stopOnMouseEnter: true, // Stop autoplay when user hovers over the carousel
        }),
    ], []);

    // Cleaned up AnimatedGroup for Hero Text/CTA to combine variants
    const heroContentVariants = {
        container: {
            visible: {
                transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.75, // Keeps the initial delay
                },
            },
        },
        ...transitionVariants,
    };
    
    return (
        <>
            <LandingNavbar/>
            <main className="overflow-hidden">
                {/* Decorative Background Gradients */}
                <div
                    aria-hidden
                    className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block">
                    <div
                        className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div
                        className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div
                        className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                
                <section>
                    <div className="relative pt-24 md:pt-36">
                        {/* Background Image/Mask */}
                        <AnimatedGroup
                            variants={heroContentVariants}
                            className="mask-b-from-35% mask-b-to-90% absolute inset-0 -z-20">
                            <Image
                                src="/Blacks.jpg"
                                alt="abstract dark background image"
                                className="hidden size-full blur-sm dark:block"
                                width={2000}
                                height={1000}
                                priority // High priority for LCP
                            />
                        </AnimatedGroup>
                        <AnimatedGroup
                            variants={heroContentVariants}
                            className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32">
                            <Image
                                src="/w2.png"
                                alt="abstract dark background image"
                                className="block blur-sm size-full dark:hidden"
                                width={2000}
                                height={1000}
                                priority // High priority for LCP
                            />
                        </AnimatedGroup>

                        <div
                            aria-hidden
                            className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]" />

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                {/* Announcement Banner */}
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="/about"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                                        aria-label="New feature announcement: Introducing Support for AI Models. Click to learn more."
                                    >
                                        <span className="text-foreground text-sm">Introducing Expense Tracker</span>
                                        <span
                                            aria-hidden="true"
                                            className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>
                                        <div
                                            className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div
                                                className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6" aria-hidden="true">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6" aria-hidden="true">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </AnimatedGroup>

                                {/* Main Headline */}
                                <TextEffect
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    as="h1"
                                    className="mx-auto mt-8 max-w-4xl text-black  dark:text-white font-bold
 text-3xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                    Manage Your Expense Control your Money.
                                </TextEffect>
                                
                                {/* Subheadline */}
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={0.5}
                                    as="p"
                                    className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                                    Start creating your budget today and save a ton of money.
                                </TextEffect>

                                {/* CTA Buttons */}
                                <AnimatedGroup
                                    variants={heroContentVariants}
                                    className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row">
                                    <div key={1}>
                                        <Button asChild size="lg" className="rounded-xl px-6 text-base font-semibold">
                                            <Link href="/sign-up">
                                                <span className="text-nowrap">Get Started</span>
                                            </Link>
                                        </Button>
                                    </div> 
                                </AnimatedGroup>
                            </div>
                        </div>

                        {/* Image Carousel */}
                        <AnimatedGroup
                            variants={heroContentVariants}>
                            <div className="flex items-center justify-center w-full mx-auto py-10">
                                <Carousel 
                                    className="w-full max-w-4xl rounded-3xl shadow-2xl shadow-zinc-950/20 dark:shadow-none"
                                    plugins={carouselPlugins}
                                    opts={{ loop: true }} // Ensures smooth looping
                                >
                                    <CarouselContent className="rounded-3xl">
                                        {Images.map((image, index) => (
                                            <CarouselItem key={index} className="rounded-3xl overflow-hidden">
                                                <Image 
                                                    src={image} 
                                                    width={1500} 
                                                    height={800} 
                                                    className='w-full h-auto max-h-[550px] object-cover rounded-3xl aspect-video' 
                                                    alt={`Financial tracking dashboard preview ${index + 1}`}
                                                    priority={index === 0} // Only set priority for the first image
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious aria-label="Previous image" />
                                    <CarouselNext aria-label="Next image" />
                                </Carousel>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                
                {/* Customer Logos Section */}
                <section className="bg-background pb-16 pt-16 md:pb-32">
                    <div className="group relative m-auto max-w-5xl px-6">
                        {/* Hover Overlay */}
                        <div
                            className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                            <Link href="#" className="block text-sm font-medium text-primary duration-150 hover:opacity-75">
                                <span> Meet Our Customers</span>
                                <ChevronRight className="ml-1 inline-block size-4" />
                            </Link>
                        </div>
                        
                        {/* Logos Grid */}
                        <div
                            className="group-hover:blur-xs mx-auto mt-12 grid max-w-8xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14"
                            aria-label="Trusted by companies like Negd bank,Awash Bank,Ethio telecom and more.">
                            
                            {/* Logos are repeated from original for brevity */}
                            {[
                                { src: "Negd.svg", alt: "Negd Bank" },
                                { src: "Awash.svg", alt: "Awash Bank" },
                                { src: "Dashen.svg", alt: "Dashen Bank" },
                                { src: "Abbisinia.svg", alt: "Abbisinia Bank" },
                                { src: "Oromia.svg", alt: "Oromia Bank" },
                                { src: "Tele.svg", alt: "Ethio Telecom" },
                                { src: "Flin.svg", alt: "Flinston" },
                                { src: "Zemen.svg", alt: "Zemen Bank" },
                            ].map((logo, i) => (
                                <div className="flex" key={i}>
                                    {/* Using standard img tags for external SVG for consistency with original */}
                                    <img
                                        className="mx-auto h-5 w-fit dark:invert"
                                        src={logo.src}
                                        alt={logo.alt}
                                        height={i === 2 || i === 5 ? 16 : i === 6 ? 28 : 20} // Adjusted heights based on original
                                        width="auto" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}