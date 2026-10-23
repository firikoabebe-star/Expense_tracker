import type { Metadata } from "next";

import LegalLayout, { LegalHeading, type LegalSection } from "/components/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service | Montra",
  description: "The terms that apply when you use Montra.",
};

const SECTIONS: LegalSection[] = [
  { id: "acceptance", label: "Acceptance" },
  { id: "the-service", label: "The service" },
  { id: "accounts-and-security", label: "Accounts and security" },
  { id: "acceptable-use", label: "Acceptable use" },
  { id: "ai-features", label: "AI features" },
  { id: "availability", label: "Availability" },
  { id: "termination", label: "Termination" },
  { id: "liability", label: "Liability limits" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="These terms govern your use of Montra."
      lastUpdated="October 23, 2026"
      sections={SECTIONS}
    >
      <div className="mb-8 rounded-lg border border-border bg-accent p-4 text-sm leading-6 text-foreground">
        This is a template and should be reviewed by a lawyer before it is
        relied on.
      </div>

      <LegalHeading id="acceptance">Acceptance</LegalHeading>
      <p>
        By creating an account or using Montra, you agree to these terms. If you
        do not agree, do not use the service.
      </p>

      <LegalHeading id="the-service">The service</LegalHeading>
      <p>
        Montra is a personal expense tracker. It lets you create budgets, record
        expenses, and use optional AI features to help you enter and understand
        your spending.
      </p>

      <LegalHeading id="accounts-and-security">Accounts and security</LegalHeading>
      <p>
        You are responsible for the information on your account and for keeping
        your sign-in details secure. Do not share your password with anyone.
        Contact{" "}
        <a href="mailto:support@base.et">support@base.et</a> if you believe your
        account has been compromised.
      </p>

      <LegalHeading id="acceptable-use">Acceptable use</LegalHeading>
      <p>You agree not to:</p>
      <ul>
        <li>use Montra for unlawful purposes;</li>
        <li>attempt to access another person&apos;s account or data;</li>
        <li>interfere with the operation or security of the service;</li>
        <li>upload content that you do not have the right to use.</li>
      </ul>

      <LegalHeading id="ai-features">AI features</LegalHeading>
      <p>
        Montra&apos;s AI features, including quick add, receipt scanning, and
        spending summaries, can make mistakes. Review any suggestion before you
        save or rely on it.
      </p>
      <p>
        AI suggestions are not financial, legal, or tax advice. They are
        provided for convenience only.
      </p>

      <LegalHeading id="availability">Availability</LegalHeading>
      <p>
        We aim to keep Montra available, but we do not guarantee uninterrupted
        access. The service may be changed, suspended, or unavailable from time
        to time.
      </p>

      <LegalHeading id="termination">Termination</LegalHeading>
      <p>
        You may stop using Montra at any time and request account deletion by
        emailing{" "}
        <a href="mailto:support@base.et">support@base.et</a>. We may suspend or
        terminate access for accounts that violate these terms.
      </p>

      <LegalHeading id="liability">Liability limits</LegalHeading>
      <p>
        To the maximum extent permitted by law, Montra is not liable for
        indirect, incidental, special, or consequential damages arising from
        your use of the service. Nothing in these terms limits liability that
        cannot be limited by law.
      </p>

      <LegalHeading id="changes">Changes</LegalHeading>
      <p>
        We may update these terms from time to time. When we do, we will update
        the date at the top of this page. Continued use of Montra means you
        accept the updated terms.
      </p>

      <LegalHeading id="contact">Contact</LegalHeading>
      <p>
        Questions about these terms can be sent to{" "}
        <a href="mailto:support@base.et">support@base.et</a>.
      </p>
    </LegalLayout>
  );
}
