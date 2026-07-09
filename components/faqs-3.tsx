"use client";
// ─────────────────────────────────────────────────────────────────
// components/faqs-3.jsx
// grey.co pattern:
//   • White background section
//   • Left: sticky eyebrow + big italic headline + sub-copy
//   • Right: custom accordion with + / − icon circles
// ─────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "How do I create a budget?",
    a: 'Navigate to the Budgets tab and click "New Budget". Give it a name (e.g., Groceries), set a monthly limit, and pick a category icon. You can create as many budgets as you need — there is no limit.',
  },
  {
    q: "How do I log an expense?",
    a: 'Open any budget card and tap "+ Add Expense". Fill in the name, amount, and date. Your remaining balance updates instantly. You can also bulk-import transactions via CSV.',
  },
  {
    q: "Can I edit or delete a budget?",
    a: "Yes. Click the three-dot menu on any budget card to rename it, adjust the limit, change the category, or permanently delete it along with all its linked expenses.",
  },
  {
    q: "Is my financial data secure?",
    a: "All data is encrypted at rest and in transit using AES-256. We never share or sell your personal data to third parties. Your financial records are yours alone.",
  },
  {
    q: "Is there a mobile app?",
    a: "The web app is fully responsive and works great on any mobile browser. Native iOS and Android apps are currently on our public roadmap.",
  },
  {
    q: "Can I export my data?",
    a: "Yes — Pro and Business plan users can export full spending history as CSV or Excel. Starter plan users can export the last 30 days.",
  },
];

export default function FAQsThree() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      style={{
        background: "#fff",
        padding: "clamp(4rem,7vw,7rem) 0",
        borderTop: "1px solid var(--clr-border)",
      }}
    >
      <div
        style={{
          maxWidth: "78rem",
          margin: "0 auto",
          padding: "0 clamp(1.25rem,5vw,3rem)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,280px), 1fr))",
          gap: "clamp(2.5rem,5vw,5rem)",
          alignItems: "start",
        }}
      >
        {/* ── Left: Sticky heading ── */}
        <div style={{ position: "sticky", top: "5.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--clr-text-muted)",
              marginBottom: "1rem",
            }}
          >
            FAQ
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.875rem,3.5vw,2.875rem)",
              letterSpacing: "-0.03em",
              color: "var(--clr-text)",
              lineHeight: 1.1,
              marginBottom: "1.25rem",
            }}
          >
            Frequently
            <br />
            asked
            <br />
            <em style={{ fontStyle: "italic", color: "var(--clr-brand)" }}>
              questions.
            </em>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "0.9375rem",
              color: "var(--clr-text-muted)",
              lineHeight: 1.7,
            }}
          >
            Can't find your answer?{" "}
            <a
              href="mailto:support@montra.app"
              style={{ color: "var(--clr-brand)", textDecoration: "underline" }}
            >
              Email our team
            </a>
            .
          </p>
        </div>

        {/* ── Right: Accordion ── */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}
        >
          {FAQ_ITEMS.map(({ q, a }, i) => (
            <AccordionItem
              key={i}
              question={q}
              answer={a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1.5px solid var(--clr-border)",
        overflow: "hidden",
        background: isOpen ? "#fff" : "transparent",
        transition: "background 0.2s, box-shadow 0.2s",
        boxShadow: isOpen ? "var(--shadow-sm)" : "none",
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1.125rem 1.375rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: "0.9375rem",
            color: "var(--clr-text)",
            lineHeight: 1.4,
          }}
        >
          {question}
        </span>

        {/* Icon circle */}
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isOpen ? "var(--clr-brand)" : "var(--block-sage)",
            color: isOpen ? "#E7E1B1" : "var(--clr-brand)",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          {isOpen ? <Minus size={13} /> : <Plus size={13} />}
        </span>
      </button>

      {/* Answer — animated height */}
      <div
        style={{
          maxHeight: isOpen ? 300 : 0,
          overflow: "hidden",
          transition: "max-height 0.38s var(--ease-spring)",
        }}
      >
        <p
          style={{
            padding: "0 1.375rem 1.375rem",
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.9375rem",
            color: "var(--clr-text-muted)",
            lineHeight: 1.75,
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}
