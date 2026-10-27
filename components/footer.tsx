"use client";
// ─────────────────────────────────────────────────────────────────
// components/footer.jsx
// grey.co pattern:
//   • Brand surface — full-bleed (solid card surface in dark mode)
//   • Logo + tagline column, 3 link columns, newsletter column
//   • Bottom bar: copyright left, legal links right
// ─────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const COLS = {
  Product: [
    ["Features", "/services"],
    ["Pricing", "/pricing"],
    ["About", "/about"],
    ["Developers", "/developers"],
  ],
  Resources: [
    ["Help Center", "/help"],
    ["FAQ", "/help"],
    ["Contact", "/contact"],
  ],
  Legal: [
    ["Privacy Policy", "/privacy"],
    ["Terms of Service", "/terms"],
    ["Cookie Policy", "/privacy#cookies"],
  ],
};

export default function FooterSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSub = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      setSent(true);
      setEmail("");
    }
  };

  return (
    <footer className="surface-inverse">
      <div
        style={{
          maxWidth: "78rem",
          margin: "0 auto",
          padding: "clamp(3rem,5vw,4.5rem) clamp(1.25rem,5vw,3rem) 0",
        }}
      >
        {/* ── Top grid ── */}
        <div
          className="border-on-inverse"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "clamp(2rem,4vw,3.5rem)",
            paddingBottom: "clamp(2.5rem,4vw,4rem)",
            borderBottomWidth: 1,
            borderBottomStyle: "solid",
          }}
        >
          {/* Brand col */}
          <div style={{ gridColumn: "span 1" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: "var(--clr-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--clr-brand)",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                M
              </div>
              <span
                className="text-on-inverse-accent"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Montra
              </span>
            </div>

            <p
              className="text-on-inverse-muted"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.875rem",
                lineHeight: 1.7,
                maxWidth: "22ch",
                marginBottom: "1.375rem",
              }}
            >
              Smart budgeting for everyone. Take control of your money today.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(COLS).map(([cat, links]) => (
            <div key={cat}>
              <h4
                className="text-on-inverse-accent"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "1.25rem",
                }}
              >
                {cat}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.7rem",
                }}
              >
                {links.map(([name, href]) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="on-inverse-link"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 300,
                        fontSize: "0.9rem",
                      }}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4
              className="text-on-inverse-accent"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1.25rem",
              }}
            >
              STAY UPDATED
            </h4>
            {sent ? (
              <p
                className="text-on-inverse-accent"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                ✓ You're subscribed!
              </p>
            ) : (
              <form
                onSubmit={handleSub}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    padding: "0.625rem 0.875rem",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.375rem",
                    padding: "0.625rem",
                    borderRadius: 10,
                    border: "none",
                    background: "var(--clr-accent)",
                    color: "var(--clr-brand)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "var(--clr-brand-light)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--clr-accent)")
                  }
                >
                  Subscribe <ArrowRight size={13} />
                </button>
              </form>
            )}

            <p
              className="text-on-inverse-muted"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.75rem",
                marginTop: "0.75rem",
                lineHeight: 1.6,
              }}
            >
              By subscribing, you agree to our{" "}
              <Link
                href="/privacy"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                Privacy Policy
              </Link>
              . Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            padding: "1.5rem 0",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.875rem",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            className="text-on-inverse-muted"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "0.8rem",
            }}
          >
            © {new Date().getFullYear()} Montra. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.375rem", flexWrap: "wrap" }}>
            {[
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
              ["Cookies", "/privacy#cookies"],
            ].map(([t, href]) => (
              <Link
                key={t}
                href={href}
                className="on-inverse-link"
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "0.8rem",
                }}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
