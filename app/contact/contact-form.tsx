"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader, Send } from "lucide-react";

import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";
import {
  sendContactMessage,
  type ContactFieldErrors,
} from "./actions";

type FormStatus = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "flex min-h-32 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-[invalid=true]:border-destructive";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setMessage("");
    setFieldErrors({});

    try {
      const result = await sendContactMessage({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
        website: String(data.get("website") ?? ""),
      });

      if (result.ok) {
        form.reset();
        setStatus("success");
        return;
      }

      setFieldErrors(result.fieldErrors ?? {});
      setMessage(result.message);
      setStatus("error");
    } catch {
      setMessage("We couldn't send your message. Please email support@base.et.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="mt-6 rounded-lg border border-border bg-card p-5"
      >
        <CheckCircle2 aria-hidden="true" className="h-6 w-6 text-primary" />
        <h3 className="mt-3 text-lg font-semibold text-foreground">
          Message sent
        </h3>
        <div className="mt-1 text-sm leading-6 text-muted-foreground">
          Thanks for reaching out. We usually reply within 2 business days.
        </div>
        <Button
          type="button"
          variant="secondary"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="relative mt-6 space-y-5">
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label
          htmlFor="contact-name"
          className="text-sm font-medium text-foreground"
        >
          Name
        </label>
        <Input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={80}
          disabled={submitting}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          className="mt-1.5"
        />
        {fieldErrors.name && (
          <span
            id="contact-name-error"
            className="mt-1 block text-xs text-destructive"
          >
            {fieldErrors.name}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="text-sm font-medium text-foreground"
        >
          Email
        </label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          disabled={submitting}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
          className="mt-1.5"
        />
        {fieldErrors.email && (
          <span
            id="contact-email-error"
            className="mt-1 block text-xs text-destructive"
          >
            {fieldErrors.email}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="text-sm font-medium text-foreground"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          disabled={submitting}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={
            fieldErrors.message ? "contact-message-error" : undefined
          }
          className={`${fieldClass} mt-1.5`}
        />
        {fieldErrors.message && (
          <span
            id="contact-message-error"
            className="mt-1 block text-xs text-destructive"
          >
            {fieldErrors.message}
          </span>
        )}
      </div>

      {status === "error" && message && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {message}
        </div>
      )}

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? (
          <Loader className="animate-spin" aria-hidden="true" />
        ) : (
          <Send aria-hidden="true" />
        )}
        {submitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
