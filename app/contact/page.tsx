import type { Metadata } from "next";
import { Mail } from "lucide-react";

import LegalLayout, { LegalHeading, type LegalSection } from "/components/legal-layout";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact | Montra",
  description: "Contact Montra support by email or send a message.",
};

const SECTIONS: LegalSection[] = [
  { id: "contact-support", label: "Contact support" },
  { id: "send-a-message", label: "Send a message" },
];

export default function ContactPage() {
  return (
    <LegalLayout
      title="Contact"
      description="Questions, feedback, or account help—we'd like to hear from you."
      lastUpdated="October 23, 2026"
      sections={SECTIONS}
    >
      <LegalHeading id="contact-support">Contact support</LegalHeading>
      <p>
        Email us at{" "}
        <a href="mailto:support@base.et">support@base.et</a>.
      </p>
      <p>We usually reply within 2 business days.</p>
      <div className="mt-5 flex items-start gap-3 rounded-lg border border-border bg-card p-4">
        <Mail aria-hidden="true" className="mt-0.5 h-5 w-5 text-primary" />
        <div>
          <div className="text-sm font-semibold text-foreground">Email</div>
          <a
            href="mailto:support@base.et"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            support@base.et
          </a>
        </div>
      </div>

      <LegalHeading id="send-a-message">Send a message</LegalHeading>
      <p>
        Use the form below and include as much detail as you can. We usually
        reply within 2 business days.
      </p>
      <ContactForm />
    </LegalLayout>
  );
}
