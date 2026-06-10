"use client";
// ─────────────────────────────────────────────────────────────────
// components/features-1.jsx
// grey.co "Go global" pattern:
//   • Section eyebrow + big italic headline centered at top
//   • Then three large rounded-corner blocks stacked vertically
//     (or in a 2-col grid on large screens)
//   • Each block has its own soft background color
//   • Inside: ALL-CAPS tag, bold title, desc, arrow CTA, photo
// ─────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const FEATURES = [
  {
    tag: "SMART DASHBOARD",
    title: "Your finances, clear at a glance",
    desc: "One screen that tells the full story. Compare budgets vs. actual spending with intuitive charts and a real-time activity feed — no spreadsheets, no confusion.",
    cta: "Explore dashboard",
    href: "/services",
    bg: "var(--block-sage)",
    img: "/stacks-coins.jpg",
    imgAlt: "Stacked coins representing savings and wealth",
  },
  {
    tag: "CATEGORY BUDGETING",
    title: "Set limits. Stay in control.",
    desc: "Create budgets for every spending category. Color-coded progress bars make it effortless to see exactly where you stand — before you overspend.",
    cta: "Set your budgets",
    href: "/services",
    bg: "var(--block-blush)",
    img: "/Birr.jpg",
    imgAlt: "Ethiopian Birr currency notes representing local money management",
  },
  {
    tag: "EXPENSE LOGGING",
    title: "Every transaction. Logged instantly.",
    desc: "Add expenses in seconds — name, amount, date, and category. Build a meticulous record that makes year-end reconciliation completely stress-free.",
    cta: "Start tracking",
    href: "/services",
    bg: "var(--block-sky)",
    img: "/Happy_family3.jpg",
    imgAlt: "Family reviewing their budget together on a smartphone",
  },
];

export default function Features() {
  return (
    <section
      id="services"
      style={{
        background: "#fff",
        padding: "clamp(4rem, 7vw, 7rem) 0",
      }}
    >
      <div
        style={{
          maxWidth: "78rem",
          margin: "0 auto",
          padding: "0 clamp(1.25rem,5vw,3rem)",
        }}
      >
        {/* Section header — centered, grey.co style */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "clamp(2.5rem, 5vw, 4.5rem)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--clr-text-muted)",
              marginBottom: "0.875rem",
            }}
          >
            CORE FEATURES
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              letterSpacing: "-0.03em",
              color: "var(--clr-text)",
              lineHeight: 1.08,
            }}
          >
            No limits, no borders.
            <br />
            <em style={{ fontStyle: "italic", color: "var(--clr-brand)" }}>
              Go financial.
            </em>
          </h2>
        </div>

        {/* Feature cards */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} {...f} flip={i % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ tag, title, desc, cta, href, bg, img, imgAlt, flip }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,300px), 1fr))",
        borderRadius: "var(--r-xl)",
        overflow: "hidden",
        background: bg,
        minHeight: 380,
      }}
    >
      {/* ── Text panel ── */}
      <div
        style={{
          padding: "clamp(2rem,5vw,3.5rem)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "1.125rem",
          order: flip ? 2 : 1,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--clr-text-muted)",
          }}
        >
          {tag}
        </span>

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(1.375rem, 3vw, 2rem)",
            letterSpacing: "-0.025em",
            color: "var(--clr-text)",
            lineHeight: 1.15,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "1rem",
            color: "var(--clr-text-2)",
            lineHeight: 1.75,
            maxWidth: "40ch",
          }}
        >
          {desc}
        </p>

        <Link
          href={href}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: hovered ? "0.625rem" : "0.375rem",
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: "0.9375rem",
            color: "var(--clr-brand)",
            textDecoration: "none",
            transition: "gap 0.2s var(--ease-spring)",
          }}
        >
          {cta} <ArrowRight size={15} />
        </Link>
      </div>

      {/* ── Photo panel ── */}
      <div style={{ order: flip ? 1 : 2, overflow: "hidden", minHeight: 280 }}>
        <Image
          src={img}
          width={680}
          height={460}
          alt={imgAlt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.5s var(--ease-spring)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.03)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>
    </div>
  );
}
