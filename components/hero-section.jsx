"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Check, TrendingUp, Wallet, PiggyBank } from "lucide-react";
import LandingNavbar from "./LandingNavbar";

const TRUST = ["50,000+ users", "Free to start", "No credit card needed"];

export default function HeroSection() {
  return (
    <>
      <LandingNavbar />

      <main
        style={{
          background: "var(--clr-bg)",
          overflow: "hidden",
        }}
      >
        <section
          style={{
            paddingTop: "8rem",
            paddingBottom: "5rem",
            position: "relative",
          }}
        >
          {/* Background glow */}
          <div
            style={{
              position: "absolute",
              top: "-10rem",
              left: "50%",
              transform: "translateX(-50%)",
              width: "50rem",
              height: "50rem",
              background:
                "radial-gradient(circle, rgba(13,83,14,0.08), transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0 clamp(1.25rem, 5vw, 3rem)",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* 2-Column layout */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.05fr 0.95fr",
                gap: "4rem",
                alignItems: "center",
              }}
            >
              {/* Left column – text & CTAs */}
              <div
                style={{
                  textAlign: "left",
                  maxWidth: "620px",
                }}
              >
                {/* Badge */}
                <div
                  className="et-fade-up"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".5rem",
                    padding: ".6rem 1rem",
                    borderRadius: "999px",
                    background: "var(--block-sage)",
                    border: "1px solid var(--clr-border)",
                    marginBottom: "1.5rem",
                  }}
                >
                  <TrendingUp size={14} color="var(--clr-brand)" />
                  <span
                    style={{
                      fontSize: ".85rem",
                      color: "var(--clr-brand)",
                      fontWeight: 600,
                    }}
                  >
                    Smart Budgeting App
                  </span>
                </div>

                {/* Headline */}
                <h6
                  className="et-fade-up et-d1"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(2.75rem, 6vw, 4.75rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.05em",
                    maxWidth: "12ch",
                    margin: 0,
                  }}
                >
                  Manage your
                  <br />
                  <em
                    style={{
                      color: "var(--clr-brand)",
                      fontStyle: "italic",
                    }}
                  >
                    money.
                  </em>
                  <br />
                  Build your future.
                </h6>

                {/* Description */}
                <p
                  className="et-fade-up et-d2"
                  style={{
                    maxWidth: "42rem",
                    margin: "2rem 0",
                    color: "var(--clr-text-muted)",
                    fontSize: "1.1rem",
                    lineHeight: 1.8,
                  }}
                >
                  Track expenses, automate budgets, and understand your finances
                  with beautiful insights designed to help you save more every
                  month.
                </p>

                {/* CTA */}
                <div
                  className="et-fade-up et-d3"
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "1rem",
                    flexWrap: "wrap",
                    marginBottom: "2rem",
                  }}
                >
                  <Link
                    href="/sign-up"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: ".5rem",
                      padding: "1rem 2rem",
                      borderRadius: "var(--r-pill)",
                      background: "var(--clr-brand)",
                      color: "#fff",
                      textDecoration: "none",
                      fontWeight: 600,
                      boxShadow: "var(--shadow-md)",
                    }}
                  >
                    Get Started Free
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    href="/pricing"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "1rem 2rem",
                      borderRadius: "var(--r-pill)",
                      border: "1px solid var(--clr-border)",
                      color: "var(--clr-text)",
                      textDecoration: "none",
                      background: "white",
                    }}
                  >
                    View Pricing
                  </Link>
                </div>

                {/* Trust */}
                <div
                  className="et-fade-up et-d4"
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "1.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {TRUST.map((item) => (
                    <span
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: ".4rem",
                        color: "var(--clr-text-muted)",
                        fontSize: ".9rem",
                      }}
                    >
                      <Check size={14} color="var(--clr-brand)" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right column – Dashboard preview */}
              <div>
                <div
                  className="et-scale-in"
                  style={{
                    position: "relative",
                    maxWidth: "100%",
                    margin: 0,
                  }}
                >
                  {/* Main Dashboard */}
                  <div
                    style={{
                      background: "white",
                      borderRadius: "32px",
                      border: "1px solid var(--clr-border)",
                      boxShadow: "var(--shadow-xl)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        padding: "1rem 1.5rem",
                        borderBottom: "1px solid var(--clr-border)",
                        display: "flex",
                        gap: ".5rem",
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "#ff5f57",
                        }}
                      />
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "#febc2e",
                        }}
                      />
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "#28c840",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        padding: "2rem",
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit,minmax(220px,1fr))",
                        gap: "1rem",
                      }}
                    >
                      {/* Card 1 */}
                      <div
                        style={{
                          background: "var(--block-sage)",
                          borderRadius: "20px",
                          padding: "1.5rem",
                        }}
                      >
                        <Wallet size={24} color="var(--clr-brand)" />
                        <p
                          style={{
                            marginTop: ".8rem",
                            color: "var(--clr-text-muted)",
                          }}
                        >
                          Total Balance
                        </p>
                        <h3
                          style={{
                            fontSize: "2rem",
                            marginTop: ".25rem",
                          }}
                        >
                          $12,480
                        </h3>
                      </div>

                      {/* Card 2 */}
                      <div
                        style={{
                          background: "var(--block-cream)",
                          borderRadius: "20px",
                          padding: "1.5rem",
                        }}
                      >
                        <PiggyBank size={24} color="var(--clr-brand)" />
                        <p
                          style={{
                            marginTop: ".8rem",
                            color: "var(--clr-text-muted)",
                          }}
                        >
                          Monthly Savings
                        </p>
                        <h3
                          style={{
                            fontSize: "2rem",
                            marginTop: ".25rem",
                          }}
                        >
                          $4,200
                        </h3>
                      </div>

                      {/* Chart */}
                      <div
                        style={{
                          gridColumn: "1/-1",
                          background: "var(--clr-bg-off)",
                          borderRadius: "20px",
                          padding: "2rem",
                        }}
                      >
                        <p
                          style={{
                            marginBottom: "1rem",
                            fontWeight: 600,
                          }}
                        >
                          Spending Overview
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "end",
                            gap: "1rem",
                            height: "180px",
                          }}
                        >
                          {[40, 70, 55, 90, 65, 110, 80].map((h, i) => (
                            <div
                              key={i}
                              style={{
                                flex: 1,
                                height: `${h}%`,
                                borderRadius: "12px 12px 0 0",
                                background: "var(--clr-brand)",
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Card 1 */}
                  <div
                    style={{
                      position: "absolute",
                      top: "15%",
                      left: "-50px",
                      background: "white",
                      padding: "1rem",
                      borderRadius: "18px",
                      boxShadow: "var(--shadow-lg)",
                      border: "1px solid var(--clr-border)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: ".8rem",
                        color: "var(--clr-text-muted)",
                      }}
                    >
                      Savings Goal
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "1.25rem",
                        color: "var(--clr-brand)",
                      }}
                    >
                      82%
                    </div>
                  </div>

                  {/* Floating Card 2 */}
                  <div
                    style={{
                      position: "absolute",
                      right: "-40px",
                      bottom: "15%",
                      background: "var(--clr-brand)",
                      color: "white",
                      padding: "1rem 1.25rem",
                      borderRadius: "18px",
                      boxShadow: "var(--shadow-lg)",
                    }}
                  >
                    <div style={{ opacity: 0.8, fontSize: ".8rem" }}>
                      Budget Status
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "1.1rem",
                      }}
                    >
                      On Track ✓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
