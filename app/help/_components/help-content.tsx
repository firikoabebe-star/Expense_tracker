"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, LifeBuoy, Mail, Search } from "lucide-react";

import LegalLayout, { LegalHeading, type LegalSection } from "/components/legal-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "/components/ui/accordion";
import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

const CATEGORIES: FaqCategory[] = [
  {
    id: "accounts-and-sign-in",
    title: "Accounts and sign-in",
    items: [
      {
        question: "How do I create an account?",
        answer:
          "Use the sign-up page with your name, email, and a password, or continue with Google. You will verify your email with a code before signing in.",
      },
      {
        question: "How do I sign in?",
        answer:
          "Use the email and password you signed up with, or choose Continue with Google. If your email is not verified yet, enter the verification code sent to you.",
      },
      {
        question: "I forgot my password. What should I do?",
        answer:
          "Choose Forgot password? on the sign-in page and enter your email. We will send a reset code to your email address.",
      },
    ],
  },
  {
    id: "verification-codes",
    title: "Verification codes",
    items: [
      {
        question: "Why am I asked for a code?",
        answer:
          "We send a verification code to confirm your email when you sign up or reset your password.",
      },
      {
        question: "How long does a verification code last?",
        answer: "Verification codes expire after 1 minute.",
      },
      {
        question: "The code did not arrive. What can I try?",
        answer:
          "Check your spam folder, then use Resend code. You can request another code after the short cooldown.",
      },
    ],
  },
  {
    id: "budgets-and-expenses",
    title: "Budgets and expenses",
    items: [
      {
        question: "How do I create a budget?",
        answer:
          "Open Budgets, choose the option to create a budget, then enter a name and an amount in Ethiopian birr (ETB).",
      },
      {
        question: "How do I add an expense?",
        answer:
          "Open a budget and use Add Expense. You can enter the expense manually, use quick add, or scan a receipt.",
      },
      {
        question: "Can I edit or delete a budget?",
        answer:
          "Yes. Open the budget to edit its name or amount, or delete it. Deleting a budget also deletes the expenses inside it.",
      },
      {
        question: "Can I delete an expense?",
        answer:
          "Yes. Use the delete action in your expenses list. A short undo window is available after deleting.",
      },
      {
        question: "Why is my expense blocked?",
        answer:
          "An expense cannot exceed the remaining amount in its budget. Check the budget balance and the expense amount.",
      },
    ],
  },
  {
    id: "amounts",
    title: "Amounts like 1.5m",
    items: [
      {
        question: "What amount formats are accepted?",
        answer:
          "Enter amounts in Ethiopian birr (ETB). You can type 2500, 250k, or 1.43m. Spaces, commas, and a leading ETB are also accepted.",
      },
      {
        question: "Does 1.5m mean 1,500,000?",
        answer: "Yes. k means thousand, m means million, and b means billion.",
      },
      {
        question: "Are decimals supported?",
        answer: "Yes. Amounts are rounded to two decimal places.",
      },
      {
        question: "Why will my amount not save?",
        answer:
          "Amounts must be greater than 0 and no more than ETB 100,000,000. Check the value for typos.",
      },
    ],
  },
  {
    id: "ai-features",
    title: "AI features",
    items: [
      {
        question: "What can the AI features do?",
        answer:
          "Quick add turns a sentence into an expense, receipt scan reads a photo of a receipt, and spending insights summarize your budgets and expenses.",
      },
      {
        question: "Are receipt images stored?",
        answer:
          "No. Receipt images are sent to Google Gemini for processing and are not stored.",
      },
      {
        question: "Is the AI always accurate?",
        answer:
          "No. AI can make mistakes. Review the name, amount, and budget before saving anything.",
      },
      {
        question: "Is AI advice financial advice?",
        answer:
          "No. Spending insights and tips are suggestions, not financial, legal, or tax advice.",
      },
      {
        question: "Why is an AI feature unavailable?",
        answer:
          "AI features can be rate-limited or temporarily unavailable. Wait a moment and try again.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    items: [
      {
        question: "What data does Montra collect?",
        answer:
          "We collect your name, email, hashed password, budgets, and expenses. If you sign in with Google, we also receive your Google profile name and email.",
      },
      {
        question: "Does Montra use cookies?",
        answer: "Montra uses session cookies for sign-in only.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "Email support@base.et to request deletion of your account.",
      },
      {
        question: "Where can I read the full policy?",
        answer:
          "See the Privacy Policy page for details about what we collect, how we use it, and third parties.",
      },
    ],
  },
];

const SECTIONS: LegalSection[] = [
  ...CATEGORIES.map(({ id, title }) => ({ id, label: title })),
  { id: "still-need-help", label: "Still need help?" },
];

export default function HelpContent() {
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return CATEGORIES;

    return CATEGORIES.map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.question.toLowerCase().includes(term) ||
          item.answer.toLowerCase().includes(term)
      ),
    })).filter((category) => category.items.length > 0);
  }, [query]);

  const hasResults = filteredCategories.length > 0;

  return (
    <LegalLayout
      title="Help Center"
      description="Answers to common questions about accounts, budgets, amounts, AI features, and privacy."
      lastUpdated="October 23, 2026"
      sections={SECTIONS}
    >
      <div className="relative">
        <label htmlFor="faq-search" className="sr-only">
          Search help articles
        </label>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="faq-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search help articles"
          className="pl-9"
        />
      </div>

      {hasResults ? (
        <div className="mt-8 space-y-10">
          {filteredCategories.map((category) => (
            <section key={category.id} aria-labelledby={category.id}>
              <LegalHeading id={category.id}>{category.title}</LegalHeading>
              <Accordion type="single" collapsible className="mt-3">
                {category.items.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    value={`${category.id}-${index}`}
                    className="border-border"
                  >
                    <AccordionTrigger className="text-left text-foreground">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="leading-7 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            No answers matched &ldquo;{query.trim()}&rdquo;. Try a different
            search, or contact us and we will help.
          </p>
        </div>
      )}

      <div className="mt-12 rounded-lg border border-border bg-accent p-5">
        <div className="flex items-start gap-3">
          <LifeBuoy aria-hidden="true" className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h2
              id="still-need-help"
              className="scroll-mt-24 text-lg font-semibold text-foreground"
            >
              Still need help? Contact us
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Send us a message and we will get back to you, or email{" "}
              <a
                href="mailto:support@base.et"
                className="font-medium text-primary underline underline-offset-4"
              >
                support@base.et
              </a>
              .
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/contact">
                  Contact us
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <a
                href="mailto:support@base.et"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground"
              >
                <Mail aria-hidden="true" className="h-4 w-4" />
                support@base.et
              </a>
            </div>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}
