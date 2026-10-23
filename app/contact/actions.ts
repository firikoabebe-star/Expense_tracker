"use server";

import { createHash } from "node:crypto";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

const SUPPORT_EMAIL = "support@base.et";
const RATE_WINDOW_MS = 10 * 60_000;
const MAX_PER_CLIENT = 3;
const MAX_GLOBAL = 20;

export interface ContactInput {
  name: string;
  email: string;
  message: string;
  website?: string;
}

export type ContactFieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export type ContactResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: ContactFieldErrors };

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(80, "Name can't be more than 80 characters."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .max(254, "Email can't be more than 254 characters.")
    .refine(
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Enter a valid email address."
    ),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(5000, "Message can't be more than 5,000 characters."),
  website: z.string().max(200).optional(),
});

interface RateBucket {
  count: number;
  resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();
let rateChecks = 0;

function consumeRateLimit(key: string, max: number): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(key);

  rateChecks += 1;
  if (rateChecks % 256 === 0) {
    for (const [entryKey, entry] of rateBuckets) {
      if (entry.resetAt <= now) rateBuckets.delete(entryKey);
    }
  }

  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (bucket.count >= max) return false;

  bucket.count += 1;
  return true;
}

function clientRateKey(requestHeaders: Headers): string {
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || requestHeaders.get("x-real-ip")?.trim() || "unknown";

  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

let resendClient: Resend | null = null;

function getResendClient(apiKey: string): Resend {
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fieldErrorsFrom(error: z.ZodError): ContactFieldErrors {
  const fieldErrors: ContactFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (field === "name" || field === "email" || field === "message") {
      fieldErrors[field] ??= issue.message;
    }
  }

  return fieldErrors;
}

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  if (
    input &&
    typeof input === "object" &&
    typeof input.website === "string" &&
    input.website.trim()
  ) {
    return { ok: true };
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const { name, email, message } = parsed.data;
  const requestHeaders = await headers();
  const clientKey = clientRateKey(requestHeaders);

  if (!consumeRateLimit(`contact:${clientKey}`, MAX_PER_CLIENT)) {
    return {
      ok: false,
      message: "You've sent several messages recently. Please try again later.",
    };
  }

  if (!consumeRateLimit("contact:global", MAX_GLOBAL)) {
    return {
      ok: false,
      message: "The contact form is busy right now. Please email support@base.et.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    return {
      ok: false,
      message: `The contact form is unavailable right now. Please email ${SUPPORT_EMAIL}.`,
    };
  }

  const subjectName = name.replace(/[\r\n]+/g, " ").trim();
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  try {
    const { error } = await getResendClient(apiKey).emails.send({
      from,
      to: SUPPORT_EMAIL,
      replyTo: email,
      subject: `New Montra message from ${subjectName}`,
      text: [
        "New contact message from Montra",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2 style="margin: 0 0 16px;">New contact message from Montra</h2>
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>
          <p style="margin: 0; white-space: pre-wrap;">${safeMessage}</p>
        </div>
      `,
    });

    if (error) {
      return {
        ok: false,
        message: `We couldn't send your message. Please email ${SUPPORT_EMAIL}.`,
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: `We couldn't send your message. Please email ${SUPPORT_EMAIL}.`,
    };
  }
}
