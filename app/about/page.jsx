"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Target,
  Shield,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Users,
  Star,
  Lock,
  Wallet,
  PiggyBank,
  Leaf,
  Award,
} from "lucide-react";

import LandingNavbar from "/components/LandingNavbar";
import FooterSection from "/components/footer";

const VALUES = [
  {
    icon: Target,
    title: "Clarity over complexity",
    desc: "Money management should be understandable. We remove unnecessary complexity and focus on the information that actually helps people make better decisions.",
  },
  {
    icon: Shield,
    title: "Privacy first",
    desc: "Your financial information belongs to you. Security, transparency, and trust guide every product decision we make.",
  },
  {
    icon: Sparkles,
    title: "Progress over perfection",
    desc: "Building healthy financial habits is a journey. Small improvements made consistently create meaningful long-term results.",
  },
  {
    icon: TrendingUp,
    title: "Designed for growth",
    desc: "Montra grows with you—from tracking daily spending to managing larger financial goals and milestones.",
  },
];

const STATS = [
  { value: "50K+", label: "Active Users", icon: Users },
  { value: "$12M+", label: "Tracked expenses", icon: TrendingUp },
  { value: "1M+", label: "Transactions logged", icon: CheckCircle2 },
  { value: "99.9%", label: "Platform uptime", icon: Lock },
];

export default function AboutPage() {
  return (
    <>
      <LandingNavbar />

      <main style={{ background: "#fff", minHeight: "100vh" }}>
        {/* ───────────────── HERO WITH VISIBLE FLOATING CARDS ───────────────── */}
        <section
          style={{
            paddingTop: "clamp(6rem, 12vw, 10rem)",
            paddingBottom: "clamp(4rem, 8vw, 6rem)",
            borderBottom: "1px solid var(--clr-border)",
            background:
              "linear-gradient(180deg, #fff 30%, var(--clr-bg-off) 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Floating card - LEFT */}
          <div
            style={{
              position: "absolute",
              left: "max(2rem, 5%)",
              top: "50%",
              transform: "translateY(-50%)",
              background: "white",
              borderRadius: "24px",
              padding: "1rem 1.25rem",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--clr-border)",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              zIndex: 3,
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Wallet size={18} color="var(--clr-brand)" />
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                Total Saved
              </span>
            </div>
            <strong style={{ fontSize: "1.5rem", color: "var(--clr-brand)" }}>
              $12,480
            </strong>
            <div style={{ fontSize: "0.7rem", color: "var(--clr-text-muted)" }}>
              +32% this year
            </div>
          </div>

          {/* Floating card - RIGHT */}
          <div
            style={{
              position: "absolute",
              right: "max(2rem, 5%)",
              top: "40%",
              transform: "translateY(-50%)",
              background: "var(--block-sage)",
              borderRadius: "24px",
              padding: "1rem 1.25rem",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--clr-border)",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              zIndex: 3,
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <PiggyBank size={18} color="var(--clr-brand)" />
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                Savings Rate
              </span>
            </div>
            <strong style={{ fontSize: "1.5rem", color: "var(--clr-brand)" }}>
              72%
            </strong>
            <div style={{ fontSize: "0.7rem", color: "var(--clr-text-muted)" }}>
              Above average
            </div>
          </div>

          {/* Decorative leaf - top left */}
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "8%",
              opacity: 0.15,
              transform: "rotate(-15deg)",
              pointerEvents: "none",
            }}
          >
            <Leaf size={80} color="var(--clr-brand)" strokeWidth={1} />
          </div>

          {/* Decorative award - bottom right */}
          <div
            style={{
              position: "absolute",
              bottom: "15%",
              right: "10%",
              opacity: 0.12,
              transform: "rotate(10deg)",
              pointerEvents: "none",
            }}
          >
            <Award size={100} color="var(--clr-brand)" strokeWidth={1} />
          </div>

          {/* Subtle dot patterns (still there for texture) */}
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "2%",
              width: "100px",
              height: "100px",
              backgroundImage:
                "radial-gradient(var(--clr-brand) 1.5px, transparent 1.5px)",
              backgroundSize: "16px 16px",
              opacity: 0.1,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "30%",
              right: "3%",
              width: "120px",
              height: "120px",
              backgroundImage:
                "radial-gradient(var(--clr-brand) 1.5px, transparent 1.5px)",
              backgroundSize: "20px 20px",
              opacity: 0.08,
              pointerEvents: "none",
            }}
          />

          {/* Main centered content */}
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              padding: "0 clamp(1.25rem, 5vw, 3rem)",
              textAlign: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontSize: ".75rem",
                fontWeight: 700,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "var(--clr-text-muted)",
                marginBottom: "1rem",
              }}
            >
              ABOUT Montra
            </p>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(3rem, 8vw, 5.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                color: "var(--clr-text)",
                margin: "0 auto",
                maxWidth: "14ch",
              }}
            >
              Financial confidence
              <br />
              <em
                style={{
                  color: "var(--clr-brand)",
                  fontStyle: "italic",
                }}
              >
                for everyone.
              </em>
            </h1>

            <p
              style={{
                maxWidth: "48rem",
                margin: "1.5rem auto 2rem auto",
                fontSize: "1.125rem",
                lineHeight: 1.7,
                color: "var(--clr-text-muted)",
              }}
            >
              Montra was built to help people understand, control, and
              improve their financial lives. We believe managing money should
              feel empowering—not overwhelming.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                flexWrap: "wrap",
                marginBottom: "3rem",
              }}
            >
              <Link
                href="/sign-up"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".5rem",
                  padding: "0.9rem 2rem",
                  borderRadius: "var(--r-pill)",
                  background: "var(--clr-brand)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 600,
                  boxShadow: "var(--shadow-md)",
                }}
              >
                Get Started Free
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/pricing"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.9rem 2rem",
                  borderRadius: "var(--r-pill)",
                  border: "1px solid var(--clr-border)",
                  textDecoration: "none",
                  color: "var(--clr-text)",
                  background: "white",
                }}
              >
                View Pricing
              </Link>
            </div>

            {/* Trust chips */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { icon: Users, text: "50,000+ users" },
                { icon: Star, text: "4.9/5 rating" },
                { icon: Lock, text: "Bank-level security" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "999px",
                    background: "white",
                    border: "1px solid var(--clr-border)",
                    boxShadow: "var(--shadow-sm)",
                    fontSize: "0.85rem",
                    color: "var(--clr-text-muted)",
                  }}
                >
                  <item.icon size={14} color="var(--clr-brand)" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rest of the page unchanged (mission, values, stats, philosophy, cta) */}
        {/* ... (keep exactly the same as previous version) ... */}

        {/* ───────────────── MISSION ───────────────── */}
        <section
          style={{
            padding: "clamp(4rem, 6vw, 7rem) clamp(1.25rem, 5vw, 3rem)",
            borderBottom: "1px solid var(--clr-border)",
            background: "var(--clr-bg-off)",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: ".75rem",
                  fontWeight: 700,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "var(--clr-text-muted)",
                  marginBottom: "1rem",
                }}
              >
                OUR MISSION
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                }}
              >
                Money should feel
                <br />
                simple.
              </h2>
            </div>

            <div>
              <p
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                  color: "var(--clr-text-muted)",
                  marginBottom: "1.25rem",
                }}
              >
                Most people don't have a spending problem. They have a
                visibility problem.
              </p>
              <p
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                  color: "var(--clr-text-muted)",
                }}
              >
                Banks show transactions. Spreadsheets demand discipline.
                Montra bridges the gap with a simple, beautiful system
                that makes financial awareness effortless.
              </p>
            </div>
          </div>
        </section>

        {/* ───────────────── VALUES ───────────────── */}
        <section
          style={{
            padding: "clamp(4rem, 6vw, 7rem) clamp(1.25rem, 5vw, 3rem)",
            borderBottom: "1px solid var(--clr-border)",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                letterSpacing: "-0.03em",
                marginBottom: "3rem",
              }}
            >
              What we believe.
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "2rem",
              }}
            >
              {VALUES.map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={i}
                  style={{
                    padding: "2rem",
                    borderRadius: "28px",
                    background:
                      i % 2 === 0 ? "var(--block-sage)" : "var(--block-cream)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
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
                      marginBottom: "1.25rem",
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      color: "var(--clr-text-muted)",
                      lineHeight: 1.7,
                    }}
                  >
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────── STATS ───────────────── */}
        <section
          style={{
            padding: "clamp(4rem, 6vw, 7rem) clamp(1.25rem, 5vw, 3rem)",
            borderBottom: "1px solid var(--clr-border)",
            background: "var(--clr-bg-off)",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              textAlign: "center",
            }}
          >
            {STATS.map((item) => (
              <div
                key={item.label}
                style={{
                  background: "white",
                  borderRadius: "32px",
                  padding: "2rem 1rem",
                  boxShadow: "var(--shadow-sm)",
                  border: "1px solid var(--clr-border)",
                }}
              >
                <item.icon
                  size={28}
                  color="var(--clr-brand)"
                  style={{ marginBottom: "1rem" }}
                />
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(2rem, 6vw, 3.5rem)",
                    color: "var(--clr-brand)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    marginTop: "0.5rem",
                    color: "var(--clr-text-muted)",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ───────────────── PHILOSOPHY ───────────────── */}
        <section
          style={{
            padding: "clamp(4rem, 6vw, 7rem) clamp(1.25rem, 5vw, 3rem)",
            borderBottom: "1px solid var(--clr-border)",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.04em",
                }}
              >
                Built for
                <br />
                real life.
              </h2>
            </div>
            <div>
              <div
                style={{
                  background: "var(--block-cream)",
                  borderRadius: "28px",
                  padding: "2rem",
                  marginBottom: "1.5rem",
                  border: "1px solid var(--clr-border)",
                }}
              >
                <p
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.7,
                    color: "var(--clr-text-muted)",
                  }}
                >
                  No financial jargon.
                  <br />
                  No complicated setup.
                  <br />
                  No unnecessary dashboards.
                </p>
              </div>
              <p
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "var(--clr-text-muted)",
                }}
              >
                Just thoughtful tools that help people make better financial
                decisions every day.
              </p>
            </div>
          </div>
        </section>

        {/* ───────────────── CTA ───────────────── */}
        <section
          style={{
            padding: "clamp(5rem, 8vw, 8rem) clamp(1.25rem, 5vw, 3rem)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "56rem",
              margin: "0 auto",
              background: "var(--block-sage)",
              borderRadius: "48px",
              padding: "clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)",
              border: "1px solid var(--clr-border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 6vw, 4rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                marginBottom: "1rem",
              }}
            >
              Ready to take control
              <br />
              of your finances?
            </h2>
            <p
              style={{
                color: "var(--clr-text-muted)",
                fontSize: "1.1rem",
                lineHeight: 1.6,
                marginBottom: "2rem",
                maxWidth: "36rem",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Start tracking, budgeting, and building better financial habits
              today.
            </p>
            <Link
              href="/sign-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                padding: "1rem 2rem",
                borderRadius: "var(--r-pill)",
                background: "var(--clr-brand)",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
                boxShadow: "var(--shadow-md)",
              }}
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <FooterSection />
    </>
  );
}
