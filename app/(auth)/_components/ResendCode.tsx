"use client";

import { useEffect, useState } from "react";

type ResendResult = { error?: string } | void;

type ResendCodeProps = {
  onResend: () => Promise<ResendResult>;
  initialCooldown?: number;
  disabled?: boolean;
};

export function ResendCode({
  onResend,
  initialCooldown = 60,
  disabled,
}: ResendCodeProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialCooldown);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleResend = async () => {
    if (secondsLeft > 0 || sending) return;

    setSending(true);
    setStatus(null);

    try {
      const result = await onResend();
      if (result?.error) {
        setStatus({ type: "error", text: result.error });
        return;
      }
      setStatus({
        type: "success",
        text: "A new code has been sent to your email.",
      });
      setSecondsLeft(60);
    } catch {
      setStatus({
        type: "error",
        text: "We couldn't resend the code. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-1 text-center">
      <button
        type="button"
        onClick={handleResend}
        disabled={disabled || sending || secondsLeft > 0}
        className="text-sm font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline"
      >
        {secondsLeft > 0
          ? `Resend code in ${secondsLeft}s`
          : sending
            ? "Sending..."
            : "Resend code"}
      </button>
      {status && (
        <p
          role={status.type === "error" ? "alert" : "status"}
          className={
            status.type === "error"
              ? "text-sm text-destructive"
              : "text-sm text-emerald-600 dark:text-emerald-400"
          }
        >
          {status.text}
        </p>
      )}
    </div>
  );
}
