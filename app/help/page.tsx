import type { Metadata } from "next";

import HelpContent from "./_components/help-content";

export const metadata: Metadata = {
  title: "Help Center | Montra",
  description: "Answers to common questions about Montra accounts, budgets, AI features, and privacy.",
};

export default function HelpPage() {
  return <HelpContent />;
}
