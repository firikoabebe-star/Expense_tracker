"use client";
// ─────────────────────────────────────────────────────────────────
// app/pricing/page.jsx
// grey.co aesthetic:
//   • Pure white page canvas
//   • Eyebrow + big italic headline
//   • Billing toggle pill
//   • 3 plan cards: soft bg | dark green (featured) | soft bg
//   • Small FAQ grid at bottom
// ─────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import Link from "next/link";
import { Check, X, Zap, User, Building2, ArrowRight } from "lucide-react";
import LandingNavbar from "/components/LandingNavbar";
import FooterSection from "/components/footer";

const PLANS = [
  {
    icon: User,
    name: "Starter",
    tagline: "Perfect for getting started",
    monthly: 0,
    yearly: 0,
    cta: "Start for free",
    href: "/sign-up",
    dark: false,
    badge: null,
    features: [
      { t: "Up to 3 budgets", ok: true },
      { t: "50 expense entries / month", ok: true },
      { t: "Basic dashboard", ok: true },
      { t: "Email support", ok: true },
      { t: "CSV export", ok: false },
      { t: "Analytics & charts", ok: false },
      { t: "Custom categories", ok: false },
      { t: "API access", ok: false },
    ],
  },
  {
    icon: Zap,
    name: "Pro",
    tagline: "For individuals serious about money",
    monthly: 9,
    yearly: 7,
    cta: "Get Pro",
    href: "/sign-up?plan=pro",
    dark: true,
    badge: "Most Popular",
    features: [
      { t: "Unlimited budgets", ok: true },
      { t: "Unlimited expense entries", ok: true },
      { t: "Advanced dashboard", ok: true },
      { t: "Priority support", ok: true },
      { t: "CSV & Excel export", ok: true },
      { t: "Analytics & charts", ok: true },
      { t: "Custom categories", ok: true },
      { t: "API access", ok: false },
    ],
  },
  {
    icon: Building2,
    name: "Business",
    tagline: "For teams and organisations",
    monthly: 29,
    yearly: 22,
    cta: "Start Business Trial",
    href: "/sign-up?plan=business",
    dark: false,
    badge: null,
    features: [
      { t: "Everything in Pro", ok: true },
      { t: "Up to 20 team members", ok: true },
      { t: "Shared budgets", ok: true },
      { t: "Dedicated support", ok: true },
      { t: "CSV & Excel export", ok: true },
      { t: "Analytics & charts", ok: true },
      { t: "Custom categories", ok: true },
      { t: "Full API access", ok: true },
    ],
  },
];

const FAQS = [
  {
    q: "Can I switch plans later?",
    a: "Yes — upgrade or downgrade any time. Pro-rated billing applies.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Pro includes a 14-day free trial. No credit card required to start.",
  },
  {
    q: "What payment methods are accepted?",
    a: "Visa, Mastercard, and major mobile money providers are supported.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Absolutely. Cancel from your account settings at any time.",
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <LandingNavbar />
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        {/* ── Hero ── */}
        <section
          style={{
            paddingTop: "clamp(6rem,10vw,9rem)",
            paddingBottom: "clamp(3rem,5vw,5rem)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "56rem",
              margin: "0 auto",
              padding: "0 clamp(1.25rem,5vw,3rem)",
            }}
          >
            <p
              className="et-fade-up"
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
              PRICING
            </p>

            <h1
              className="et-fade-up et-d1"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2.5rem,5.5vw,4.25rem)",
                letterSpacing: "-0.035em",
                color: "var(--clr-text)",
                lineHeight: 1.06,
                marginBottom: "1.25rem",
              }}
            >
              Simple, transparent
              <br />
              <em style={{ fontStyle: "italic", color: "var(--clr-brand)" }}>
                pricing.
              </em>
            </h1>

            <p
              className="et-fade-up et-d2"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "1.0625rem",
                color: "var(--clr-text-muted)",
                lineHeight: 1.75,
                marginBottom: "2.5rem",
                maxWidth: "42ch",
                margin: "0 auto 2.5rem",
              }}
            >
              Start free and upgrade as you grow. Cancel or change plans at any
              time.
            </p>

            {/* Billing toggle */}
            <div
              className="et-fade-up et-d3"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.875rem",
                background: "var(--clr-bg-off)",
                border: "1px solid var(--clr-border)",
                borderRadius: "var(--r-pill)",
                padding: "0.4rem 1rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: !yearly ? "var(--clr-text)" : "var(--clr-text-muted)",
                  fontWeight: !yearly ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                Monthly
              </span>

              <button
                onClick={() => setYearly(!yearly)}
                aria-label="Toggle billing period"
                style={{
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  background: yearly
                    ? "var(--clr-brand)"
                    : "var(--clr-border-mid)",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.25s",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    left: yearly ? 23 : 3,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left 0.25s var(--ease-spring)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </button>

              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  color: yearly ? "var(--clr-text)" : "var(--clr-text-muted)",
                  fontWeight: yearly ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                Yearly
                <span
                  style={{
                    background: "var(--block-sage)",
                    color: "var(--clr-brand)",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "var(--r-pill)",
                    letterSpacing: "0.02em",
                  }}
                >
                  SAVE 22%
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* ── Plan cards ── */}
        <section
          style={{ padding: "0 clamp(1.25rem,5vw,3rem) clamp(4rem,7vw,6rem)" }}
        >
          <div
            style={{
              maxWidth: "78rem",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%,280px), 1fr))",
              gap: "1.25rem",
              alignItems: "stretch",
            }}
          >
            {PLANS.map((plan, i) => (
              <PlanCard key={plan.name} plan={plan} yearly={yearly} index={i} />
            ))}
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: "1.75rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "var(--clr-text-muted)",
            }}
          >
            All plans include a 14-day free trial on paid features. No credit
            card required to start.
          </p>
        </section>

        {/* ── FAQ ── */}
        <section
          style={{
            background: "var(--clr-bg-off)",
            padding: "clamp(3.5rem,6vw,6rem) clamp(1.25rem,5vw,3rem)",
            borderTop: "1px solid var(--clr-border)",
          }}
        >
          <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.625rem,3vw,2.25rem)",
                letterSpacing: "-0.025em",
                color: "var(--clr-text)",
                textAlign: "center",
                marginBottom: "2.5rem",
              }}
            >
              Pricing{" "}
              <em style={{ fontStyle: "italic", color: "var(--clr-brand)" }}>
                FAQ
              </em>
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1.125rem",
              }}
            >
              {FAQS.map(({ q, a }, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: "var(--r-md)",
                    border: "1.5px solid var(--clr-border)",
                    background: "#fff",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: "var(--clr-text)",
                    }}
                  >
                    {q}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "0.875rem",
                      color: "var(--clr-text-muted)",
                      lineHeight: 1.7,
                    }}
                  >
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <FooterSection />
    </>
  );
}

interface PlanCardProps {
  plan: {
    icon: React.ComponentType<{ size?: number }>;
    name: string;
    tagline: string;
    monthly: number;
    yearly: number;
    cta: string;
    href: string;
    dark: boolean;
    badge: string | null;
    features: { t: string; ok: boolean }[];
  };
  yearly: boolean;
  index: number;
}

function PlanCard({ plan, yearly, index }: PlanCardProps) {
  const {
    icon: Icon,
    name,
    tagline,
    monthly,
    yearly: yr,
    cta,
    href,
    dark,
    badge,
    features,
  } = plan;
  const price = yearly ? yr : monthly;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--r-xl)",
        padding: "clamp(1.75rem,3vw,2.5rem)",
        background: dark ? "var(--clr-brand)" : "var(--block-sage)",
        border: dark ? "none" : "1.5px solid var(--clr-border)",
        position: "relative",
        boxShadow: dark ? "var(--shadow-lg)" : "var(--shadow-xs)",
        animation: `et-fade-up 0.55s ${index * 0.09 + 0.1}s both`,
      }}
    >
      {badge && (
        <span
          style={{
            position: "absolute",
            top: -13,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#E7E1B1",
            color: "var(--clr-brand)",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            fontSize: "0.68rem",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            padding: "3px 14px",
            borderRadius: "var(--r-pill)",
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </span>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: dark
              ? "rgba(231,225,177,0.15)"
              : "var(--clr-brand-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: dark ? "#E7E1B1" : "var(--clr-brand)",
          }}
        >
          <Icon size={19} />
        </div>
        <div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.0625rem",
              color: dark ? "#E7E1B1" : "var(--clr-text)",
            }}
          >
            {name}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "0.8rem",
              color: dark ? "rgba(231,225,177,0.6)" : "var(--clr-text-muted)",
            }}
          >
            {tagline}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "1.75rem" }}>
        <div
          style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: price === 0 ? "2.5rem" : "3rem",
              color: dark ? "#E7E1B1" : "var(--clr-text)",
              letterSpacing: "-0.04em",
            }}
          >
            {price === 0 ? "Free" : `$${price}`}
          </span>
          {price > 0 && (
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.875rem",
                color: dark
                  ? "rgba(231,225,177,0.55)"
                  : "var(--clr-text-muted)",
              }}
            >
              /mo
            </span>
          )}
        </div>
        {yearly && price > 0 && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.78rem",
              color: dark ? "rgba(231,225,177,0.55)" : "var(--clr-text-muted)",
              marginTop: 3,
            }}
          >
            Billed annually · ${price * 12}/yr
          </p>
        )}
      </div>

      <Link
        href={href}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4rem",
          padding: "0.7rem 1.5rem",
          borderRadius: "var(--r-pill)",
          background: dark ? "#E7E1B1" : "var(--clr-brand)",
          color: dark ? "var(--clr-brand)" : "#fff",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: "0.9375rem",
          textDecoration: "none",
          marginBottom: "1.75rem",
          transition: "opacity 0.15s, transform 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.88";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {cta} <ArrowRight size={14} />
      </Link>

      <div
        style={{
          height: 1,
          background: dark ? "rgba(231,225,177,0.15)" : "var(--clr-border)",
          marginBottom: "1.5rem",
        }}
      />

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          flex: 1,
        }}
      >
        {features.map(({ t, ok }, j) => (
          <li
            key={j}
            style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: ok
                  ? dark
                    ? "rgba(231,225,177,0.18)"
                    : "var(--clr-brand-light)"
                  : "transparent",
                color: ok
                  ? dark
                    ? "#E7E1B1"
                    : "var(--clr-brand)"
                  : dark
                    ? "rgba(231,225,177,0.25)"
                    : "var(--clr-border-mid)",
              }}
            >
              {ok ? (
                <Check size={10} strokeWidth={3} />
              ) : (
                <X size={10} strokeWidth={2} />
              )}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.9rem",
                color: ok
                  ? dark
                    ? "rgba(255,255,255,0.88)"
                    : "var(--clr-text-2)"
                  : dark
                    ? "rgba(255,255,255,0.32)"
                    : "var(--clr-text-muted)",
              }}
            >
              {t}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
