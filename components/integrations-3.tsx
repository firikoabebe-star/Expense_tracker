"use client";
// ─────────────────────────────────────────────────────────────────
// components/integrations-3.tsx
// "A truly complete expense account" section.
//   • Left: code-built account mockup (no image), light/dark aware
//   • Right: eyebrow, headline, copy, CTA, numbered list (unchanged)
// ─────────────────────────────────────────────────────────────────
import React from "react";
import Link from "next/link";
import {
  Bell,
  FileSpreadsheet,
  Plus,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const POINTS = [
  "Zero account & card maintenance fees",
  "Real-time budget tracking",
  "Instant expense notifications",
  "Unlimited budget categories",
  "CSV & Excel data export",
  "Visual analytics & spending insights",
];

const CATS = [
  { name: "Food & Dining", pct: 78, color: "#14d9c4" },
  { name: "Transport", pct: 74, color: "#1e9bff" },
  { name: "Housing", pct: 80, color: "#7c5cf2" },
];

const WEEK = [
  { d: "M", h: 38 },
  { d: "T", h: 62 },
  { d: "W", h: 34 },
  { d: "T", h: 78 },
  { d: "F", h: 52 },
  { d: "S", h: 92 },
  { d: "S", h: 44 },
];

/* ───────────── Theme CSS (light + dark) ───────────── */

const DARK_VARS = `
  --ix-bg: linear-gradient(135deg, #04121f 0%, #0a2238 100%);
  --ix-panel: #0a2036;
  --ix-soft: #0d2a45;
  --ix-line: rgba(120, 190, 255, 0.16);
  --ix-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  --ix-text: #f2f8ff;
  --ix-muted: #8fb2d4;
  --ix-track: rgba(255, 255, 255, 0.1);
  --ix-accent: #19e3cc;
  --ix-active: rgba(25, 227, 204, 0.16);
`;

const CSS = `
.ix {
  --ix-bg: linear-gradient(135deg, #f7fbff 0%, #e8f2fb 100%);
  --ix-panel: #ffffff;
  --ix-soft: #f3f8fd;
  --ix-line: rgba(20, 70, 130, 0.1);
  --ix-shadow: 0 10px 28px rgba(20, 70, 130, 0.12);
  --ix-text: #0b2545;
  --ix-muted: #5f7b9c;
  --ix-track: #e3edf7;
  --ix-accent: #0fb8a6;
  --ix-active: rgba(15, 184, 166, 0.12);
}
:root.dark .ix, :root[data-theme="dark"] .ix { ${DARK_VARS} }
@media (prefers-color-scheme: dark) {
  :root:not(.light):not(.dark):not([data-theme]) .ix { ${DARK_VARS} }
}

.ix { position: relative; margin-bottom: 1rem; font-family: var(--font-body); color: var(--ix-text); }
.ix-stage { padding: clamp(1.1rem, 3vw, 1.75rem) clamp(.9rem, 3vw, 1.5rem) 2.4rem;
  border-radius: var(--r-xl, 28px); background: var(--ix-bg); border: 1px solid var(--ix-line); }
.ix-card { background: var(--ix-panel); border: 1px solid var(--ix-line); border-radius: 18px;
  box-shadow: var(--ix-shadow); padding: 1.1rem; display: grid; gap: 1rem; }
.ix-row { display: flex; align-items: center; justify-content: space-between; gap: .6rem; }
.ix-title { display: flex; align-items: center; gap: .55rem; font-weight: 700; font-size: .95rem; }
.ix-ico { width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center;
  background: var(--ix-active); color: var(--ix-accent); flex: none; }
.ix-badge { display: inline-flex; align-items: center; gap: .3rem; font-size: .62rem; font-weight: 600;
  padding: .25rem .5rem; border-radius: 99px; background: var(--ix-active); color: var(--ix-accent); }
.ix-sub { font-size: .66rem; color: var(--ix-muted); }
.ix-bal b { display: block; font-size: 1.6rem; letter-spacing: -.02em; line-height: 1.1; }
.ix-sec { background: var(--ix-soft); border: 1px solid var(--ix-line); border-radius: 12px; padding: .8rem; }
.ix-sec h6 { margin: 0 0 .6rem; font-size: .72rem; font-weight: 700; display: flex; justify-content: space-between; }
.ix-sec h6 span { color: var(--ix-accent); font-weight: 600; }
.ix-track { height: 6px; border-radius: 99px; background: var(--ix-track); overflow: hidden; }
.ix-track > span { display: block; height: 100%; border-radius: 99px; }
.ix-cat { display: grid; gap: .3rem; font-size: .68rem; }
.ix-cats { display: grid; gap: .65rem; }
.ix-new { display: inline-flex; align-items: center; gap: .3rem; margin-top: .7rem; font-size: .64rem;
  color: var(--ix-muted); border: 1px dashed var(--ix-line); border-radius: 99px; padding: .25rem .6rem; }
.ix-bars { display: flex; align-items: flex-end; justify-content: space-between; gap: .4rem; height: 74px; }
.ix-bars > div { flex: 1; display: grid; gap: .3rem; justify-items: center; align-content: end; height: 100%;
  font-size: .58rem; color: var(--ix-muted); }
.ix-bars i { width: 100%; max-width: 22px; border-radius: 6px 6px 3px 3px; background: var(--ix-track); }
.ix-bars i.hi { background: linear-gradient(180deg, #19e3cc, #0fa8b8); }

/* decoration beside the text column (outside the card) */
.ixd { position: absolute; pointer-events: none; display: none; }
@media (min-width: 1100px) { .ixd { display: block; } }
.ixd-dots { top: 0; right: .25rem; width: 88px; height: 77px; opacity: .45;
  background-image: radial-gradient(#14d9c4 1.6px, transparent 1.9px); background-size: 14px 14px; }
.ixd-leaf-sm { top: 6rem; right: 1.5rem; opacity: .6; transform: rotate(18deg); }
.ixd-leaf { bottom: 0; right: 0; }

.ix-float { position: absolute; background: var(--ix-panel); border: 1px solid var(--ix-line);
  box-shadow: var(--ix-shadow); border-radius: 14px; display: flex; align-items: center; gap: .65rem; }
.ix-notif { top: -14px; right: -12px; padding: .65rem .85rem; width: min(220px, 70%); }
.ix-notif b { display: block; font-size: .72rem; }
.ix-notif small { font-size: .62rem; color: var(--ix-muted); }
.ix-export { bottom: -16px; left: -12px; padding: .65rem .9rem; }
.ix-export b { display: block; font-size: .72rem; }
.ix-export small { font-size: .62rem; color: var(--ix-muted); }
`;

function Spark() {
  return (
    <svg width="84" height="30" viewBox="0 0 84 30" fill="none" aria-hidden="true">
      <polyline
        points="0,24 12,17 22,21 34,11 46,17 58,8 70,13 84,3"
        stroke="var(--ix-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Leaf({ id, w, h }: { id: string; w: number; h: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 90 110" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#19e3cc" />
          <stop offset="1" stopColor="#0a8fa8" />
        </linearGradient>
      </defs>
      <path d="M48 104C40 70 46 36 76 8c10 34 0 70-28 96Z" fill={`url(#${id})`} opacity=".92" />
      <path d="M44 100C26 84 12 62 14 40c24 8 38 32 30 60Z" fill={`url(#${id})`} opacity=".72" />
      <path d="M47 106c4-26 14-52 30-96" stroke="#e8fffb" strokeOpacity=".35" strokeWidth="1" />
    </svg>
  );
}

function AccountMock() {
  return (
    <div className="ix" role="img" aria-label="Preview of an expense account with balance, budget tracking, categories, weekly spending, notifications and export">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="ix-stage">
        <div className="ix-card">
          <div className="ix-row">
            <div className="ix-title">
              <span className="ix-ico"><Wallet size={16} /></span>
              Expense account
            </div>
          </div>

          <div className="ix-row">
            <div className="ix-bal">
              <span className="ix-sub">Available balance</span>
              <b>ETB 84,250</b>
              <span className="ix-badge" style={{ marginTop: ".5rem" }}>
                <ShieldCheck size={11} /> Zero fees
              </span>
            </div>
            <Spark />
          </div>

          <div className="ix-sec">
            <h6>
              Monthly budget <span>62%</span>
            </h6>
            <div className="ix-track">
              <span style={{ width: "62%", background: "linear-gradient(90deg,#14d9c4,#1e9bff)" }} />
            </div>
            <div className="ix-row ix-sub" style={{ marginTop: ".45rem" }}>
              <span>ETB 31,000 spent</span>
              <span>ETB 50,000</span>
            </div>
          </div>

          <div className="ix-sec">
            <h6>Categories</h6>
            <div className="ix-cats">
              {CATS.map((c) => (
                <div className="ix-cat" key={c.name}>
                  <div className="ix-row">
                    <span>{c.name}</span>
                    <span className="ix-sub">{c.pct}%</span>
                  </div>
                  <div className="ix-track">
                    <span style={{ width: `${c.pct}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
            <span className="ix-new"><Plus size={11} /> Add category</span>
          </div>

          <div className="ix-sec">
            <h6>
              This week <span>Insights</span>
            </h6>
            <div className="ix-bars">
              {WEEK.map((w, i) => (
                <div key={i}>
                  <i className={w.h === 92 ? "hi" : ""} style={{ height: `${w.h}%` }} />
                  {w.d}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Floating: instant notification */}
      <div className="ix-float ix-notif">
        <span className="ix-ico"><Bell size={15} /></span>
        <span>
          <b>Expense logged</b>
          <small>Lunch · ETB 250 · just now</small>
        </span>
      </div>

      {/* Floating: export */}
      <div className="ix-float ix-export">
        <span className="ix-ico"><FileSpreadsheet size={15} /></span>
        <span>
          <b>Export data</b>
          <small>CSV · Excel</small>
        </span>
      </div>

      {/* Floating: satisfaction chip */}
      <div
        style={{
          position: "absolute",
          bottom: -16,
          right: -12,
          background: "var(--card)",
          borderRadius: 16,
          padding: "1rem 1.375rem",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "2rem",
            color: "var(--clr-brand)",
            lineHeight: 1,
            margin: 0,
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
            marginBottom: 0,
          }}
        >
          user satisfaction
        </p>
      </div>
    </div>
  );
}

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
        {/* ── Left: Account mockup ── */}
        <AccountMock />

        {/* ── Right: Text ── */}
        <div style={{ position: "relative" }}>
          <span className="ixd ixd-dots" aria-hidden="true" />
          <span className="ixd ixd-leaf-sm" aria-hidden="true">
            <Leaf id="ixd-leaf-a" w={64} h={78} />
          </span>
          <span className="ixd ixd-leaf" aria-hidden="true">
            <Leaf id="ixd-leaf-b" w={112} h={136} />
          </span>

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
              color: "var(--primary-foreground)",
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

          {/* Numbered list */}
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