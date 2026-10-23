import type { Metadata } from "next";

import LegalLayout, { LegalHeading, type LegalSection } from "/components/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy | Montra",
  description: "How Montra collects, uses, and protects your personal information.",
};

const SECTIONS: LegalSection[] = [
  { id: "what-we-collect", label: "What we collect" },
  { id: "how-we-use-it", label: "How we use it" },
  { id: "third-parties", label: "Third parties" },
  { id: "cookies", label: "Cookies" },
  { id: "retention-and-deletion", label: "Retention and deletion" },
  { id: "security", label: "Security" },
  { id: "children", label: "Children" },
  { id: "changes", label: "Changes" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="This policy explains what Montra collects, why we collect it, and the choices you have."
      lastUpdated="October 23, 2026"
      sections={SECTIONS}
    >
      <LegalHeading id="what-we-collect">What we collect</LegalHeading>
      <p>
        When you create a Montra account, we collect your name, email address,
        and a hashed password. If you sign in with Google, we receive your
        Google profile name and email address.
      </p>
      <p>
        We also store the budgets and expenses you create in Montra so that we
        can show them back to you.
      </p>

      <LegalHeading id="how-we-use-it">How we use it</LegalHeading>
      <p>We use your information to:</p>
      <ul>
        <li>create and authenticate your account;</li>
        <li>store, display, and organize your budgets and expenses;</li>
        <li>send account emails such as verification codes and password resets;</li>
        <li>
          process the requests you make to Montra&apos;s AI features, including
          quick add text, receipt images, and spending summaries.
        </li>
      </ul>

      <LegalHeading id="third-parties">Third parties</LegalHeading>
      <p>
        We use the following service providers to run Montra. They process data
        on our behalf to provide their services:
      </p>
      <ul>
        <li>
          <strong>Neon</strong> for our database.
        </li>
        <li>
          <strong>Vercel</strong> for hosting.
        </li>
        <li>
          <strong>Resend</strong> for sending email.
        </li>
        <li>
          <strong>Google</strong> for signing in with Google.
        </li>
        <li>
          <strong>Google Gemini</strong> for AI features. Quick add text,
          receipt images, and spending summaries are sent to Google Gemini for
          processing. Receipt images are not stored.
        </li>
      </ul>

      <LegalHeading id="cookies">Cookies</LegalHeading>
      <p>
        Montra uses session cookies for sign-in only. These cookies keep you
        signed in while you use the app.
      </p>

      <LegalHeading id="retention-and-deletion">Retention and deletion</LegalHeading>
      <p>
        Your account information, budgets, and expenses remain associated with
        your Montra account. You can request deletion of your account by
        emailing{" "}
        <a href="mailto:support@base.et">support@base.et</a>.
      </p>

      <LegalHeading id="security">Security</LegalHeading>
      <p>
        Passwords are stored in hashed form. No method of transmitting or
        storing data is completely secure, so please use a strong, unique
        password for your account.
      </p>

      <LegalHeading id="children">Children</LegalHeading>
      <p>
        Montra is not intended for children under 13. We do not knowingly
        collect personal information from children under 13.
      </p>

      <LegalHeading id="changes">Changes</LegalHeading>
      <p>
        We may update this policy from time to time. When we do, we will update
        the date at the top of this page.
      </p>

      <LegalHeading id="contact">Contact</LegalHeading>
      <p>
        If you have questions about this policy, email{" "}
        <a href="mailto:support@base.et">support@base.et</a>.
      </p>
    </LegalLayout>
  );
}
