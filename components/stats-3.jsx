// components/sections/StatsSection.jsx
'use client';

import React from 'react';
import { AnimatedGroup } from '/components/ui/animated-group'; // Assuming path
import { transitionVariants } from '/lib/utils'; // Reusing transition variants

export default function StatsSection() {
    const stats = [
        { value: '+1200', label: 'Stars on GitHub' },
        { value: '56%', label: 'Conversion rate' },
        { value: '+500', label: 'Powered Apps' },
    ];

    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <AnimatedGroup
                    variants={{
                        container: {
                            visible: {
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.1,
                                },
                            },
                        },
                        ...transitionVariants,
                    }}
                    className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-center lg:max-w-none lg:grid-cols-3"
                >
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <p className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                                {stat.value}
                            </p>
                            <p className="mt-4 text-lg leading-8 text-muted-foreground">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </AnimatedGroup>
            </div>
        </section>
    );
}