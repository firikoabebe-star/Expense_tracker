"use client";

// ─────────────────────────────────────────────────────────────────
// components/hero-section.tsx
// Landing hero — one rounded frame holding an asymmetric bento grid:
//   • text panel with a notched (concave) bottom-right corner
//   • large "spending overview" tile with an inline SVG area chart
//   • "AI insight" tile with a progress bar
//   • angled "scan receipt" tile in the bottom-right corner
// Every surface is a design token (bg-card / bg-accent / border-border)
// so both themes stay solid — no glass, no hardcoded colours.
// ─────────────────────────────────────────────────────────────────
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, ScanLine, Sparkles, TrendingDown } from "lucide-react";

import LandingNavbar from "./LandingNavbar";
import { cn } from "/lib/utils";

// Sample figures — labelled as sample data wherever they appear.
const SAMPLE = {
  spent: "ETB 12,450",
  lastMonth: "ETB 13,560",
  trend: "8.2%",
  insight: "Groceries are 18% under budget — ETB 1,240 left this month.",
  budgetUsed: 62,
  receiptTotal: "ETB 480",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const CHART_LINE =
  "M0 92 C22 88 38 70 62 72 C86 74 102 88 126 66 C150 44 168 60 192 50 C216 40 232 54 256 32 C280 10 300 28 320 20";
const CHART_AREA = `${CHART_LINE} L320 120 L0 120 Z`;

const DISPLAY_FONT = { fontFamily: "var(--font-display)" } as const;

type TileProps = {
  /** When provided, the live sample card is replaced by this image. */
  imageUrl?: string;
  className?: string;
};

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.04,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <>
      <LandingNavbar />

      <main className="overflow-hidden bg-background">
        <section className="px-4 pb-16 pt-[6.5rem] sm:px-6 sm:pb-20 lg:px-8 lg:pb-24 lg:pt-32">
          <div className="mx-auto w-full max-w-[1320px]">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="rounded-3xl border border-border bg-card p-4"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12">
                {/* ── Text panel (notched corner) ─────────────────── */}
                <motion.div
                  variants={item}
                  className="relative col-span-2 overflow-hidden rounded-[1.75rem] border border-border bg-accent lg:col-span-7 lg:row-span-2"
                >
                  <div className="flex h-full flex-col justify-center gap-6 p-5 sm:gap-7 sm:p-8 lg:p-10">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-[0.6875rem] font-semibold text-foreground sm:gap-2 sm:px-3 sm:text-xs">
                        <Sparkles className="h-3 w-3 shrink-0 text-primary sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                        <span className="whitespace-nowrap">AI-powered expense tracking</span>
                      </span>
                      <MiniThumbnail />
                    </div>

                    <div className="space-y-4">
                      <h1
                        className="text-[clamp(2.125rem,6vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.035em] text-foreground"
                        style={DISPLAY_FONT}
                      >
                        Every birr,
                        <br />
                        finally <span className="text-primary">clear</span>.
                      </h1>
                      <p className="max-w-[46ch] text-[0.95rem] leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
                        Montra turns everyday spending into budgets and insights
                        you can act on, so you always know where your money went.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        href="/sign-up"
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[var(--clr-brand-mid)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        Get started
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <Link
                        href="#services"
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        See features
                      </Link>
                    </div>
                  </div>

                  {/* Concave cut-out punched into the corner that meets
                      the media tiles. Filled with the frame surface. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-px -right-px hidden h-24 w-24 rounded-tl-[2.5rem] bg-card lg:block"
                  />
                </motion.div>

                {/* ── Large tile: spending overview ───────────────── */}
                <motion.div
                  variants={item}
                  className="col-span-2 lg:col-span-5 lg:row-span-2"
                >
                  <Float className="h-full" delay={0}>
                    <SpendingOverviewTile className="h-full" />
                  </Float>
                </motion.div>

                {/* ── AI insight tile ─────────────────────────────── */}
                <motion.div variants={item} className="col-span-1 lg:col-span-8 lg:row-start-3">
                  <Float className="h-full" delay={0.6}>
                    <InsightTile className="h-full" />
                  </Float>
                </motion.div>

                {/* ── Angled scan-receipt tile ────────────────────── */}
                <motion.div variants={item} className="col-span-1 lg:col-span-4 lg:row-start-3">
                  <Float className="h-full" delay={1.2}>
                    <ScanReceiptTile className="h-full" />
                  </Float>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}

/* ── Gentle float wrapper (disabled for reduced motion) ─────────── */
function Float({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 7,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Small rounded thumbnail beside the headline ────────────────── */
function MiniThumbnail() {
  return (
    <div className="ml-auto flex h-16 w-16 shrink-0 flex-col justify-between rounded-2xl border border-border bg-card p-2 sm:h-20 sm:w-20">
      <div className="flex h-6 items-end gap-1 sm:h-8" aria-hidden="true">
        {[45, 70, 55, 90].map((height, index) => (
          <span
            key={index}
            className="w-full rounded-sm bg-primary"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <span className="text-[0.625rem] font-medium leading-none text-muted-foreground sm:text-[0.6875rem]">
        Saved
      </span>
    </div>
  );
}

/* ── Large tile: live area chart ────────────────────────────────── */
function SpendingOverviewTile({ imageUrl, className }: TileProps) {
  if (imageUrl) {
    return (
      <figure
        className={cn(
          "relative min-h-[16rem] overflow-hidden rounded-[1.75rem] border border-border bg-card",
          className
        )}
      >
        <Image
          src={imageUrl}
          alt="Montra spending overview preview"
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover"
        />
      </figure>
    );
  }

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-[1.75rem] border border-border bg-card p-5 sm:p-6",
        className
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground" style={DISPLAY_FONT}>
            Spending overview
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            This month · sample data
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-accent px-2.5 py-1 text-[0.6875rem] font-semibold text-primary">
          <TrendingDown className="h-3 w-3" aria-hidden="true" />
          {SAMPLE.trend}
        </span>
      </header>

      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Total spent
          </p>
          <p
            className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            style={DISPLAY_FONT}
          >
            {SAMPLE.spent}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          vs {SAMPLE.lastMonth} last month
        </p>
      </div>

      <div className="mt-auto flex min-h-[9.5rem] flex-1 flex-col gap-2">
        <div className="relative min-h-[7.5rem] w-full flex-1">
          <svg
            viewBox="0 0 320 120"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label={`Sample spending trend from January to June, ending at ${SAMPLE.spent} this month`}
          >
            <defs>
              <linearGradient id="heroSpendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line
              x1="0"
              y1="40"
              x2="320"
              y2="40"
              stroke="var(--border)"
              strokeDasharray="4 6"
            />
            <line
              x1="0"
              y1="82"
              x2="320"
              y2="82"
              stroke="var(--border)"
              strokeDasharray="4 6"
            />
            <path d={CHART_AREA} fill="url(#heroSpendFill)" />
            <path
              d={CHART_LINE}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <div className="flex justify-between text-[0.6875rem] text-muted-foreground">
          {MONTHS.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

/* ── AI insight tile ────────────────────────────────────────────── */
function InsightTile({ imageUrl, className }: TileProps) {
  if (imageUrl) {
    return (
      <figure
        className={cn(
          "relative min-h-[12rem] overflow-hidden rounded-2xl border border-border bg-accent",
          className
        )}
      >
        <Image
          src={imageUrl}
          alt="Montra AI insight preview"
          fill
          sizes="(min-width: 1024px) 60vw, 50vw"
          className="object-cover"
        />
      </figure>
    );
  }

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border bg-accent p-4 sm:p-5",
        className
      )}
    >
      <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
        <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        AI insight
      </h2>

      <p className="text-[0.8125rem] leading-relaxed text-foreground sm:text-sm">
        {SAMPLE.insight}
      </p>

      <p className="text-[0.6875rem] text-muted-foreground">Sample insight</p>

      <div className="mt-auto space-y-2 pt-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[0.6875rem] sm:text-xs">
          <span className="text-muted-foreground">Grocery budget</span>
          <span className="font-semibold text-foreground">
            {SAMPLE.budgetUsed}% used
          </span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full border border-border bg-background"
          role="img"
          aria-label={`Grocery budget: ${SAMPLE.budgetUsed} percent used (sample data)`}
        >
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${SAMPLE.budgetUsed}%` }}
          />
        </div>
      </div>
    </article>
  );
}

/* ── Angled scan-receipt tile ───────────────────────────────────── */
function ScanReceiptTile({ imageUrl, className }: TileProps) {
  if (imageUrl) {
    return (
      <figure
        className={cn(
          "relative min-h-[12rem] overflow-hidden rounded-[1.5rem] border border-border bg-accent",
          className
        )}
      >
        <Image
          src={imageUrl}
          alt="Montra receipt scanning preview"
          fill
          sizes="(min-width: 1024px) 30vw, 50vw"
          className="object-cover"
        />
      </figure>
    );
  }

  return (
    <article
      className={cn(
        "relative flex flex-col gap-3 overflow-hidden rounded-[1.5rem] border border-border bg-accent p-4 sm:p-5",
        className
      )}
    >
      <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
          <ScanLine className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        </span>
        Scan receipt
      </h2>

      <p className="text-[0.6875rem] leading-snug text-muted-foreground sm:text-xs">
        Snap a receipt and Montra logs it for you.
      </p>

      <div className="mt-auto w-full max-w-[104px] rounded-lg border border-border bg-card p-2">
        <div className="space-y-1" aria-hidden="true">
          <span className="block h-1 w-3/4 rounded-full bg-border" />
          <span className="block h-1 w-1/2 rounded-full bg-border" />
          <span className="block h-1 w-2/3 rounded-full bg-border" />
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-dashed border-border pt-1.5 text-[0.625rem] font-semibold text-foreground">
          <span>Total</span>
          <span>{SAMPLE.receiptTotal}</span>
        </div>
      </div>

      {/* Diagonal cut corner: the frame surface shows through, so the
          tile reads as clipped without masking its border. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-12 w-12"
      >
        <span
          className="absolute inset-0 bg-card"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        />
        <span className="absolute left-1/2 top-1/2 h-px w-[68px] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-border" />
      </span>
    </article>
  );
}
