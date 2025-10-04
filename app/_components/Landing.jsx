import Link from 'next/link'
import React from 'react'
import HeroSection from '/components/hero-section'
import Features from '/components/features-1'
import IntegrationSection from '/components/integrations-3'
import StatsSection from '/components/stats-3'
import Faqs from '/components/faqs-3'
import Footer from '/components/footer'


function Landing() {
  return (
    <div>
      <HeroSection/>
      <Features/>
      <IntegrationSection/>
      <StatsSection />
      <Faqs/>
      <Footer/>
    </div>
  )
}

export default Landing
