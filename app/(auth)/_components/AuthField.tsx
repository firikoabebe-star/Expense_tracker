"use client";

import type { ReactNode } from "react";
import { cn } from "/lib/utils";
import { PasswordInput } from "./PasswordInput";

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
  const errorId = `${id}-error`;

  return (
    <div>
      <FieldLabel htmlFor={id} required={required} hint={hint}>
        {label}
      </FieldLabel>

      <PasswordInput
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        required={required}
        invalid={Boolean(error)}
        describedBy={describedBy}
        className={authInputClass(Boolean(error))}
      />

      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}

      {below}
    </div>
  );
}
