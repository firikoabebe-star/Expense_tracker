"use client";

import { Check, X } from "lucide-react";
import { getPasswordStrength, PASSWORD_RULES } from "/lib/password";
import { cn } from "/lib/utils";

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong"] as const;

// One semantic token per strength level. Every value is a CSS variable, so it
// adapts to dark/light mode — no hardcoded colors.
const STRENGTH_COLORS = [
  "var(--strength-weak)",
  "var(--strength-fair)",
  "var(--strength-good)",
  "var(--strength-strong)",
] as const;

const SEGMENT_COUNT = 4;

type PasswordChecklistProps = {
  password: string;
  visible: boolean;
  id?: string;
};

export function PasswordChecklist({
  password,
  visible,
  id = "password-checklist",
}: PasswordChecklistProps) {
  if (!visible) return null;

  const strength = getPasswordStrength(password);
  const level = Math.min(Math.max(strength, 1), SEGMENT_COUNT);
  const label = STRENGTH_LABELS[level - 1];
  const levelColor = STRENGTH_COLORS[level - 1];

  return (
    <div
      id={id}
      aria-live="polite"
      className="mt-2.5 space-y-2"
    >
      <ul className="space-y-1" aria-label="Password requirements">
        {PASSWORD_RULES.map((rule) => {
          const met = password.length > 0 && rule.test(password);
          return (
            <li key={rule.id} className="flex items-center gap-2 text-xs">
              {met ? (
                <Check
                  className="h-3.5 w-3.5 shrink-0 text-[var(--primary)]"
                  aria-hidden="true"
                />
              ) : (
                <X
                  className="h-3.5 w-3.5 shrink-0 text-[var(--clr-text-muted)]"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "text-[var(--clr-text-2)]",
                  met && "text-[var(--clr-text)]"
                )}
              >
                {rule.label}
              </span>
              <span className="sr-only">{met ? " (met)" : " (not met)"}</span>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1" aria-hidden="true">
          {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
            <span
              key={index}
              className="relative h-2 flex-1 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--accent)]"
            >
              <span
                className={cn(
                  "absolute inset-0 origin-left rounded-full transition-all duration-150 motion-reduce:transition-none",
                  index < strength ? "scale-x-100" : "scale-x-0"
                )}
                style={{ backgroundColor: levelColor }}
              />
            </span>
          ))}
        </div>
        <span
          className="text-xs font-medium"
          style={{ color: levelColor }}
        >
          <span className="sr-only">Password strength: </span>
          {label}
        </span>
      </div>
    </div>
  );
}
