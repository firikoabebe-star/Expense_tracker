"use client";
// ─────────────────────────────────────────────────────────────────
// components/LandingNavbar.jsx
// grey.co pattern: transparent navbar that becomes frosted-glass
// on scroll. Pill "Get started" CTA. Ghost "Login" link.
// Mobile: slide-in drawer from the right.
// ─────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Developers", href: "/developers" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const close = () => setDrawerOpen(false);

  // ── Shared link style helpers ──
  const navLinkBase = {
    fontFamily: "var(--font-body)",
    fontSize: "0.9375rem",
    fontWeight: 400,
    color: "var(--clr-text-2)",
    textDecoration: "none",
    transition: "color 0.15s",
  };

  return (
    <>
      {/* ═══════════════ HEADER ═══════════════ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 66,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1.25rem, 5vw, 3rem)",
          transition:
            "background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
          background: scrolled ? "rgba(255,255,255,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px) saturate(180%)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--clr-border)"
            : "1px solid transparent",
        }}
        className="dark:[background:rgba(10,26,11,0.88)]"
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          aria-label="Montra home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          {/* Logomark */}
          <span
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "var(--clr-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E7E1B1",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 15,
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(13,83,14,0.30)",
            }}
          >
            M
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "1.0625rem",
              color: "var(--clr-text)",
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ color: "var(--clr-brand)" }}>Montra</span>
          </span>
        </Link>

        {/* ── Desktop Nav (hidden < 1024px) ── */}
        <nav
          aria-label="Main"
          style={{ alignItems: "center", gap: "2rem" }}
          className="hidden lg:flex"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={navLinkBase}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--clr-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--clr-text-2)")
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* ── Desktop Actions (hidden < 1024px) ── */}
          <div
            className="hidden lg:flex"
            style={{ alignItems: "center", gap: "0.375rem" }}
          >
            <Link
              href="/sign-in"
              style={{
                ...navLinkBase,
                padding: "0.4rem 0.9rem",
                borderRadius: "var(--r-pill)",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--block-sage)";
                e.currentTarget.style.color = "var(--clr-brand)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--clr-text-2)";
              }}
            >
              Log in
            </Link>

            <Link
              href="/sign-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.5rem 1.25rem",
                borderRadius: "var(--r-pill)",
                background: "var(--clr-brand)",
                color: "#fff",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "0.9rem",
                textDecoration: "none",
                boxShadow: "0 2px 12px rgba(13,83,14,0.28)",
                transition:
                  "background 0.15s, transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--clr-brand-mid)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 18px rgba(13,83,14,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--clr-brand)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 12px rgba(13,83,14,0.28)";
              }}
            >
              Get started — it's free
            </Link>
          </div>

          <ModeToggle />

          {/* Hamburger — visible < 1024px */}
          <button
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="flex lg:hidden"
            style={{
              width: 38,
              height: 38,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              border: "1.5px solid var(--clr-border)",
              background: "transparent",
              color: "var(--clr-text)",
              cursor: "pointer",
            }}
          >
            {drawerOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </header>

      {/* ═══════════════ MOBILE BACKDROP ═══════════════ */}
      {drawerOpen && (
        <div
          onClick={close}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 98,
            background: "rgba(0,0,0,0.22)",
            backdropFilter: "blur(3px)",
            animation: "et-fade-in 0.2s ease both",
          }}
        />
      )}

      {/* ═══════════════ MOBILE DRAWER ═══════════════ */}
      <aside
        aria-hidden={!drawerOpen}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(310px, 90vw)",
          zIndex: 99,
          background: "var(--clr-bg)",
          borderLeft: "1px solid var(--clr-border)",
          padding: "5rem 1.75rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s var(--ease-spring)",
          boxShadow: drawerOpen ? "var(--shadow-xl)" : "none",
          overflowY: "auto",
        }}
      >
        {NAV_LINKS.map(({ label, href }, i) => (
          <Link
            key={label}
            href={href}
            onClick={close}
            style={{
              display: "block",
              padding: "0.75rem 1rem",
              borderRadius: 12,
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "1.0625rem",
              color: "var(--clr-text)",
              textDecoration: "none",
              transition: "background 0.15s, color 0.15s",
              animationDelay: `${i * 40}ms`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--block-sage)";
              e.currentTarget.style.color = "var(--clr-brand)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--clr-text)";
            }}
          >
            {label}
          </Link>
        ))}

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "0.625rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--clr-border)",
          }}
        >
          <Link
            href="/sign-up"
            onClick={close}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.75rem",
              borderRadius: "var(--r-pill)",
              background: "var(--clr-brand)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.9375rem",
              textDecoration: "none",
              boxShadow: "0 2px 12px rgba(13,83,14,0.28)",
            }}
          >
            Get started — it's free
          </Link>
          <Link
            href="/sign-in"
            onClick={close}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.75rem",
              borderRadius: "var(--r-pill)",
              border: "1.5px solid var(--clr-border-mid)",
              color: "var(--clr-text)",
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: "0.9375rem",
              textDecoration: "none",
            }}
          >
            Log in
          </Link>
        </div>
      </aside>
    </>
  );
}
