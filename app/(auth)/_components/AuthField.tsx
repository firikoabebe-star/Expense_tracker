"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "/components/ui/input";
import { cn } from "/lib/utils";

export const AUTH_INPUT_CLASS =
  "h-11 rounded-lg border-[var(--clr-border-mid)] bg-transparent px-3 text-sm placeholder:text-[var(--clr-text-muted)] focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0";

export const AUTH_BUTTON_CLASS =
  "h-11 w-full rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90";

export function authInputClass(hasError?: boolean) {
  return cn(
    AUTH_INPUT_CLASS,
    hasError && "border-destructive focus-visible:ring-destructive"
  );
}

type FieldLabelProps = {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  hint?: ReactNode;
};

export function FieldLabel({
  htmlFor,
  children,
  required,
  hint,
}: FieldLabelProps) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-[var(--clr-text-2)]"
      >
        {children}
        {required && (
          <>
            <span className="ml-0.5 text-destructive" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>
      {hint}
    </div>
  );
}

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  hint?: ReactNode;
  /** Extra element rendered inside the field wrapper, below input/error. */
  below?: ReactNode;
  /** Ids to append to the input's aria-describedby (e.g. a live checklist). */
  describedBy?: string;
};

export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  disabled,
  required,
  onBlur,
  onFocus,
  hint,
  below,
  describedBy,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;
  const toggleLabel = visible ? `Hide ${label}` : `Show ${label}`;

  return (
    <div>
      <FieldLabel htmlFor={id} required={required} hint={hint}>
        {label}
      </FieldLabel>

      <div className="relative">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [error ? errorId : undefined, describedBy]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn(authInputClass(Boolean(error)), "pr-11")}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={toggleLabel}
          aria-pressed={visible}
          aria-controls={id}
          disabled={disabled}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-[var(--clr-text-muted)] transition-colors hover:text-[var(--clr-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}

      {below}
    </div>
  );
}
