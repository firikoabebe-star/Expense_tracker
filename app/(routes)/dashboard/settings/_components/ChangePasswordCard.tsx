"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "/components/ui/button";
import { PasswordChecklist } from "../../../../(auth)/_components/PasswordChecklist";
import { PasswordInput } from "../../../../(auth)/_components/PasswordInput";
import { validatePassword } from "/lib/password";
import { cn } from "/lib/utils";
import { authClient } from "/lib/auth-client";
import { SettingsCard } from "./SettingsCard";

interface ChangePasswordCardProps {
  hasCredential: boolean;
}

type Status = { type: "success" | "error"; message: string };

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;
    const errorObj = record.error;
    if (errorObj && typeof errorObj === "object") {
      const e = errorObj as Record<string, unknown>;
      if (typeof e.message === "string") return e.message;
    }
    if (typeof record.message === "string") return record.message;
  }
  return "Failed to change password";
}

function isWrongCurrentPassword(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("current password") ||
    lower.includes("invalid password") ||
    lower.includes("incorrect password") ||
    lower.includes("wrong password")
  );
}

export function ChangePasswordCard({ hasCredential }: ChangePasswordCardProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [newFocused, setNewFocused] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  const passwordCheck = useMemo(
    () => validatePassword(newPassword),
    [newPassword]
  );
  const rulesOk = passwordCheck.valid;
  const differsFromCurrent =
    newPassword.length > 0 &&
    currentPassword.length > 0 &&
    newPassword !== currentPassword;
  const matches = confirmPassword.length > 0 && newPassword === confirmPassword;

  const canSubmit =
    !loading &&
    hasCredential &&
    currentPassword.length > 0 &&
    rulesOk &&
    differsFromCurrent &&
    matches;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setStatus(null);
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (result && typeof result === "object" && "error" in result && result.error) {
        const message = getErrorMessage(result);
        if (isWrongCurrentPassword(message)) {
          setCurrentPassword("");
        }
        setStatus({ type: "error", message });
        toast.error(message);
        return;
      }

      setStatus({
        type: "success",
        message: "Password changed. Other sessions have been signed out.",
      });
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const message = getErrorMessage(error);
      if (isWrongCurrentPassword(message)) {
        setCurrentPassword("");
      }
      setStatus({ type: "error", message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsCard
      icon={KeyRound}
      title="Security"
      description="Update your password. Changing it signs out your other sessions."
    >
      {!hasCredential ? (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-accent p-4 sm:flex-row sm:items-start">
          <ShieldAlert
            className="h-5 w-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              This account signs in with Google
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              It doesn&apos;t have a password to change here. Manage your
              password in your Google account settings.
            </p>
            <Link
              href="/forgot-password"
              className="mt-3 inline-flex min-h-[40px] items-center gap-1 rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
            >
              Go to password reset
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-foreground"
            >
              Current password
            </label>
            <PasswordInput
              id="current-password"
              value={currentPassword}
              onChange={setCurrentPassword}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-foreground"
            >
              New password
            </label>
            <PasswordInput
              id="new-password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
              disabled={loading}
              invalid={newPassword.length > 0 && !rulesOk}
              describedBy={
                newPassword.length > 0 || newFocused
                  ? "new-password-checklist"
                  : undefined
              }
              onFocus={() => setNewFocused(true)}
              onBlur={() => setNewFocused(false)}
            />
            <p className="text-xs text-muted-foreground">
              Use at least 8 characters with uppercase, lowercase, a number and
              a special character.
            </p>
            <PasswordChecklist
              password={newPassword}
              visible={newPassword.length > 0 || newFocused}
              id="new-password-checklist"
            />
            {newPassword.length > 0 &&
              currentPassword.length > 0 &&
              !differsFromCurrent && (
                <p className="text-xs text-destructive">
                  New password must be different from the current password.
                </p>
              )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-foreground"
            >
              Confirm new password
            </label>
            <PasswordInput
              id="confirm-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              disabled={loading}
              invalid={confirmPassword.length > 0 && !matches}
            />
            {confirmPassword.length > 0 && !matches && (
              <p className="text-xs text-destructive">Passwords do not match.</p>
            )}
          </div>

          <div aria-live="polite" role="status">
            {status ? (
              <div
                className={cn(
                  "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
                  status.type === "success"
                    ? "border-border bg-accent text-foreground"
                    : "border-destructive/40 bg-destructive/10 text-destructive"
                )}
              >
                {status.type === "success" ? (
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span className="min-w-0">{status.message}</span>
              </div>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={!canSubmit}
            aria-busy={loading}
            className="min-h-[40px] w-full"
          >
            {loading ? (
              <Loader className="animate-spin" aria-hidden="true" />
            ) : null}
            {loading ? "Changing password…" : "Change password"}
          </Button>
        </form>
      )}
    </SettingsCard>
  );
}
