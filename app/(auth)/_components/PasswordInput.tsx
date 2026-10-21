"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "/components/ui/input";
import { cn } from "/lib/utils";

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  onBlur?: () => void;
  onFocus?: () => void;
  /** Ids to append to the input's aria-describedby (e.g. a live checklist). */
  describedBy?: string;
};

/**
 * Password input with a show/hide eye toggle inside the right end of the
 * field. Each instance owns its own visibility state, so multiple fields on
 * the same form toggle independently.
 */
export function PasswordInput({
  id,
  value,
  onChange,
  name,
  placeholder,
  autoComplete,
  className,
  disabled,
  required,
  invalid,
  onBlur,
  onFocus,
  describedBy,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;
  const toggleLabel = visible ? "Hide password" : "Show password";

  return (
    <div className="relative">
      <Input
        id={id}
        name={name ?? id}
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
        aria-invalid={invalid ? true : undefined}
        aria-describedby={
          [invalid ? errorId : undefined, describedBy]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cn(className, "pr-11")}
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
  );
}
