"use client";

import { useState } from "react";
import { authClient } from "/lib/auth-client";
import { getOtpErrorMessage } from "/lib/auth-errors";
import { Button } from "/components/ui/button";
import { OtpField } from "./OtpField";
import { ResendCode } from "./ResendCode";

type VerifyEmailStepProps = {
  email: string;
  onVerified: () => void;
  onBack?: () => void;
  initialCooldown?: number;
  initialError?: string;
  notice?: string;
};

export function VerifyEmailStep({
  email,
  onVerified,
  onBack,
  initialCooldown = 60,
  initialError,
  notice,
}: VerifyEmailStepProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: verifyError } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });

    if (verifyError) {
      setError(
        getOtpErrorMessage(
          verifyError,
          "We couldn't verify that code. Please try again."
        )
      );
      setLoading(false);
      return;
    }

    onVerified();
  };

  const handleResend = async () => {
    const { error: resendError } =
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

    return {
      error: resendError
        ? getOtpErrorMessage(
            resendError,
            "We couldn't resend the code. Please try again."
          )
        : undefined,
    };
  };

  return (
    <div>
      <h1 className="mb-2 text-center text-2xl font-bold">Verify your email</h1>
      <p className="mb-6 text-center text-sm text-[var(--clr-text-muted)]">
        Enter the 6-digit code we sent to{" "}
        <span className="font-medium text-[var(--clr-text)]">{email}</span>.
      </p>

      {notice && (
        <div className="mb-4 rounded-md border border-[var(--clr-border)] bg-[var(--clr-bg-off)] px-3 py-2 text-center text-sm text-[var(--clr-text-2)]">
          {notice}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-4">
        <OtpField
          value={otp}
          onChange={(value) => {
            setOtp(value);
            if (error) setError("");
          }}
          disabled={loading}
          autoFocus
        />

        {error && (
          <p role="alert" className="text-center text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>

      <div className="mt-5 space-y-3">
        <ResendCode
          onResend={handleResend}
          initialCooldown={initialCooldown}
          disabled={loading}
        />

        {onBack && (
          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-[var(--clr-text-muted)] hover:text-primary hover:underline"
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
