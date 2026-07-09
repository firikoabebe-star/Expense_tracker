"use client";
// ─────────────────────────────────────────────────────────────────
// components/testimonials.jsx
// grey.co "Making a difference together" pattern:
//   • White bg section
//   • Eyebrow + big italic headline
//   • Full-bleed lifestyle photo spanning partial width
//   • Three testimonial cards below — middle card inverted dark green
// ─────────────────────────────────────────────────────────────────
import React from "react";
import Image from "next/image";

const CARDS = [
  {
    text: "Montra completely changed how I manage my freelance income. I finally know exactly where every birr goes.",
    name: "Selam Tadesse",
    role: "Freelance Designer, Addis Ababa",
    avatar: "S",
  },
  {
    text: "The budgeting features are incredible. I paid off debt I had been avoiding for two years just by following my dashboard.",
    name: "Dawit Kebede",
    role: "Software Engineer",
    avatar: "D",
    highlight: true,
  },
  {
    text: "Simple, beautiful, and actually useful. I have tried five budgeting apps — this is the one I actually stuck with.",
    name: "Amara Osei",
    role: "Digital Nomad",
    avatar: "A",
  },
];

export default function Testimonials() {
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
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "clamp(2.5rem,4vw,4rem)",
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
            WHAT PEOPLE SAY
          </p>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2rem,4.5vw,3.25rem)",
              letterSpacing: "-0.03em",
              color: "var(--clr-text)",
              lineHeight: 1.1,
            }}
          >
            Making a difference,
            <br />
            <em style={{ fontStyle: "italic", color: "var(--clr-brand)" }}>
              together.
            </em>
          </h2>
        </div>

        {/* Lifestyle image banner */}
        <div
          style={{
            borderRadius: "var(--r-xl)",
            overflow: "hidden",
            marginBottom: "1.5rem",
            background: "var(--block-cream)",
            maxHeight: 340,
          }}
        >
          <Image
            src="/Happy_family3.jpg"
            width={1200}
            height={400}
            alt="People smiling, representing satisfied Montra users"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 30%",
              display: "block",
            }}
          />
        </div>

        {/* Testimonial cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "1.125rem",
          }}
        >
          {CARDS.map(({ text, name, role, avatar, highlight }, i) => (
            <div
              key={i}
              style={{
                borderRadius: "var(--r-lg)",
                padding: "clamp(1.5rem,3vw,2.25rem)",
                background: highlight
                  ? "var(--clr-brand)"
                  : "var(--block-sage)",
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {/* Stars */}
              <div style={{ display: "flex", gap: "3px" }}>
                {[...Array(5)].map((_, s) => (
                  <span
                    key={s}
                    style={{
                      color: highlight ? "#E7E1B1" : "var(--clr-brand)",
                      fontSize: "0.875rem",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "clamp(0.9375rem,2vw,1.0625rem)",
                  color: highlight
                    ? "rgba(255,255,255,0.92)"
                    : "var(--clr-text)",
                  lineHeight: 1.65,
                  flex: 1,
                }}
              >
                "{text}"
              </p>

              {/* Author */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: highlight
                      ? "rgba(231,225,177,0.18)"
                      : "var(--clr-brand-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.0625rem",
                    color: highlight ? "#E7E1B1" : "var(--clr-brand)",
                  }}
                >
                  {avatar}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: highlight ? "#fff" : "var(--clr-text)",
                    }}
                  >
                    {name}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "0.8125rem",
                      color: highlight
                        ? "rgba(255,255,255,0.55)"
                        : "var(--clr-text-muted)",
                    }}
                  >
                    {role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
