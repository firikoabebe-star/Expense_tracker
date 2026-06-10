"use client";
// ─────────────────────────────────────────────────────────────────
// components/footer.jsx
// grey.co pattern:
//   • Dark green (#0D530E) background — full-bleed
//   • Logo + tagline column, 4 link columns, newsletter column
//   • Bottom bar: copyright left, legal links right
// ─────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Instagram, Youtube, Twitter } from "lucide-react";

const COLS = {
  Product: [
    ["Features", "/services"],
    ["Pricing", "/pricing"],
    ["About", "/about"],
    ["Developers", "/developers"],
  ],
  Company: [
    ["Blog", "#"],
    ["Careers", "#"],
    ["Press", "#"],
    ["Contact", "#"],
  ],
  Resources: [
    ["Help Center", "#"],
    ["FAQ", "#"],
    ["Video Guides", "#"],
    ["Status", "#"],
  ],
  Legal: [
    ["Privacy Policy", "#"],
    ["Terms of Service", "#"],
    ["Cookie Policy", "#"],
  ],
};

const SOCIALS = [
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Youtube, href: "#", label: "YouTube" },
  { Icon: Twitter, href: "#", label: "Twitter" },
];

export default function FooterSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSub = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSent(true);
      setEmail("");
    }
  };

  const linkStyle = {
    fontFamily: "var(--font-body)",
    fontWeight: 300,
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.55)",
    textDecoration: "none",
    transition: "color 0.15s",
  };

  return (
    <footer style={{ background: "var(--clr-brand)" }}>
      <div
        style={{
          maxWidth: "78rem",
          margin: "0 auto",
          padding: "clamp(3rem,5vw,4.5rem) clamp(1.25rem,5vw,3rem) 0",
        }}
      >
        {/* ── Top grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "clamp(2rem,4vw,3.5rem)",
            paddingBottom: "clamp(2.5rem,4vw,4rem)",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
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
                  background: "#E7E1B1",
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
                E
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#E7E1B1",
                }}
              >
                Montra
              </span>
            </div>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.875rem",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.7,
                maxWidth: "22ch",
                marginBottom: "1.375rem",
              }}
            >
              Smart budgeting for everyone. Take control of your money today.
            </p>

            {/* Socials */}
            <div style={{ display: "flex", gap: "0.625rem" }}>
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.55)",
                    textDecoration: "none",
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.15)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(COLS).map(([cat, links]) => (
            <div key={cat}>
              <h4
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
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
                      style={linkStyle}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
                      }
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
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "1.25rem",
              }}
            >
              STAY UPDATED
            </h4>
            {sent ? (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "#a8e6a9",
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
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.07)",
                    color: "#fff",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    outline: "none",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(231,225,177,0.5)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.15)")
                  }
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
                    background: "#E7E1B1",
                    color: "var(--clr-brand)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Subscribe <ArrowRight size={13} />
                </button>
              </form>
            )}

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.3)",
                marginTop: "0.75rem",
                lineHeight: 1.6,
              }}
            >
              By subscribing, you agree to our Privacy Policy. Unsubscribe
              anytime.
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
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            © {new Date().getFullYear()} Montra. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.375rem", flexWrap: "wrap" }}>
            {["Privacy", "Terms", "Cookies"].map((t) => (
              <Link
                key={t}
                href="#"
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.3)",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.65)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.3)")
                }
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
