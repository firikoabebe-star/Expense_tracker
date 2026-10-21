"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "/lib/auth-client";
import { getOtpErrorMessage, isEmailNotVerified } from "/lib/auth-errors";
import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";
import {
  AUTH_BUTTON_CLASS,
  FieldLabel,
  PasswordField,
  authInputClass,
} from "../../_components/AuthField";
import { AuthDivider } from "../../_components/AuthDivider";
import { BrandLogo } from "../../_components/BrandLogo";
import { GoogleButton } from "../../_components/GoogleButton";
import { VerifyEmailStep } from "../../_components/VerifyEmailStep";
import { useOAuthError } from "../../_components/useOAuthError";

export default function SignInPage() {
  const [step, setStep] = useState<"credentials" | "verify">("credentials");
  const [challengeEmail, setChallengeEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);
  const [verifyError, setVerifyError] = useState("");
  const [verifyNotice, setVerifyNotice] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useOAuthError(setError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    const { error: signInError } = await authClient.signIn.email({
      email: normalizedEmail,
      password,
    });

    if (signInError) {
      if (isEmailNotVerified(signInError)) {
        // The account exists but still needs email verification. Send a new
        // code and move to the OTP screen for this email.
        const { error: sendError } =
          await authClient.emailOtp.sendVerificationOtp({
            email: normalizedEmail,
            type: "email-verification",
          });

        setChallengeEmail(normalizedEmail);
        setResendCooldown(sendError ? 0 : 60);
        setVerifyNotice(
          sendError
            ? ""
            : "Your email isn't verified yet. We've sent a new 6-digit code."
        );
        setVerifyError(
          sendError
            ? getOtpErrorMessage(
                sendError,
                "We couldn't send a new code. Use Resend code below."
              )
            : ""
        );
        setPassword("");
        setStep("verify");
        setLoading(false);
        return;
      }

      setError(signInError.message || "Failed to sign in");
      setLoading(false);
      return;
    }

    router.push("/post-login");
  };

  if (step === "verify") {
    return (
      <VerifyEmailStep
        email={challengeEmail}
        initialCooldown={resendCooldown}
        initialError={verifyError}
        notice={verifyNotice}
        onVerified={() => router.replace("/post-login")}
        onBack={() => {
          setStep("credentials");
          setError("");
          setVerifyError("");
          setVerifyNotice("");
        }}
      />
    );
  }

  return (
    <div>
      <BrandLogo className="mb-5" />

      <h1 className="text-center text-2xl font-bold">Welcome back</h1>
      <p className="mb-6 mt-1 text-center text-sm text-[var(--clr-text-muted)]">
        Sign in to continue
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel htmlFor="email" required>
            Email
          </FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
            className={authInputClass()}
          />
        </div>

        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          hint={
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          }
        />

        {error && (
          <p role="alert" className="text-center text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className={AUTH_BUTTON_CLASS}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <AuthDivider />

      <GoogleButton errorCallbackURL="/sign-in" onError={setError} />

      <p className="mt-4 text-center text-sm text-[var(--clr-text-muted)]">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
