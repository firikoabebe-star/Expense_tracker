"use client";
// ─────────────────────────────────────────────────────────────────
// components/ModeToggle.tsx
// Minimal icon button → popover with Light / Dark / System options.
// Styled with semantic tokens so it reads correctly in both themes.
// ─────────────────────────────────────────────────────────────────
import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const CurrentIcon =
    theme === "dark" ? Moon : theme === "system" ? Monitor : Sun;

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle colour theme"
        aria-expanded={open}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {mounted ? <CurrentIcon size={18} /> : <Monitor size={18} />}
      </button>

      {/* Dropdown */}
      {mounted && open && (
        <ul
          role="listbox"
          aria-label="Theme options"
          className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[8.5rem] list-none rounded-xl border border-border bg-card p-1 shadow-md"
        >
          {OPTIONS.map(({ value, label, Icon }) => {
            const active = theme === value;
            return (
              <li key={value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setTheme(value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-accent font-semibold text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon size={14} aria-hidden />
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
