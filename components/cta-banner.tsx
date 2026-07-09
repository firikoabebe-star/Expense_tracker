"use client";
// ─────────────────────────────────────────────────────────────────
// components/cta-banner.jsx
// grey.co "Get digital banking at your fingertips" pattern:
//   • Inside a white-bg section, a dark green rounded rectangle
//   • Left: eyebrow + bold italic headline + sub-copy
//   • Right: two CTA buttons stacked
//   • Decorative translucent circles on corners
// ─────────────────────────────────────────────────────────────────
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section
      style={{
        background: "#fff",
        padding: "0 clamp(1.25rem,5vw,3rem) clamp(4rem,7vw,7rem)",
      }}
    >
      <div style={{ maxWidth: "78rem", margin: "0 auto" }}>
        <div
          style={{
            background: "var(--clr-brand)",
            borderRadius: "var(--r-2xl)",
            padding: "clamp(2.5rem,5vw,4.5rem) clamp(2rem,5vw,4rem)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(2rem,4vw,3.5rem)",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative blobs */}
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "rgba(231,225,177,0.08)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              left: "45%",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(231,225,177,0.05)",
              pointerEvents: "none",
            }}
          />

          {/* Left copy */}
          <div style={{ position: "relative", zIndex: 1, flex: "1 1 280px" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(231,225,177,0.55)",
                marginBottom: "0.875rem",
              }}
            >
              GET STARTED TODAY
            </p>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.875rem,3.5vw,2.875rem)",
                letterSpacing: "-0.03em",
                color: "#E7E1B1",
                lineHeight: 1.1,
                marginBottom: "1rem",
              }}
            >
              Get smart budgeting
              <br />
              <em style={{ fontStyle: "italic" }}>at your fingertips.</em>
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "1rem",
                color: "rgba(255,255,255,0.58)",
                lineHeight: 1.75,
                maxWidth: "44ch",
              }}
            >
              Join 50,000+ people who track smarter, save more, and stress less
              about money.
            </p>
          </div>

          {/* Right CTAs */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              flexShrink: 0,
            }}
          >
            <Link
              href="/sign-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.9375rem 2.25rem",
                borderRadius: "var(--r-pill)",
                background: "#E7E1B1",
                color: "var(--clr-brand)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "1rem",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "background 0.15s, transform 0.15s",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#E7E1B1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Get started — it's free <ArrowRight size={16} />
            </Link>

            <Link
              href="/pricing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.9375rem 2.25rem",
                borderRadius: "var(--r-pill)",
                border: "1.5px solid rgba(231,225,177,0.30)",
                color: "rgba(255,255,255,0.75)",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "0.9375rem",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(231,225,177,0.65)";
                e.currentTarget.style.color = "rgba(255,255,255,0.95)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(231,225,177,0.30)";
                e.currentTarget.style.color = "rgba(255,255,255,0.75)";
              }}
            >
              View pricing plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
