"use client";
// ─────────────────────────────────────────────────────────────────
// components/stats-3.jsx
// grey.co pattern: dark-branded section with large stat numbers
// and a marquee strip of feature names below it.
// ─────────────────────────────────────────────────────────────────
import React from "react";

const STATS = [
  { value: "50,000+", label: "Active Users", note: "and growing every day" },
  { value: "$2.4M+", label: "Expenses Tracked", note: "across all budgets" },
  { value: "12,000+", label: "Organisations", note: "trust our platform" },
  { value: "98%", label: "Satisfaction Rate", note: "from user surveys" },
];

const MARQUEE_ITEMS = [
  "Smart Dashboard",
  "Category Budgets",
  "Expense Logging",
  "Real-time Alerts",
  "CSV Export",
  "Visual Analytics",
  "Goal Tracking",
  "Dark Mode",
  "Mobile-first",
  "Free to Start",
  "Smart Dashboard",
  "Category Budgets",
  "Expense Logging",
  "Real-time Alerts",
  "CSV Export",
  "Visual Analytics",
  "Goal Tracking",
  "Dark Mode",
  "Mobile-first",
  "Free to Start",
];

export default function StatsSection() {
  return (
    <section
      style={{
        background: "var(--clr-brand)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(231,225,177,0.07)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: "30%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(231,225,177,0.05)",
          pointerEvents: "none",
        }}
      />

      {/* Stats row */}
      <div
        style={{
          maxWidth: "78rem",
          margin: "0 auto",
          padding: "clamp(3.5rem,6vw,5.5rem) clamp(1.25rem,5vw,3rem)",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "2rem",
          textAlign: "center",
        }}
      >
        {STATS.map(({ value, label, note }, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 80}ms` }}
            className="et-fade-up"
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2.25rem,4.5vw,3.25rem)",
                color: "#E7E1B1",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                marginBottom: "0.5rem",
              }}
            >
              {value}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "0.9375rem",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "0.25rem",
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.42)",
              }}
            >
              {note}
            </p>
          </div>
        ))}
      </div>

      {/* Marquee strip */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.12)",
          padding: "1.125rem 0",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="et-marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "1.5rem",
                paddingRight: "3rem",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "0.875rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "rgba(231,225,177,0.55)",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "rgba(231,225,177,0.4)",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
