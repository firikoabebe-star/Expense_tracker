"use client";
// ─────────────────────────────────────────────────────────────────
// app/developers/page.jsx
// grey.co aesthetic applied to a dev-focused page:
//   • White canvas  |  dark terminal panel as hero image element
//   • Soft colored feature chip cards
//   • Language-tabbed code block with copy button
//   • Endpoint reference table
// ─────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Copy,
  Check,
  Code2,
  Zap,
  Lock,
  GitBranch,
  BookOpen,
  Terminal,
  ChevronRight,
} from "lucide-react";
import LandingNavbar from "/components/LandingNavbar";
import FooterSection from "/components/footer";

/* ── Code samples ──────────────────────────────── */
const SAMPLES = {
  "Node.js": `import Montra from '@montra/sdk';

const client = new Montra({
  apiKey: process.env.EXPENSE_API_KEY,
});

// Fetch all budgets
const budgets = await client.budgets.list();

// Log an expense
const expense = await client.expenses.create({
  budgetId: 'bgt_abc123',
  name:      'Grocery run',
  amount:    42.50,
  date:      new Date().toISOString(),
});

console.log(expense.id); // exp_xyz789`,

  Python: `from montra import Montra

client = Montra(api_key=os.environ["EXPENSE_API_KEY"])

# Fetch all budgets
budgets = client.budgets.list()

# Log an expense
expense = client.expenses.create(
    budget_id="bgt_abc123",
    name="Grocery run",
    amount=42.50,
    date=datetime.now().isoformat(),
)
print(expense.id)  # exp_xyz789`,

  cURL: `curl -X POST https://api.montra.app/v1/expenses \\
  -H "Authorization: Bearer $EXPENSE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "budget_id": "bgt_abc123",
    "name":      "Grocery run",
    "amount":    42.50,
    "date":      "2026-06-01T14:30:00Z"
  }'`,
};

const ENDPOINTS = [
  {
    m: "GET",
    p: "/v1/budgets",
    d: "List all budgets for the authenticated user",
  },
  {
    m: "POST",
    p: "/v1/budgets",
    d: "Create a new budget with name, amount, and category",
  },
  { m: "GET", p: "/v1/budgets/:id", d: "Retrieve a single budget by ID" },
  { m: "PUT", p: "/v1/budgets/:id", d: "Update budget name or spending limit" },
  {
    m: "DELETE",
    p: "/v1/budgets/:id",
    d: "Delete a budget and all linked expenses",
  },
  {
    m: "GET",
    p: "/v1/expenses",
    d: "List expenses, filterable by budget or date range",
  },
  { m: "POST", p: "/v1/expenses", d: "Log a new expense linked to a budget" },
  { m: "DELETE", p: "/v1/expenses/:id", d: "Remove a specific expense entry" },
];

const METHOD_COLOR: Record<string, { bg: string; clr: string }> = {
  GET: { bg: "rgba(13,83,14,0.10)", clr: "#0D530E" },
  POST: { bg: "rgba(48,109,41,0.10)", clr: "#306D29" },
  PUT: { bg: "rgba(160,120,0,0.10)", clr: "#7a5a00" },
  DELETE: { bg: "rgba(180,30,30,0.10)", clr: "#a00" },
};

const CHIPS = [
  {
    icon: Zap,
    title: "REST & Webhooks",
    desc: "Clean RESTful endpoints + real-time webhook events for budget and threshold alerts.",
  },
  {
    icon: Lock,
    title: "Secure by Default",
    desc: "Bearer token auth, HTTPS-only, scoped API keys with read/write permission control.",
  },
  {
    icon: GitBranch,
    title: "Versioned API",
    desc: "Stable /v1 with a clear deprecation policy — we never silently break integrations.",
  },
  {
    icon: BookOpen,
    title: "Full Docs",
    desc: "Interactive explorer, SDK guides, and runnable examples for every endpoint.",
  },
];

export default function DevelopersPage() {
  const [tab, setTab] = useState("Node.js");

  return (
    <>
      <LandingNavbar />
      <div style={{ background: "#fff", minHeight: "100vh" }}>
        {/* ── Hero ── */}
        <section
          style={{
            paddingTop: "clamp(6rem,10vw,9rem)",
            paddingBottom: "clamp(3rem,5vw,5rem)",
            borderBottom: "1px solid var(--clr-border)",
            background:
              "linear-gradient(180deg, #fff 55%, var(--clr-bg-off) 100%)",
          }}
        >
          <div
            style={{
              maxWidth: "78rem",
              margin: "0 auto",
              padding: "0 clamp(1.25rem,5vw,3rem)",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%,320px), 1fr))",
              gap: "clamp(2.5rem,5vw,5rem)",
              alignItems: "center",
            }}
          >
            {/* Left copy */}
            <div>
              <p
                className="et-fade-up"
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
                DEVELOPER API
              </p>

              <h1
                className="et-fade-up et-d1"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(2.5rem,5.5vw,4rem)",
                  letterSpacing: "-0.035em",
                  color: "var(--clr-text)",
                  lineHeight: 1.06,
                  marginBottom: "1.25rem",
                }}
              >
                Build on top of
                <br />
                <em style={{ fontStyle: "italic", color: "var(--clr-brand)" }}>
                  Montra.
                </em>
              </h1>

              <p
                className="et-fade-up et-d2"
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 300,
                  fontSize: "1.0625rem",
                  color: "var(--clr-text-muted)",
                  lineHeight: 1.75,
                  maxWidth: "42ch",
                  marginBottom: "2.25rem",
                }}
              >
                A clean REST API to programmatically manage budgets, log
                expenses, and listen for real-time financial events in your own
                apps.
              </p>

              <div
                className="et-fade-up et-d3"
                style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}
              >
                <Link
                  href="#quickstart"
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
                  Quickstart <ArrowRight size={15} />
                </Link>
                <Link
                  href="#reference"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.75rem 1.75rem",
                    borderRadius: "var(--r-pill)",
                    border: "1.5px solid var(--clr-border-mid)",
                    color: "var(--clr-text-2)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 400,
                    fontSize: "0.9375rem",
                    textDecoration: "none",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--clr-brand)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "var(--clr-border-mid)")
                  }
                >
                  API Reference
                </Link>
              </div>
            </div>

            {/* Right: terminal panel */}
            <div
              className="et-scale-in et-d2"
              style={{
                borderRadius: "var(--r-xl)",
                overflow: "hidden",
                background: "#0D1A0E",
                border: "1px solid rgba(231,225,177,0.12)",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.75rem 1rem",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.2)",
                }}
              >
                {["#ff5f57", "#ffbd2e", "#28c941"].map((c) => (
                  <div
                    key={c}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: c,
                      opacity: 0.8,
                    }}
                  />
                ))}
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  ~ montra-api
                </span>
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: "1.375rem 1.5rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  lineHeight: 1.8,
                  color: "rgba(231,225,177,0.82)",
                  overflowX: "auto",
                  whiteSpace: "pre",
                }}
              >
                {`$ npm install @montra/sdk

$ export EXPENSE_API_KEY="sk_live_..."

$ node -e "
  const et = require('@montra/sdk');
  const c = new et({ apiKey: process.env.EXPENSE_API_KEY });
  c.budgets.list().then(console.log);
"

[
  { id: 'bgt_abc123', name: 'Groceries', limit: 200 },
  { id: 'bgt_def456', name: 'Transport', limit: 80  },
]`}
              </pre>
            </div>
          </div>
        </section>

        {/* ── Feature chips ── */}
        <section
          style={{
            padding: "clamp(3.5rem,5vw,5rem) clamp(1.25rem,5vw,3rem)",
            borderBottom: "1px solid var(--clr-border)",
          }}
        >
          <div
            style={{
              maxWidth: "78rem",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.125rem",
            }}
          >
            {CHIPS.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                style={{
                  borderRadius: "var(--r-lg)",
                  padding: "1.75rem",
                  background:
                    i % 2 === 0 ? "var(--block-sage)" : "var(--block-cream)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "var(--clr-brand-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--clr-brand)",
                  }}
                >
                  <Icon size={18} />
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: "var(--clr-text)",
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    fontSize: "0.875rem",
                    color: "var(--clr-text-muted)",
                    lineHeight: 1.7,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Quickstart ── */}
        <section
          id="quickstart"
          style={{
            padding: "clamp(3.5rem,5vw,5rem) clamp(1.25rem,5vw,3rem)",
            borderBottom: "1px solid var(--clr-border)",
          }}
        >
          <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
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
              QUICKSTART
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.625rem,3vw,2.25rem)",
                letterSpacing: "-0.025em",
                color: "var(--clr-text)",
                marginBottom: "0.75rem",
              }}
            >
              Up and running in{" "}
              <em style={{ fontStyle: "italic", color: "var(--clr-brand)" }}>
                5 minutes.
              </em>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "1rem",
                color: "var(--clr-text-muted)",
                lineHeight: 1.7,
                marginBottom: "2rem",
              }}
            >
              Choose your language and run the example below.
            </p>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "0.875rem",
                flexWrap: "wrap",
              }}
            >
              {Object.keys(SAMPLES).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setTab(lang)}
                  style={{
                    padding: "0.375rem 1rem",
                    borderRadius: "var(--r-pill)",
                    border: `1.5px solid ${tab === lang ? "var(--clr-brand)" : "var(--clr-border)"}`,
                    background:
                      tab === lang ? "var(--block-sage)" : "transparent",
                    color:
                      tab === lang
                        ? "var(--clr-brand)"
                        : "var(--clr-text-muted)",
                    fontFamily: "var(--font-body)",
                    fontWeight: tab === lang ? 600 : 400,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            <CodeBlock code={SAMPLES[tab as keyof typeof SAMPLES]} lang={tab} />

            <div
              style={{
                marginTop: "1.75rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <Link
                href="/sign-up"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.6875rem 1.5rem",
                  borderRadius: "var(--r-pill)",
                  background: "var(--clr-brand)",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--clr-brand-mid)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--clr-brand)")
                }
              >
                Get your API key <ChevronRight size={14} />
              </Link>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  color: "var(--clr-text-muted)",
                }}
              >
                Business plan required for API access.
              </span>
            </div>
          </div>
        </section>

        {/* ── Reference ── */}
        <section
          id="reference"
          style={{ padding: "clamp(3.5rem,5vw,5rem) clamp(1.25rem,5vw,3rem)" }}
        >
          <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
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
              API REFERENCE
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.625rem,3vw,2.25rem)",
                letterSpacing: "-0.025em",
                color: "var(--clr-text)",
                marginBottom: "0.75rem",
              }}
            >
              Endpoint{" "}
              <em style={{ fontStyle: "italic", color: "var(--clr-brand)" }}>
                reference.
              </em>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "1rem",
                color: "var(--clr-text-muted)",
                lineHeight: 1.7,
                marginBottom: "2rem",
              }}
            >
              Base URL:{" "}
              <code
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.875rem",
                  color: "var(--clr-brand)",
                  background: "var(--block-sage)",
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >
                https://api.montra.app/v1
              </code>
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {ENDPOINTS.map(({ m, p, d }, i) => (
                <EndpointRow key={i} method={m} path={p} desc={d} />
              ))}
            </div>
          </div>
        </section>
      </div>
      <FooterSection />
    </>
  );
}

interface CodeBlockProps {
  code: string;
  lang: string;
}

function CodeBlock({ code, lang }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{
        borderRadius: "var(--r-lg)",
        overflow: "hidden",
        background: "#0D1A0E",
        border: "1px solid rgba(231,225,177,0.10)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.625rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Code2 size={13} style={{ color: "rgba(255,255,255,0.35)" }} />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            {lang.toLowerCase()}
          </span>
        </div>
        <button
          onClick={copy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            padding: "0.25rem 0.625rem",
            borderRadius: 6,
            border: "none",
            background: copied
              ? "rgba(13,83,14,0.3)"
              : "rgba(255,255,255,0.08)",
            color: copied ? "#6ed870" : "rgba(255,255,255,0.5)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "1.25rem 1.5rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.8rem",
          lineHeight: 1.8,
          color: "rgba(231,225,177,0.82)",
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        {code}
      </pre>
    </div>
  );
}

interface EndpointRowProps {
  method: string;
  path: string;
  desc: string;
}

function EndpointRow({ method, path, desc }: EndpointRowProps) {
  const [h, setH] = useState(false);
  const { bg, clr } = METHOD_COLOR[method];
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.875rem",
        alignItems: "center",
        padding: "0.875rem 1.125rem",
        borderRadius: 12,
        border: `1.5px solid ${h ? "var(--clr-border-mid)" : "var(--clr-border)"}`,
        background: h ? "var(--clr-bg-off)" : "transparent",
        transition: "all 0.15s",
        cursor: "default",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 600,
          fontSize: "0.7rem",
          letterSpacing: "0.06em",
          padding: "3px 9px",
          borderRadius: 5,
          background: bg,
          color: clr,
          minWidth: 54,
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {method}
      </span>
      <code
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.84rem",
          color: "var(--clr-text)",
          letterSpacing: "-0.01em",
          flex: "0 0 auto",
        }}
      >
        {path}
      </code>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 300,
          fontSize: "0.875rem",
          color: "var(--clr-text-muted)",
          marginLeft: "auto",
          textAlign: "right",
          maxWidth: "28ch",
          lineHeight: 1.5,
        }}
      >
        {desc}
      </span>
    </div>
  );
}
