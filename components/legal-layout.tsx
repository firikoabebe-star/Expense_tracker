import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export interface LegalSection {
  id: string;
  label: string;
}

interface LegalLayoutProps {
  title: string;
  description?: string;
  lastUpdated: string;
  sections: LegalSection[];
  children: React.ReactNode;
}

export function LegalHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="group mt-10 scroll-mt-24 text-2xl font-semibold tracking-tight text-foreground first:mt-0"
    >
      <a
        href={`#${id}`}
        className="inline-flex items-baseline gap-2 text-inherit no-underline"
      >
        {children}
        <span
          aria-hidden="true"
          className="text-sm font-normal text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        >
          #
        </span>
      </a>
    </h2>
  );
}

function TableOfContents({ sections }: { sections: LegalSection[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="block rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {section.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function LegalLayout({
  title,
  description,
  lastUpdated,
  sections,
  children,
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            aria-label="Montra home"
            className="flex items-center gap-2 no-underline"
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[var(--clr-brand)] text-sm font-bold text-[var(--clr-accent)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              M
            </span>
            <span
              className="text-base font-semibold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Montra
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
      </header>

      <main>
        <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
          <div className="lg:max-w-[720px]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Montra
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 max-w-[65ch] text-base leading-7 text-muted-foreground">
                {description}
              </p>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,720px)_220px] lg:justify-center">
            <div className="min-w-0">
              <details className="group mb-8 rounded-lg border border-border bg-card lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
                  On this page
                  <ChevronRight
                    aria-hidden="true"
                    className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90"
                  />
                </summary>
                <nav aria-label="Table of contents" className="px-2 pb-3">
                  <TableOfContents sections={sections} />
                </nav>
              </details>

              <article className="max-w-[720px] text-[15px] [&_li]:leading-7 [&_li]:text-muted-foreground [&_li_a]:text-primary [&_li_a]:underline [&_li_a]:underline-offset-4 [&_p]:mt-4 [&_p]:leading-7 [&_p]:text-muted-foreground [&_p_a]:font-medium [&_p_a]:text-primary [&_p_a]:underline [&_p_a]:underline-offset-4 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {children}
              </article>
            </div>

            <aside className="hidden lg:block">
              <nav
                aria-label="Table of contents"
                className="sticky top-24 rounded-lg border border-border bg-card p-4"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  On this page
                </p>
                <TableOfContents sections={sections} />
              </nav>
            </aside>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Montra. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="no-underline transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="no-underline transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/help" className="no-underline transition-colors hover:text-foreground">
              Help
            </Link>
            <Link href="/contact" className="no-underline transition-colors hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
