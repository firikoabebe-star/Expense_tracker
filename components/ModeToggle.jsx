"use client";
// ─────────────────────────────────────────────────────────────────
// components/ModeToggle.jsx
// Minimal icon button → popover with Light / Dark / System options.
// ─────────────────────────────────────────────────────────────────
import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const CurrentIcon =
    theme === "dark" ? Moon : theme === "system" ? Monitor : Sun;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle colour theme"
        aria-expanded={open}
        style={{
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          border: "1.5px solid var(--clr-border)",
          background: "transparent",
          color: "var(--clr-text-muted)",
          cursor: "pointer",
          transition: "border-color 0.15s, background 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--clr-border-mid)";
          e.currentTarget.style.background = "var(--block-sage)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--clr-border)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        <CurrentIcon size={15} />
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          role="listbox"
          aria-label="Theme options"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: 136,
            background: "var(--clr-bg)",
            border: "1px solid var(--clr-border)",
            borderRadius: 12,
            boxShadow: "var(--shadow-md)",
            padding: "0.3rem",
            listStyle: "none",
            margin: 0,
            zIndex: 200,
            animation: "et-fade-up 0.2s var(--ease-spring) both",
          }}
        >
          {OPTIONS.map(({ value, label, Icon }) => {
            const active = theme === value;
            return (
              <li key={value}>
                <button
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setTheme(value);
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: 8,
                    border: "none",
                    background: active ? "var(--block-sage)" : "transparent",
                    color: active ? "var(--clr-brand)" : "var(--clr-text-2)",
                    fontFamily: "var(--font-body)",
                    fontWeight: active ? 600 : 400,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "background 0.12s, color 0.12s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      e.currentTarget.style.background = "var(--clr-bg-off)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon size={13} />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
