"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "/lib/auth-client";
import { PASSWORD_ERROR_MESSAGE, validatePassword } from "/lib/password";
import { validateFullName } from "/lib/name";
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
import { PasswordChecklist } from "../../_components/PasswordChecklist";
import { VerifyEmailStep } from "../../_components/VerifyEmailStep";
import { useOAuthError } from "../../_components/useOAuthError";

type FieldName = "fullName" | "email" | "password" | "confirmPassword";
type FieldErrors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  const email = values.email.trim();

  if (!values.fullName.trim()) {
    errors.fullName = "Enter your first and last name";
  } else {
    const nameCheck = validateFullName(values.fullName);
    if (!nameCheck.valid) {
      errors.fullName = nameCheck.message ?? "Enter your first and last name";
    }
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (!validatePassword(values.password).valid) {
    errors.password = PASSWORD_ERROR_MESSAGE;
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export default function SignUpPage() {
  const [step, setStep] = useState<"form" | "verify">("form");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useOAuthError(setError);

  const values = { fullName, email, password, confirmPassword };
  const passwordRulesOk = validatePassword(password).valid;
  const confirmMatches =
    confirmPassword.length > 0 && confirmPassword === password;

  const setFieldValue = (field: FieldName, value: string) => {
    switch (field) {
      case "fullName":
        setFullName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        setPasswordTouched(true);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
    }

    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current
    );
    if (error) setError("");
  };

  const validateField = (field: FieldName) => {
    const nextErrors = validate(values);
    setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const nameCheck = validateFullName(fullName);

    const { error: signUpError } = await authClient.signUp.email({
      name: nameCheck.normalized,
      email: normalizedEmail,
      password,
    });

    if (signUpError) {
      setError(signUpError.message || "Failed to sign up");
      setLoading(false);
      return;
    }

    // Sign-up requires email verification. Keep the user here and show the
    // OTP screen instead of sending them to sign-in or the dashboard.
    setRegisteredEmail(normalizedEmail);
    setPassword("");
    setConfirmPassword("");
    setStep("verify");
    setLoading(false);
  };

  if (step === "verify") {
    return (
      <VerifyEmailStep
        email={registeredEmail}
        initialCooldown={60}
        onVerified={() => router.replace("/post-login")}
        onBack={() => {
          setStep("form");
          setPasswordTouched(false);
          setError("");
        }}
      />
    );
  }

  return (
    <div>
      <BrandLogo className="mb-5" />

      <h1 className="text-center text-2xl font-bold">Create your account</h1>
      <p className="mb-6 mt-1 text-center text-sm text-[var(--clr-text-muted)]">
        Sign up to start tracking your expenses
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <FieldLabel htmlFor="fullName" required>
            Full Name
          </FieldLabel>
          <Input
            id="fullName"
            name="name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFieldValue("fullName", e.target.value)}
            onBlur={() => validateField("fullName")}
            required
            aria-required="true"
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={
              errors.fullName ? "fullName-error" : undefined
            }
            className={authInputClass(Boolean(errors.fullName))}
          />
          {errors.fullName && (
            <p
              id="fullName-error"
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <FieldLabel htmlFor="email" required>
            Email
          </FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            placeholder="Enter your email"
            autoComplete="email"
            value={email}
            onChange={(e) => setFieldValue("email", e.target.value)}
            onBlur={() => validateField("email")}
            required
            aria-required="true"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={authInputClass(Boolean(errors.email))}
          />
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="mt-1 text-xs text-destructive"
            >
              {errors.email}
            </p>
          )}
        </div>

        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={(value) => setFieldValue("password", value)}
          onBlur={() => validateField("password")}
          onFocus={() => setPasswordTouched(true)}
          placeholder="Enter your password"
          autoComplete="new-password"
          error={errors.password}
          disabled={loading}
          required
          describedBy={passwordTouched ? "password-checklist" : undefined}
          below={
            <PasswordChecklist
              password={password}
              visible={passwordTouched}
            />
          }
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(value) => setFieldValue("confirmPassword", value)}
          onBlur={() => validateField("confirmPassword")}
          placeholder="Confirm your password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          disabled={loading}
          required
        />

        {error && (
          <p role="alert" className="text-center text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={
            loading ||
            !passwordRulesOk ||
            !confirmMatches ||
            !validateFullName(fullName).valid
          }
          aria-busy={loading}
          className={AUTH_BUTTON_CLASS}
        >
          {loading ? "Signing up..." : "Sign up"}
        </Button>
      </form>

      <AuthDivider />

      <GoogleButton
        errorCallbackURL="/sign-up"
        onError={setError}
        disabled={loading}
      />

      <p className="mt-4 text-center text-sm text-[var(--clr-text-muted)]">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
