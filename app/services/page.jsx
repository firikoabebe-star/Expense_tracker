"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  TrendingUp,
  BarChart3,
  Target,
  ArrowRight,
  CheckCircle2,
  Wallet,
  PiggyBank,
  Activity,
} from "lucide-react";

import LandingNavbar from "/components/LandingNavbar";
import FooterSection from "/components/footer";

/* ───────────────────────────────────────────────
   SERVICES (expanded SaaS-level structure)
─────────────────────────────────────────────── */
const SERVICES = [
  {
    icon: LayoutDashboard,
    title: "Smart Dashboard Analytics",
    desc: "A real-time financial overview that shows your spending, budgets, and progress in one clean interface.",
    bullets: [
      "Live financial snapshot",
      "Spending vs budget comparison",
      "Category breakdown insights",
    ],
  },
  {
    icon: PieChart,
    title: "Advanced Budget Planning",
    desc: "Create flexible budgets per category and adjust them dynamically as your spending habits evolve.",
    bullets: [
      "Unlimited budget categories",
      "Monthly & custom cycles",
      "Auto-adjust suggestions",
    ],
  },
  {
    icon: Receipt,
    title: "Expense Tracking System",
    desc: "Log and organize every transaction instantly with structured categorization and history tracking.",
    bullets: [
      "One-click expense logging",
      "Smart categorization",
      "Full transaction history",
    ],
  },
  {
    icon: BarChart3,
    title: "Financial Reports",
    desc: "Generate deep insights into your financial behavior with visual reports and trend analysis.",
    bullets: [
      "Monthly spending reports",
      "Category trend analysis",
      "Exportable data views",
    ],
  },
  {
    icon: Target,
    title: "Savings Goals",
    desc: "Set personal financial goals and track your progress with automated updates and projections.",
    bullets: ["Goal-based budgeting", "Progress tracking", "Milestone alerts"],
  },
  {
    icon: TrendingUp,
    title: "Smart Financial Insights",
    desc: "AI-style insights that help you understand spending patterns and optimize your financial habits.",
    bullets: [
      "Spending behavior detection",
      "Optimization suggestions",
      "Monthly improvement tips",
    ],
  },
];

// Trust indicators
const TRUST = [
  "4.9/5 App Store Rating",
  "50,000+ Active Users",
  "Bank-Level Security",
];

export default function ServicesPage() {
  return (
    <>
      <LandingNavbar />

      <main style={{ background: "var(--clr-bg)", minHeight: "100vh" }}>
        {/* ───────────────── BENTO HERO ───────────────── */}
        <section
          style={{
            paddingTop: "clamp(6rem, 10vw, 8rem)",
            paddingBottom: "clamp(4rem, 6vw, 6rem)",
            position: "relative",
            overflow: "hidden",
            borderBottom: "1px solid var(--clr-border)",
            background:
              "linear-gradient(180deg, #fff 40%, var(--clr-bg-off) 100%)",
          }}
        >
          {/* Background glow */}
          <div
            style={{
              position: "absolute",
              top: "-10rem",
              left: "50%",
              transform: "translateX(-50%)",
              width: "70rem",
              height: "70rem",
              background:
                "radial-gradient(circle, rgba(13,83,14,0.06), transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 clamp(1.25rem, 5vw, 3rem)",
              display: "grid",
              gridTemplateColumns: "1.1fr 0.9fr",
              gap: "4rem",
              alignItems: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* LEFT column – text + CTAs */}
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "var(--clr-text-muted)",
                  marginBottom: "1rem",
                }}
              >
                Services Overview
              </p>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.04em",
                  marginBottom: "1.25rem",
                }}
              >
                Everything you need to
                <br />
                <span style={{ color: "var(--clr-brand)" }}>
                  manage money better.
                </span>
              </h1>

              <p
                style={{
                  maxWidth: "42ch",
                  color: "var(--clr-text-muted)",
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                  marginBottom: "2rem",
                }}
              >
                Montra combines budgeting, analytics, and intelligent
                insights into one seamless financial platform.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  marginBottom: "2rem",
                }}
              >
                <Link
                  href="/sign-up"
                  style={{
                    padding: "0.85rem 1.6rem",
                    borderRadius: "999px",
                    background: "var(--clr-brand)",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 600,
                    display: "inline-flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    boxShadow: "0 8px 24px rgba(13,83,14,0.2)",
                  }}
                >
                  Get Started <ArrowRight size={16} />
                </Link>

                <Link
                  href="/pricing"
                  style={{
                    padding: "0.85rem 1.6rem",
                    borderRadius: "999px",
                    border: "1px solid var(--clr-border)",
                    color: "var(--clr-text)",
                    textDecoration: "none",
                    fontWeight: 500,
                    background: "white",
                  }}
                >
                  View Pricing
                </Link>
              </div>

              {/* Trust indicators (inline) */}
              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                  borderTop: "1px solid var(--clr-border)",
                  paddingTop: "1.5rem",
                }}
              >
                {TRUST.map((item) => (
                  <span
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontSize: "0.85rem",
                      color: "var(--clr-text-muted)",
                    }}
                  >
                    <CheckCircle2 size={14} color="var(--clr-brand)" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT column – bento dashboard preview */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Card 1: Income / Expenses / Savings Rate */}
              <div
                style={{
                  background: "white",
                  borderRadius: "28px",
                  padding: "1.5rem",
                  border: "1px solid var(--clr-border)",
                  boxShadow: "var(--shadow-md)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <Wallet size={18} color="var(--clr-brand)" />
                    <p
                      style={{
                        fontSize: "0.7rem",
                        marginTop: "0.5rem",
                        color: "var(--clr-text-muted)",
                      }}
                    >
                      Income
                    </p>
                    <strong style={{ fontSize: "1.25rem" }}>+$8,420</strong>
                  </div>
                  <div>
                    <Activity size={18} color="var(--clr-brand)" />
                    <p
                      style={{
                        fontSize: "0.7rem",
                        marginTop: "0.5rem",
                        color: "var(--clr-text-muted)",
                      }}
                    >
                      Expenses
                    </p>
                    <strong style={{ fontSize: "1.25rem" }}>-$3,150</strong>
                  </div>
                  <div>
                    <PiggyBank size={18} color="var(--clr-brand)" />
                    <p
                      style={{
                        fontSize: "0.7rem",
                        marginTop: "0.5rem",
                        color: "var(--clr-text-muted)",
                      }}
                    >
                      Savings Rate
                    </p>
                    <strong style={{ fontSize: "1.25rem" }}>72%</strong>
                  </div>
                </div>
              </div>

              {/* Card 2: Budget progress bar */}
              <div
                style={{
                  background: "var(--block-sage)",
                  borderRadius: "28px",
                  padding: "1.5rem",
                  border: "1px solid var(--clr-border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Monthly Budget</span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--clr-text-muted)",
                    }}
                  >
                    $2,450 / $3,000
                  </span>
                </div>
                <div
                  style={{
                    height: "10px",
                    background: "rgba(13,83,14,0.15)",
                    borderRadius: "20px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: "82%",
                      height: "100%",
                      background: "var(--clr-brand)",
                      borderRadius: "20px",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    marginTop: "0.75rem",
                    color: "var(--clr-text-muted)",
                  }}
                >
                  On track – 18% remaining
                </p>
              </div>

              {/* Card 3: Recent activity (mini feed) */}
              <div
                style={{
                  background: "white",
                  borderRadius: "28px",
                  padding: "1.25rem",
                  border: "1px solid var(--clr-border)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <p
                  style={{
                    fontWeight: 600,
                    marginBottom: "0.75rem",
                    fontSize: "0.9rem",
                  }}
                >
                  Recent Activity
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.6rem",
                  }}
                >
                  {[
                    "Salary added",
                    "Grocery budget used",
                    "Savings goal updated",
                  ].map((text, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      <CheckCircle2 size={12} color="var(--clr-brand)" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────── SERVICES GRID (upgraded) ───────────────── */}
        <section
          style={{
            padding: "clamp(4rem, 6vw, 6rem) 0",
            borderBottom: "1px solid var(--clr-border)",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 clamp(1.25rem, 5vw, 3rem)",
            }}
          >
            <div style={{ marginBottom: "3rem", textAlign: "center" }}>
              <p
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "var(--clr-text-muted)",
                  marginBottom: "0.75rem",
                }}
              >
                Comprehensive Toolkit
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  letterSpacing: "-0.03em",
                  marginBottom: "1rem",
                }}
              >
                Built for complete financial control
              </h2>
              <p
                style={{
                  color: "var(--clr-text-muted)",
                  maxWidth: "48rem",
                  margin: "0 auto",
                }}
              >
                A full suite of tools designed to give you clarity, confidence,
                and control over your money.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2rem",
              }}
            >
              {SERVICES.map((s, i) => (
                <div
                  key={i}
                  style={{
                    background:
                      i % 2 === 0 ? "var(--block-sage)" : "var(--block-cream)",
                    borderRadius: "28px",
                    padding: "2rem",
                    border: "1px solid var(--clr-border)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      background: "var(--clr-brand-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--clr-brand)",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <s.icon size={24} />
                  </div>

                  <h3
                    style={{
                      marginTop: 0,
                      fontFamily: "var(--font-display)",
                      fontSize: "1.35rem",
                      fontWeight: 600,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {s.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--clr-text-muted)",
                      lineHeight: 1.6,
                      marginBottom: "1.25rem",
                    }}
                  >
                    {s.desc}
                  </p>

                  <div style={{ marginTop: "auto" }}>
                    {s.bullets.map((b, j) => (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          marginTop: "0.6rem",
                          fontSize: "0.85rem",
                          color: "var(--clr-text-muted)",
                        }}
                      >
                        <CheckCircle2 size={14} color="var(--clr-brand)" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────── HOW IT WORKS (replaces live demo) ───────────────── */}
        <section
          style={{
            padding: "clamp(4rem, 6vw, 6rem) 0",
            borderBottom: "1px solid var(--clr-border)",
            background: "var(--clr-bg-off)",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 clamp(1.25rem, 5vw, 3rem)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "var(--clr-text-muted)",
                  marginBottom: "1rem",
                }}
              >
                Simple & Powerful
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.03em",
                }}
              >
                Three steps to
                <br />
                <span style={{ color: "var(--clr-brand)" }}>
                  financial clarity.
                </span>
              </h2>
              <p
                style={{
                  marginTop: "1rem",
                  color: "var(--clr-text-muted)",
                  lineHeight: 1.6,
                }}
              >
                No complicated setup. No hidden fees. Just a clear path to
                better money management.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {[
                {
                  step: "01",
                  title: "Connect your accounts",
                  desc: "Securely link bank accounts or add transactions manually. Everything stays private.",
                },
                {
                  step: "02",
                  title: "Set budgets & goals",
                  desc: "Create custom spending limits and savings targets that fit your lifestyle.",
                },
                {
                  step: "03",
                  title: "Get insights & improve",
                  desc: "Receive weekly reports and smart recommendations to save more automatically.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    background: "white",
                    borderRadius: "24px",
                    padding: "1.25rem",
                    border: "1px solid var(--clr-border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <div
                    style={{
                      minWidth: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      background: "var(--block-sage)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--clr-brand)",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--clr-text-muted)",
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────── CTA (upgraded bento style) ───────────────── */}
        <section
          style={{
            padding: "clamp(5rem, 8vw, 7rem) 0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "56rem",
              margin: "0 auto",
              background: "var(--block-cream)",
              borderRadius: "48px",
              padding: "clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)",
              border: "1px solid var(--clr-border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.03em",
                marginBottom: "1rem",
              }}
            >
              Start managing your money smarter
            </h2>

            <p
              style={{
                maxWidth: "36rem",
                margin: "0 auto 2rem",
                color: "var(--clr-text-muted)",
                lineHeight: 1.7,
              }}
            >
              Join thousands of users already building better financial habits
              with Montra.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/sign-up"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.9rem 2rem",
                  borderRadius: "999px",
                  background: "var(--clr-brand)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 600,
                  boxShadow: "var(--shadow-md)",
                }}
              >
                Get Started Free <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.9rem 2rem",
                  borderRadius: "999px",
                  border: "1px solid var(--clr-border)",
                  background: "white",
                  color: "var(--clr-text)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </>
  );
}
