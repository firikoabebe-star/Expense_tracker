"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "/lib/auth-client";
import { getOtpErrorMessage } from "/lib/auth-errors";
import { PASSWORD_ERROR_MESSAGE, validatePassword } from "/lib/password";
import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";
import { OtpField } from "../_components/OtpField";
import { PasswordChecklist } from "../_components/PasswordChecklist";
import { PasswordInput } from "../_components/PasswordInput";
import { ResendCode } from "../_components/ResendCode";

const RESET_INPUT_CLASS =
  "border-[var(--clr-border-mid)] bg-transparent placeholder:text-[var(--clr-text-muted)] focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [requestedEmail, setRequestedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordRulesOk = validatePassword(password).valid;
  const confirmMatches =
    confirmPassword.length > 0 && confirmPassword === password;

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
      email: normalizedEmail,
      type: "forget-password",
    });

    if (sendError) {
      setError(
        getOtpErrorMessage(
          sendError,
          "We couldn't send a reset code. Please try again."
        )
      );
      setLoading(false);
      return;
    }

    // The request always succeeds, whether or not the email exists, so the
    // message shown next is intentionally the same for every email.
    setRequestedEmail(normalizedEmail);
    setStep("reset");
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    if (!validatePassword(password).valid) {
      setError(PASSWORD_ERROR_MESSAGE);
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: resetError } = await authClient.emailOtp.resetPassword({
      email: requestedEmail,
      otp,
      password,
    });

    if (resetError) {
      setError(
        getOtpErrorMessage(
          resetError,
          "We couldn't reset your password. Check the code and try again."
        )
      );
      setLoading(false);
      return;
    }

    toast.success("Password reset successfully. Sign in with your new password.");
    router.push("/sign-in");
  };

  const handleResend = async () => {
    const { error: resendError } = await authClient.emailOtp.sendVerificationOtp({
      email: requestedEmail,
      type: "forget-password",
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

  if (step === "reset") {
    return (
      <div>
        <h1 className="mb-2 text-center text-2xl font-bold">
          Reset your password
        </h1>
        <p className="mb-6 text-center text-sm text-[var(--clr-text-muted)]">
          If an account exists for{" "}
          <span className="font-medium text-[var(--clr-text)]">
            {requestedEmail}
          </span>
          , we sent a 6-digit code. Enter it below with your new password.
        </p>

        {error && (
          <p role="alert" className="mb-4 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <OtpField
            value={otp}
            onChange={(value) => {
              setOtp(value);
              if (error) setError("");
            }}
            disabled={loading}
            autoFocus
          />

          <div>
            <label
              htmlFor="new-password"
              className="mb-1 block text-sm font-medium text-[var(--clr-text-2)]"
            >
              New password
            </label>
            <PasswordInput
              id="new-password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setPasswordTouched(true);
              }}
              onFocus={() => setPasswordTouched(true)}
              describedBy={
                passwordTouched ? "new-password-checklist" : undefined
              }
              className={RESET_INPUT_CLASS}
              required
            />

            <PasswordChecklist
              password={password}
              visible={passwordTouched}
              id="new-password-checklist"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1 block text-sm font-medium text-[var(--clr-text-2)]"
            >
              Confirm new password
            </label>
            <PasswordInput
              id="confirm-password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              className={RESET_INPUT_CLASS}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={
              loading ||
              otp.length !== 6 ||
              !passwordRulesOk ||
              !confirmMatches
            }
            className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
          >
            {loading ? "Resetting password..." : "Reset password"}
          </Button>
        </form>

        <div className="mt-5 space-y-3">
          <ResendCode
            onResend={handleResend}
            initialCooldown={60}
            disabled={loading}
          />

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setStep("request");
                setOtp("");
                setPassword("");
                setPasswordTouched(false);
                setConfirmPassword("");
                setError("");
              }}
              className="text-sm text-[var(--clr-text-muted)] hover:text-primary hover:underline"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-center text-2xl font-bold">Forgot password?</h1>
      <p className="mb-6 text-center text-sm text-[var(--clr-text-muted)]">
        Enter the email associated with your account and we&apos;ll send you a
        6-digit reset code.
      </p>

      {error && (
        <p role="alert" className="mb-4 text-center text-sm text-destructive">
          {error}
        </p>
      )}

      <form onSubmit={handleRequest} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-[var(--clr-text-2)]"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-[var(--clr-border-mid)] bg-transparent placeholder:text-[var(--clr-text-muted)] focus-visible:ring-[var(--ring)] focus-visible:ring-offset-0"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
        >
          {loading ? "Sending code..." : "Send reset code"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-[var(--clr-text-muted)]">
        Remembered your password?{" "}
        <Link href="/sign-in" className="text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
