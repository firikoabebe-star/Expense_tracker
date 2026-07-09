"use client";
// ─────────────────────────────────────────────────────────────────
// components/integrations-3.jsx
// grey.co "A truly global foreign account" section pattern:
//   • White / off-white section background
//   • Left: phone/lifestyle photo with floating summary chip
//   • Right: eyebrow, big headline, sub-copy, CTA, numbered list
// ─────────────────────────────────────────────────────────────────
import React from "react";
import Link from "next/link";
import Image from "next/image";

const POINTS = [
  "Zero account & card maintenance fees",
  "Real-time budget tracking",
  "Instant expense notifications",
  "Unlimited budget categories",
  "CSV & Excel data export",
  "Visual analytics & spending insights",
];

export default function IntegrationsSection() {
  return (
    <section
      style={{
        background: "var(--clr-bg-off)",
        padding: "clamp(4rem,7vw,7rem) 0",
      }}
    >
      <div
        style={{
          maxWidth: "78rem",
          margin: "0 auto",
          padding: "0 clamp(1.25rem,5vw,3rem)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,300px), 1fr))",
          gap: "clamp(2.5rem,6vw,5rem)",
          alignItems: "center",
        }}
      >
        {/* ── Left: Photo ── */}
        <div style={{ position: "relative" }}>
          {/* Photo container with rounded blob bg */}
          <div
            style={{
              borderRadius: "var(--r-xl)",
              overflow: "hidden",
              background: "var(--block-blush)",
              position: "relative",
            }}
          >
            <Image
              src="/stacks-coins.jpg"
              width={620}
              height={560}
              alt="Coins stacked representing savings and financial growth"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: 520,
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>

          {/* Floating stat chip */}
          <div
            style={{
              position: "absolute",
              bottom: -16,
              right: -12,
              background: "#fff",
              borderRadius: 16,
              padding: "1rem 1.375rem",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--clr-border)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "2rem",
                color: "var(--clr-brand)",
                lineHeight: 1,
              }}
            >
              98%
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.8125rem",
                color: "var(--clr-text-muted)",
                marginTop: 4,
              }}
            >
              user satisfaction
            </p>
          </div>
        </div>

        {/* ── Right: Text ── */}
        <div>
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
            A TRULY POWERFUL APP
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
            A truly complete
            <br />
            <em style={{ fontStyle: "italic", color: "var(--clr-brand)" }}>
              expense account.
            </em>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "1rem",
              color: "var(--clr-text-2)",
              lineHeight: 1.75,
              marginBottom: "2rem",
              maxWidth: "40ch",
            }}
          >
            Get a complete expense tracking account that puts you in total
            control of your money. See everything. Understand everything. Save
            more.
          </p>

          <Link
            href="/sign-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.75rem 1.75rem",
              borderRadius: "var(--r-pill)",
              background: "var(--clr-brand)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.9375rem",
              textDecoration: "none",
              boxShadow: "0 2px 12px rgba(13,83,14,0.26)",
              transition: "background 0.15s, transform 0.15s",
              marginBottom: "2.25rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--clr-brand-mid)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--clr-brand)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Create an account
          </Link>

          {/* Numbered list — grey.co style */}
          <ol
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.875rem",
            }}
          >
            {POINTS.map((p, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    border: "1.5px solid var(--clr-border-mid)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: "var(--clr-text-muted)",
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 400,
                    fontSize: "0.9375rem",
                    color: "var(--clr-text-2)",
                  }}
                >
                  {p}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
