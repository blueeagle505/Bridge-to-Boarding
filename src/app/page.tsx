import { Hero } from "@/components/sections/hero";
import { TrustSection } from "@/components/sections/trust";
import { AboutSection } from "@/components/sections/about";
import { HelpGrid } from "@/components/sections/help-grid";
import { FeaturedSchools } from "@/components/sections/featured-schools";
import { FaqSection } from "@/components/sections/faq";
import { CtaSection } from "@/components/sections/cta";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bridge to Boarding",
    description:
      "A free, student-led mentorship initiative helping students gain admission to boarding schools.",
    url: process.env.NEXTAUTH_URL || "https://bridgetoboarding.org",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <TrustSection />
      <AboutSection />
      <HelpGrid />
      <FeaturedSchools />
      <FaqSection />
      <CtaSection />
    </>
  );
}
