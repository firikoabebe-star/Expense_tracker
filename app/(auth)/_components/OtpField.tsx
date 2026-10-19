"use client";

import { Input } from "/components/ui/input";

type OtpFieldProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

export function OtpField({
  value,
  onChange,
  disabled,
  autoFocus,
}: OtpFieldProps) {
  return (
    <div>
      <label htmlFor="otp" className="sr-only">
        6-digit verification code
      </label>
      <Input
        id="otp"
        name="otp"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={6}
        placeholder="000000"
        value={value}
        onChange={(event) =>
          onChange(event.target.value.replace(/\D/g, "").slice(0, 6))
        }
        disabled={disabled}
        autoFocus={autoFocus}
        className="h-12 border-[var(--clr-border-mid)] bg-transparent text-center font-mono text-xl tracking-[0.5em] placeholder:text-[var(--clr-text-muted)] focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
      />
    </div>
  );
}
