// ─────────────────────────────────────────────────────────────────
// components/features-1.tsx
// Feature section with live, code-built UI mockups (no images).
// Light/dark is handled with CSS variables, so the mockups switch
// with <html class="dark">, <html data-theme="dark"> or the OS theme.
// ─────────────────────────────────────────────────────────────────
import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Car,
  ChevronDown,
  ChevronRight,
  PiggyBank,
  ShoppingBag,
  Utensils,
} from "lucide-react";

/* ───────────────────────── Data ───────────────────────── */

const C = {
  teal: "#14d9c4",
  blue: "#1e9bff",
  purple: "#7c5cf2",
  violet: "#a98bf7",
  sky: "#5ab8ff",
  cyan: "#27b6ff",
};

const CATS = [
  { name: "Food & Dining", spent: 620, budget: 800, share: 33, color: C.teal },
  { name: "Transport", spent: 370, budget: 500, share: 20, color: C.blue },
  { name: "Housing", spent: 480, budget: 600, share: 26, color: C.purple },
  { name: "Shopping", spent: 210, budget: 400, share: 11, color: C.violet },
  { name: "Entertainment", spent: 120, budget: 200, share: 6, color: C.sky },
  { name: "Other", spent: 60, budget: 150, share: 4, color: C.cyan },
];

const pct = (s: number, b: number) => Math.round((s / b) * 100);
const etb = (n: number) => `ETB ${n.toLocaleString("en-US")}`;

type Visual = "dashboard" | "budget" | "expense";

const FEATURES: {
  tag: string;
  title: string;
  accent: string;
  desc: string;
  cta: string;
  href: string;
  visual: Visual;
}[] = [
  {
    tag: "SMART DASHBOARD",
    title: "Your finances, clear at a glance",
    accent: "at a glance",
    desc: "One screen that tells the full story. Compare budgets vs. actual spending with intuitive charts and a real-time activity feed — no spreadsheets, no confusion.",
    cta: "Explore dashboard",
    href: "/services",
    visual: "dashboard",
  },
  {
    tag: "CATEGORY BUDGETING",
    title: "Set limits. Stay in control.",
    accent: "control.",
    desc: "Create budgets for every spending category. Color-coded progress bars make it effortless to see exactly where you stand — before you overspend.",
    cta: "Set your budgets",
    href: "/services",
    visual: "budget",
  },
  {
    tag: "EXPENSE LOGGING",
    title: "Every transaction. Logged instantly.",
    accent: "instantly.",
    desc: "Add expenses in seconds — name, amount, date, and category. Build a meticulous record that makes year-end reconciliation completely stress-free.",
    cta: "Start tracking",
    href: "/services",
    visual: "expense",
  },
];

/* ───────────────────────── Theme CSS ───────────────────────── */

const DARK_VARS = `
  --fx-bg: linear-gradient(135deg, #04121f 0%, #0a2238 100%);
  --fx-panel: #0a2036;
  --fx-side: #081b2f;
  --fx-field: #0d2a45;
  --fx-line: rgba(120, 190, 255, 0.16);
  --fx-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  --fx-text: #f2f8ff;
  --fx-muted: #8fb2d4;
  --fx-track: rgba(255, 255, 255, 0.1);
  --fx-accent: #19e3cc;
  --fx-active: rgba(25, 227, 204, 0.16);
`;

const CSS = `
.fx {
  --fx-bg: linear-gradient(135deg, #f7fbff 0%, #e8f2fb 100%);
  --fx-panel: #ffffff;
  --fx-side: #f6fafe;
  --fx-field: #ffffff;
  --fx-line: rgba(20, 70, 130, 0.1);
  --fx-shadow: 0 8px 26px rgba(20, 70, 130, 0.09);
  --fx-text: #0b2545;
  --fx-muted: #5f7b9c;
  --fx-track: #e3edf7;
  --fx-accent: #0fb8a6;
  --fx-active: rgba(15, 184, 166, 0.12);
}
:root.dark .fx, :root[data-theme="dark"] .fx { ${DARK_VARS} }
@media (prefers-color-scheme: dark) {
  :root:not(.light):not(.dark):not([data-theme]) .fx { ${DARK_VARS} }
}

.fx-card { display: grid; gap: clamp(1.5rem, 3vw, 2.5rem); align-items: center;
  padding: clamp(1.25rem, 3.5vw, 3rem); border-radius: var(--r-xl, 28px);
  background: var(--fx-bg); border: 1px solid var(--fx-line); overflow: hidden; }
@media (min-width: 960px) { .fx-card { grid-template-columns: minmax(0, 1fr) minmax(0, 2.3fr); } }

.fx-tag { font-family: var(--font-body); font-size: .68rem; font-weight: 700;
  letter-spacing: .12em; color: var(--fx-accent); }
.fx-title { font-family: var(--font-display); font-weight: 700; color: var(--fx-text);
  font-size: clamp(1.6rem, 3vw, 2.35rem); line-height: 1.12; letter-spacing: -.025em; margin: .75rem 0 1rem; }
.fx-title em { font-style: normal; color: var(--fx-accent); }
.fx-desc { font-family: var(--font-body); color: var(--fx-muted); line-height: 1.7;
  font-size: 1rem; max-width: 40ch; margin: 0; }
.fx-cta { display: inline-flex; align-items: center; gap: .4rem; margin-top: 1.5rem;
  font-family: var(--font-body); font-weight: 600; font-size: .9375rem;
  color: var(--fx-accent); text-decoration: none; transition: gap .2s; }
.fx-cta:hover { gap: .7rem; }

/* mockup primitives */
.fx-mock { container-type: inline-size; min-width: 0; font-family: var(--font-body); color: var(--fx-text); }
.fx-panel { background: var(--fx-panel); border: 1px solid var(--fx-line); border-radius: 14px;
  box-shadow: var(--fx-shadow); padding: .9rem; min-width: 0; }
.fx-h { font-weight: 700; font-size: .85rem; margin: 0; }
.fx-sub { font-size: .66rem; color: var(--fx-muted); margin: .15rem 0 0; }
.fx-muted { color: var(--fx-muted); }
.fx-row { display: flex; align-items: center; justify-content: space-between; gap: .5rem; }
.fx-track { height: 6px; border-radius: 99px; background: var(--fx-track); overflow: hidden; }
.fx-track > span { display: block; height: 100%; border-radius: 99px; }
.fx-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
.fx-ico { width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center;
  flex: none; color: #fff; }
.fx-ico.soft { background: var(--fx-active); color: var(--fx-accent); }
.fx-donut { position: relative; flex: none; }
.fx-donut svg { width: 100%; height: 100%; display: block; }
.fx-donut-c { position: absolute; inset: 0; display: grid; place-content: center; text-align: center; }
.fx-donut-c b { font-size: .95rem; }
.fx-donut-c small { font-size: .6rem; color: var(--fx-muted); }
.fx-legend { display: grid; gap: .5rem; font-size: .7rem; flex: 1; min-width: 0; }
.fx-legend > div { display: grid; grid-template-columns: auto 1fr auto auto; gap: .5rem; align-items: center; }
.fx-legend .n { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fx-legend .v { font-variant-numeric: tabular-nums; white-space: nowrap; }
.fx-legend .p { color: var(--fx-muted); min-width: 2.2rem; text-align: right; }

/* dashboard */
.fx-pair { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); gap: .9rem; align-items: stretch; }
.fx-ring { position: relative; width: 138px; height: 138px; margin: 1.1rem auto 1rem; }
.fx-ring svg { width: 100%; height: 100%; display: block; }
.fx-ring > div { position: absolute; inset: 0; display: grid; place-content: center; text-align: center; }
.fx-ring b { font-size: 1.5rem; }
.fx-ring small { font-size: .65rem; color: var(--fx-muted); }
.fx-kv { display: flex; justify-content: space-between; font-size: .8rem; padding: .3rem 0; }
.fx-kv span { color: var(--fx-muted); }
.fx-kv b { font-variant-numeric: tabular-nums; }
.fx-hr { height: 1px; background: var(--fx-line); margin: .5rem 0 .7rem; }
.fx-ok { display: flex; align-items: center; gap: .5rem; font-size: .72rem; font-weight: 600; }
.fx-ok i { width: 8px; height: 8px; border-radius: 50%; background: #3ddc84; }
.fx-top3 { display: grid; gap: .75rem; margin-top: 1rem; }
.fx-top3 > div { display: flex; align-items: center; gap: .7rem; font-size: .8rem; }
.fx-av { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; flex: none;
  background: var(--fx-active); color: var(--fx-accent); font-weight: 700; font-size: .8rem; }
.fx-top3 .t { flex: 1; min-width: 0; font-weight: 600; line-height: 1.25; }
.fx-top3 .t small { display: block; font-weight: 400; font-size: .65rem; color: var(--fx-muted); }
.fx-top3 b { font-variant-numeric: tabular-nums; font-size: .78rem; white-space: nowrap; }
.fx-bars { display: grid; gap: .7rem; margin-top: .8rem; }
.fx-bars .fx-row { font-size: .66rem; margin-bottom: .25rem; }
@container (max-width: 560px) {
  .fx-pair { grid-template-columns: 1fr; }
}

/* budget */
.fx-two { display: grid; grid-template-columns: 1.15fr 1fr; gap: .9rem; }
.fx-bud { display: flex; align-items: center; gap: 1rem; margin-top: 1rem; }
@container (max-width: 640px) {
  .fx-two { grid-template-columns: 1fr; }
  .fx-bud { flex-direction: column; align-items: stretch; }
  .fx-bud .fx-donut { align-self: center; }
}

/* expense */
.fx-exp { display: grid; grid-template-columns: 1fr 1.05fr .8fr; gap: .9rem; align-items: center; }
.fx-tx { display: flex; align-items: center; gap: .6rem; background: var(--fx-panel); border: 1px solid var(--fx-line);
  border-radius: 12px; padding: .65rem .75rem; box-shadow: var(--fx-shadow); font-size: .7rem; }
.fx-tx + .fx-tx { margin-top: .6rem; }
.fx-tx .t { flex: 1; min-width: 0; }
.fx-tx b { display: block; font-size: .95rem; }
.fx-tx small { color: var(--fx-muted); font-size: .6rem; }
.fx-form { background: var(--fx-panel); border: 1px solid var(--fx-line); border-radius: 18px; box-shadow: var(--fx-shadow); overflow: hidden; }
.fx-form header { display: flex; align-items: center; justify-content: space-between; padding: .8rem .9rem; font-weight: 700; font-size: .85rem; border-bottom: 1px solid var(--fx-line); }
.fx-form header span { display: flex; align-items: center; gap: .6rem; }
.fx-form .body { padding: .8rem .9rem 1rem; display: grid; gap: .6rem; }
.fx-form label { font-size: .62rem; color: var(--fx-muted); display: grid; gap: .25rem; }
.fx-field { display: flex; align-items: center; gap: .4rem; font-size: .72rem; color: var(--fx-text);
  background: var(--fx-field); border: 1px solid var(--fx-line); border-radius: 8px; padding: .5rem .6rem; }
.fx-field .end { margin-left: auto; color: var(--fx-muted); }
.fx-save { text-align: center; font-weight: 600; font-size: .75rem; color: #fff; padding: .6rem; border-radius: 9px;
  background: linear-gradient(90deg, #0fb5b0, #17d4b8); margin-top: .2rem; }
.fx-side-col { display: grid; gap: .8rem; justify-items: center; }
.fx-side-col .fx-panel { width: 100%; }
.fx-side-col b { font-size: 1.15rem; display: block; }

@container (max-width: 720px) {
  .fx-exp { grid-template-columns: 1fr 1fr; }
  .fx-side-col { display: none; }
}
@container (max-width: 460px) {
  .fx-exp { grid-template-columns: 1fr; }
}
`;

/* ───────────────────────── Mockup parts ───────────────────────── */

function Donut({
  size,
  children,
}: {
  size: number;
  children?: React.ReactNode;
}) {
  let acc = 0;
  return (
    <div className="fx-donut" style={{ width: size, height: size }}>
      <svg viewBox="0 0 42 42" aria-hidden="true">
        {CATS.map((c) => {
          const dash = Math.max(c.share - 1, 0.5);
          const el = (
            <circle
              key={c.name}
              cx="21"
              cy="21"
              r="15.915"
              fill="none"
              stroke={c.color}
              strokeWidth="5"
              strokeDasharray={`${dash} ${100 - dash}`}
              strokeDashoffset={-acc}
              transform="rotate(-90 21 21)"
            />
          );
          acc += c.share;
          return el;
        })}
      </svg>
      <div className="fx-donut-c">{children}</div>
    </div>
  );
}

function Spark({ w = 70, h = 26 }: { w?: number; h?: number }) {
  return (
    <svg width={w} height={h} viewBox="0 0 70 26" fill="none" aria-hidden="true">
      <polyline
        points="0,20 10,14 18,18 28,10 38,15 48,8 58,12 70,3"
        stroke="var(--fx-accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Bars({ count = 4 }: { count?: number }) {
  return (
    <div className="fx-bars">
      {CATS.slice(0, count).map((c) => (
        <div key={c.name}>
          <div className="fx-row">
            <span>{c.name}</span>
            <span className="fx-muted">
              {etb(c.spent)} / {c.budget.toLocaleString("en-US")}
            </span>
          </div>
          <div className="fx-track">
            <span style={{ width: `${pct(c.spent, c.budget)}%`, background: c.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────────── Mockups ───────────────────────── */

function DashboardMock() {
  const top = [
    ["Rent", "house", 12000],
    ["Groceries", "food", 8400],
    ["Taxi rides", "transport", 4100],
    ["Ethio telecom", "utilities", 1500],
  ] as const;

  return (
    <div className="fx-pair">
      <div className="fx-panel" style={{ padding: "1.1rem" }}>
        <div className="fx-row" style={{ alignItems: "flex-start" }}>
          <div>
            <h5 className="fx-h" style={{ fontSize: "1rem" }}>Monthly target</h5>
            <p className="fx-sub">This month against your total budget</p>
          </div>
          <PiggyBank size={16} className="fx-muted" />
        </div>

        <div className="fx-ring">
          <svg viewBox="0 0 42 42" aria-hidden="true">
            <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--fx-track)" strokeWidth="2.6" />
            <circle
              cx="21" cy="21" r="15.915" fill="none" stroke="var(--fx-accent)" strokeWidth="2.6"
              strokeLinecap="round" strokeDasharray="62 38" transform="rotate(-90 21 21)"
            />
          </svg>
          <div>
            <b>62%</b>
            <small>of budget</small>
          </div>
        </div>

        <div className="fx-kv"><span>Spent</span><b>ETB 31,000</b></div>
        <div className="fx-kv"><span>Budget</span><b>ETB 50,000</b></div>
        <div className="fx-hr" />
        <div className="fx-ok"><i /> On track</div>
      </div>

      <div className="fx-panel" style={{ padding: "1.1rem" }}>
        <div className="fx-row" style={{ alignItems: "flex-start" }}>
          <h5 className="fx-h" style={{ fontSize: "1rem" }}>Top expenses</h5>
          <span className="fx-sub" style={{ color: "var(--fx-accent)", margin: 0 }}>View all →</span>
        </div>
        <p className="fx-sub">Your largest spends this period.</p>
        <div className="fx-top3">
          {top.map(([name, cat, amt]) => (
            <div key={name}>
              <span className="fx-av">{name[0]}</span>
              <span className="t">{name}<small>{cat}</small></span>
              <b>{etb(amt)}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BudgetMock() {
  return (
    <div className="fx-two">
      <div className="fx-panel" style={{ padding: "1.1rem" }}>
        <div className="fx-row" style={{ justifyContent: "flex-start", gap: ".7rem" }}>
          <CalendarDays size={22} color="var(--fx-accent)" />
          <div>
            <h5 className="fx-h" style={{ fontSize: "1rem" }}>Monthly Budget</h5>
            <p className="fx-sub">Oct 1, 2025 – Oct 31, 2025</p>
          </div>
        </div>
        <div className="fx-bud">
          <Donut size={132}>
            <b style={{ fontSize: "1rem" }}>ETB 2,850</b>
            <small>Total Budget</small>
          </Donut>
          <div className="fx-legend">
            {CATS.map((c) => (
              <div key={c.name}>
                <i className="fx-dot" style={{ background: c.color }} />
                <span className="n">{c.name}</span>
                <span className="v">{etb(c.spent)} / {c.budget.toLocaleString("en-US")}</span>
                <span className="p">{pct(c.spent, c.budget)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fx-panel" style={{ padding: "1.1rem" }}>
        <div className="fx-row" style={{ justifyContent: "flex-start", gap: ".6rem" }}>
          <BarChart3 size={18} color="var(--fx-accent)" />
          <h5 className="fx-h" style={{ fontSize: "1rem" }}>Budget Progress</h5>
        </div>
        <Bars />
      </div>
    </div>
  );
}

function ExpenseMock() {
  const tx = [
    [Utensils, "Lunch", "ETB 12.50", "Oct 28, 2025 • Food & Dining", C.teal],
    [Car, "Uber", "ETB 8.75", "Oct 27, 2025 • Transport", C.blue],
    [ShoppingBag, "Groceries", "ETB 34.20", "Oct 26, 2025 • Shopping", C.purple],
  ] as const;

  return (
    <div className="fx-exp">
      <div>
        {tx.map(([Icon, name, amt, meta, color]) => (
          <div className="fx-tx" key={name}>
            <span className="fx-ico" style={{ background: color }}><Icon size={15} /></span>
            <span className="t">
              {name}
              <b>{amt}</b>
              <small>{meta}</small>
            </span>
            <ChevronRight size={14} className="fx-muted" />
          </div>
        ))}
      </div>

      <div className="fx-form">
        <header>
          <span><ArrowLeft size={14} /> Add Expense</span>
          <CalendarDays size={14} color="var(--fx-accent)" />
        </header>
        <div className="body">
          <label>Name<div className="fx-field">Office Supplies</div></label>
          <label>Amount<div className="fx-field">ETB 45.00</div></label>
          <label>
            Date
            <div className="fx-field">
              <CalendarDays size={13} color="var(--fx-accent)" /> Oct 28, 2025
            </div>
          </label>
          <label>
            Category
            <div className="fx-field">
              <Utensils size={13} color="var(--fx-accent)" /> Food &amp; Dining
              <ChevronDown size={13} className="end" />
            </div>
          </label>
          <div className="fx-save">Save Expense</div>
        </div>
      </div>

      <div className="fx-side-col">
        <div className="fx-panel">
          <span className="fx-sub">This Month</span>
          <b>ETB 245.60</b>
          <small style={{ fontSize: ".62rem", color: "var(--fx-accent)" }}>↑ 12%</small>
          <div style={{ marginTop: ".4rem" }}><Spark w={110} h={36} /></div>
        </div>
        <svg width="90" height="110" viewBox="0 0 90 110" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="fx-leaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#19e3cc" />
              <stop offset="1" stopColor="#0a8fa8" />
            </linearGradient>
          </defs>
          <path d="M48 104C40 70 46 36 76 8c10 34 0 70-28 96Z" fill="url(#fx-leaf)" opacity=".9" />
          <path d="M44 100C26 84 12 62 14 40c24 8 38 32 30 60Z" fill="url(#fx-leaf)" opacity=".7" />
        </svg>
      </div>
    </div>
  );
}

const VISUALS: Record<Visual, () => React.ReactElement> = {
  dashboard: DashboardMock,
  budget: BudgetMock,
  expense: ExpenseMock,
};

const LABELS: Record<Visual, string> = {
  dashboard: "Preview of the Montra dashboard with income, spending, budget and recent activity",
  budget: "Preview of category budgets with a donut chart and progress bars",
  expense: "Preview of the add expense form and recent transactions",
};

/* ───────────────────────── Section ───────────────────────── */

export default function Features() {
  return (
    <section
      id="services"
      className="fx"
      style={{
        background: "var(--background)",
        padding: "clamp(4rem, 7vw, 7rem) 0",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div
        style={{
          maxWidth: "78rem",
          margin: "0 auto",
          padding: "0 clamp(1.25rem,5vw,3rem)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 5vw, 4.5rem)" }}>
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
            <em style={{ fontStyle: "italic", color: "var(--clr-brand)" }}>Go financial.</em>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {FEATURES.map((f) => {
            const Visual = VISUALS[f.visual];
            const [before, after] = f.title.split(f.accent);
            return (
              <article className="fx-card" key={f.tag}>
                <div>
                  <span className="fx-tag">{f.tag}</span>
                  <h3 className="fx-title">
                    {before}
                    <em>{f.accent}</em>
                    {after}
                  </h3>
                  <p className="fx-desc">{f.desc}</p>
                  <Link href={f.href} className="fx-cta">
                    {f.cta} <ArrowRight size={15} />
                  </Link>
                </div>

                <div className="fx-mock" role="img" aria-label={LABELS[f.visual]}>
                  <Visual />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}