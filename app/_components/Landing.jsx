// ─────────────────────────────────────────────────────────────────
// app/_components/Landing.jsx
// Root landing page — assembles all sections in grey.co order.
// Background stays pure #fff (light) / #0A1A0B (dark).
// ─────────────────────────────────────────────────────────────────
import React from "react";
import HeroSection from "/components/hero-section";
import Features from "/components/features-1";
import IntegrationsSection from "/components/integrations-3";
import StatsSection from "/components/stats-3";
import Testimonials from "/components/testimonials";
import FAQsThree from "/components/faqs-3";
import CTABanner from "/components/cta-banner";
import FooterSection from "/components/footer";

export default function Landing() {
  return (
    <div style={{ background: "var(--clr-bg)" }}>
      {/* HeroSection renders LandingNavbar inside itself */}
      <HeroSection />
      <Features />
      <IntegrationsSection />
      <StatsSection />
      <Testimonials />
      <FAQsThree />
      <CTABanner />
      <FooterSection />
    </div>
  );
}
